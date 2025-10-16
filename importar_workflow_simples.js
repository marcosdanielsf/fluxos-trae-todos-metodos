// Script simplificado para importar workflow no n8n
// Execute este código no console do navegador (F12) na página do n8n

console.log('🚀 Importando workflow Central TRAE...');

// Workflow simplificado e funcional
const workflowSimples = {
  "name": "Central TRAE - Teste Funcional",
  "nodes": [
    {
      "parameters": {
        "path": "trae-teste",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "trae-teste-webhook"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"status\": \"success\", \"message\": \"Central TRAE funcionando!\", \"data\": $json, \"timestamp\": new Date().toISOString() } }}"
      },
      "id": "webhook-response",
      "name": "Resposta",
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
            "node": "Resposta",
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

// Função para importar
async function importarWorkflow() {
  try {
    // Copiar para clipboard
    const jsonString = JSON.stringify(workflowSimples, null, 2);
    await navigator.clipboard.writeText(jsonString);
    
    console.log('✅ JSON copiado para clipboard!');
    console.log('');
    console.log('📋 PASSOS PARA IMPORTAR:');
    console.log('1. Clique no botão "+" (novo workflow) no canto superior esquerdo');
    console.log('2. Selecione "Import from clipboard"');
    console.log('3. Cole o conteúdo (Ctrl+V ou Cmd+V)');
    console.log('4. Clique em "Import"');
    console.log('5. Salve o workflow (Ctrl+S ou Cmd+S)');
    console.log('6. Ative o workflow clicando no botão "Inactive" → "Active"');
    console.log('');
    console.log('🔗 Após ativar, teste com:');
    console.log('curl -X POST http://localhost:5678/webhook/trae-teste -H "Content-Type: application/json" -d \'{"teste": "funcionando"}\'');
    
    return true;
  } catch (error) {
    console.error('❌ Erro:', error);
    console.log('');
    console.log('📋 JSON para copiar manualmente:');
    console.log(JSON.stringify(workflowSimples, null, 2));
    return false;
  }
}

// Executar
importarWorkflow();

// Disponibilizar globalmente
window.importarTRAE = importarWorkflow;