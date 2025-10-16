#!/usr/bin/env python3
"""
Script para verificar namespaces no Pinecone e encontrar os dados do Socialfy.
"""

import requests
import json
from typing import List, Dict, Any

# Configurações
PINECONE_API_KEY = "***REMOVED***"
OPENAI_API_KEY = "***REMOVED***"

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

def search_namespace(namespace: str, query: str = "Socialfy") -> Dict[str, Any]:
    """Busca em um namespace específico."""
    try:
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
            "topK": 3,
            "includeMetadata": True,
            "namespace": namespace
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Erro na busca: {response.status_code} - {response.text}"}
            
    except Exception as e:
        return {"error": str(e)}

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
    """Função principal para verificar namespaces."""
    print("🔍 Verificando namespaces no Pinecone...")
    
    # Obter estatísticas do índice
    try:
        stats = get_index_stats()
        print(f"\n📊 Estatísticas do índice:")
        print(f"Total de vetores: {stats.get('totalVectorCount', 0)}")
        print(f"Dimensão: {stats.get('dimension', 0)}")
        
        namespaces = stats.get('namespaces', {})
        print(f"\n📁 Namespaces encontrados: {len(namespaces)}")
        
        for namespace, info in namespaces.items():
            vector_count = info.get('vectorCount', 0)
            print(f"  - {namespace}: {vector_count} vetores")
            
            # Testar busca em cada namespace
            print(f"    🔎 Testando busca por 'Socialfy' no namespace '{namespace}'...")
            results = search_namespace(namespace, "Socialfy")
            
            if "error" in results:
                print(f"    ❌ Erro: {results['error']}")
            elif "matches" in results and results["matches"]:
                print(f"    ✅ Encontrados {len(results['matches'])} resultados!")
                
                for i, match in enumerate(results["matches"], 1):
                    score = match.get("score", 0)
                    metadata = match.get("metadata", {})
                    source = metadata.get("source", "N/A")
                    
                    print(f"      📄 Resultado {i} (Score: {score:.4f}): {source}")
                    
                    # Se encontrou dados do Socialfy, mostrar mais detalhes
                    if "socialfy" in source.lower() or "crm" in source.lower():
                        text = metadata.get("text", "")
                        if text:
                            preview = text[:150] + "..." if len(text) > 150 else text
                            print(f"      📖 Texto: {preview}")
            else:
                print(f"    ❌ Nenhum resultado encontrado")
                
        # Testar busca no namespace vazio (default)
        print(f"\n🔎 Testando busca no namespace padrão (vazio)...")
        results = search_namespace("", "Socialfy")
        
        if "error" in results:
            print(f"❌ Erro: {results['error']}")
        elif "matches" in results and results["matches"]:
            print(f"✅ Encontrados {len(results['matches'])} resultados no namespace padrão!")
            
            for i, match in enumerate(results["matches"], 1):
                score = match.get("score", 0)
                metadata = match.get("metadata", {})
                source = metadata.get("source", "N/A")
                
                print(f"  📄 Resultado {i} (Score: {score:.4f}): {source}")
        else:
            print(f"❌ Nenhum resultado encontrado no namespace padrão")
            
    except Exception as e:
        print(f"❌ Erro ao obter estatísticas: {e}")

if __name__ == "__main__":
    main()