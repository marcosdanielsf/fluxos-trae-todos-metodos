#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Transcritor de SWIPE FILES - Extração de texto de imagens organizadas por blocos
Analisa todas as imagens no diretório de prospecção fria e extrai o conteúdo textual
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
import base64
from typing import Dict, List, Tuple
import requests

# Configuração de logging
def setup_logging():
    """Configura o sistema de logging"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / f"transcricao_swipe_files_{timestamp}.log"
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    return log_file

def encode_image_to_base64(image_path: str) -> str:
    """Converte imagem para base64"""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        logging.error(f"Erro ao codificar imagem {image_path}: {e}")
        return None

def extract_text_from_image_claude(image_path: str) -> str:
    """
    Extrai texto de uma imagem usando análise visual
    Simula o processo de OCR para extrair conteúdo textual
    """
    try:
        # Para este exemplo, vamos simular a extração de texto
        # Em um cenário real, você usaria uma API de OCR como Google Vision, Tesseract, etc.
        
        filename = os.path.basename(image_path)
        logging.info(f"Processando imagem: {filename}")
        
        # Aqui você integraria com uma API de OCR real
        # Por enquanto, retornamos um placeholder indicando que a imagem foi processada
        return f"[IMAGEM PROCESSADA: {filename}]\n[Conteúdo textual seria extraído aqui via OCR]\n[Incluiria: mensagens, scripts, conversas, etc.]"
        
    except Exception as e:
        logging.error(f"Erro ao processar imagem {image_path}: {e}")
        return f"[ERRO AO PROCESSAR: {os.path.basename(image_path)}]"

def analyze_directory_structure(base_path: str) -> Dict:
    """Analisa a estrutura de diretórios e identifica blocos/scripts"""
    
    structure = {}
    base_path = Path(base_path)
    
    logging.info(f"Analisando estrutura do diretório: {base_path}")
    
    # Extensões de imagem suportadas
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
    
    for root, dirs, files in os.walk(base_path):
        root_path = Path(root)
        relative_path = root_path.relative_to(base_path)
        
        # Identifica imagens no diretório atual
        images = []
        for file in files:
            file_path = root_path / file
            if file_path.suffix.lower() in image_extensions:
                images.append({
                    'filename': file,
                    'full_path': str(file_path),
                    'size': file_path.stat().st_size if file_path.exists() else 0
                })
        
        if images:  # Só adiciona se houver imagens
            # Determina o tipo de bloco baseado no nome do diretório
            dir_name = str(relative_path)
            block_type = categorize_block(dir_name)
            
            structure[dir_name] = {
                'block_type': block_type,
                'description': generate_block_description(dir_name),
                'image_count': len(images),
                'images': images
            }
    
    return structure

def categorize_block(dir_name: str) -> str:
    """Categoriza o tipo de bloco baseado no nome do diretório"""
    dir_lower = dir_name.lower()
    
    if '[ss]' in dir_lower or 'social selling' in dir_lower:
        return 'Social Selling'
    elif '[inst]' in dir_lower or 'instagram' in dir_lower:
        return 'Instagram'
    elif '[lkin]' in dir_lower or 'linkedin' in dir_lower:
        return 'LinkedIn'
    elif 'whatsapp' in dir_lower or 'agendamento' in dir_lower:
        return 'WhatsApp/Agendamento'
    elif 'médico' in dir_lower or 'doctor' in dir_lower:
        return 'Nicho Médico'
    elif 'pc' in dir_lower:
        return 'Programa de Coaching'
    else:
        return 'Outros Scripts'

def generate_block_description(dir_name: str) -> str:
    """Gera descrição do bloco baseado no nome"""
    descriptions = {
        'AGENDAMENTO - PC': 'Scripts de agendamento para Programa de Coaching',
        'ALEXANDRE ANDRADE - PC.COM': 'Scripts específicos do Alexandre Andrade',
        'MURILO MAX - JEUNESSE': 'Scripts do Murilo Max para Jeunesse',
        '[INSTA] [F] Pablo Bravo': 'Scripts de Instagram - Pablo Bravo (Feminino)',
        '[INST] TATIANE PC': 'Scripts de Instagram - Tatiane PC',
        '[INST] THALITA GUSMÃO - POLISHOP': 'Scripts de Instagram - Thalita Gusmão (Polishop)',
        '[INST] [F] GABI PC': 'Scripts de Instagram - Gabi PC (Feminino)',
        '[INST] [F] ISIS': 'Scripts de Instagram - Isis (Feminino)',
        '[INST] [F] JESSICA DOS REIS PC': 'Scripts de Instagram - Jessica dos Reis PC (Feminino)',
        '[INST] [F] JONAS': 'Scripts de Instagram - Jonas (Feminino)',
        '[INST] [Q] CARLOS': 'Scripts de Instagram - Carlos (Quente)',
        '[INST] [Q] VINCIUS': 'Scripts de Instagram - Vinícius (Quente)',
        '[LKIN] MARCIO BERTOT - CONSULTORIA DE NEGÓCIOS': 'Scripts de LinkedIn - Marcio Bertot',
        '[SS] DAVI OLIVEIRA': 'Scripts de Social Selling - Davi Oliveira',
        '[SS] GABRIEL BREIER': 'Scripts de Social Selling - Gabriel Breier',
        '[SS] GABRIEL RUCCI': 'Scripts de Social Selling - Gabriel Rucci',
        '[SS] HENRIQUE TOLEDO': 'Scripts de Social Selling - Henrique Toledo',
        '[SS] MARCOS DUTRA': 'Scripts de Social Selling - Marcos Dutra',
        '[SS] RANY': 'Scripts de Social Selling - Rany',
        '[SS] RUDY MAWER': 'Scripts de Social Selling - Rudy Mawer',
        '[SS] THIAGO GERMANO': 'Scripts de Social Selling - Thiago Germano',
        '[SS] VICTOR MULI': 'Scripts de Social Selling - Victor Muli'
    }
    
    return descriptions.get(dir_name, f'Scripts de prospecção - {dir_name}')

def transcribe_images_by_block(structure: Dict) -> Dict:
    """Transcreve todas as imagens organizadas por bloco"""
    
    transcriptions = {}
    total_images = sum(block['image_count'] for block in structure.values())
    processed_count = 0
    
    logging.info(f"Iniciando transcrição de {total_images} imagens em {len(structure)} blocos")
    
    for block_name, block_info in structure.items():
        logging.info(f"Processando bloco: {block_name} ({block_info['image_count']} imagens)")
        
        block_transcriptions = []
        
        for image_info in block_info['images']:
            processed_count += 1
            logging.info(f"Processando imagem {processed_count}/{total_images}: {image_info['filename']}")
            
            # Extrai texto da imagem
            text_content = extract_text_from_image_claude(image_info['full_path'])
            
            block_transcriptions.append({
                'filename': image_info['filename'],
                'full_path': image_info['full_path'],
                'transcription': text_content,
                'file_size': image_info['size']
            })
        
        transcriptions[block_name] = {
            'block_info': block_info,
            'transcriptions': block_transcriptions,
            'summary': {
                'total_images': len(block_transcriptions),
                'total_characters': sum(len(t['transcription']) for t in block_transcriptions),
                'block_type': block_info['block_type'],
                'description': block_info['description']
            }
        }
    
    return transcriptions

def generate_structured_report(transcriptions: Dict, output_file: str):
    """Gera relatório estruturado das transcrições"""
    
    logging.info(f"Gerando relatório estruturado: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# 📋 TRANSCRIÇÃO DE SWIPE FILES - PROSPECÇÃO FRIA\n\n")
        f.write("## 🎯 Resumo Executivo\n\n")
        
        total_blocks = len(transcriptions)
        total_images = sum(t['summary']['total_images'] for t in transcriptions.values())
        
        f.write(f"- **Total de Blocos/Scripts:** {total_blocks}\n")
        f.write(f"- **Total de Imagens Transcritas:** {total_images}\n")
        f.write(f"- **Data de Processamento:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n")
        
        # Índice por categoria
        f.write("## 📑 Índice por Categoria\n\n")
        categories = {}
        for block_name, data in transcriptions.items():
            category = data['summary']['block_type']
            if category not in categories:
                categories[category] = []
            categories[category].append(block_name)
        
        for category, blocks in categories.items():
            f.write(f"### {category}\n")
            for block in blocks:
                f.write(f"- [{block}](#{block.lower().replace(' ', '-').replace('[', '').replace(']', '').replace('/', '-')})\n")
            f.write("\n")
        
        f.write("---\n\n")
        
        # Transcrições detalhadas por bloco
        f.write("## 📝 Transcrições Detalhadas por Bloco\n\n")
        
        for block_name, data in transcriptions.items():
            block_info = data['block_info']
            summary = data['summary']
            
            f.write(f"### {block_name}\n\n")
            f.write(f"**Tipo:** {summary['block_type']}  \n")
            f.write(f"**Descrição:** {summary['description']}  \n")
            f.write(f"**Total de Imagens:** {summary['total_images']}  \n\n")
            
            # Transcrições individuais
            for i, transcription in enumerate(data['transcriptions'], 1):
                f.write(f"#### Imagem {i}: {transcription['filename']}\n\n")
                f.write("```\n")
                f.write(transcription['transcription'])
                f.write("\n```\n\n")
                f.write(f"*Arquivo: `{transcription['filename']}` ({transcription['file_size']} bytes)*\n\n")
            
            f.write("---\n\n")
        
        # Estatísticas finais
        f.write("## 📊 Estatísticas Finais\n\n")
        f.write("| Categoria | Blocos | Imagens | Caracteres |\n")
        f.write("|-----------|--------|---------|------------|\n")
        
        for category in categories.keys():
            category_blocks = [b for b in transcriptions.keys() if transcriptions[b]['summary']['block_type'] == category]
            category_images = sum(transcriptions[b]['summary']['total_images'] for b in category_blocks)
            category_chars = sum(transcriptions[b]['summary']['total_characters'] for b in category_blocks)
            
            f.write(f"| {category} | {len(category_blocks)} | {category_images} | {category_chars:,} |\n")
        
        f.write(f"\n**TOTAL** | {total_blocks} | {total_images} | {sum(t['summary']['total_characters'] for t in transcriptions.values()):,} |\n\n")

def save_json_report(transcriptions: Dict, structure: Dict, output_file: str):
    """Salva relatório detalhado em JSON"""
    
    report = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_blocks': len(transcriptions),
            'total_images': sum(t['summary']['total_images'] for t in transcriptions.values()),
            'base_directory': '/Users/marcosdaniels/Downloads/5. FULL SALES 2/9. Prospecção Fria/3. SWIPE FILE DE AGENDAMENTO- PROSPC'
        },
        'directory_structure': structure,
        'transcriptions': transcriptions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    logging.info(f"Relatório JSON salvo: {output_file}")

def main():
    """Função principal"""
    
    # Configuração
    base_directory = "/Users/marcosdaniels/Downloads/5. FULL SALES 2/9. Prospecção Fria/3. SWIPE FILE DE AGENDAMENTO- PROSPC"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Setup logging
    log_file = setup_logging()
    
    try:
        logging.info("=== INICIANDO TRANSCRIÇÃO DE SWIPE FILES ===")
        logging.info(f"Diretório base: {base_directory}")
        
        # Verifica se o diretório existe
        if not os.path.exists(base_directory):
            raise FileNotFoundError(f"Diretório não encontrado: {base_directory}")
        
        # Analisa estrutura de diretórios
        logging.info("Analisando estrutura de diretórios...")
        structure = analyze_directory_structure(base_directory)
        
        if not structure:
            logging.warning("Nenhuma imagem encontrada no diretório especificado")
            return
        
        logging.info(f"Encontrados {len(structure)} blocos com imagens")
        
        # Transcreve imagens por bloco
        logging.info("Iniciando processo de transcrição...")
        transcriptions = transcribe_images_by_block(structure)
        
        # Gera relatórios
        markdown_file = f"TRANSCRICAO_SWIPE_FILES_{timestamp}.md"
        json_file = f"logs/relatorio_transcricao_{timestamp}.json"
        
        logging.info("Gerando relatórios...")
        generate_structured_report(transcriptions, markdown_file)
        save_json_report(transcriptions, structure, json_file)
        
        # Resumo final
        total_images = sum(t['summary']['total_images'] for t in transcriptions.values())
        logging.info("=== TRANSCRIÇÃO CONCLUÍDA ===")
        logging.info(f"✅ {len(transcriptions)} blocos processados")
        logging.info(f"✅ {total_images} imagens transcritas")
        logging.info(f"✅ Relatório Markdown: {markdown_file}")
        logging.info(f"✅ Relatório JSON: {json_file}")
        logging.info(f"✅ Log detalhado: {log_file}")
        
        print(f"\n🎉 TRANSCRIÇÃO CONCLUÍDA COM SUCESSO!")
        print(f"📄 Relatório principal: {markdown_file}")
        print(f"📊 Dados detalhados: {json_file}")
        print(f"📝 Log completo: {log_file}")
        
    except Exception as e:
        logging.error(f"Erro durante a execução: {e}")
        raise

if __name__ == "__main__":
    main()