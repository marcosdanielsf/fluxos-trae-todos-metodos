# 🚀 Como Acessar a Aplicação Assembly Line no seu Mac

## 📍 Passo a Passo

### 1. Abra o Terminal no seu Mac
Pressione `Cmd + Espaço` e digite "Terminal"

### 2. Clone ou Atualize o Repositório

#### Se você NÃO tem o repositório ainda:

```bash
# Escolha onde quer salvar (exemplo: Documentos)
cd ~/Documents

# Clone o repositório
git clone https://github.com/marcosdanielsf/fluxos-trae-todos-metodos.git

# Entre no diretório
cd fluxos-trae-todos-metodos
```

#### Se você JÁ TEM o repositório:

```bash
# Navegue até o diretório (ajuste o caminho conforme necessário)
cd ~/Documents/fluxos-trae-todos-metodos

# OU procure onde está:
# cd ~/fluxos-trae-todos-metodos

# Atualize o repositório
git fetch origin
git checkout claude/assembly-line-ai-marketing-app-011CUfAseJNqesSc8CNVpeRD
git pull origin claude/assembly-line-ai-marketing-app-011CUfAseJNqesSc8CNVpeRD
```

### 3. Entre na Pasta da Aplicação

```bash
cd assembly-line
```

### 4. Instale as Dependências

```bash
npm install
```

Isso vai instalar todas as bibliotecas necessárias (Next.js, React, Tailwind, etc.)

### 5. Execute a Aplicação

```bash
npm run dev
```

### 6. Abra no Navegador

A aplicação estará rodando em:
```
http://localhost:3000
```

Você será automaticamente redirecionado para a tela de **Login**.

## 📱 Navegação da Aplicação

Após executar `npm run dev`, você pode acessar:

### Telas Principais:
- **http://localhost:3000** → Redireciona para login
- **http://localhost:3000/auth/login** → Tela de login
- **http://localhost:3000/auth/register** → Tela de cadastro
- **http://localhost:3000/onboarding** → Wizard de 4 etapas
- **http://localhost:3000/dashboard** → Dashboard do projeto
- **http://localhost:3000/project/completion** → Tela de conclusão

### Fluxo Recomendado:
1. Comece em `/auth/login` ou `/auth/register`
2. Preencha o formulário (validação em tempo real)
3. Clique em "Entrar" → vai para `/onboarding`
4. Complete as 4 etapas do onboarding
5. Clique em "Iniciar Projeto" → vai para `/dashboard`
6. Explore o dashboard com as 4 fases e agentes
7. Clique em "Ver Resultado" nos agentes concluídos
8. Acesse `/project/completion` para ver a tela de conclusão

## ✨ Funcionalidades para Testar

### Tela de Login/Cadastro:
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Estado de loading ao submeter
- ✅ Checkbox "Lembrar de mim"
- ✅ Alternância entre login e cadastro

### Onboarding (4 Etapas):
- ✅ Progress bar animada
- ✅ Validação de campos obrigatórios
- ✅ Upload de arquivos (drag & drop)
- ✅ Seleção múltipla de faixa etária
- ✅ Cards clicáveis para escolha de funil

### Dashboard:
- ✅ 4 fases com agentes
- ✅ Estados: concluído ✓, processando ⏳, bloqueado 🔒
- ✅ Progress bars com porcentagem
- ✅ Sidebar com navegação
- ✅ Modal de resultado do agente

### Modal de Resultado:
- ✅ Tabs (Padrões, Estrutura, Dados Brutos)
- ✅ Botões de ação (Aprovar, Feedback, Refazer)
- ✅ Histórico de versões
- ✅ Copiar JSON

### Tela de Conclusão:
- ✅ Animação de confete
- ✅ Estatísticas do projeto
- ✅ 8 tipos de entregáveis em cards
- ✅ Hover effects nos cards

## 🎨 Design System

A aplicação usa um **tema dark** com:
- **Cores primárias:** Azul brilhante (#4a7dff) e Roxo (#7b68ee)
- **Background:** Preto profundo (#0a0a0f)
- **Animações suaves** com Framer Motion
- **Ícones** da biblioteca Lucide React
- **Componentes** totalmente responsivos

## 🛠️ Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Lucide React

## ❓ Problemas Comuns

### "npm: command not found"
Instale o Node.js: https://nodejs.org/

### "git: command not found"
Instale o Git: https://git-scm.com/download/mac

### Porta 3000 já em uso
```bash
# Use outra porta
npm run dev -- -p 3001
```

### Erro ao instalar dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📞 Precisa de Ajuda?

Se tiver algum problema, me avise e posso:
1. Verificar o status do repositório
2. Criar uma versão alternativa
3. Ajudar com troubleshooting específico

---

**Desenvolvido com ❤️ usando Next.js 14 + TypeScript**
