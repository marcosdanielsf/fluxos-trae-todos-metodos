// Script para importar o workflow "Central TRAE - Direto" no n8n
// Execute este código no console do navegador (F12 > Console)

console.log('🚀 Iniciando importação do workflow Central TRAE - Direto...');

// Definição do workflow
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

// Função para importar o workflow
async function importarWorkflow() {
  try {
    console.log('📋 Copiando workflow para clipboard...');
    
    // Copiar para clipboard
    await navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2));
    
    console.log('✅ Workflow copiado para clipboard!');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. Clique no botão "+" (novo workflow) no n8n');
    console.log('2. Clique em "Import from clipboard"');
    console.log('3. Cole o conteúdo (Ctrl+V ou Cmd+V)');
    console.log('4. Clique em "Import"');
    console.log('5. Clique no botão "Inactive" para ativar → "Active"');
    console.log('6. Salve o workflow (Ctrl+S ou Cmd+S)');
    console.log('');
    console.log('🧪 TESTE O WEBHOOK:');
    console.log('curl -X POST http://localhost:5678/webhook/trae-direto \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"teste": "funcionando", "projeto": "Central TRAE"}\'');
    
  } catch (error) {
    console.error('❌ Erro ao copiar para clipboard:', error);
    console.log('');
    console.log('📋 IMPORTAÇÃO MANUAL:');
    console.log('1. Copie o JSON abaixo:');
    console.log(JSON.stringify(workflowData, null, 2));
    console.log('');
    console.log('2. No n8n: + → Import from clipboard → Cole → Import');
  }
}

// Executar importação
importarWorkflow();