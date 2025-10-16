#!/usr/bin/env python3
"""
Script para verificar estatísticas do índice Pinecone
"""

try:
    from pinecone import Pinecone  # type: ignore
except ImportError as e:
    print(f"Erro de importação: {e}")
    print("Certifique-se de que a biblioteca Pinecone está instalada:")
    print("pip install pinecone")
    exit(1)

# Configurações
PINECONE_API_KEY = "***REMOVED***"
INDEX_NAME = "quickstart"

def verificar_indice():
    """Verifica estatísticas do índice Pinecone."""
    try:
        # Conectar ao Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(INDEX_NAME)
        
        print(f"=== ESTATÍSTICAS DO ÍNDICE '{INDEX_NAME}' ===")
        
        # Obter estatísticas
        stats = index.describe_index_stats()
        print(f"Total de vetores: {stats.total_vector_count}")
        print(f"Dimensão: {stats.dimension}")
        
        if stats.namespaces:
            print("\nNamespaces:")
            for namespace, info in stats.namespaces.items():
                print(f"  - {namespace}: {info.vector_count} vetores")
        else:
            print("Nenhum namespace específico (usando namespace padrão)")
        
        # Testar uma consulta simples
        print("\n=== TESTE DE CONSULTA ===")
        try:
            # Consulta com vetor dummy para testar conectividade
            query_vector = [0.1] * 1536
            results = index.query(
                vector=query_vector,
                top_k=3,
                include_metadata=True
            )
            
            print(f"Consulta retornou {len(results.matches)} resultados")
            if results.matches:
                print("Primeiros resultados:")
                for i, match in enumerate(results.matches[:2]):
                    print(f"  {i+1}. Score: {match.score:.4f}")
                    if match.metadata:
                        file_path = match.metadata.get('file_path', 'N/A')
                        print(f"     Arquivo: {file_path}")
        
        except Exception as e:
            print(f"Erro na consulta: {e}")
        
        print("\n✅ Verificação concluída!")
        
    except Exception as e:
        print(f"❌ Erro ao verificar índice: {e}")

if __name__ == "__main__":
    verificar_indice()