#!/usr/bin/env python3
"""
Script para organizar corretamente a estrutura de arquivos:
- Manter imagens como imagens (não como .txt)
- Organizar imagens em diretório específico
- Manter apenas documentos reais em arquivos_txt
"""

import os
import shutil
import json
from datetime import datetime
import logging

def setup_logging():
    """Configura o sistema de logging"""
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(log_dir, f"organizacao_estrutura_{timestamp}.log")
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    return log_file

def criar_diretorios():
    """Cria os diretórios necessários para organização"""
    diretorios = [
        "imagens_organizadas",
        "documentos_texto"
    ]
    
    for diretorio in diretorios:
        os.makedirs(diretorio, exist_ok=True)
        logging.info(f"Diretório criado/verificado: {diretorio}")

def identificar_imagens_no_diretorio_principal():
    """Identifica todas as imagens no diretório principal"""
    extensoes_imagem = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
    imagens_encontradas = []
    
    for arquivo in os.listdir('.'):
        if os.path.isfile(arquivo):
            nome, extensao = os.path.splitext(arquivo)
            if extensao.lower() in extensoes_imagem:
                imagens_encontradas.append(arquivo)
    
    logging.info(f"Encontradas {len(imagens_encontradas)} imagens no diretório principal")
    return imagens_encontradas

def mover_imagens_para_diretorio_organizado(imagens):
    """Move imagens para o diretório organizado"""
    contador_movidas = 0
    
    for imagem in imagens:
        try:
            destino = os.path.join("imagens_organizadas", imagem)
            shutil.move(imagem, destino)
            logging.info(f"Imagem movida: {imagem} -> {destino}")
            contador_movidas += 1
        except Exception as e:
            logging.error(f"Erro ao mover imagem {imagem}: {e}")
    
    return contador_movidas

def verificar_arquivos_txt_validos():
    """Verifica quais arquivos .txt contêm realmente texto válido"""
    arquivos_txt_dir = "arquivos_txt"
    if not os.path.exists(arquivos_txt_dir):
        logging.warning(f"Diretório {arquivos_txt_dir} não encontrado")
        return []
    
    arquivos_validos = []
    for arquivo in os.listdir(arquivos_txt_dir):
        if arquivo.endswith('.txt'):
            caminho_arquivo = os.path.join(arquivos_txt_dir, arquivo)
            try:
                with open(caminho_arquivo, 'r', encoding='utf-8', errors='ignore') as f:
                    conteudo = f.read(1000)  # Lê apenas os primeiros 1000 caracteres
                    
                # Verifica se é texto legível (não binário)
                if conteudo and not any(ord(char) < 32 and char not in '\n\r\t' for char in conteudo[:100]):
                    arquivos_validos.append(arquivo)
                    
            except Exception as e:
                logging.error(f"Erro ao verificar arquivo {arquivo}: {e}")
    
    logging.info(f"Encontrados {len(arquivos_validos)} arquivos .txt válidos")
    return arquivos_validos

def gerar_relatorio_organizacao(imagens_movidas, arquivos_txt_validos, log_file):
    """Gera relatório da organização"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    relatorio_file = f"logs/relatorio_organizacao_{timestamp}.json"
    
    relatorio = {
        "timestamp": datetime.now().isoformat(),
        "resumo": {
            "imagens_movidas": imagens_movidas,
            "arquivos_txt_validos": len(arquivos_txt_validos),
            "estrutura_corrigida": True
        },
        "diretorios_criados": [
            "imagens_organizadas",
            "documentos_texto"
        ],
        "arquivos_txt_validos": arquivos_txt_validos,
        "log_file": log_file
    }
    
    with open(relatorio_file, 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, indent=2, ensure_ascii=False)
    
    logging.info(f"Relatório gerado: {relatorio_file}")
    return relatorio_file

def main():
    """Função principal"""
    print("🔧 Iniciando organização da estrutura correta...")
    
    # Setup
    log_file = setup_logging()
    logging.info("Iniciando organização da estrutura de arquivos")
    
    # Criar diretórios
    criar_diretorios()
    
    # Identificar e mover imagens
    imagens = identificar_imagens_no_diretorio_principal()
    imagens_movidas = mover_imagens_para_diretorio_organizado(imagens)
    
    # Verificar arquivos .txt válidos
    arquivos_txt_validos = verificar_arquivos_txt_validos()
    
    # Gerar relatório
    relatorio_file = gerar_relatorio_organizacao(imagens_movidas, arquivos_txt_validos, log_file)
    
    # Resumo final
    print(f"\n✅ Organização concluída!")
    print(f"📊 Imagens movidas: {imagens_movidas}")
    print(f"📄 Arquivos .txt válidos: {len(arquivos_txt_validos)}")
    print(f"📁 Imagens organizadas em: imagens_organizadas/")
    print(f"📁 Documentos de texto em: arquivos_txt/")
    print(f"📋 Relatório: {relatorio_file}")
    print(f"📝 Log: {log_file}")

if __name__ == "__main__":
    main()