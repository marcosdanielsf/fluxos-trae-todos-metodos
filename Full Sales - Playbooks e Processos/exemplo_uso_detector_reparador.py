#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exemplo de Uso do Detector e Reparador Universal de Arquivos
Demonstra diferentes formas de usar o script principal
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório atual ao path para importar o módulo
sys.path.append(str(Path(__file__).parent))

from detector_reparador_universal import DetectorReparadorUniversal

def exemplo_deteccao_apenas():
    """Exemplo: Apenas detectar problemas sem reparar"""
    print("🔍 EXEMPLO 1: DETECÇÃO APENAS")
    print("=" * 50)
    
    diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    detector = DetectorReparadorUniversal(diretorio, modo="deteccao")
    
    # Executar apenas detecção
    problemas = detector.executar_deteccao()
    
    # Mostrar resumo
    total_problemas = sum(len(lista) for lista in problemas.values())
    print(f"Total de problemas encontrados: {total_problemas}")
    
    for categoria, lista in problemas.items():
        if lista:
            print(f"- {categoria}: {len(lista)} problemas")
    
    # Gerar relatório
    relatorio = detector.gerar_relatorio(incluir_deteccao=True, incluir_reparo=False)
    print(f"Relatório salvo em: {relatorio}")
    print()

def exemplo_reparo_apenas():
    """Exemplo: Apenas reparar problemas já detectados"""
    print("🔧 EXEMPLO 2: REPARO APENAS")
    print("=" * 50)
    
    diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    reparador = DetectorReparadorUniversal(diretorio, modo="reparo")
    
    # Primeiro detectar problemas
    problemas = reparador.executar_deteccao()
    
    # Depois reparar
    resultado_reparo = reparador.executar_reparo(problemas)
    
    print(f"Arquivos reparados: {resultado_reparo['arquivos_reparados']}")
    print(f"Problemas corrigidos: {len(resultado_reparo['problemas_corrigidos'])}")
    print(f"Erros encontrados: {len(resultado_reparo['erros'])}")
    
    # Gerar relatório
    relatorio = reparador.gerar_relatorio(incluir_deteccao=False, incluir_reparo=True)
    print(f"Relatório salvo em: {relatorio}")
    print()

def exemplo_completo():
    """Exemplo: Detecção e reparo completos"""
    print("🔄 EXEMPLO 3: PROCESSO COMPLETO")
    print("=" * 50)
    
    diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    processador = DetectorReparadorUniversal(diretorio, modo="completo")
    
    # Executar processo completo
    relatorio = processador.executar()
    
    # Mostrar estatísticas
    stats = processador.stats
    print(f"Arquivos analisados: {stats['arquivos_analisados']}")
    print(f"Problemas encontrados: {stats['problemas_encontrados']}")
    print(f"Arquivos reparados: {stats['arquivos_reparados']}")
    print(f"Duplicados removidos: {stats['duplicados_removidos']}")
    print(f"Extensões corrigidas: {stats['extensoes_corrigidas']}")
    print(f"PDFs reparados: {stats['pdfs_reparados']}")
    print(f"XLSX reparados: {stats['xlsx_reparados']}")
    print(f"DOCX reparados: {stats['docx_reparados']}")
    print(f"PPTX reparados: {stats['pptx_reparados']}")
    
    print(f"Relatório completo salvo em: {relatorio}")
    print()

def exemplo_uso_programatico():
    """Exemplo: Uso programático para integração em outros sistemas"""
    print("💻 EXEMPLO 4: USO PROGRAMÁTICO")
    print("=" * 50)
    
    diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    detector = DetectorReparadorUniversal(diretorio, modo="deteccao")
    
    # Detectar problemas específicos
    problemas = detector.executar_deteccao()
    
    # Processar resultados programaticamente
    arquivos_com_problemas = []
    
    for categoria, lista in problemas.items():
        for problema in lista:
            arquivos_com_problemas.append({
                'arquivo': problema['arquivo'],
                'categoria': categoria,
                'problema': problema.get('problema', ''),
                'detalhes': problema.get('detalhes', '')
            })
    
    # Mostrar arquivos com problemas
    print(f"Encontrados {len(arquivos_com_problemas)} arquivos com problemas:")
    for item in arquivos_com_problemas[:5]:  # Mostrar apenas os primeiros 5
        print(f"- {Path(item['arquivo']).name}: {item['problema']}")
    
    if len(arquivos_com_problemas) > 5:
        print(f"... e mais {len(arquivos_com_problemas) - 5} arquivos")
    
    print()

def exemplo_filtros_personalizados():
    """Exemplo: Como criar filtros personalizados"""
    print("🎯 EXEMPLO 5: FILTROS PERSONALIZADOS")
    print("=" * 50)
    
    diretorio = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    detector = DetectorReparadorUniversal(diretorio, modo="deteccao")
    
    # Executar detecção
    problemas = detector.executar_deteccao()
    
    # Filtrar apenas PDFs com problemas
    pdfs_problematicos = []
    for categoria, lista in problemas.items():
        for problema in lista:
            arquivo = Path(problema['arquivo'])
            if arquivo.suffix.lower() == '.pdf':
                pdfs_problematicos.append(problema)
    
    print(f"PDFs com problemas: {len(pdfs_problematicos)}")
    for pdf in pdfs_problematicos:
        print(f"- {Path(pdf['arquivo']).name}: {pdf.get('problema', '')}")
    
    # Filtrar apenas arquivos duplicados
    duplicados = problemas.get('arquivos_duplicados', [])
    print(f"\nArquivos duplicados: {len(duplicados)}")
    for dup in duplicados:
        print(f"- {Path(dup['arquivo']).name}")
    
    print()

def mostrar_diretorios_criados():
    """Mostra os diretórios criados pelo processo"""
    print("📁 DIRETÓRIOS CRIADOS")
    print("=" * 50)
    
    base = Path("/Users/marcosdaniels/Downloads/5. FULL SALES 2/Consolidado")
    
    diretorios = [
        "logs",
        "arquivos_reparados", 
        "backup_originais",
        "duplicados_removidos",
        "arquivos_csv",
        "arquivos_txt"
    ]
    
    for diretorio in diretorios:
        caminho = base / diretorio
        if caminho.exists():
            arquivos = list(caminho.glob('*'))
            print(f"✅ {diretorio}: {len(arquivos)} arquivos")
        else:
            print(f"❌ {diretorio}: não existe")
    
    print()

def main():
    """Função principal que executa todos os exemplos"""
    print("🚀 EXEMPLOS DE USO DO DETECTOR E REPARADOR UNIVERSAL")
    print("=" * 70)
    print()
    
    # Verificar se o diretório existe
    diretorio_base = "/Users/marcosdaniels/Downloads/5. FULL SALES 2"
    if not Path(diretorio_base).exists():
        print(f"❌ Diretório não encontrado: {diretorio_base}")
        return
    
    try:
        # Executar exemplos
        exemplo_deteccao_apenas()
        exemplo_reparo_apenas()
        exemplo_completo()
        exemplo_uso_programatico()
        exemplo_filtros_personalizados()
        mostrar_diretorios_criados()
        
        print("✅ Todos os exemplos foram executados com sucesso!")
        print("\n💡 DICAS DE USO:")
        print("- Use modo 'deteccao' para análise rápida sem modificar arquivos")
        print("- Use modo 'reparo' quando já souber quais problemas existem")
        print("- Use modo 'completo' para processo automatizado completo")
        print("- Sempre verifique os logs e relatórios gerados")
        print("- Os backups são criados automaticamente antes de qualquer reparo")
        
    except Exception as e:
        print(f"❌ Erro durante execução: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()