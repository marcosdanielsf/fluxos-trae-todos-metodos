# 🚀 GUIA COMPLETO - IMPORTAR WORKFLOW NO N8N

## ✅ STATUS ATUAL
- **n8n**: ✅ Rodando em http://localhost:5678
- **Interface**: ✅ Aberta no navegador
- **Workflow**: ✅ Pronto para importar

## 🎯 MÉTODO 1: IMPORTAÇÃO AUTOMÁTICA (RECOMENDADO)

### Passo 1: Abrir Console do Navegador
1. Na interface do n8n, pressione **F12** (ou Cmd+Option+I no Mac)
2. Clique na aba **"Console"**

### Passo 2: Executar Script
1. Copie e cole este código no console:

```javascript
// Script de importação automática
const workflowData = {
  "name": "Central TRAE - Direto",
  "nodes": [
    {
      "parameters": {
        "path": "trae-direto",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "trae-direto-webhook"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"status\": \"success\", \"message\": \"Central TRAE funcionando perfeitamente!\", \"dados_recebidos\": $json, \"timestamp\": new Date().toISOString(), \"webhook_url\": \"http://localhost:5678/webhook/trae-direto\" } }}"
      },
      "id": "webhook-response",
      "name": "Resposta TRAE",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [440, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Resposta TRAE",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {},
  "versionId": "1"
};

navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2)).then(() => {
  console.log('✅ Workflow copiado para clipboard!');
  console.log('Agora: + → Import from clipboard → Cole → Import');
});
```

2. Pressione **Enter** para executar

### Passo 3: Importar na Interface
1. Clique no botão **"+"** (novo workflow)
2. Clique em **"Import from clipboard"**
3. Cole o conteúdo (Ctrl+V ou Cmd+V)
4. Clique em **"Import"**

## 🎯 MÉTODO 2: IMPORTAÇÃO MANUAL

### Passo 1: Copiar JSON
Abra o arquivo `workflow_trae_direto.json` e copie todo o conteúdo.

### Passo 2: Importar
1. No n8n: **"+"** → **"Import from clipboard"**
2. Cole o JSON
3. Clique em **"Import"**

## 🔄 ATIVAR O WORKFLOW

### Após Importar:
1. Clique no botão **"Inactive"** (canto superior direito)
2. Ele mudará para **"Active"** ✅
3. Salve o workflow (Ctrl+S ou Cmd+S)

## 🧪 TESTAR O WEBHOOK

Execute este comando no terminal:

```bash
curl -X POST http://localhost:5678/webhook/trae-direto \
  -H "Content-Type: application/json" \
  -d '{"teste": "funcionando", "projeto": "Central TRAE"}'
```

### Resposta Esperada:
```json
{
  "status": "success",
  "message": "Central TRAE funcionando perfeitamente!",
  "dados_recebidos": {"teste": "funcionando", "projeto": "Central TRAE"},
  "timestamp": "2024-01-XX...",
  "webhook_url": "http://localhost:5678/webhook/trae-direto"
}
```

## 📁 ARQUIVOS DISPONÍVEIS

1. **`workflow_trae_direto.json`** - JSON do workflow
2. **`importar_trae_direto.js`** - Script automático
3. **`GUIA_IMPORTACAO_COMPLETO.md`** - Este guia

## 🚨 SOLUÇÃO DE PROBLEMAS

### Se der erro 404:
- Verifique se o workflow está **ativo** (botão Active)
- Salve o workflow após ativar

### Se não conseguir importar:
- Tente o método manual (copiar/colar JSON)
- Verifique se o JSON está válido

### Se o console não funcionar:
- Use o método manual de importação
- Copie o JSON do arquivo `workflow_trae_direto.json`

---

**🎯 OBJETIVO**: Ter o webhook `http://localhost:5678/webhook/trae-direto` funcionando e respondendo com sucesso!