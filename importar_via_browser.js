// Script para importar workflow no n8n via console do navegador
// 1. Abra http://localhost:5678 no navegador
// 2. Abra o console do desenvolvedor (F12)
// 3. Cole e execute este script

const workflowSimples = {
  "name": "Central TRAE - Teste Simples",
  "nodes": [
    {
      "parameters": {
        "path": "teste-trae",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "teste-trae-webhook"
    },
    {
      "parameters": {
        "functionCode": "// Função simples para processar dados\nconst dados = $input.item.json;\n\nreturn {\n  json: {\n    status: 'success',\n    message: 'Workflow TRAE funcionando!',\n    dados_recebidos: dados,\n    timestamp: new Date().toISOString()\n  }\n};"
      },
      "id": "processar-dados",
      "name": "Processar Dados",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.webhookResponse",
      "typeVersion": 1,
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Processar Dados",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Processar Dados": {
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
  "active": false,
  "settings": {},
  "versionId": "1"
};

console.log('=== SCRIPT DE IMPORTAÇÃO N8N ===');
console.log('1. Workflow JSON preparado');
console.log('2. Copie o JSON abaixo:');
console.log(JSON.stringify(workflowSimples, null, 2));

console.log('\n=== INSTRUÇÕES PARA IMPORTAR ===');
console.log('1. No n8n, clique no botão "+" para criar novo workflow');
console.log('2. Clique nos 3 pontos (...) no menu superior');
console.log('3. Selecione "Import from JSON"');
console.log('4. Cole o JSON acima');
console.log('5. Clique em "Import"');
console.log('6. Salve o workflow (Ctrl+S)');
console.log('7. Ative o workflow (toggle no canto superior direito)');

// Função para copiar JSON para clipboard (se suportado)
function copiarJSON() {
  const json = JSON.stringify(workflowSimples, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(json).then(() => {
      console.log('✅ JSON copiado para clipboard!');
    }).catch(err => {
      console.log('❌ Erro ao copiar:', err);
    });
  } else {
    console.log('📋 Clipboard não suportado. Copie manualmente o JSON acima.');
  }
}

// Executar cópia automática
copiarJSON();

// Retornar o workflow para referência
workflowSimples;