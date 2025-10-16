#!/usr/bin/env python3
"""
Script para testar conexão com Pinecone e verificar configurações.
"""

import requests
import json

# Configurações
PINECONE_API_KEY = "***REMOVED***"
INDEX_NAME = "quickstart"

def test_pinecone_connection():
    """Testa a conexão com o Pinecone."""
    
    # Primeiro, vamos listar os índices disponíveis
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }
    
    # URL para listar índices
    list_url = "https://api.pinecone.io/indexes"
    
    try:
        print("🔍 Testando conexão com Pinecone...")
        response = requests.get(list_url, headers=headers)
        print(f"Status da resposta: {response.status_code}")
        
        if response.status_code == 200:
            indexes = response.json()
            print("✅ Conexão bem-sucedida!")
            print(f"📋 Índices disponíveis: {json.dumps(indexes, indent=2)}")
            
            # Verificar se o índice existe
            index_names = [idx.get('name', '') for idx in indexes.get('indexes', [])]
            if INDEX_NAME in index_names:
                print(f"✅ Índice '{INDEX_NAME}' encontrado!")
                
                # Obter detalhes do índice
                for idx in indexes.get('indexes', []):
                    if idx.get('name') == INDEX_NAME:
                        print(f"📊 Detalhes do índice:")
                        print(f"  - Host: {idx.get('host', 'N/A')}")
                        print(f"  - Dimensão: {idx.get('dimension', 'N/A')}")
                        print(f"  - Métrica: {idx.get('metric', 'N/A')}")
                        print(f"  - Status: {idx.get('status', {}).get('ready', 'N/A')}")
                        
                        # Testar endpoint de upsert
                        if idx.get('host'):
                            test_upsert_endpoint(idx['host'])
                        
            else:
                print(f"❌ Índice '{INDEX_NAME}' não encontrado!")
                print(f"Índices disponíveis: {index_names}")
                
        else:
            print(f"❌ Erro na conexão: {response.status_code}")
            print(f"Resposta: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro ao testar conexão: {e}")

def test_upsert_endpoint(host):
    """Testa o endpoint de upsert."""
    print(f"\n🔗 Testando endpoint de upsert: {host}")
    
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }
    
    # Dados de teste mínimos
    test_data = {
        "vectors": [
            {
                "id": "test-vector",
                "values": [0.1] * 1536,  # Embedding de teste
                "metadata": {"test": "true"}
            }
        ],
        "namespace": "test"
    }
    
    url = f"https://{host}/vectors/upsert"
    
    try:
        response = requests.post(url, headers=headers, json=test_data)
        print(f"Status do upsert: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Endpoint de upsert funcionando!")
            print(f"Resposta: {response.json()}")
        else:
            print(f"❌ Erro no upsert: {response.status_code}")
            print(f"Resposta: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro ao testar upsert: {e}")

if __name__ == "__main__":
    test_pinecone_connection()