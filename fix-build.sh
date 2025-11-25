#!/bin/bash

# Script de Correção para Assembly Line
echo "🔧 Corrigindo problemas de build..."

# Navegar para o diretório da aplicação
cd "$(dirname "$0")/assembly-line"

# 1. Limpar cache do Next.js
echo "🧹 Limpando cache do Next.js..."
rm -rf .next

# 2. Limpar node_modules e package-lock.json
echo "🗑️ Removendo node_modules..."
rm -rf node_modules
rm -f package-lock.json

# 3. Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install

# 4. Limpar cache do npm
echo "🧹 Limpando cache do npm..."
npm cache clean --force

# 5. Verificar se os arquivos essenciais existem
echo "✅ Verificando arquivos essenciais..."

if [ ! -f "lib/utils.ts" ]; then
  echo "❌ Arquivo lib/utils.ts não encontrado!"
  exit 1
fi

if [ ! -f "tsconfig.json" ]; then
  echo "❌ Arquivo tsconfig.json não encontrado!"
  exit 1
fi

echo "✅ Todos os arquivos essenciais estão presentes!"

# 6. Executar o build de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
npm run dev
