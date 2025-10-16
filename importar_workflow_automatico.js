// Script para importar workflow automaticamente no n8n
// Execute este código no console do navegador (F12) na interface do n8n

console.log('🚀 Iniciando importação automática do workflow...');

// Workflow completo Central TRAE
const workflowData = {
  "name": "Central TRAE - Diagnóstico 360° Completo",
  "nodes": [
    {
      "parameters": {
        "path": "diagnostico-360",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "diagnostico-360-trae"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.action}}",
              "operation": "equals",
              "value2": "criar_workflow"
            }
          ]
        }
      },
      "id": "verificar-acao",
      "name": "Verificar Ação",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "functionCode": "const projeto = $input.item.json.projeto || 'Projeto Padrão';\nconst cliente = $input.item.json.cliente || 'Cliente Padrão';\nconst tipo = $input.item.json.tipo || 'Completo';\nconst timestamp = new Date().toISOString();\n\nconst estruturaPastas = {\n  raiz: 'Central_TRAE',\n  fases: [\n    {\n      nome: 'Fase1_Preparacao_Diagnostico_360',\n      descricao: 'Preparação e Diagnóstico 360°',\n      subpastas: ['Documentacao_Base', 'Analise_Inicial', 'Stakeholders', 'Cronograma_Planejamento'],\n      arquivos: ['README_Fase1.md', 'Checklist_Diagnostico.md', 'Template_Entrevista_Stakeholders.md']\n    },\n    {\n      nome: 'Fase2_Desenho_Processos',\n      descricao: 'Desenho e Mapeamento de Processos',\n      subpastas: ['Processos_AsIs', 'Processos_ToBe', 'Fluxogramas', 'Documentacao_Tecnica'],\n      arquivos: ['README_Fase2.md', 'Template_Mapeamento_Processo.md', 'Matriz_RACI.csv']\n    },\n    {\n      nome: 'Fase3_Configuracao_Sistemas',\n      descricao: 'Configuração de Sistemas e Integrações',\n      subpastas: ['Configuracoes_Monday', 'Configuracoes_N8N', 'Integracao_APIs', 'Testes_Validacao'],\n      arquivos: ['README_Fase3.md', 'Documentacao_Integracao.md', 'Plano_Testes.md']\n    }\n  ]\n};\n\nreturn { json: { projeto, cliente, tipo, timestamp, estruturaPastas } };"
      },
      "id": "processar-estrutura",
      "name": "Processar Estrutura",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [650, 200]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"status\": \"success\", \"message\": \"Workflow Central TRAE criado com sucesso!\", \"projeto\": $json.projeto, \"cliente\": $json.cliente, \"timestamp\": $json.timestamp, \"webhook_url\": \"http://localhost:5678/webhook/diagnostico-360\" } }}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [850, 200]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Verificar Ação",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Verificar Ação": {
      "main": [
        [
          {
            "node": "Processar Estrutura",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Processar Estrutura": {
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

// Função para importar o workflow
async function importarWorkflow() {
  try {
    console.log('📝 Preparando dados do workflow...');
    
    // Copiar JSON para clipboard
    await navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2));
    console.log('✅ JSON copiado para clipboard!');
    
    console.log('📋 INSTRUÇÕES PARA IMPORTAR:');
    console.log('1. Na interface do n8n, clique no botão "+" (novo workflow)');
    console.log('2. Clique em "Import from clipboard" ou "Import"');
    console.log('3. Cole o conteúdo (Ctrl+V ou Cmd+V)');
    console.log('4. Clique em "Import"');
    console.log('5. Ative o workflow clicando no botão "Inactive" para torná-lo "Active"');
    console.log('');
    console.log('🔗 Após ativar, o webhook estará disponível em:');
    console.log('   http://localhost:5678/webhook/diagnostico-360');
    
  } catch (error) {
    console.error('❌ Erro na importação:', error);
    console.log('📋 JSON do workflow para importação manual:');
    console.log(JSON.stringify(workflowData, null, 2));
  }
}

// Executar importação
importarWorkflow();

// Disponibilizar função global para re-executar se necessário
window.importarWorkflowTRAE = importarWorkflow;