#!/usr/bin/env python3
"""
Script para investigar detalhadamente o conteúdo do índice Pinecone
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

def investigar_indice():
    """Investiga detalhadamente o conteúdo do índice."""
    try:
        # Conectar ao Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(INDEX_NAME)
        
        print(f"=== INVESTIGAÇÃO DETALHADA DO ÍNDICE '{INDEX_NAME}' ===")
        
        # Obter estatísticas
        stats = index.describe_index_stats()
        print(f"Total de vetores: {stats.total_vector_count}")
        print(f"Dimensão: {stats.dimension}")
        
        # Listar alguns IDs específicos para verificar se existem
        print("\n=== TESTANDO IDs ESPECÍFICOS ===")
        test_ids = [
            "Fluxogramas_Completos_Marketing_Vendas_0",
            "Analise_Clinica_Organograma_Real_0", 
            "Mapa_Estrutura_Organizacional_Mottivme_0"
        ]
        
        for test_id in test_ids:
            try:
                result = index.fetch(ids=[test_id])
                if result.vectors:
                    print(f"✅ ID '{test_id}' encontrado")
                    vector = result.vectors[test_id]
                    if vector.metadata:
                        print(f"   Metadados: {vector.metadata}")
                    else:
                        print("   ⚠️  Sem metadados")
                else:
                    print(f"❌ ID '{test_id}' NÃO encontrado")
            except Exception as e:
                print(f"❌ Erro ao buscar ID '{test_id}': {e}")
        
        # Fazer uma consulta para ver todos os vetores disponíveis
        print("\n=== CONSULTA GERAL ===")
        try:
            query_vector = [0.1] * 1536
            results = index.query(
                vector=query_vector,
                top_k=10,
                include_metadata=True,
                include_values=False
            )
            
            print(f"Consulta retornou {len(results.matches)} resultados:")
            for i, match in enumerate(results.matches):
                print(f"  {i+1}. ID: {match.id}")
                print(f"     Score: {match.score:.4f}")
                if match.metadata:
                    file_path = match.metadata.get('file_path', 'N/A')
                    text_preview = match.metadata.get('text', 'N/A')[:100] + "..."
                    print(f"     Arquivo: {file_path}")
                    print(f"     Texto: {text_preview}")
                else:
                    print("     ⚠️  Sem metadados")
                print()
        
        except Exception as e:
            print(f"Erro na consulta geral: {e}")
        
        # Verificar namespace específico
        print("\n=== VERIFICANDO NAMESPACE ESPECÍFICO ===")
        try:
            results = index.query(
                vector=[0.1] * 1536,
                top_k=5,
                namespace="mottivme-docs",
                include_metadata=True
            )
            if results.matches:
                print(f"Namespace 'mottivme-docs': {len(results.matches)} resultados")
                for match in results.matches:
                    print(f"  - ID: {match.id}")
                    if match.metadata:
                        print(f"    Arquivo: {match.metadata.get('file_path', 'N/A')}")
            else:
                print("Namespace 'mottivme-docs': Nenhum resultado encontrado")
        except Exception as e:
            print(f"Erro ao verificar namespace: {e}")
        
        print("\n✅ Investigação concluída!")
        
    except Exception as e:
        print(f"❌ Erro ao investigar índice: {e}")

if __name__ == "__main__":
    investigar_indice()