# 🔧 Sistema de Detecção e Reparo de Arquivos

Sistema completo para detectar e reparar problemas em arquivos de documentos, planilhas e apresentações.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso Básico](#uso-básico)
- [Modos de Operação](#modos-de-operação)
- [Tipos de Problemas Detectados](#tipos-de-problemas-detectados)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Exemplos de Uso](#exemplos-de-uso)
- [Relatórios](#relatórios)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O **Detector e Reparador Universal de Arquivos** é uma ferramenta Python que:

- ✅ Detecta arquivos corrompidos ou com problemas
- 🔧 Repara automaticamente arquivos danificados
- 📊 Converte XLSX para CSV
- 🗂️ Remove arquivos duplicados
- 📝 Corrige extensões incorretas
- 💾 Cria backups automáticos
- 📈 Gera relatórios detalhados

## 🚀 Funcionalidades

### Detecção de Problemas
- **Arquivos vazios** (0 bytes)
- **Arquivos muito pequenos** (suspeitos)
- **Conteúdo suspeito** (PDFs sem texto, planilhas vazias)
- **Estruturas danificadas** (arquivos corrompidos)
- **Metadados corrompidos**
- **Problemas de encoding**
- **Arquivos duplicados** (baseado em checksum MD5)
- **Extensões incorretas** (baseado no conteúdo real)

### Reparos Automáticos
- **PDFs**: Recriação com estrutura corrigida
- **XLSX**: Múltiplos métodos de reparo (openpyxl, pandas, ZIP)
- **DOCX**: Extração de texto e recriação
- **PPTX**: Recriação de apresentações básicas
- **Duplicados**: Movimentação para pasta específica
- **Extensões**: Correção baseada no tipo real do arquivo

## 📦 Instalação

### Dependências Necessárias

```bash
pip install pandas python-docx PyPDF2 python-pptx openpyxl PyMuPDF docx2txt
```

### Verificação da Instalação

```python
python detector_reparador_universal.py --help
```

## 🎮 Uso Básico

### Linha de Comando

```bash
# Modo completo (detecção + reparo)
python detector_reparador_universal.py --modo completo

# Apenas detecção
python detector_reparador_universal.py --modo deteccao

# Apenas reparo
python detector_reparador_universal.py --modo reparo

# Especificar diretório
python detector_reparador_universal.py --diretorio "/caminho/para/arquivos" --modo completo
```

### Uso Programático

```python
from detector_reparador_universal import DetectorReparadorUniversal

# Inicializar
detector = DetectorReparadorUniversal("/caminho/para/arquivos", modo="completo")

# Executar processo completo
relatorio = detector.executar()

# Acessar estatísticas
print(f"Arquivos analisados: {detector.stats['arquivos_analisados']}")
print(f"Problemas encontrados: {detector.stats['problemas_encontrados']}")
print(f"Arquivos reparados: {detector.stats['arquivos_reparados']}")
```

## 🔄 Modos de Operação

### 1. Modo Detecção (`deteccao`)
- Apenas identifica problemas
- Não modifica arquivos
- Gera relatório de problemas encontrados
- Ideal para análise inicial

### 2. Modo Reparo (`reparo`)
- Executa detecção e reparo
- Cria backups automáticos
- Repara arquivos problemáticos
- Move duplicados para pasta específica

### 3. Modo Completo (`completo`)
- Combina detecção e reparo
- Processo automatizado completo
- Relatório detalhado de todo o processo
- **Recomendado para uso geral**

## 🔍 Tipos de Problemas Detectados

### Arquivos Vazios
- Arquivos com 0 bytes
- Podem indicar falha na criação/transferência

### Arquivos Muito Pequenos
- Arquivos menores que o esperado para o tipo
- Limites específicos por extensão:
  - DOCX: < 1KB
  - XLSX: < 2KB
  - PPTX: < 5KB
  - PDF: < 500 bytes

### Conteúdo Suspeito
- **PDFs**: Sem texto extraível (apenas imagens)
- **DOCX**: Sem conteúdo de texto
- **XLSX**: Sem dados nas células
- **PPTX**: Sem slides

### Arquivos Duplicados
- Identificados por checksum MD5
- Mesmo conteúdo, nomes diferentes
- Automaticamente movidos para pasta `duplicados_removidos`

### Extensões Incorretas
- Arquivo com extensão que não corresponde ao conteúdo
- Detectado pela análise da assinatura do arquivo
- Corrigido automaticamente

## 📁 Estrutura de Diretórios

Após a execução, a seguinte estrutura é criada:

```
Consolidado/
├── arquivos_reparados/          # Arquivos reparados
├── backup_originais/            # Backups dos arquivos originais
├── duplicados_removidos/        # Arquivos duplicados movidos
├── arquivos_csv/               # Conversões XLSX → CSV
├── arquivos_txt/               # Extrações de texto
└── logs/                       # Logs e relatórios
    ├── detector_reparador_universal_YYYYMMDD_HHMMSS.log
    └── relatorio_universal_YYYYMMDD_HHMMSS.json
```

## 💡 Exemplos de Uso

### Exemplo 1: Análise Rápida
```python
# Apenas verificar problemas sem reparar
detector = DetectorReparadorUniversal("/meus/arquivos", modo="deteccao")
problemas = detector.executar_deteccao()

# Ver resumo
for categoria, lista in problemas.items():
    if lista:
        print(f"{categoria}: {len(lista)} problemas")
```

### Exemplo 2: Reparo Seletivo
```python
# Detectar problemas
detector = DetectorReparadorUniversal("/meus/arquivos", modo="reparo")
problemas = detector.executar_deteccao()

# Reparar apenas PDFs
pdfs_problematicos = problemas.get('arquivos_com_conteudo_suspeito', [])
pdf_problems = [p for p in pdfs_problematicos if p['arquivo'].endswith('.pdf')]

if pdf_problems:
    detector.executar_reparo({'arquivos_com_conteudo_suspeito': pdf_problems})
```

### Exemplo 3: Monitoramento Automático
```python
import schedule
import time

def verificar_arquivos():
    detector = DetectorReparadorUniversal("/arquivos/importantes", modo="completo")
    relatorio = detector.executar()
    
    if detector.stats['problemas_encontrados'] > 0:
        print(f"⚠️ {detector.stats['problemas_encontrados']} problemas encontrados!")
        # Enviar notificação, email, etc.

# Executar verificação diária
schedule.every().day.at("02:00").do(verificar_arquivos)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Verificar a cada hora
```

## 📊 Relatórios

### Estrutura do Relatório JSON

```json
{
  "timestamp": "20241002_123456",
  "modo_execucao": "completo",
  "estatisticas": {
    "arquivos_analisados": 228,
    "problemas_encontrados": 4,
    "arquivos_reparados": 4,
    "duplicados_removidos": 3,
    "extensoes_corrigidas": 0,
    "pdfs_reparados": 1,
    "xlsx_reparados": 0,
    "docx_reparados": 0,
    "pptx_reparados": 0
  },
  "problemas_detectados": {
    "arquivos_vazios": [],
    "arquivos_duplicados": [...],
    "arquivos_com_conteudo_suspeito": [...]
  },
  "problemas_corrigidos": [
    {
      "arquivo": "/caminho/arquivo.pdf",
      "problema": "PDF sem texto extraível",
      "solucao": "PDF recriado com estrutura corrigida",
      "arquivo_reparado": "/caminho/reparados/arquivo.pdf"
    }
  ]
}
```

### Logs Detalhados

Os logs incluem:
- Timestamp de cada operação
- Arquivos processados
- Problemas encontrados
- Reparos executados
- Erros e exceções

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Importação
```
ImportError: No module named 'pandas'
```
**Solução**: Instalar dependências
```bash
pip install pandas python-docx PyPDF2 python-pptx openpyxl PyMuPDF docx2txt
```

#### 2. Permissões de Arquivo
```
PermissionError: [Errno 13] Permission denied
```
**Solução**: Verificar permissões do diretório
```bash
chmod -R 755 /caminho/para/arquivos
```

#### 3. Arquivo em Uso
```
PermissionError: [Errno 32] The process cannot access the file
```
**Solução**: Fechar aplicações que estão usando os arquivos

#### 4. Espaço em Disco
```
OSError: [Errno 28] No space left on device
```
**Solução**: Liberar espaço em disco ou usar diretório com mais espaço

### Configurações Avançadas

#### Ajustar Limites de Tamanho
```python
detector = DetectorReparadorUniversal("/arquivos", modo="completo")

# Modificar limites personalizados
def verificar_arquivo_muito_pequeno_customizado(arquivo, limite=50):
    # Lógica personalizada
    pass

detector.verificar_arquivo_muito_pequeno = verificar_arquivo_muito_pequeno_customizado
```

#### Filtros Personalizados
```python
# Ignorar certos tipos de arquivo
def filtro_personalizado(arquivo):
    extensoes_ignoradas = ['.tmp', '.log', '.cache']
    return arquivo.suffix.lower() not in extensoes_ignoradas

# Aplicar filtro antes da análise
arquivos_filtrados = [f for f in arquivos if filtro_personalizado(f)]
```

## 📞 Suporte

### Logs de Debug
Para debug detalhado, modifique o nível de log:

```python
import logging
logging.getLogger().setLevel(logging.DEBUG)
```

### Informações do Sistema
```python
import sys
print(f"Python: {sys.version}")
print(f"Plataforma: {sys.platform}")

# Verificar dependências
try:
    import pandas, docx, PyPDF2, pptx, openpyxl, fitz, docx2txt
    print("✅ Todas as dependências instaladas")
except ImportError as e:
    print(f"❌ Dependência faltando: {e}")
```

## 📈 Estatísticas de Uso

O sistema rastreia automaticamente:
- Número de arquivos analisados
- Tipos de problemas encontrados
- Taxa de sucesso de reparos
- Tempo de processamento
- Espaço economizado (duplicados removidos)

## 🔄 Atualizações

Para manter o sistema atualizado:

1. Verificar novas versões das dependências
2. Testar em ambiente de desenvolvimento
3. Fazer backup dos scripts atuais
4. Atualizar gradualmente

---

**Desenvolvido para análise e reparo eficiente de arquivos de documentos corporativos.**

*Última atualização: Outubro 2024*