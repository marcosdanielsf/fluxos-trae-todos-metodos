#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para reorganizar todos os arquivos do projeto em uma única pasta
com numeração sequencial, mantendo a integridade dos arquivos.
"""

import os
import shutil
from pathlib import Path

def reorganizar_arquivos():
    """
    Reorganiza todos os arquivos do projeto em uma única pasta com numeração sequencial.
    """
    # Diretório base do projeto
    base_dir = Path(".")
    
    # Pasta destino para arquivos consolidados
    destino_dir = base_dir / "Arquivos_Consolidados"
    
    # Garantir que a pasta destino existe
    destino_dir.mkdir(exist_ok=True)
    
    # Lista para armazenar todos os arquivos encontrados
    todos_arquivos = []
    
    # Buscar todos os arquivos recursivamente, excluindo .DS_Store e a pasta destino
    for arquivo in base_dir.rglob("*"):
        if (arquivo.is_file() and 
            arquivo.name != ".DS_Store" and 
            "Arquivos_Consolidados" not in str(arquivo) and
            arquivo.name != "reorganizar_arquivos.py"):  # Excluir este script
            todos_arquivos.append(arquivo)
    
    # Ordenar arquivos por nome para consistência
    todos_arquivos.sort(key=lambda x: str(x))
    
    print(f"Encontrados {len(todos_arquivos)} arquivos para reorganizar.")
    
    # Contador para numeração sequencial
    contador = 1
    
    # Processar cada arquivo
    for arquivo_original in todos_arquivos:
        try:
            # Obter extensão do arquivo
            extensao = arquivo_original.suffix
            
            # Criar novo nome com numeração sequencial
            novo_nome = f"{contador:03d}{extensao}"
            
            # Caminho completo do arquivo destino
            arquivo_destino = destino_dir / novo_nome
            
            # Copiar arquivo para o destino (mantendo integridade)
            shutil.copy2(arquivo_original, arquivo_destino)
            
            print(f"Arquivo {contador:03d}: {arquivo_original} -> {novo_nome}")
            
            contador += 1
            
        except Exception as e:
            print(f"Erro ao processar {arquivo_original}: {e}")
            continue
    
    print(f"\nReorganização concluída! {contador-1} arquivos foram consolidados na pasta 'Arquivos_Consolidados'.")
    
    # Criar arquivo de mapeamento para referência
    criar_mapeamento(todos_arquivos, destino_dir)

def criar_mapeamento(arquivos_originais, destino_dir):
    """
    Cria um arquivo de mapeamento mostrando a correspondência entre
    nomes originais e novos nomes numerados.
    """
    mapeamento_file = destino_dir / "000_MAPEAMENTO_ARQUIVOS.txt"
    
    with open(mapeamento_file, 'w', encoding='utf-8') as f:
        f.write("MAPEAMENTO DE ARQUIVOS REORGANIZADOS\n")
        f.write("=" * 50 + "\n\n")
        f.write("Formato: [Número] -> [Caminho Original]\n\n")
        
        for i, arquivo in enumerate(arquivos_originais, 1):
            extensao = arquivo.suffix
            novo_nome = f"{i:03d}{extensao}"
            f.write(f"{novo_nome} -> {arquivo}\n")
    
    print(f"Arquivo de mapeamento criado: {mapeamento_file}")

if __name__ == "__main__":
    reorganizar_arquivos()