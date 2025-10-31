-- ========================================
-- ASSEMBLY LINE - SUPABASE DATABASE SCHEMA
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROJECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
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

-- ========================================
-- PHASES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'locked' CHECK (status IN ('active', 'locked', 'completed')),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AGENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS agents (
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
  result_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ASSETS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS assets (
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

-- ========================================
-- INDEXES FOR BETTER PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_phases_project_id ON phases(project_id);
CREATE INDEX IF NOT EXISTS idx_agents_phase_id ON agents(phase_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_favorite ON assets(favorite);

-- ========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES (OPEN FOR DEVELOPMENT)
-- ========================================
-- ⚠️ ATENÇÃO: Estas políticas permitem acesso público
-- Para produção, implemente autenticação e filtre por user_id

DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects"
  ON projects FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on phases" ON phases;
CREATE POLICY "Allow all operations on phases"
  ON phases FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on agents" ON agents;
CREATE POLICY "Allow all operations on agents"
  ON agents FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on assets" ON assets;
CREATE POLICY "Allow all operations on assets"
  ON assets FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================================
-- FUNCTION TO UPDATE updated_at TIMESTAMP
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS TO AUTO-UPDATE updated_at
-- ========================================
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_phases_updated_at ON phases;
CREATE TRIGGER update_phases_updated_at
  BEFORE UPDATE ON phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO (OPCIONAL)
-- ========================================
-- Execute estas queries para verificar se tudo foi criado:

-- Ver todas as tabelas criadas:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver políticas RLS:
-- SELECT * FROM pg_policies;

-- Testar insert (opcional):
-- INSERT INTO projects (user_id, name, niche, client_name)
-- VALUES ('demo-user', 'Teste', 'Marketing', 'Cliente Teste');

-- ========================================
-- ✅ PRONTO! TABELAS CRIADAS COM SUCESSO
-- ========================================
