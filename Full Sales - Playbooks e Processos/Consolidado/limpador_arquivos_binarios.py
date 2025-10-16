#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Limpador de Arquivos Binários Corrompidos
==========================================

Este script identifica e remove arquivos .txt que contêm dados binários
corrompidos (imagens, documentos, etc.) que foram incorretamente convertidos
para texto, gerando conteúdo ilegível.

Autor: Sistema de Detecção e Reparo Universal
Data: 2025-01-02
"""

import os
import shutil
import json
import re
from datetime import datetime
from pathlib import Path
import logging

class LimpadorArquivosBinarios:
    def __init__(self, diretorio_origem):
        self.diretorio_origem = Path(diretorio_origem)
        self.diretorio_binarios = self.diretorio_origem.parent / "arquivos_binarios_removidos"
        self.diretorio_logs = self.diretorio_origem.parent / "logs"
        
        # Configurar logging
        self.diretorio_logs.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = self.diretorio_logs / f"limpeza_binarios_{timestamp}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Padrões para detectar dados binários
        self.padroes_binarios = [
            r'PNG\s*\n\s*\x1a\n',  # Header PNG
            r'JFIF',               # Header JPEG
            r'GIF8[79]a',          # Header GIF
            r'BM',                 # Header BMP
            r'II\*\x00',          # Header TIFF (little endian)
            r'MM\x00\*',          # Header TIFF (big endian)
            r'%PDF-',              # Header PDF
            r'PK\x03\x04',         # Header ZIP/Office docs
            r'MZ',                 # Header executável
            r'\x89PNG\r\n\x1a\n',  # PNG completo
            r'\xff\xd8\xff',       # JPEG SOI marker
        ]
        
        # Padrões de caracteres binários suspeitos
        self.padroes_caracteres_binarios = [
            r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]{10,}',  # Sequências de caracteres não-ASCII
            r'[^\x20-\x7E\n\r\t]{20,}',  # Muitos caracteres não imprimíveis
        ]
        
        self.relatorio = {
            "timestamp": datetime.now().isoformat(),
            "diretorio_origem": str(self.diretorio_origem),
            "arquivos_analisados": 0,
            "arquivos_binarios_detectados": 0,
            "arquivos_movidos": 0,
            "arquivos_com_erro": 0,
            "detalhes": []
        }
    
    def detectar_arquivo_binario(self, arquivo_path):
        """
        Detecta se um arquivo .txt contém dados binários corrompidos
        """
        try:
            with open(arquivo_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Ler apenas os primeiros 2KB para análise
                conteudo = f.read(2048)
                
                # Verificar padrões de headers binários
                for padrao in self.padroes_binarios:
                    if re.search(padrao, conteudo, re.IGNORECASE | re.DOTALL):
                        return True, f"Header binário detectado: {padrao}"
                
                # Verificar densidade de caracteres binários
                for padrao in self.padroes_caracteres_binarios:
                    matches = re.findall(padrao, conteudo)
                    if matches:
                        return True, f"Alta densidade de caracteres binários: {len(matches)} sequências"
                
                # Verificar se tem metadados mas conteúdo suspeito
                if "=== METADADOS ===" in conteudo and "=== CONTEÚDO ===" in conteudo:
                    # Extrair seção de conteúdo
                    partes = conteudo.split("=== CONTEÚDO ===")
                    if len(partes) > 1:
                        conteudo_secao = partes[1][:500]  # Primeiros 500 chars do conteúdo
                        
                        # Se tem extensão de imagem nos metadados e conteúdo binário
                        if any(ext in conteudo for ext in ['.PNG', '.JPG', '.JPEG', '.GIF', '.BMP']):
                            # Verificar se o conteúdo parece binário
                            chars_nao_ascii = sum(1 for c in conteudo_secao if ord(c) > 127 or ord(c) < 32)
                            if chars_nao_ascii > len(conteudo_secao) * 0.3:  # Mais de 30% caracteres suspeitos
                                return True, "Arquivo de imagem com conteúdo binário corrompido"
                
                return False, "Arquivo parece conter texto legível"
                
        except Exception as e:
            self.logger.error(f"Erro ao analisar {arquivo_path}: {e}")
            return False, f"Erro na análise: {e}"
    
    def mover_arquivo_binario(self, arquivo_path):
        """
        Move arquivo binário para pasta separada
        """
        try:
            # Criar diretório de destino se não existir
            self.diretorio_binarios.mkdir(exist_ok=True)
            
            # Definir caminho de destino
            nome_arquivo = arquivo_path.name
            destino = self.diretorio_binarios / nome_arquivo
            
            # Se arquivo já existe, adicionar sufixo
            contador = 1
            while destino.exists():
                nome_base = arquivo_path.stem
                extensao = arquivo_path.suffix
                destino = self.diretorio_binarios / f"{nome_base}_{contador}{extensao}"
                contador += 1
            
            # Mover arquivo
            shutil.move(str(arquivo_path), str(destino))
            self.logger.info(f"Arquivo movido: {nome_arquivo} -> {destino.name}")
            return True, str(destino)
            
        except Exception as e:
            self.logger.error(f"Erro ao mover {arquivo_path}: {e}")
            return False, str(e)
    
    def processar_diretorio(self):
        """
        Processa todos os arquivos .txt no diretório
        """
        self.logger.info(f"Iniciando limpeza de arquivos binários em: {self.diretorio_origem}")
        
        # Listar todos os arquivos .txt
        arquivos_txt = list(self.diretorio_origem.glob("*.txt"))
        self.relatorio["arquivos_analisados"] = len(arquivos_txt)
        
        self.logger.info(f"Encontrados {len(arquivos_txt)} arquivos .txt para análise")
        
        for arquivo in arquivos_txt:
            try:
                # Detectar se é binário
                eh_binario, motivo = self.detectar_arquivo_binario(arquivo)
                
                detalhe = {
                    "arquivo": arquivo.name,
                    "eh_binario": eh_binario,
                    "motivo": motivo,
                    "tamanho": arquivo.stat().st_size,
                    "movido": False,
                    "destino": None
                }
                
                if eh_binario:
                    self.relatorio["arquivos_binarios_detectados"] += 1
                    self.logger.warning(f"Arquivo binário detectado: {arquivo.name} - {motivo}")
                    
                    # Mover arquivo
                    sucesso, destino = self.mover_arquivo_binario(arquivo)
                    if sucesso:
                        self.relatorio["arquivos_movidos"] += 1
                        detalhe["movido"] = True
                        detalhe["destino"] = destino
                    else:
                        self.relatorio["arquivos_com_erro"] += 1
                        detalhe["erro"] = destino
                else:
                    self.logger.debug(f"Arquivo OK: {arquivo.name}")
                
                self.relatorio["detalhes"].append(detalhe)
                
            except Exception as e:
                self.logger.error(f"Erro ao processar {arquivo}: {e}")
                self.relatorio["arquivos_com_erro"] += 1
                self.relatorio["detalhes"].append({
                    "arquivo": arquivo.name,
                    "erro": str(e),
                    "eh_binario": None,
                    "movido": False
                })
    
    def gerar_relatorio(self):
        """
        Gera relatório final da limpeza
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        arquivo_relatorio = self.diretorio_logs / f"relatorio_limpeza_{timestamp}.json"
        
        with open(arquivo_relatorio, 'w', encoding='utf-8') as f:
            json.dump(self.relatorio, f, indent=2, ensure_ascii=False)
        
        # Relatório resumido
        self.logger.info("=" * 60)
        self.logger.info("RELATÓRIO FINAL DA LIMPEZA")
        self.logger.info("=" * 60)
        self.logger.info(f"Arquivos analisados: {self.relatorio['arquivos_analisados']}")
        self.logger.info(f"Arquivos binários detectados: {self.relatorio['arquivos_binarios_detectados']}")
        self.logger.info(f"Arquivos movidos com sucesso: {self.relatorio['arquivos_movidos']}")
        self.logger.info(f"Arquivos com erro: {self.relatorio['arquivos_com_erro']}")
        self.logger.info(f"Arquivos restantes (texto legível): {self.relatorio['arquivos_analisados'] - self.relatorio['arquivos_movidos'] - self.relatorio['arquivos_com_erro']}")
        self.logger.info(f"Relatório detalhado salvo em: {arquivo_relatorio}")
        
        if self.relatorio['arquivos_movidos'] > 0:
            self.logger.info(f"Arquivos binários movidos para: {self.diretorio_binarios}")
        
        return arquivo_relatorio

def main():
    """
    Função principal
    """
    import sys
    
    if len(sys.argv) > 1:
        diretorio = sys.argv[1]
    else:
        diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2/Consolidado/arquivos_txt"
    
    if not os.path.exists(diretorio):
        print(f"Erro: Diretório não encontrado: {diretorio}")
        sys.exit(1)
    
    limpador = LimpadorArquivosBinarios(diretorio)
    
    try:
        limpador.processar_diretorio()
        arquivo_relatorio = limpador.gerar_relatorio()
        
        print(f"\n✅ Limpeza concluída com sucesso!")
        print(f"📊 Relatório detalhado: {arquivo_relatorio}")
        
        if limpador.relatorio['arquivos_movidos'] > 0:
            print(f"📁 Arquivos binários movidos para: {limpador.diretorio_binarios}")
        
    except Exception as e:
        print(f"❌ Erro durante a limpeza: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()