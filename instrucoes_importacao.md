# Instruções para Importar o Workflow Central TRAE no n8n

## Pré-requisitos
- n8n rodando em http://localhost:5678 ✅
- Arquivo `workflow_diagnostico_360_completo.json` disponível ✅

## Passo a Passo

### 1. Acessar o n8n
- Abra http://localhost:5678 no navegador
- Faça login se necessário

### 2. Importar o Workflow
1. Clique em **"+ Add workflow"** ou no menu **"Workflows"**
2. Selecione **"Import from file"** ou **"Import from JSON"**
3. Copie todo o conteúdo do arquivo `workflow_diagnostico_360_completo.json`
4. Cole no campo de texto ou selecione o arquivo
5. Clique em **"Import"**

### 3. Configurar o Workflow
1. Após importar, verifique se todos os nós estão conectados corretamente
2. Clique em **"Save"** para salvar o workflow
3. Dê um nome descritivo: "Central TRAE - Diagnóstico 360° Completo"

### 4. Ativar o Workflow
1. Clique no botão **"Inactive"** para mudar para **"Active"**
2. O webhook estará disponível em: `http://localhost:5678/webhook/diagnostico-360`

### 5. Testar o Workflow

#### Usando curl:
```bash
curl -X POST http://localhost:5678/webhook/diagnostico-360 \
  -H "Content-Type: application/json" \
  -d @teste_workflow.json
```

#### Usando o arquivo de teste:
O arquivo `teste_workflow.json` contém um payload de exemplo para testar o workflow.

### 6. Verificar Execução
1. No n8n, vá para **"Executions"** para ver o histórico
2. Clique na execução mais recente para ver os detalhes
3. Verifique se todos os nós foram executados com sucesso

## Funcionalidades do Workflow

### Nós Principais:
1. **Webhook Trigger** - Recebe requisições HTTP
2. **Verificar Ação** - Valida se a ação é "criar_workflow"
3. **Processar Estrutura** - Gera a estrutura de pastas e arquivos
4. **Gerar Comandos Pastas** - Cria comandos mkdir
5. **Executar Comandos** - Executa os comandos de criação de pastas
6. **Gerar Arquivos** - Cria arquivos template
7. **Escrever Arquivos** - Salva os arquivos no sistema
8. **Criar Item Monday** - Cria item no Monday.com (se configurado)
9. **Webhook Response** - Retorna resposta estruturada

### Estrutura Criada:
- **Central_TRAE/** (pasta raiz)
  - **Fase1_Preparacao_Diagnostico_360/**
  - **Fase2_Desenho_Processos/**
  - **Fase3_Configuracao_Sistemas/**
  - **Fase4_Treinamento_GoLive/**
  - **Fase5_Monitoramento_Melhoria/**

Cada fase contém subpastas específicas e arquivos template (.md e .csv).

## Troubleshooting

### Problema: Webhook não responde
- Verifique se o workflow está ativo
- Confirme a URL: `http://localhost:5678/webhook/diagnostico-360`

### Problema: Erro de permissão ao criar pastas
- Verifique as permissões do diretório de destino
- Ajuste o caminho base no nó "Gerar Comandos Pastas"

### Problema: Monday.com não funciona
- Configure as credenciais do Monday.com no n8n
- Ou remova o nó "Criar Item Monday" se não for necessário

## Próximos Passos
1. Configurar integrações adicionais (Monday.com, Slack, etc.)
2. Personalizar templates de arquivos
3. Adicionar validações e tratamento de erros
4. Configurar notificações de sucesso/erro