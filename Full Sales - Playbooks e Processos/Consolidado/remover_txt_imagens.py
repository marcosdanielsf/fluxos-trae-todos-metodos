#!/usr/bin/env python3
"""
Script para remover definitivamente os arquivos .txt que correspondem às imagens
Estes arquivos não deveriam ter sido criados em primeiro lugar
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
    log_file = os.path.join(log_dir, f"remocao_txt_imagens_{timestamp}.log")
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    return log_file

def obter_nomes_imagens_organizadas():
    """Obtém os nomes das imagens que foram organizadas"""
    imagens_dir = "imagens_organizadas"
    if not os.path.exists(imagens_dir):
        logging.error(f"Diretório {imagens_dir} não encontrado")
        return []
    
    nomes_imagens = []
    for arquivo in os.listdir(imagens_dir):
        if os.path.isfile(os.path.join(imagens_dir, arquivo)):
            # Remove a extensão para comparar com os .txt
            nome_sem_extensao = os.path.splitext(arquivo)[0]
            nomes_imagens.append(nome_sem_extensao)
    
    logging.info(f"Encontrados {len(nomes_imagens)} nomes de imagens para verificação")
    return nomes_imagens

def identificar_txt_de_imagens(nomes_imagens):
    """Identifica arquivos .txt que correspondem às imagens"""
    arquivos_binarios_dir = "arquivos_binarios_removidos"
    if not os.path.exists(arquivos_binarios_dir):
        logging.error(f"Diretório {arquivos_binarios_dir} não encontrado")
        return []
    
    txt_de_imagens = []
    for arquivo in os.listdir(arquivos_binarios_dir):
        if arquivo.endswith('.txt'):
            nome_sem_extensao = os.path.splitext(arquivo)[0]
            if nome_sem_extensao in nomes_imagens:
                txt_de_imagens.append(arquivo)
    
    logging.info(f"Identificados {len(txt_de_imagens)} arquivos .txt correspondentes às imagens")
    return txt_de_imagens

def mover_para_lixeira_definitiva(txt_de_imagens):
    """Move os arquivos .txt de imagens para uma pasta de lixeira definitiva"""
    lixeira_dir = "lixeira_txt_imagens"
    os.makedirs(lixeira_dir, exist_ok=True)
    
    arquivos_binarios_dir = "arquivos_binarios_removidos"
    contador_movidos = 0
    
    for arquivo in txt_de_imagens:
        try:
            origem = os.path.join(arquivos_binarios_dir, arquivo)
            destino = os.path.join(lixeira_dir, arquivo)
            shutil.move(origem, destino)
            logging.info(f"Arquivo .txt de imagem movido para lixeira: {arquivo}")
            contador_movidos += 1
        except Exception as e:
            logging.error(f"Erro ao mover arquivo {arquivo}: {e}")
    
    return contador_movidos

def gerar_relatorio_remocao(nomes_imagens, txt_removidos, contador_movidos, log_file):
    """Gera relatório da remoção"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    relatorio_file = f"logs/relatorio_remocao_txt_imagens_{timestamp}.json"
    
    relatorio = {
        "timestamp": datetime.now().isoformat(),
        "resumo": {
            "imagens_organizadas": len(nomes_imagens),
            "txt_de_imagens_identificados": len(txt_removidos),
            "txt_movidos_para_lixeira": contador_movidos,
            "correcao_concluida": True
        },
        "txt_removidos": txt_removidos,
        "diretorio_lixeira": "lixeira_txt_imagens",
        "log_file": log_file
    }
    
    with open(relatorio_file, 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, indent=2, ensure_ascii=False)
    
    logging.info(f"Relatório gerado: {relatorio_file}")
    return relatorio_file

def main():
    """Função principal"""
    print("🗑️  Iniciando remoção de arquivos .txt incorretos de imagens...")
    
    # Setup
    log_file = setup_logging()
    logging.info("Iniciando remoção de arquivos .txt correspondentes às imagens")
    
    # Obter nomes das imagens organizadas
    nomes_imagens = obter_nomes_imagens_organizadas()
    if not nomes_imagens:
        print("❌ Nenhuma imagem encontrada no diretório imagens_organizadas")
        return
    
    # Identificar .txt de imagens
    txt_de_imagens = identificar_txt_de_imagens(nomes_imagens)
    if not txt_de_imagens:
        print("✅ Nenhum arquivo .txt de imagem encontrado para remover")
        return
    
    # Mover para lixeira
    contador_movidos = mover_para_lixeira_definitiva(txt_de_imagens)
    
    # Gerar relatório
    relatorio_file = gerar_relatorio_remocao(nomes_imagens, txt_de_imagens, contador_movidos, log_file)
    
    # Resumo final
    print(f"\n✅ Remoção concluída!")
    print(f"📊 Imagens organizadas: {len(nomes_imagens)}")
    print(f"🗑️  Arquivos .txt de imagens removidos: {contador_movidos}")
    print(f"📁 Arquivos movidos para: lixeira_txt_imagens/")
    print(f"📋 Relatório: {relatorio_file}")
    print(f"📝 Log: {log_file}")

if __name__ == "__main__":
    main()