# 🗄️ Configuração do Supabase - Assembly Line

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie um novo projeto:
   - Nome: `assembly-line`
   - Database Password: (escolha uma senha forte)
   - Region: South America (São Paulo) ou mais próxima
4. Aguarde ~2 minutos para o projeto ser criado

## 2. Configurar Variáveis de Ambiente

Depois que o projeto for criado, copie as credenciais:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública)

3. Adicione ao arquivo `.env.local`:

```env
# Gemini API (já configurado)
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBBKr0iawCM6ZABZz-V0p_yo5B-cE3EAiA

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 3. Criar Tabelas no Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o SQL abaixo e execute (▶️ Run):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  current_phase INTEGER DEFAULT 1,
  status TEXT DEFAULT 'em-andamento' CHECK (status IN ('em-andamento', 'concluido', 'pausado')),
  total_cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phases table
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'locked' CHECK (status IN ('active', 'locked', 'completed')),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'processing', 'pending', 'locked')),
  progress INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  badge TEXT,
  badge_variant TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT FALSE,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_phases_project_id ON phases(project_id);
CREATE INDEX idx_agents_phase_id ON agents(phase_id);
CREATE INDEX idx_assets_project_id ON assets(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permitir acesso público por enquanto - ajuste conforme necessário)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on phases" ON phases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on agents" ON agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assets" ON assets FOR ALL USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Verificar Tabelas

Depois de executar o SQL:

1. Vá em **Table Editor** no Supabase
2. Você deve ver 4 tabelas:
   - ✅ `projects`
   - ✅ `phases`
   - ✅ `agents`
   - ✅ `assets`

## 5. Testar a Conexão

Reinicie o servidor Next.js:

```bash
npm run dev
```

A aplicação agora está conectada ao Supabase! 🎉

## 📊 Estrutura do Banco de Dados

### Tabela `projects`
Armazena os projetos principais:
- `id`: UUID único
- `name`: Nome do projeto
- `niche`: Nicho do negócio
- `client_name`: Nome do cliente
- `current_phase`: Fase atual (1-4)
- `status`: em-andamento | concluido | pausado
- `total_cost`: Custo total em tokens

### Tabela `phases`
Armazena as 4 fases de cada projeto:
- `id`: UUID único
- `project_id`: Referência ao projeto
- `phase_number`: 1, 2, 3 ou 4
- `title`: Título da fase
- `status`: active | locked | completed
- `progress`: 0-100

### Tabela `agents`
Armazena os agentes de cada fase:
- `id`: UUID único
- `phase_id`: Referência à fase
- `name`: Nome do agente
- `status`: completed | processing | pending | locked
- `tokens_used`: Tokens consumidos
- `cost`: Custo em dólares

### Tabela `assets`
Armazena os assets gerados:
- `id`: UUID único
- `project_id`: Referência ao projeto
- `type`: copy | headline | story | ad | email | etc
- `title`: Título do asset
- `content`: Conteúdo gerado
- `tags`: Array de tags
- `favorite`: Se está favoritado
- `downloads`: Contador de downloads

## 🔒 Segurança

Por padrão, as políticas RLS estão abertas para desenvolvimento.

**Para produção**, você deve:
1. Implementar autenticação de usuários
2. Ajustar as policies RLS para filtrar por `user_id`
3. Usar Supabase Auth para gerenciar sessões

## 📝 Próximos Passos

Depois de configurar o Supabase:

1. ✅ Tabelas criadas
2. ✅ Variáveis de ambiente configuradas
3. 🔄 Implementar salvamento automático no Dashboard
4. 🔄 Sincronizar dados em tempo real
5. 🔄 Migrar dados mockados para o banco

---

**Precisa de ajuda?** Consulte a [documentação oficial do Supabase](https://supabase.com/docs)
