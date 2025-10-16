#!/usr/bin/env python3
"""
Script para testar busca no Pinecone com dados do CRM Socialfy.
"""

import requests
import json
from typing import List, Dict, Any

# Configurações
PINECONE_API_KEY = "***REMOVED***"
OPENAI_API_KEY = "***REMOVED***"
INDEX_NAME = "quickstart"
NAMESPACE = "mottivme-docs"

def get_embedding_openai(text: str) -> List[float]:
    """Gera embedding usando OpenAI."""
    url = "https://api.openai.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "input": text,
        "model": "text-embedding-ada-002"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()["data"][0]["embedding"]
    else:
        raise Exception(f"Erro ao gerar embedding: {response.status_code} - {response.text}")

def search_pinecone(query: str, top_k: int = 5) -> Dict[str, Any]:
    """Busca no Pinecone."""
    # Gerar embedding da consulta
    query_embedding = get_embedding_openai(query)
    
    # URL do endpoint de query
    url = "https://quickstart-b11hvzz.svc.aped-4627-b74a.pinecone.io/query"
    
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }
    
    data = {
        "vector": query_embedding,
        "topK": top_k,
        "includeMetadata": True,
        "namespace": NAMESPACE
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Erro na busca: {response.status_code} - {response.text}")

def get_index_stats():
    """Obtém estatísticas do índice."""
    url = "https://quickstart-b11hvzz.svc.aped-4627-b74a.pinecone.io/describe_index_stats"
    
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json={})
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Erro ao obter estatísticas: {response.status_code} - {response.text}")

def main():
    """Função principal para testar busca."""
    print("🔍 Testando busca no CRM Socialfy indexado no Pinecone...")
    
    # Primeiro, verificar estatísticas do índice
    try:
        print("\n📊 Obtendo estatísticas do índice...")
        stats = get_index_stats()
        print(f"Estatísticas: {json.dumps(stats, indent=2)}")
    except Exception as e:
        print(f"❌ Erro ao obter estatísticas: {e}")
    
    # Consultas de teste
    test_queries = [
        "O que é o CRM Socialfy?",
        "Quais são as funcionalidades de automação?",
        "Como funciona o WhatsApp integrado?",
        "Metodologia 5D",
        "White label SaaS",
        "AI Voice Agent",
        "Workflows e automação",
        "Site e Funnel Builder"
    ]
    
    for query in test_queries:
        try:
            print(f"\n🔎 Buscando: '{query}'")
            results = search_pinecone(query, top_k=3)
            
            if "matches" in results and results["matches"]:
                print(f"✅ Encontrados {len(results['matches'])} resultados:")
                
                for i, match in enumerate(results["matches"], 1):
                    score = match.get("score", 0)
                    metadata = match.get("metadata", {})
                    
                    print(f"\n  📄 Resultado {i} (Score: {score:.4f}):")
                    print(f"    📁 Arquivo: {metadata.get('source', 'N/A')}")
                    print(f"    📝 Chunk: {metadata.get('chunk_id', 'N/A')}")
                    
                    # Mostrar um trecho do texto
                    text = metadata.get("text", "")
                    if text:
                        preview = text[:200] + "..." if len(text) > 200 else text
                        print(f"    📖 Texto: {preview}")
            else:
                print("❌ Nenhum resultado encontrado")
                
        except Exception as e:
            print(f"❌ Erro na busca '{query}': {e}")

if __name__ == "__main__":
    main()