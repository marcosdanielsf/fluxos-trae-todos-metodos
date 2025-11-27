#!/usr/bin/env python3
"""
TRAE OS - Sistema de Memória Compartilhada
Usa Pinecone para armazenamento vetorial e busca semântica
"""

from typing import Dict, Any, List, Optional
import json
import hashlib
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class SharedMemory:
    """
    Sistema de memória compartilhada entre todos os agentes

    Funcionalidades:
    - Armazenamento vetorial (Pinecone)
    - Busca semântica
    - Contexto compartilhado
    - Histórico de decisões
    - Aprendizado contínuo
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.pinecone_api_key = config.get("pinecone_api_key")
        self.openai_api_key = config.get("openai_api_key")
        self.index_name = config.get("index_name", "trae-os-memory")
        self.namespace = "trae-brain"

        self.local_cache = {}

        logger.info("🧠 Shared Memory initialized")

    async def store(self, key: str, data: Dict[str, Any], metadata: Dict[str, Any] = None):
        """Armazena informação na memória"""
        metadata = metadata or {}

        # Gera embedding
        embedding = await self._generate_embedding(json.dumps(data))

        # ID único
        vector_id = self._generate_id(key)

        # Metadata completo
        full_metadata = {
            **metadata,
            "key": key,
            "timestamp": datetime.now().isoformat(),
            "data_preview": str(data)[:500]
        }

        # Armazena no Pinecone
        vector = {
            "id": vector_id,
            "values": embedding,
            "metadata": full_metadata
        }

        await self._upsert_to_pinecone([vector])

        # Cache local
        self.local_cache[key] = {
            "data": data,
            "metadata": full_metadata,
            "timestamp": datetime.now().isoformat()
        }

        logger.info(f"💾 Stored in memory: {key}")

    async def retrieve(self, key: str) -> Optional[Dict[str, Any]]:
        """Recupera informação da memória"""
        # Tenta cache local primeiro
        if key in self.local_cache:
            logger.info(f"📂 Retrieved from cache: {key}")
            return self.local_cache[key]["data"]

        # Busca no Pinecone
        vector_id = self._generate_id(key)
        result = await self._fetch_from_pinecone(vector_id)

        if result:
            logger.info(f"📂 Retrieved from Pinecone: {key}")
            return result.get("data")

        return None

    async def search(self, query: str, top_k: int = 5, filter_metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Busca semântica na memória"""
        logger.info(f"🔍 Searching memory: {query}")

        # Gera embedding da query
        query_embedding = await self._generate_embedding(query)

        # Busca no Pinecone
        results = await self._query_pinecone(query_embedding, top_k, filter_metadata)

        return results

    async def get_context(self, module: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Recupera contexto relevante para um módulo"""
        filter_metadata = {"module": module}

        results = await self._query_pinecone_by_metadata(filter_metadata, limit)

        return results

    async def store_decision(self, decision: Dict[str, Any]):
        """Armazena decisão para aprendizado"""
        decision_key = f"decision_{datetime.now().timestamp()}"

        await self.store(decision_key, decision, metadata={
            "type": "decision",
            "module": decision.get("module"),
            "outcome": decision.get("outcome")
        })

    async def learn_from_outcomes(self, module: str) -> Dict[str, Any]:
        """Aprende com decisões passadas"""
        # Busca decisões anteriores do módulo
        past_decisions = await self.search(
            f"decisions from {module}",
            top_k=20,
            filter_metadata={"type": "decision", "module": module}
        )

        # Analisa padrões
        successful_decisions = [d for d in past_decisions if d.get("outcome") == "success"]
        failed_decisions = [d for d in past_decisions if d.get("outcome") == "failure"]

        learning = {
            "total_decisions": len(past_decisions),
            "success_rate": len(successful_decisions) / len(past_decisions) if past_decisions else 0,
            "patterns": {
                "successful": self._extract_patterns(successful_decisions),
                "failed": self._extract_patterns(failed_decisions)
            },
            "recommendations": self._generate_learning_recommendations(successful_decisions, failed_decisions)
        }

        return learning

    async def _generate_embedding(self, text: str) -> List[float]:
        """Gera embedding usando OpenAI"""
        try:
            import requests

            headers = {
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json"
            }

            data = {
                "input": text,
                "model": "text-embedding-ada-002"
            }

            response = requests.post(
                "https://api.openai.com/v1/embeddings",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            result = response.json()
            return result["data"][0]["embedding"]

        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            # Fallback: embedding dummy
            return [0.1] * 1536

    async def _upsert_to_pinecone(self, vectors: List[Dict[str, Any]]) -> bool:
        """Envia vetores para Pinecone"""
        try:
            import requests

            url = f"https://{self.index_name}.svc.aped-4627-b74a.pinecone.io/vectors/upsert"

            headers = {
                "Api-Key": self.pinecone_api_key,
                "Content-Type": "application/json"
            }

            data = {
                "vectors": vectors,
                "namespace": self.namespace
            }

            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()

            logger.info(f"✅ Upserted {len(vectors)} vectors to Pinecone")
            return True

        except Exception as e:
            logger.error(f"Error upserting to Pinecone: {e}")
            return False

    async def _fetch_from_pinecone(self, vector_id: str) -> Optional[Dict[str, Any]]:
        """Busca vetor específico no Pinecone"""
        # Implementação simplificada
        return None

    async def _query_pinecone(self, query_embedding: List[float], top_k: int, filter_metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Busca semântica no Pinecone"""
        try:
            import requests

            url = f"https://{self.index_name}.svc.aped-4627-b74a.pinecone.io/query"

            headers = {
                "Api-Key": self.pinecone_api_key,
                "Content-Type": "application/json"
            }

            data = {
                "vector": query_embedding,
                "topK": top_k,
                "namespace": self.namespace,
                "includeMetadata": True
            }

            if filter_metadata:
                data["filter"] = filter_metadata

            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()

            results = response.json()
            return results.get("matches", [])

        except Exception as e:
            logger.error(f"Error querying Pinecone: {e}")
            return []

    async def _query_pinecone_by_metadata(self, filter_metadata: Dict[str, Any], limit: int) -> List[Dict[str, Any]]:
        """Busca por metadata"""
        # Usa embedding dummy para buscar por metadata
        dummy_embedding = [0.0] * 1536

        return await self._query_pinecone(dummy_embedding, limit, filter_metadata)

    def _generate_id(self, key: str) -> str:
        """Gera ID único para vetor"""
        return hashlib.md5(key.encode()).hexdigest()

    def _extract_patterns(self, decisions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extrai padrões de decisões"""
        if not decisions:
            return {}

        # Análise de padrões
        patterns = {
            "common_factors": [],
            "timing_patterns": [],
            "context_patterns": []
        }

        return patterns

    def _generate_learning_recommendations(self, successful: List[Dict[str, Any]], failed: List[Dict[str, Any]]) -> List[str]:
        """Gera recomendações baseadas em aprendizado"""
        recommendations = []

        if len(successful) > len(failed):
            recommendations.append("Continue current approach - high success rate")
        else:
            recommendations.append("Review and adjust strategy - low success rate")

        return recommendations

    def get_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas da memória"""
        return {
            "cache_size": len(self.local_cache),
            "namespace": self.namespace,
            "index_name": self.index_name
        }
