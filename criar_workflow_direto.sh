#!/bin/bash

echo "🚀 Criando workflow diretamente no n8n..."

# Verificar se n8n está rodando
echo "📡 Verificando status do n8n..."
STATUS=$(curl -s http://localhost:5678/healthz)
echo "Status: $STATUS"

if [[ "$STATUS" != *"ok"* ]]; then
    echo "❌ n8n não está rodando. Inicie com: npx n8n start"
    exit 1
fi

echo "✅ n8n está rodando!"

# Tentar criar workflow via API (sem autenticação primeiro)
echo "📝 Tentando criar workflow via API..."

# Workflow simples para teste
WORKFLOW_JSON='{
  "name": "Central TRAE - Teste Direto",
  "nodes": [
    {
      "parameters": {
        "path": "teste-direto",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "teste-direto-trae"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{{ { \"status\": \"success\", \"message\": \"Workflow TRAE funcionando!\", \"timestamp\": \"\" + new Date().toISOString() } }}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {},
  "versionId": "1"
}'

# Tentar diferentes endpoints da API
echo "🔄 Testando endpoint /api/v1/workflows..."
curl -X POST http://localhost:5678/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d "$WORKFLOW_JSON" \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "🔄 Testando endpoint /rest/workflows..."
curl -X POST http://localhost:5678/rest/workflows \
  -H "Content-Type: application/json" \
  -d "$WORKFLOW_JSON" \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "🔄 Testando endpoint /workflows..."
curl -X POST http://localhost:5678/workflows \
  -H "Content-Type: application/json" \
  -d "$WORKFLOW_JSON" \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "📋 INSTRUÇÕES MANUAIS:"
echo "1. Abra http://localhost:5678 no navegador"
echo "2. Clique em 'New Workflow' ou '+'"
echo "3. Cole o JSON do workflow (disponível em workflow_simples.json)"
echo "4. Ative o workflow"
echo ""
echo "📁 Arquivos disponíveis:"
echo "- workflow_simples.json (workflow básico)"
echo "- workflow_diagnostico_360_completo.json (workflow completo)"
echo "- importar_workflow_automatico.js (script para console do navegador)"
echo ""
echo "🔗 Após ativar, teste com:"
echo "curl -X POST http://localhost:5678/webhook/teste-direto -H 'Content-Type: application/json' -d '{\"teste\": \"ok\"}'"