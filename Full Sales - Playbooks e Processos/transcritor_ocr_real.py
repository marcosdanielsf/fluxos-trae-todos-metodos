#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Transcritor OCR Real - Extração de texto de imagens usando Tesseract
Versão: 2.0
Data: 02/10/2024
"""

import os
import sys
import subprocess
import logging
from datetime import datetime
from pathlib import Path
import json
from typing import Dict, List, Tuple, Optional, Any

# Variáveis globais para controle de dependências
CV2_AVAILABLE = False
PIL_AVAILABLE = False
PYTESSERACT_AVAILABLE = False

# Módulos opcionais (serão importados dinamicamente)
cv2: Any = None
np: Any = None
Image: Any = None
pytesseract: Any = None

# Configuração de logging
def setup_logging():
    """Configura o sistema de logging"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / f"transcricao_ocr_real_{timestamp}.log"
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    return log_file

def check_dependencies():
    """Verifica e instala dependências necessárias"""
    global CV2_AVAILABLE, PIL_AVAILABLE, PYTESSERACT_AVAILABLE
    global cv2, np, Image, pytesseract
    
    logging.info("Verificando dependências...")
    
    # Lista de pacotes necessários
    required_packages = [
        ('pytesseract', 'pytesseract'),
        ('Pillow', 'PIL'),
        ('opencv-python', 'cv2')
    ]
    
    for package_name, import_name in required_packages:
        try:
            if import_name == 'PIL':
                from PIL import Image as PILImage
                Image = PILImage
                PIL_AVAILABLE = True
            elif import_name == 'cv2':
                import cv2 as opencv
                import numpy as numpy_module
                cv2 = opencv
                np = numpy_module
                CV2_AVAILABLE = True
            elif import_name == 'pytesseract':
                import pytesseract as tesseract
                pytesseract = tesseract
                PYTESSERACT_AVAILABLE = True
            logging.info(f"✅ {package_name} já instalado")
        except ImportError:
            logging.info(f"📦 Instalando {package_name}...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
                # Tentar importar novamente após instalação
                if import_name == 'PIL':
                    from PIL import Image as PILImage
                    Image = PILImage
                    PIL_AVAILABLE = True
                elif import_name == 'cv2':
                    import cv2 as opencv
                    import numpy as numpy_module
                    cv2 = opencv
                    np = numpy_module
                    CV2_AVAILABLE = True
                elif import_name == 'pytesseract':
                    import pytesseract as tesseract
                    pytesseract = tesseract
                    PYTESSERACT_AVAILABLE = True
                logging.info(f"✅ {package_name} instalado com sucesso")
            except (subprocess.CalledProcessError, ImportError) as e:
                logging.error(f"Erro com {package_name}: {e}")
                return False
    
    # Verifica Tesseract
    if PYTESSERACT_AVAILABLE and pytesseract:
        try:
            # Tenta configurar o caminho do Tesseract no macOS
            possible_paths = [
                '/usr/local/bin/tesseract',
                '/opt/homebrew/bin/tesseract',
                '/usr/bin/tesseract'
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    break
            
            # Testa se funciona
            pytesseract.get_tesseract_version()
            logging.info("✅ Tesseract configurado com sucesso")
            return True
            
        except Exception as e:
            logging.error(f"❌ Erro com Tesseract: {e}")
            logging.info("📋 Para instalar no macOS: brew install tesseract")
            return False
    
    return CV2_AVAILABLE and PIL_AVAILABLE and PYTESSERACT_AVAILABLE

def extract_text_from_image_ocr(image_path: str) -> str:
    """
    Extrai texto de uma imagem usando Tesseract OCR com pré-processamento
    """
    if not (CV2_AVAILABLE and PIL_AVAILABLE and PYTESSERACT_AVAILABLE):
        return f"[ERRO: Dependências não disponíveis] {os.path.basename(image_path)}"
    
    if not all([cv2, np, Image, pytesseract]):
        return f"[ERRO: Módulos não carregados] {os.path.basename(image_path)}"
    
    try:
        # Carrega a imagem
        imread = getattr(cv2, 'imread', None)
        if not imread:
            return f"[ERRO: OpenCV sem imread] {os.path.basename(image_path)}"
        image = imread(image_path)
        if image is None:
            return f"[ERRO: Não foi possível carregar a imagem] {os.path.basename(image_path)}"
        
        # Pré-processamento para melhorar OCR
        # Converte para escala de cinza
        cvtColor = getattr(cv2, 'cvtColor', None)
        color_bgr2gray = getattr(cv2, 'COLOR_BGR2GRAY', None)
        if not cvtColor or color_bgr2gray is None:
            return f"[ERRO: OpenCV sem cvtColor/constante GRAY] {os.path.basename(image_path)}"
        gray = cvtColor(image, color_bgr2gray)
        
        # Aplica filtro para reduzir ruído
        medianBlur = getattr(cv2, 'medianBlur', None)
        if not medianBlur:
            return f"[ERRO: OpenCV sem medianBlur] {os.path.basename(image_path)}"
        denoised = medianBlur(gray, 3)
        
        # Melhora contraste usando CLAHE
        createCLAHE = getattr(cv2, 'createCLAHE', None)
        if createCLAHE:
            clahe = createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(denoised)
        else:
            # Fallback: se não houver CLAHE, segue com a imagem denoisada
            enhanced = denoised
        
        # Converte para PIL Image para usar com pytesseract
        pil_image = Image.fromarray(enhanced)
        
        # Configuração do Tesseract para português e inglês
        config = '--oem 3 --psm 6 -l por+eng'
        
        # Extrai o texto
        text = pytesseract.image_to_string(pil_image, config=config)
        
        # Limpa o texto extraído
        cleaned_text = text.strip()
        if not cleaned_text:
            return f"[TEXTO NÃO DETECTADO] {os.path.basename(image_path)}"
        
        return cleaned_text
        
    except Exception as e:
        logging.error(f"Erro ao processar {image_path}: {e}")
        return f"[ERRO OCR: {str(e)}] {os.path.basename(image_path)}"

def extract_text_from_image_with_fallback(image_path: str) -> str:
    """
    Extrai texto de uma imagem com fallback para diferentes métodos
    """
    filename = os.path.basename(image_path)
    
    # Verifica se as dependências estão disponíveis
    if not (CV2_AVAILABLE and PIL_AVAILABLE and PYTESSERACT_AVAILABLE):
        logging.warning(f"Dependências não disponíveis para OCR de {filename}")
        return f"[ERRO: Dependências não disponíveis para {filename}]"
    
    # Verifica se os módulos foram carregados globalmente
    if not all([cv2, np, Image, pytesseract]):
        logging.warning(f"Módulos não carregados para OCR de {filename}")
        return f"[ERRO: Módulos não carregados para {filename}]"
    
    logging.info(f"Processando OCR: {filename}")
    
    try:
        # Carrega a imagem usando OpenCV
        imread = getattr(cv2, 'imread', None)
        if not imread:
            logging.error(f"OpenCV sem imread para {filename}")
            return f"[ERRO: OpenCV sem imread] {filename}"
        image = imread(image_path)
        if image is None:
            logging.error(f"Não foi possível carregar {filename}")
            return f"[ERRO: Imagem não carregada] {filename}"
        
        # Pré-processamento básico
        cvtColor = getattr(cv2, 'cvtColor', None)
        color_bgr2gray = getattr(cv2, 'COLOR_BGR2GRAY', None)
        if not cvtColor or color_bgr2gray is None:
            logging.error(f"OpenCV sem cvtColor/constante GRAY para {filename}")
            return f"[ERRO: OpenCV sem cvtColor/GRAY] {filename}"
        gray = cvtColor(image, color_bgr2gray)
        
        # Aplica filtro de mediana para reduzir ruído
        medianBlur = getattr(cv2, 'medianBlur', None)
        if not medianBlur:
            logging.error(f"OpenCV sem medianBlur para {filename}")
            return f"[ERRO: OpenCV sem medianBlur] {filename}"
        denoised = medianBlur(gray, 3)
        
        # Melhora o contraste usando CLAHE
        createCLAHE = getattr(cv2, 'createCLAHE', None)
        if createCLAHE:
            clahe = createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(denoised)
        else:
            enhanced = denoised
        
        # Converte para PIL Image
        pil_image = Image.fromarray(enhanced)
        
        # Configurações do Tesseract
        configs = [
            '--oem 3 --psm 6 -l por+eng',  # Configuração principal
            '--oem 3 --psm 3 -l por+eng',  # Fallback 1
            '--oem 3 --psm 8 -l por+eng',  # Fallback 2
            '-l por+eng'                   # Configuração básica
        ]
        
        text = ""
        for config in configs:
            try:
                text = pytesseract.image_to_string(pil_image, config=config)
                if text.strip():
                    break
            except Exception:
                continue
        
        # Se ainda não conseguiu texto, tenta configuração básica
        if not text.strip():
            try:
                text = pytesseract.image_to_string(pil_image, lang='por+eng')
            except Exception:
                text = ""
        
        # Limpa e valida o texto
        cleaned_text = text.strip()
        if not cleaned_text:
            logging.warning(f"Nenhum texto detectado em {filename}")
            return f"[SEM TEXTO DETECTADO] {filename}"
        
        logging.info(f"✅ OCR concluído: {filename} ({len(cleaned_text)} chars)")
        return cleaned_text
        
    except Exception as e:
        logging.error(f"Erro no OCR de {filename}: {e}")
        return f"[ERRO OCR: {str(e)}] {filename}"

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
    """Transcreve todas as imagens organizadas por bloco usando OCR real"""
    
    transcriptions = {}
    total_images = sum(block['image_count'] for block in structure.values())
    processed_count = 0
    
    logging.info(f"Iniciando transcrição OCR de {total_images} imagens em {len(structure)} blocos")
    
    for block_name, block_info in structure.items():
        logging.info(f"Processando bloco: {block_name} ({block_info['image_count']} imagens)")
        
        block_transcriptions = []
        
        for image_info in block_info['images']:
            processed_count += 1
            logging.info(f"Processando imagem {processed_count}/{total_images}: {image_info['filename']}")
            
            # Extrai texto da imagem usando OCR
            text_content = extract_text_from_image_ocr(image_info['full_path'])
            
            block_transcriptions.append({
                'filename': image_info['filename'],
                'full_path': image_info['full_path'],
                'transcription': text_content,
                'file_size': image_info['size'],
                'character_count': len(text_content)
            })
        
        transcriptions[block_name] = {
            'block_info': block_info,
            'transcriptions': block_transcriptions,
            'summary': {
                'total_images': len(block_transcriptions),
                'total_characters': sum(t['character_count'] for t in block_transcriptions),
                'block_type': block_info['block_type'],
                'description': block_info['description'],
                'successful_extractions': sum(1 for t in block_transcriptions if not t['transcription'].startswith('[ERRO') and not t['transcription'].startswith('[IMAGEM SEM TEXTO'))
            }
        }
    
    return transcriptions

def generate_structured_report(transcriptions: Dict, output_file: str):
    """Gera relatório estruturado das transcrições com OCR real"""
    
    logging.info(f"Gerando relatório estruturado: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# 📋 TRANSCRIÇÃO COMPLETA DE SWIPE FILES - PROSPECÇÃO FRIA\n\n")
        f.write("## 🎯 Resumo Executivo\n\n")
        
        total_blocks = len(transcriptions)
        total_images = sum(t['summary']['total_images'] for t in transcriptions.values())
        total_successful = sum(t['summary']['successful_extractions'] for t in transcriptions.values())
        
        f.write(f"- **Total de Blocos/Scripts:** {total_blocks}\n")
        f.write(f"- **Total de Imagens Processadas:** {total_images}\n")
        f.write(f"- **Transcrições Bem-sucedidas:** {total_successful}\n")
        f.write(f"- **Taxa de Sucesso:** {(total_successful/total_images*100):.1f}%\n")
        f.write(f"- **Data de Processamento:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"- **Método:** OCR com Tesseract (Português + Inglês)\n\n")
        
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
                success_rate = transcriptions[block]['summary']['successful_extractions']
                total_imgs = transcriptions[block]['summary']['total_images']
                f.write(f"- [{block}](#{block.lower().replace(' ', '-').replace('[', '').replace(']', '').replace('/', '-')}) ({success_rate}/{total_imgs} extrações)\n")
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
            f.write(f"**Total de Imagens:** {summary['total_images']}  \n")
            f.write(f"**Extrações Bem-sucedidas:** {summary['successful_extractions']}  \n")
            f.write(f"**Taxa de Sucesso:** {(summary['successful_extractions']/summary['total_images']*100):.1f}%  \n\n")
            
            # Transcrições individuais
            for i, transcription in enumerate(data['transcriptions'], 1):
                f.write(f"#### Imagem {i}: {transcription['filename']}\n\n")
                
                # Indica se a extração foi bem-sucedida
                if transcription['transcription'].startswith('[ERRO') or transcription['transcription'].startswith('[IMAGEM SEM TEXTO'):
                    f.write("❌ **Status:** Falha na extração\n\n")
                else:
                    f.write("✅ **Status:** Texto extraído com sucesso\n\n")
                
                f.write("**Conteúdo Extraído:**\n")
                f.write("```\n")
                f.write(transcription['transcription'])
                f.write("\n```\n\n")
                f.write(f"*Arquivo: `{transcription['filename']}` ({transcription['file_size']} bytes, {transcription['character_count']} caracteres)*\n\n")
            
            f.write("---\n\n")
        
        # Estatísticas finais
        f.write("## 📊 Estatísticas Finais\n\n")
        f.write("| Categoria | Blocos | Imagens | Sucessos | Taxa | Caracteres |\n")
        f.write("|-----------|--------|---------|----------|------|------------|\n")
        
        for category in categories.keys():
            category_blocks = [b for b in transcriptions.keys() if transcriptions[b]['summary']['block_type'] == category]
            category_images = sum(transcriptions[b]['summary']['total_images'] for b in category_blocks)
            category_success = sum(transcriptions[b]['summary']['successful_extractions'] for b in category_blocks)
            category_chars = sum(transcriptions[b]['summary']['total_characters'] for b in category_blocks)
            success_rate = (category_success/category_images*100) if category_images > 0 else 0
            
            f.write(f"| {category} | {len(category_blocks)} | {category_images} | {category_success} | {success_rate:.1f}% | {category_chars:,} |\n")
        
        total_chars = sum(t['summary']['total_characters'] for t in transcriptions.values())
        overall_success_rate = (total_successful/total_images*100) if total_images > 0 else 0
        f.write(f"\n**TOTAL** | {total_blocks} | {total_images} | {total_successful} | {overall_success_rate:.1f}% | {total_chars:,} |\n\n")

def save_json_report(transcriptions: Dict, structure: Dict, output_file: str):
    """Salva relatório detalhado em JSON"""
    
    report = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_blocks': len(transcriptions),
            'total_images': sum(t['summary']['total_images'] for t in transcriptions.values()),
            'total_successful_extractions': sum(t['summary']['successful_extractions'] for t in transcriptions.values()),
            'base_directory': '/Users/marcosdaniels/Downloads/5. FULL SALES 2/9. Prospecção Fria/3. SWIPE FILE DE AGENDAMENTO- PROSPC',
            'ocr_method': 'Tesseract OCR',
            'languages': 'Portuguese + English'
        },
        'directory_structure': structure,
        'transcriptions': transcriptions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    logging.info(f"Relatório JSON salvo: {output_file}")

def main():
    """Função principal"""
    import argparse
    parser = argparse.ArgumentParser(description="Transcritor OCR de imagens em blocos")
    parser.add_argument(
        "--diretorio", "-d",
        default="/Users/marcosdaniels/Downloads/5. FULL SALES 2/9. Prospecção Fria/3. SWIPE FILE DE AGENDAMENTO- PROSPC",
        help="Diretório base contendo blocos com imagens para OCR"
    )
    args = parser.parse_args()
    
    # Configuração
    base_directory = args.diretorio
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Setup logging
    log_file = setup_logging()
    
    try:
        logging.info("=== INICIANDO TRANSCRIÇÃO OCR DE SWIPE FILES ===")
        logging.info(f"Diretório base: {base_directory}")
        
        # Verifica dependências
        check_dependencies()
        
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
        
        # Transcreve imagens por bloco usando OCR
        logging.info("Iniciando processo de transcrição com OCR...")
        transcriptions = transcribe_images_by_block(structure)
        
        # Gera relatórios
        markdown_file = f"TRANSCRICAO_OCR_COMPLETA_{timestamp}.md"
        json_file = f"logs/relatorio_ocr_completo_{timestamp}.json"
        
        logging.info("Gerando relatórios...")
        generate_structured_report(transcriptions, markdown_file)
        save_json_report(transcriptions, structure, json_file)
        
        # Resumo final
        total_images = sum(t['summary']['total_images'] for t in transcriptions.values())
        total_successful = sum(t['summary']['successful_extractions'] for t in transcriptions.values())
        success_rate = (total_successful/total_images*100) if total_images > 0 else 0
        
        logging.info("=== TRANSCRIÇÃO OCR CONCLUÍDA ===")
        logging.info(f"✅ {len(transcriptions)} blocos processados")
        logging.info(f"✅ {total_images} imagens processadas")
        logging.info(f"✅ {total_successful} transcrições bem-sucedidas ({success_rate:.1f}%)")
        logging.info(f"✅ Relatório Markdown: {markdown_file}")
        logging.info(f"✅ Relatório JSON: {json_file}")
        logging.info(f"✅ Log detalhado: {log_file}")
        
        print(f"\n🎉 TRANSCRIÇÃO OCR CONCLUÍDA COM SUCESSO!")
        print(f"📄 Relatório principal: {markdown_file}")
        print(f"📊 Dados detalhados: {json_file}")
        print(f"📝 Log completo: {log_file}")
        print(f"🎯 Taxa de sucesso: {success_rate:.1f}% ({total_successful}/{total_images})")
        
    except Exception as e:
        logging.error(f"Erro durante a execução: {e}")
        raise

if __name__ == "__main__":
    main()