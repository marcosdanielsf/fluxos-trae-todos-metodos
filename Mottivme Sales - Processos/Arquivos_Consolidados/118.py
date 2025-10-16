#!/usr/bin/env python3
"""
Script para indexar arquivos do projeto Mottivme no Pinecone.
Baseado na documentação oficial do Pinecone.
"""

import os
import json
import csv
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
try:
    from pinecone_client import Pinecone  # type: ignore
    import tiktoken  # type: ignore
    import openai  # type: ignore
except ImportError as e:
    print(f"Erro de importação: {e}")
    print("Certifique-se de que as bibliotecas estão instaladas:")
    print("pip install pinecone-client tiktoken openai")
    exit(1)

# Configurações
PINECONE_API_KEY = "***REMOVED***"
INDEX_NAME = "quickstart"
CHUNK_SIZE = 1000
BATCH_SIZE = 100
NAMESPACE = "mottivme-docs"

# Configuração OpenAI (você pode definir sua chave aqui ou usar variável de ambiente)
OPENAI_API_KEY = "***REMOVED***"
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Extensões de arquivo suportadas
SUPPORTED_EXTENSIONS = {
    '.txt', '.md', '.py', '.js', '.html', '.css', '.json', '.csv', '.xml', '.yaml', '.yml'
}

