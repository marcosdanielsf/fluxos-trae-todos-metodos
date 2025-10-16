# Guia Completo - Criação de Workflows no n8n

## ✅ Status Atual

- **n8n está rodando**: ✅ Confirmado em `http://localhost:5678`
- **Interface web acessível**: ✅ Disponível
- **API key**: ❌ Apresenta problemas de autenticação
- **MCP n8n**: ❌ Não conectado

## 🎯 Próximos Passos para Criar Workflows

### Método 1: Importação via Interface Web (RECOMENDADO)

#### Passo 1: Acessar o n8n
1. Abra o navegador
2. Acesse: `http://localhost:5678`

#### Passo 2: Importar Workflow Simples
1. Clique no botão **"+"** para criar novo workflow
2. Clique nos **3 pontos (...)** no menu superior
3. Selecione **"Import from JSON"**
4. Use o arquivo: `workflow_simples.json`
5. Clique em **"Import"**
6. Salve o workflow (**Ctrl+S**)
7. Ative o workflow (toggle no canto superior direito)

#### Passo 3: Usar o Script Automático
1. Abra o console do navegador (**F12**)
2. Execute o script: `importar_via_browser.js`
3. O script copiará o JSON automaticamente
4. Siga as instruções exibidas no console

### Método 2: Importação do Workflow Completo

Use o arquivo `workflow_diagnostico_360_completo.json` seguindo os mesmos passos acima.

## 📁 Arquivos Disponíveis

### Workflows
- `workflow_simples.json` - Workflow básico para teste
- `workflow_diagnostico_360_completo.json` - Workflow completo Central TRAE
- `workflow-diagnostico-360.json` - Versão alternativa

### Scripts e Guias
- `importar_via_browser.js` - Script para console do navegador
- `importar_workflow.js` - Script alternativo
- `teste_workflow.json` - Payload de teste
- `instrucoes_importacao.md` - Instruções detalhadas

## 🧪 Testando o Workflow

### Após Importar e Ativar:

#### Workflow Simples:
```bash
curl -X POST http://localhost:5678/webhook/teste-trae \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Teste do workflow TRAE",
    "usuario": "Marcos"
  }'
```

#### Workflow Completo:
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

## 🔧 Configuração da API Key (Para Futuro)

### Problema Identificado:
A API key está retornando "unauthorized". Possíveis soluções:

1. **Verificar configuração no n8n**:
   - Acesse Settings → API
   - Verifique se a API está habilitada
   - Regenere a API key se necessário

2. **Verificar variáveis de ambiente**:
   ```bash
   # Verificar se o n8n está configurado para aceitar API keys
   echo $N8N_API_KEY_AUTH_ENABLED
   ```

3. **Reiniciar o n8n** com configurações corretas

## 🔌 Configuração do MCP n8n

### Para Automação Futura:

1. **Instalar o pacote MCP**:
   ```bash
   npm install -g n8n-mcp-http-local
   ```

2. **Configurar no Trae AI**:
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

3. **Reiniciar o Trae AI**

## 📊 Resultados Esperados

### Workflow Simples:
```json
{
  "status": "success",
  "message": "Workflow TRAE funcionando!",
  "dados_recebidos": {...},
  "timestamp": "2024-01-XX..."
}
```

### Workflow Completo:
```json
{
  "status": "success",
  "message": "Workflow Central TRAE criado com sucesso",
  "projeto": "Teste Central TRAE",
  "timestamp": "2024-01-XX...",
  "estrutura_criada": true
}
```

## 🚀 Próximas Etapas

1. ✅ **Importar workflow via interface web**
2. ✅ **Testar webhook**
3. 🔄 **Configurar API key corretamente**
4. 🔄 **Configurar MCP para automação**
5. 🔄 **Criar workflows adicionais conforme necessário**

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do n8n
2. Confirme que o n8n está rodando
3. Teste a conectividade: `curl http://localhost:5678/healthz`
4. Verifique as configurações de API no n8n