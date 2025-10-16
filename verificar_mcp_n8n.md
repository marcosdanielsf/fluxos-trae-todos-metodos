# Verificação e Configuração do MCP n8n

## Status Atual
❌ **MCP do n8n NÃO está conectado**

O erro "MCP tool invocation failed: list tools failed" indica que o servidor MCP do n8n não está disponível ou não está configurado corretamente.

## Como Verificar e Configurar o MCP n8n

### 1. Verificar se o n8n está rodando
```bash
curl http://localhost:5678/healthz
```
✅ **Status**: n8n está rodando (confirmado)

### 2. Verificar configuração do MCP no Trae AI

O MCP do n8n precisa estar configurado no arquivo de configuração do Trae AI. Verifique se existe uma configuração similar a esta:

```json
{
  "mcpServers": {
    "n8n-mcp-http-local": {
      "command": "npx",
      "args": ["n8n-mcp-http-local"],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

### 3. Instalar o pacote MCP n8n (se necessário)
```bash
npm install -g n8n-mcp-http-local
```

### 4. Verificar se o servidor MCP está rodando
O servidor MCP deve estar rodando em paralelo ao n8n para permitir a comunicação.

### 5. Reiniciar o Trae AI
Após configurar o MCP, pode ser necessário reiniciar o Trae AI para que as mudanças tenham efeito.

## Alternativas Enquanto o MCP não está Disponível

### Opção 1: Importação Manual via Interface Web
1. Acesse http://localhost:5678
2. Use o arquivo `importar_workflow.js` criado
3. Execute o script no console do navegador
4. Siga as instruções para importar o JSON

### Opção 2: API REST (com configuração correta)
```bash
# Primeiro, configure a API key no n8n
# Depois use:
curl -X POST http://localhost:5678/api/v1/workflows \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: SUA_API_KEY" \
  -d @workflow_diagnostico_360_completo.json
```

### Opção 3: Webhook Direto
Após importar e ativar o workflow manualmente, você pode testá-lo:
```bash
curl -X POST http://localhost:5678/webhook/diagnostico-360 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "criar_workflow",
    "projeto": "Teste Central TRAE",
    "cliente": "Cliente Teste",
    "tipo": "Completo"
  }'
```

## Próximos Passos Recomendados

1. **Verificar configuração do MCP** no Trae AI
2. **Importar o workflow manualmente** usando a interface web
3. **Testar o workflow** após a importação
4. **Configurar o MCP** para futuras automações

## Arquivos Disponíveis

- `workflow_diagnostico_360_completo.json` - Workflow completo para importação
- `importar_workflow.js` - Script para facilitar importação via console
- `teste_workflow.json` - Payload de teste
- `instrucoes_importacao.md` - Guia detalhado de importação

## Contato para Suporte

Se precisar de ajuda adicional com a configuração do MCP, verifique:
1. Documentação do Trae AI sobre configuração de MCPs
2. Logs do Trae AI para erros de conexão MCP
3. Configurações de rede e firewall