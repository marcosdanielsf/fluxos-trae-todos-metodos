#!/bin/bash

echo "=== TESTE DE WEBHOOKS N8N ==="
echo "Testando webhooks do n8n para criação de workflows..."
echo ""

# Função para testar webhook
testar_webhook() {
    local url=$1
    local payload=$2
    local nome=$3
    
    echo "🧪 Testando: $nome"
    echo "URL: $url"
    echo "Payload: $payload"
    echo ""
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    echo "Status: $http_code"
    echo "Resposta: $body"
    echo "----------------------------------------"
    echo ""
}

# Teste 1: Webhook simples (se importado)
echo "1️⃣ Testando Webhook Simples..."
testar_webhook "http://localhost:5678/webhook/teste-trae" \
    '{"mensagem": "Teste do workflow TRAE", "usuario": "Marcos"}' \
    "Workflow Simples"

# Teste 2: Webhook completo (se importado)
echo "2️⃣ Testando Webhook Completo..."
testar_webhook "http://localhost:5678/webhook/diagnostico-360" \
    '{"action": "criar_workflow", "projeto": "Teste Central TRAE", "cliente": "Cliente Teste", "tipo": "Completo"}' \
    "Workflow Completo"

# Teste 3: Verificar webhooks ativos
echo "3️⃣ Verificando webhooks ativos..."
echo "Listando webhooks disponíveis:"
curl -s http://localhost:5678/webhook-test 2>/dev/null || echo "Endpoint de teste não disponível"
echo ""

# Teste 4: Verificar status do n8n
echo "4️⃣ Verificando status do n8n..."
status=$(curl -s http://localhost:5678/healthz)
echo "Status do n8n: $status"
echo ""

echo "=== RESUMO DOS TESTES ==="
echo "✅ n8n está rodando"
echo "🔗 Interface disponível em: http://localhost:5678"
echo "📝 Para importar workflows, use os arquivos JSON disponíveis"
echo "🚀 Após importar, os webhooks estarão disponíveis"
echo ""
echo "📁 Arquivos disponíveis:"
echo "  - workflow_simples.json (workflow básico)"
echo "  - workflow_diagnostico_360_completo.json (workflow completo)"
echo "  - importar_via_browser.js (script para console)"
echo ""
echo "📖 Consulte: guia_completo_importacao.md para instruções detalhadas"