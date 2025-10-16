#!/usr/bin/env python3
"""
Script para analisar o PDF do organograma Mottivme Sales
"""

import os
import sys

def analyze_pdf_basic():
    """Análise básica do arquivo PDF"""
    pdf_file = "Organograma_Fluxograma_Mottivme_Sales.pdf"
    
    if not os.path.exists(pdf_file):
        print(f"Arquivo {pdf_file} não encontrado!")
        return
    
    # Informações básicas do arquivo
    file_size = os.path.getsize(pdf_file)
    print(f"📄 Arquivo: {pdf_file}")
    print(f"📊 Tamanho: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
    
    # Tentar ler como texto (pode não funcionar para PDFs com imagens)
    try:
        with open(pdf_file, 'rb') as f:
            content = f.read()
            
        # Procurar por strings de texto no conteúdo binário
        text_strings = []
        current_string = ""
        
        for byte in content:
            if 32 <= byte <= 126:  # Caracteres ASCII imprimíveis
                current_string += chr(byte)
            else:
                if len(current_string) > 3:
                    text_strings.append(current_string)
                current_string = ""
        
        # Filtrar strings relevantes
        relevant_strings = []
        keywords = ['sales', 'mottivme', 'diretor', 'gerente', 'coordenador', 
                   'analista', 'vendas', 'marketing', 'comercial', 'equipe',
                   'team', 'manager', 'director', 'CEO', 'CTO', 'CFO']
        
        for string in text_strings:
            if len(string) > 5 and any(keyword.lower() in string.lower() for keyword in keywords):
                relevant_strings.append(string)
        
        print(f"\n🔍 Strings relevantes encontradas: {len(relevant_strings)}")
        for string in relevant_strings[:10]:  # Mostrar apenas as primeiras 10
            print(f"  - {string}")
            
        if not relevant_strings:
            print("❌ Nenhuma string relevante encontrada no PDF")
            print("💡 O arquivo provavelmente contém apenas imagens")
            
    except Exception as e:
        print(f"❌ Erro ao analisar o PDF: {e}")

def suggest_analysis_approach():
    """Sugerir abordagens para análise do mapa mental"""
    print("\n" + "="*60)
    print("📋 SUGESTÕES PARA ANÁLISE DO MAPA MENTAL")
    print("="*60)
    
    print("\n🎯 ABORDAGENS RECOMENDADAS:")
    print("1. 📱 Abrir o PDF em um visualizador (Preview, Adobe Reader)")
    print("2. 📸 Fazer screenshot das seções principais")
    print("3. ✍️  Transcrever manualmente os elementos principais")
    print("4. 🔄 Converter para formato de texto editável")
    
    print("\n📊 ELEMENTOS TÍPICOS DE UM ORGANOGRAMA/FLUXOGRAMA:")
    print("• Estrutura hierárquica da empresa")
    print("• Cargos e responsabilidades")
    print("• Fluxos de processos de vendas")
    print("• Departamentos e equipes")
    print("• Relacionamentos entre áreas")
    
    print("\n🔍 PONTOS DE ANÁLISE IMPORTANTES:")
    print("• Clareza da estrutura organizacional")
    print("• Definição de responsabilidades")
    print("• Eficiência dos fluxos de processo")
    print("• Pontos de gargalo ou redundância")
    print("• Oportunidades de otimização")

if __name__ == "__main__":
    print("🚀 ANÁLISE DO ORGANOGRAMA MOTTIVME SALES")
    print("="*50)
    
    analyze_pdf_basic()
    suggest_analysis_approach()