#!/usr/bin/env python3
"""
Script para verificar detalhadamente os metadados dos vetores no Pinecone.
"""

try:
    from pinecone import Pinecone  # type: ignore
except ImportError as e:
    print(f"Erro de importação: {e}")
    print("Certifique-se de que a biblioteca está instalada:")
    print("pip install pinecone")
    exit(1)

import json

# Configurações
PINECONE_API_KEY = "***REMOVED***"
INDEX_NAME = "quickstart"
NAMESPACE = "mottivme-docs"

def main():
    """Verifica detalhadamente os metadados dos vetores."""
    print("🔍 Verificando metadados detalhados...")
    
    # Inicializar Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Fazer uma consulta para obter alguns vetores com metadados
    print(f"\n📊 Consultando vetores no namespace '{NAMESPACE}'...")
    
    try:
        # Consulta com vetor dummy para obter resultados
        dummy_vector = [0.1] * 1536
        results = index.query(
            vector=dummy_vector,
            top_k=5,
            namespace=NAMESPACE,
            include_metadata=True,
            include_values=False
        )
        
        print(f"Encontrados {len(results.matches)} vetores:")
        
        for i, match in enumerate(results.matches, 1):
            print(f"\n--- VETOR {i} ---")
            print(f"ID: {match.id}")
            print(f"Score: {match.score:.4f}")
            
            if match.metadata:
                print("Metadados:")
                for key, value in match.metadata.items():
                    if key == 'text':
                        # Truncar texto longo
                        text_preview = str(value)[:100] + "..." if len(str(value)) > 100 else str(value)
                        print(f"  {key}: {text_preview}")
                    else:
                        print(f"  {key}: {value}")
            else:
                print("Metadados: Nenhum")
        
        # Verificar se existe o campo 'path' nos metadados
        print(f"\n🔍 Verificando campos de metadados disponíveis:")
        all_keys = set()
        for match in results.matches:
            if match.metadata:
                all_keys.update(match.metadata.keys())
        
        print(f"Campos encontrados: {sorted(list(all_keys))}")
        
        # Verificar especificamente arquivos
        print(f"\n📁 Verificando informações de arquivos:")
        for match in results.matches:
            if match.metadata:
                filename = match.metadata.get('filename', 'N/A')
                path = match.metadata.get('path', 'N/A')
                extension = match.metadata.get('extension', 'N/A')
                print(f"  {match.id}: {filename} ({extension}) -> {path}")
                
    except Exception as e:
        print(f"❌ Erro na consulta: {e}")

if __name__ == "__main__":
    main()