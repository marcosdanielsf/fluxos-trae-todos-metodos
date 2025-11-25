-- ========================================
-- ASSEMBLY LINE - SUPABASE DATABASE SCHEMA
-- TABELAS COM SUFIXO -assembly-epic
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROJECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS "projects-assembly-epic" (
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
CREATE TABLE IF NOT EXISTS "phases-assembly-epic" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES "projects-assembly-epic"(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS "agents-assembly-epic" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES "phases-assembly-epic"(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS "assets-assembly-epic" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES "projects-assembly-epic"(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS "idx_projects_assembly_epic_user_id" ON "projects-assembly-epic"(user_id);
CREATE INDEX IF NOT EXISTS "idx_projects_assembly_epic_status" ON "projects-assembly-epic"(status);
CREATE INDEX IF NOT EXISTS "idx_phases_assembly_epic_project_id" ON "phases-assembly-epic"(project_id);
CREATE INDEX IF NOT EXISTS "idx_agents_assembly_epic_phase_id" ON "agents-assembly-epic"(phase_id);
CREATE INDEX IF NOT EXISTS "idx_agents_assembly_epic_status" ON "agents-assembly-epic"(status);
CREATE INDEX IF NOT EXISTS "idx_assets_assembly_epic_project_id" ON "assets-assembly-epic"(project_id);
CREATE INDEX IF NOT EXISTS "idx_assets_assembly_epic_type" ON "assets-assembly-epic"(type);
CREATE INDEX IF NOT EXISTS "idx_assets_assembly_epic_favorite" ON "assets-assembly-epic"(favorite);

-- ========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE "projects-assembly-epic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "phases-assembly-epic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agents-assembly-epic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assets-assembly-epic" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES (OPEN FOR DEVELOPMENT)
-- ========================================
-- ⚠️ ATENÇÃO: Estas políticas permitem acesso público
-- Para produção, implemente autenticação e filtre por user_id

DROP POLICY IF EXISTS "Allow all operations on projects-assembly-epic" ON "projects-assembly-epic";
CREATE POLICY "Allow all operations on projects-assembly-epic"
  ON "projects-assembly-epic" FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on phases-assembly-epic" ON "phases-assembly-epic";
CREATE POLICY "Allow all operations on phases-assembly-epic"
  ON "phases-assembly-epic" FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on agents-assembly-epic" ON "agents-assembly-epic";
CREATE POLICY "Allow all operations on agents-assembly-epic"
  ON "agents-assembly-epic" FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on assets-assembly-epic" ON "assets-assembly-epic";
CREATE POLICY "Allow all operations on assets-assembly-epic"
  ON "assets-assembly-epic" FOR ALL
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
DROP TRIGGER IF EXISTS update_projects_assembly_epic_updated_at ON "projects-assembly-epic";
CREATE TRIGGER update_projects_assembly_epic_updated_at
  BEFORE UPDATE ON "projects-assembly-epic"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_phases_assembly_epic_updated_at ON "phases-assembly-epic";
CREATE TRIGGER update_phases_assembly_epic_updated_at
  BEFORE UPDATE ON "phases-assembly-epic"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_assembly_epic_updated_at ON "agents-assembly-epic";
CREATE TRIGGER update_agents_assembly_epic_updated_at
  BEFORE UPDATE ON "agents-assembly-epic"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assets_assembly_epic_updated_at ON "assets-assembly-epic";
CREATE TRIGGER update_assets_assembly_epic_updated_at
  BEFORE UPDATE ON "assets-assembly-epic"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO (OPCIONAL)
-- ========================================
-- Execute estas queries para verificar se tudo foi criado:

-- Ver todas as tabelas criadas:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%assembly-epic';

-- Ver políticas RLS:
-- SELECT * FROM pg_policies WHERE tablename LIKE '%assembly-epic';

-- Testar insert (opcional):
-- INSERT INTO "projects-assembly-epic" (user_id, name, niche, client_name)
-- VALUES ('demo-user', 'Teste', 'Marketing', 'Cliente Teste');

-- ========================================
-- ✅ PRONTO! TABELAS CRIADAS COM SUCESSO
-- ========================================