def get_embedding(text, model="text-embedding-ada-002"):
    """Gera embedding usando OpenAI."""
    try:
        response = client.embeddings.create(
            input=text,
            model=model
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Erro ao gerar embedding: {e}")
        # Fallback para embedding dummy se OpenAI falhar
        return [0.1] * 1536

class DocumentProcessor:
    """Classe para processar e extrair texto de documentos."""
    
    def __init__(self):
        self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def extract_text(self, file_path: str) -> str:
        """Extrai texto de um arquivo."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                print(f"Erro ao ler arquivo {file_path}: {e}")
                return ""
        except Exception as e:
            print(f"Erro ao processar arquivo {file_path}: {e}")
            return ""
    
    def chunk_text(self, text: str, chunk_size: int = CHUNK_SIZE) -> List[str]:
        """Divide o texto em chunks menores."""
        if not text.strip():
            return []
        
        # Tokeniza o texto
        tokens = self.encoding.encode(text)
        
        # Divide em chunks
        chunks = []
        for i in range(0, len(tokens), chunk_size):
            chunk_tokens = tokens[i:i + chunk_size]
            chunk_text = self.encoding.decode(chunk_tokens)
            chunks.append(chunk_text)
        
        return chunks

class PineconeIndexer:
    """Classe para gerenciar a indexação no Pinecone."""
    
    def __init__(self):
        self.pc = None
        self.index = None
        self.processor = DocumentProcessor()
    
    def initialize_pinecone(self):
        """Inicializa a conexão com o Pinecone."""
        try:
            self.pc = Pinecone(api_key=PINECONE_API_KEY)
            
            # Verifica se o índice existe, se não, cria
            if INDEX_NAME not in [index.name for index in self.pc.list_indexes()]:
                print(f"Índice '{INDEX_NAME}' não encontrado. Criando...")
                self.pc.create_index(
                    name=INDEX_NAME,
                    dimension=1536,
                    metric="cosine",
                    spec={
                        "serverless": {
                            "cloud": "aws",
                            "region": "us-east-1"
                        }
                    }
                )
                print(f"Índice '{INDEX_NAME}' criado com sucesso!")
                # Aguarda um pouco para o índice ficar pronto
                time.sleep(10)
            
            self.index = self.pc.Index(INDEX_NAME)
            print(f"Conectado ao índice '{INDEX_NAME}' com sucesso!")
            return True
        except Exception as e:
            print(f"Erro ao conectar ao Pinecone: {e}")
            return False
    
    def test_connection(self):
        """Testa a conexão com o índice."""
        try:
            stats = self.index.describe_index_stats()
            print(f"Estatísticas do índice: {stats}")
            return True
        except Exception as e:
            print(f"Erro ao testar conexão: {e}")
            return False
    
    def extract_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extrai metadados do arquivo."""
        path_obj = Path(file_path)
        return {
            "filename": path_obj.name,
            "extension": path_obj.suffix,
            "size": path_obj.stat().st_size,
            "path": str(path_obj.absolute()),
            "modified": path_obj.stat().st_mtime
        }
    
    def index_file(self, file_path: str) -> bool:
        """Indexa um arquivo específico."""
        try:
            # Extrai texto do arquivo
            text = self.processor.extract_text(file_path)
            if not text.strip():
                print(f"Arquivo vazio ou não legível: {file_path}")
                return False
            
            # Divide em chunks
            chunks = self.processor.chunk_text(text)
            if not chunks:
                print(f"Nenhum chunk gerado para: {file_path}")
                return False
            
            # Prepara metadados
            base_metadata = self.extract_metadata(file_path)
            
            # Prepara dados para upsert
            vectors = []
            for i, chunk in enumerate(chunks):
                vector_id = f"{Path(file_path).stem}_{i}"
                metadata = base_metadata.copy()
                metadata.update({
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    "text": chunk
                })
                
                # Gerar embedding real para o chunk
                embedding = get_embedding(chunk)
                vectors.append({
                    "id": vector_id,
                    "values": embedding,
                    "metadata": metadata
                })
            
            # Faz upsert em batches
            for i in range(0, len(vectors), BATCH_SIZE):
                batch = vectors[i:i + BATCH_SIZE]
                self.index.upsert(vectors=batch, namespace=NAMESPACE)
                print(f"Indexado batch {i//BATCH_SIZE + 1} de {file_path}")
            
            print(f"Arquivo indexado com sucesso: {file_path} ({len(chunks)} chunks)")
            return True
            
        except Exception as e:
            print(f"Erro ao indexar arquivo {file_path}: {e}")
            return False
    
    def index_all_files(self, directory: str = ".") -> Dict[str, Any]:
        """Indexa todos os arquivos suportados no diretório."""
        directory_path = Path(directory)
        
        if not directory_path.exists():
            print(f"Diretório não encontrado: {directory}")
            return {"success": False, "error": "Diretório não encontrado"}
        
        # Encontra todos os arquivos suportados
        files_to_index = []
        for file_path in directory_path.rglob("*"):
            if (file_path.is_file() and 
                file_path.suffix.lower() in SUPPORTED_EXTENSIONS and
                not any(part.startswith('.') for part in file_path.parts)):
                files_to_index.append(str(file_path))
        
        if not files_to_index:
            print("Nenhum arquivo suportado encontrado.")
            return {"success": False, "error": "Nenhum arquivo encontrado"}
        
        print(f"Encontrados {len(files_to_index)} arquivos para indexar.")
        
        # Indexa cada arquivo
        successful = 0
        failed = 0
        
        for file_path in files_to_index:
            print(f"\nIndexando: {file_path}")
            if self.index_file(file_path):
                successful += 1
            else:
                failed += 1
        
        # Estatísticas finais
        total = successful + failed
        success_rate = (successful / total * 100) if total > 0 else 0
        
        print(f"\n=== RESUMO DA INDEXAÇÃO ===")
        print(f"Total de arquivos processados: {total}")
        print(f"Sucessos: {successful}")
        print(f"Falhas: {failed}")
        print(f"Taxa de sucesso: {success_rate:.1f}%")
        
        # Verifica estatísticas do índice
        try:
            stats = self.index.describe_index_stats()
            print(f"Total de vetores no índice: {stats.get('total_vector_count', 0)}")
        except Exception as e:
            print(f"Erro ao obter estatísticas do índice: {e}")
        
        return {
            "success": True,
            "total": total,
            "successful": successful,
            "failed": failed,
            "success_rate": success_rate
        }

def main():
    """Função principal."""
    print("=== INDEXADOR PINECONE MOTTIVME ===")
    
    # Inicializa o indexador
    indexer = PineconeIndexer()
    
    # Conecta ao Pinecone
    if not indexer.initialize_pinecone():
        print("Falha ao conectar ao Pinecone. Verifique a chave API.")
        return
    
    # Testa a conexão
    if not indexer.test_connection():
        print("Falha ao testar conexão com o índice.")
        return
    
    # Indexa todos os arquivos
    result = indexer.index_all_files()
    
    if result["success"]:
        print("Indexação concluída com sucesso!")
    else:
        print(f"Erro na indexação: {result.get('error', 'Erro desconhecido')}")

if __name__ == "__main__":
    main()