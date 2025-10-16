#!/bin/bash

echo "🔍 Verificando importação do workflow Central TRAE..."
echo ""

# Verificar n8n
echo "📡 Status do n8n:"
STATUS=$(curl -s http://localhost:5678/healthz)
if [[ "$STATUS" == *"ok"* ]]; then
    echo "✅ n8n rodando em http://localhost:5678"
else
    echo "❌ n8n não está rodando"
    exit 1
fi

echo ""
echo "🧪 Testando webhook 'trae-direto'..."

# Testar webhook
RESPONSE=$(curl -s -X POST http://localhost:5678/webhook/trae-direto \
  -H "Content-Type: application/json" \
  -d '{"teste": "importacao", "projeto": "Central TRAE"}' 2>/dev/null)

echo "📋 Resposta do webhook:"
echo "$RESPONSE"
echo ""

# Verificar se funcionou
if [[ "$RESPONSE" == *"Central TRAE funcionando"* ]] && [[ "$RESPONSE" == *"success"* ]]; then
    echo "🎉 PERFEITO! Workflow importado e funcionando!"
    echo "✅ Webhook ativo: http://localhost:5678/webhook/trae-direto"
    echo ""
    echo "📊 Dados da resposta:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
elif [[ "$RESPONSE" == *"404"* ]] || [[ "$RESPONSE" == *"not registered"* ]]; then
    echo "⚠️  Webhook ainda não foi importado/ativado"
    echo "💡 O workflow precisa ser importado e ativado"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Abra http://localhost:5678"
    echo "2. Siga o guia: GUIA_IMPORTACAO_COMPLETO.md"
    echo "3. Execute este script novamente para testar"
elif [[ -z "$RESPONSE" ]]; then
    echo "⚠️  Sem resposta do webhook"
    echo "💡 Verifique se o workflow está ativo"
else
    echo "⚠️  Resposta inesperada"
    echo "💡 Verifique a configuração do workflow"
    echo "📋 Resposta recebida: $RESPONSE"
fi

echo ""
echo "📁 Arquivos de ajuda:"
echo "- GUIA_IMPORTACAO_COMPLETO.md (guia passo a passo)"
echo "- workflow_trae_direto.json (JSON para importar)"
echo "- importar_trae_direto.js (script automático)"