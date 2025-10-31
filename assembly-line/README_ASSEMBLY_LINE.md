# Assembly Line - Marketing AI

Uma aplicação web completa de marketing com IA para criação automatizada de funis de vendas e conteúdo.

## 🎨 Características

- **Design Moderno**: Interface dark mode com tema customizado em azul e roxo
- **Animações Suaves**: Transições e micro-interações com Framer Motion
- **Componentes Reutilizáveis**: Sistema de design consistente com shadcn/ui
- **TypeScript**: Tipagem completa para segurança e produtividade
- **Responsivo**: Layout mobile-first totalmente responsivo

## 🚀 Tecnologias

- **Next.js 14** - App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes base
- **Framer Motion** - Animações
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

## 📱 Telas Implementadas

### 1. Login/Cadastro (`/auth/login` e `/auth/register`)
- Formulário com validação
- Opção de "Lembrar de mim"
- Integração com Google
- Estados de loading e erro

### 2. Onboarding (`/onboarding`)
Wizard de 4 etapas:
- **Etapa 1**: Informações pessoais e upload de arquivos
- **Etapa 2**: Definição do cliente ideal
- **Etapa 3**: Configuração da oferta principal
- **Etapa 4**: Escolha do tipo de funil

### 3. Dashboard do Projeto (`/dashboard`)
- Sidebar com navegação
- 4 fases de execução:
  1. Clonagem de Identidade
  2. Inteligência de Mercado
  3. Criação de Conteúdo
  4. Estrutura de Funil
- Agentes com estados (concluído, processando, pendente, bloqueado)
- Progress bars animadas
- Badges de status

### 4. Modal de Resultado do Agente
- Visualização de resultados detalhados
- Tabs com diferentes visões dos dados
- Opções de aprovação, feedback e refazer
- Histórico de versões
- Download e compartilhamento

### 5. Sistema de Notificações
- Toasts customizáveis
- 4 variantes: success, error, warning, info
- Auto-dismiss com countdown
- Ações primárias e secundárias
- Stack de múltiplas notificações

### 6. Dashboard de Conclusão (`/project/completion`)
- Animação de confete
- Estatísticas do projeto
- 8 tipos de entregáveis:
  - Clone do Especialista
  - Avatares Psicológicos
  - Posicionamento Estratégico
  - Variações de Copy
  - Scripts de VSL
  - Criativos para Ads
  - Páginas de Captura
  - Funil Completo
- Opções de download e compartilhamento

## 🎨 Design System

### Paleta de Cores

```css
--background: #0a0a0f (quase preto)
--background-secondary: #1a1a2e (azul escuro profundo)
--card: #16213e (azul médio escuro)
--card-border: #1f4068
--primary: #4a7dff (azul brilhante)
--secondary: #7b68ee (roxo)
--success: #10b981 (verde)
--warning: #f59e0b (laranja)
--error: #ef4444 (vermelho)
--foreground: #ffffff
--foreground-secondary: #94a3b8
```

### Componentes Base

- **Button**: 3 variantes (primary, secondary, outline, ghost), 3 tamanhos
- **Card**: Com bordas, padding e hover effects
- **Input**: Com ícones, labels flutuantes e validação
- **Progress**: Barra com gradiente animado
- **Badge**: 4 variantes de status
- **Toast**: Sistema completo de notificações
- **Dialog**: Modal com overlay e animações
- **Tabs**: Navegação entre conteúdos
- **Select**: Dropdown customizado
- **Textarea**: Campo de texto multilinha
- **Checkbox**: Com animação de check
- **FileUpload**: Drag & drop com preview

## 🏗️ Estrutura do Projeto

```
assembly-line/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── onboarding/
│   ├── dashboard/
│   ├── project/
│   │   └── completion/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   └── file-upload.tsx
│   ├── layout/
│   │   └── sidebar.tsx
│   └── features/
│       └── agent-result-modal.tsx
├── lib/
│   ├── utils.ts
│   └── validations/
│       ├── auth.ts
│       └── onboarding.ts
└── package.json
```

## 🚀 Como Executar

### Instalação

```bash
# Navegar para o diretório
cd assembly-line

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

## 📋 Rotas

- `/` - Redireciona para `/auth/login`
- `/auth/login` - Página de login
- `/auth/register` - Página de cadastro
- `/onboarding` - Wizard de configuração inicial
- `/dashboard` - Dashboard do projeto em andamento
- `/project/completion` - Tela de conclusão do projeto

## 🎯 Funcionalidades

### Validação de Formulários
- React Hook Form + Zod
- Validação em tempo real
- Mensagens de erro contextualizadas

### Estados de Loading
- Skeleton loaders
- Spinners animados
- Progress bars
- Feedback visual imediato

### Animações
- Fade in/out
- Slide in/out
- Scale transformations
- Hover effects
- Smooth transitions

### Responsividade
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid e Flexbox layouts
- Touch-friendly interactions

## 🔧 Customização

### Cores
Edite `app/globals.css` para alterar as variáveis de cor do tema.

### Componentes
Todos os componentes em `components/ui/` são customizáveis e reutilizáveis.

### Validações
Schemas de validação em `lib/validations/` podem ser estendidos conforme necessário.

## 📝 Próximos Passos

- [ ] Integração com backend real
- [ ] Autenticação completa (JWT, OAuth)
- [ ] Persistência de dados
- [ ] Upload real de arquivos
- [ ] Geração de conteúdo com IA
- [ ] Testes unitários e E2E
- [ ] Documentação de API
- [ ] Deploy em produção

## 📄 Licença

Este é um projeto demonstrativo.

---

Desenvolvido com ❤️ usando Next.js 14 e TypeScript
