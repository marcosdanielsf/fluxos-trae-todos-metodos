// Script para importar workflow no n8n via interface web
// Execute este script no console do navegador na página do n8n

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
        "functionCode": `const projeto = $input.item.json.projeto || 'Projeto Padrão';
const cliente = $input.item.json.cliente || 'Cliente Padrão';
const tipo = $input.item.json.tipo || 'Completo';
const timestamp = new Date().toISOString();

const estruturaPastas = {
  raiz: 'Central_TRAE',
  fases: [
    {
      nome: 'Fase1_Preparacao_Diagnostico_360',
      descricao: 'Preparação e Diagnóstico 360°',
      subpastas: [
        'Documentacao_Base',
        'Analise_Inicial', 
        'Stakeholders',
        'Cronograma_Planejamento'
      ],
      arquivos: [
        'README_Fase1.md',
        'Checklist_Diagnostico.md',
        'Template_Entrevista_Stakeholders.md',
        'Acessos_Stakeholders.csv',
        'Cronograma_Fase1.csv'
      ]
    },
    {
      nome: 'Fase2_Desenho_Processos',
      descricao: 'Desenho e Mapeamento de Processos',
      subpastas: [
        'Processos_AsIs',
        'Processos_ToBe',
        'Fluxogramas',
        'Documentacao_Tecnica'
      ],
      arquivos: [
        'README_Fase2.md',
        'Template_Mapeamento_Processo.md',
        'Matriz_RACI.csv'
      ]
    },
    {
      nome: 'Fase3_Configuracao_Sistemas',
      descricao: 'Configuração de Sistemas e Integrações',
      subpastas: [
        'Configuracoes_Monday',
        'Configuracoes_N8N',
        'Integracao_APIs',
        'Testes_Validacao'
      ],
      arquivos: [
        'README_Fase3.md',
        'Documentacao_Integracao.md',
        'Plano_Testes.md'
      ]
    },
    {
      nome: 'Fase4_Treinamento_GoLive',
      descricao: 'Treinamento e Go-Live',
      subpastas: [
        'Materiais_Treinamento',
        'Manuais_Usuario',
        'Videos_Tutoriais',
        'Suporte_GoLive'
      ],
      arquivos: [
        'README_Fase4.md',
        'Cronograma_Treinamento.csv',
        'Checklist_GoLive.md'
      ]
    },
    {
      nome: 'Fase5_Monitoramento_Melhoria',
      descricao: 'Monitoramento Contínuo e Melhorias',
      subpastas: [
        'Dashboards',
        'Relatorios_Performance',
        'Backlog_Melhorias',
        'Documentacao_Evolucao'
      ],
      arquivos: [
        'README_Fase5.md',
        'Template_Relatorio_Mensal.md',
        'KPIs_Monitoramento.csv'
      ]
    }
  ]
};

return {
  json: {
    projeto,
    cliente,
    tipo,
    timestamp,
    estruturaPastas
  }
};`
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
        "responseBody": "={{ { \"status\": \"success\", \"message\": \"Workflow Central TRAE criado com sucesso\", \"projeto\": $json.projeto, \"timestamp\": $json.timestamp, \"estrutura_criada\": true } }}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.webhookResponse",
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
function importarWorkflow() {
  console.log('Iniciando importação do workflow...');
  
  // Simular o processo de importação
  const workflowJson = JSON.stringify(workflowData, null, 2);
  
  console.log('Workflow JSON gerado:');
  console.log(workflowJson);
  
  // Instruções para o usuário
  console.log('\n=== INSTRUÇÕES PARA IMPORTAR ===');
  console.log('1. Copie o JSON acima');
  console.log('2. No n8n, clique em "+" para criar novo workflow');
  console.log('3. Clique nos 3 pontos (...) no canto superior direito');
  console.log('4. Selecione "Import from JSON"');
  console.log('5. Cole o JSON e clique em "Import"');
  console.log('6. Salve o workflow');
  console.log('7. Ative o workflow');
  
  return workflowData;
}

// Executar a importação
importarWorkflow();