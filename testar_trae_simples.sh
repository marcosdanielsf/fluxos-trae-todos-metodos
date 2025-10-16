#!/bin/bash

echo "🚀 Testando Central TRAE..."
echo ""

# Verificar n8n
echo "📡 Verificando n8n..."
STATUS=$(curl -s http://localhost:5678/healthz)
if [[ "$STATUS" == *"ok"* ]]; then
    echo "✅ n8n está rodando!"
else
    echo "❌ n8n não está rodando. Execute: npx n8n start"
    exit 1
fi

echo ""
echo "🔗 Interface do n8n: http://localhost:5678"
echo ""

# Testar webhooks existentes
echo "🧪 Testando webhooks disponíveis..."
echo ""

echo "📝 Testando webhook 'trae-direto'..."
RESPONSE1=$(curl -s -X POST http://localhost:5678/webhook/trae-direto \
  -H "Content-Type: application/json" \
  -d '{"teste": "funcionando", "projeto": "Central TRAE"}' 2>/dev/null)

if [[ "$RESPONSE1" == *"success"* ]]; then
    echo "✅ Webhook 'trae-direto' funcionando!"
    echo "📋 Resposta: $RESPONSE1"
else
    echo "⚠️  Webhook 'trae-direto' não está ativo"
    echo "💡 Importe o arquivo: workflow_trae_direto.json"
fi

echo ""
echo "📝 Testando webhook 'diagnostico-360'..."
RESPONSE2=$(curl -s -X POST http://localhost:5678/webhook/diagnostico-360 \
  -H "Content-Type: application/json" \
  -d '{"action": "criar_workflow", "projeto": "Teste"}' 2>/dev/null)

if [[ "$RESPONSE2" == *"success"* ]]; then
    echo "✅ Webhook 'diagnostico-360' funcionando!"
    echo "📋 Resposta: $RESPONSE2"
else
    echo "⚠️  Webhook 'diagnostico-360' não está ativo"
    echo "💡 Importe o arquivo: workflow_diagnostico_360_completo.json"
fi

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Abra http://localhost:5678"
echo "2. Clique em '+' (novo workflow)"
echo "3. Clique em 'Import from clipboard'"
echo "4. Cole o conteúdo do arquivo workflow_trae_direto.json"
echo "5. Ative o workflow (botão Inactive → Active)"
echo ""
echo "📁 Arquivos disponíveis:"
echo "- workflow_trae_direto.json (mais simples)"
echo "- workflow_diagnostico_360_completo.json (completo)"
echo "- SOLUCAO_ERRO.md (guia de solução)"