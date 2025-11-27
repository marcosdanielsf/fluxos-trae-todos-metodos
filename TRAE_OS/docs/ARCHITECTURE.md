# 🏗️ TRAE OS - Arquitetura Detalhada

## Visão Geral

O TRAE OS é construído em uma arquitetura de microserviços orientada por eventos, com IA central orquestrando todos os módulos.

## 🧠 Camada 1: O Cérebro (Brain)

### Core Orchestrator

O **Orquestrador Central** é o coração do sistema:

```python
TraeOrchestratorBrain
├── monitor_modules()      # Monitora estado dos 8 módulos
├── process_task_queue()   # Processa fila de tarefas por prioridade
├── execute_task()         # Executa tarefa e coordena módulos
├── decide_next_steps()    # IA decide próximos passos
└── health_check()         # Verifica saúde do sistema
```

**Responsabilidades**:
- Coordenar os 8 módulos
- Gerenciar fluxo de dados
- Priorizar tarefas automaticamente
- Monitorar saúde do sistema

### Agentes Especializados

Cada módulo tem um **Agente IA** dedicado:

#### 1. DiagnosticAgent (Fase 1)
```python
Habilidades:
- icp_analysis          # Análise de ICP
- channel_audit         # Auditoria de canais
- competitor_benchmark  # Benchmark competitivo
- metrics_analysis      # Análise de métricas
- cs_diagnostic         # Diagnóstico de CS
```

#### 2. SDRAgent (Fase 5)
```python
Habilidades:
- lead_qualification    # Qualificação automática
- data_enrichment       # Enriquecimento de dados
- automated_outreach    # Cadências automatizadas
- intelligent_scheduling # Agendamento inteligente
- auto_followup         # Follow-up automático
- lead_scoring          # Scoring de leads
```

**Pipeline SDR**:
```
Lead → Enriquecimento → Score → Qualificação
  ↓
Se Qualificado:
  → Outreach → Resposta → Agendamento → Handoff Closer
Se Não Qualificado:
  → Nurture → Follow-up Future
```

### Memória Compartilhada

**SharedMemory** usando Pinecone:

```python
Funcionalidades:
- store()               # Armazena com embedding
- retrieve()            # Recupera por chave
- search()              # Busca semântica
- get_context()         # Contexto por módulo
- learn_from_outcomes() # Aprendizado contínuo
```

**Fluxo de Memória**:
```
Evento → Embedding (OpenAI) → Pinecone Vector DB
                                    ↓
                         Busca Semântica ← Query
                                    ↓
                            Resultados Relevantes
```

### Motor de Decisão

**DecisionEngine** combina regras + ML:

```python
Processo de Decisão:
1. Recebe contexto
2. Busca histórico (SharedMemory)
3. Aprende com decisões passadas
4. Aplica regras de negócio
5. Aplica ML/IA
6. Combina decisões
7. Retorna ação recomendada
```

**Tipos de Decisão**:
- **STRATEGIC**: Decisões de longo prazo
- **TACTICAL**: Decisões de médio prazo
- **OPERATIONAL**: Decisões do dia a dia

## 🔄 Camada 2: Fluxo de Dados

### Fluxo Completo de Lead

```
1. CAPTURA (Módulo Aquisição)
   Landing Page → Form Submit → Webhook → TRAE OS

2. PROCESSAMENTO (Módulo Pré-Vendas)
   Lead → Enriquecimento → Scoring → Qualificação
      ↓
   Se Score >= 60:
      → Cadência Email/WhatsApp
      → Resposta Positiva
      → Agendamento Automático

3. VENDAS (Módulo Vendas)
   Reunião Agendada → Closer Preparado (IA)
      ↓
   Durante Call:
      → IA sugere respostas
      → IA analisa objeções
   Pós Call:
      → Proposta Gerada Automaticamente
      → Follow-up Automático

4. CONVERSÃO
   Deal Fechado → CRM Atualizado
      ↓
   Trigger Automático: Módulo Onboarding

5. ONBOARDING (Módulo CS)
   Email Kickoff → Sequência Drip
      ↓
   Health Score Monitorado
      ↓
   Se < 70: Intervenção Automática
   Se > 75: Upsell Sugerido

6. GESTÃO (Módulo Gestão)
   Todas métricas consolidadas
      ↓
   Dashboard Atualizado em Tempo Real
      ↓
   Decisões Sugeridas por IA
```

## 🌐 Camada 3: APIs e Integrações

### API REST

**Endpoints Principais**:

```
POST   /brain/start              # Inicia cérebro
POST   /brain/stop               # Para cérebro
GET    /brain/status             # Status completo

POST   /tasks/add                # Adiciona tarefa
POST   /leads/process            # Processa lead
POST   /decisions/request        # Solicita decisão

GET    /modules/{module}/status  # Status de módulo
POST   /modules/{module}/execute # Executa ação

GET    /memory/search            # Busca semântica
GET    /analytics/overview       # Analytics geral
```

### WebSocket

**Monitoramento em Tempo Real**:

```javascript
ws://localhost:8000/ws/brain

// Cliente recebe updates a cada 5s:
{
  "running": true,
  "modules": {...},
  "queue_size": 5,
  "health_score": 82
}
```

### Integrações Externas

```yaml
CRM:
  - Socialfy (Principal)
  - HubSpot
  - Pipedrive

Marketing:
  - Meta Ads API
  - Google Ads API
  - Mailchimp/SendGrid

Comunicação:
  - WhatsApp (Twilio)
  - Email (SendGrid)
  - SMS (Twilio)

Calendário:
  - Google Calendar
  - Calendly

Pagamento:
  - Stripe
  - Asaas

Enriquecimento:
  - Clearbit
  - Apollo.io
  - LinkedIn Sales Navigator
```

## 🗄️ Camada 4: Dados

### Database Schema

```sql
-- PostgreSQL

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  company VARCHAR(255),
  score INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  module VARCHAR(50),
  action VARCHAR(100),
  priority VARCHAR(20),
  status VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP,
  executed_at TIMESTAMP
);

-- Decisions
CREATE TABLE decisions (
  id UUID PRIMARY KEY,
  module VARCHAR(50),
  context JSONB,
  decision JSONB,
  outcome VARCHAR(50),
  created_at TIMESTAMP
);

-- Metrics
CREATE TABLE metrics (
  id UUID PRIMARY KEY,
  module VARCHAR(50),
  metric_name VARCHAR(100),
  metric_value DECIMAL,
  timestamp TIMESTAMP
);
```

### Redis Cache

```
Estrutura de Cache:
- lead:{email}           → Dados do lead (TTL: 1h)
- task:{id}              → Status de tarefa (TTL: 24h)
- module:{name}:status   → Status do módulo (TTL: 5min)
- analytics:overview     → Analytics cache (TTL: 15min)
```

### Pinecone Vector Store

```
Namespace: trae-brain

Vetores:
- decision_{timestamp}   → Decisões históricas
- diagnostic_{company}   → Diagnósticos
- lead_{email}           → Perfil de leads
- context_{module}       → Contexto de módulos

Metadata:
- type: [decision, diagnostic, lead, context]
- module: [diagnostico, pre_vendas, ...]
- timestamp: ISO8601
- outcome: [success, failure, pending]
```

## 🔒 Camada 5: Segurança

### Autenticação

```python
# JWT Tokens
POST /auth/login
→ Returns: {access_token, refresh_token}

# Todas requisições
Headers: {
  "Authorization": "Bearer {access_token}"
}
```

### Rate Limiting

```
Por IP:
- 100 requests/minuto
- 1000 requests/hora

Por API Key:
- 1000 requests/minuto
- 10000 requests/hora
```

### Encryption

```
At Rest:
- PostgreSQL: Transparent Data Encryption
- Pinecone: Encrypted vectors
- Backups: AES-256

In Transit:
- HTTPS/TLS 1.3
- WSS (WebSocket Secure)
```

## 📊 Camada 6: Monitoramento

### Métricas (Prometheus)

```python
# Sistema
- brain_health_score
- modules_active_count
- task_queue_size
- memory_entries_count

# Performance
- task_execution_time
- api_response_time
- database_query_time

# Negócio
- leads_processed_total
- meetings_scheduled_total
- deals_closed_total
- revenue_generated
```

### Logs (Structured)

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "level": "INFO",
  "module": "pre_vendas",
  "event": "lead_qualified",
  "lead_email": "joao@empresa.com",
  "score": 85,
  "context": {...}
}
```

### Alertas

```yaml
Alertas Críticos:
- Brain health < 80%
- Module error rate > 5%
- API response time > 1s
- Database connection issues

Notificações:
- Slack
- Email
- PagerDuty
```

## 🚀 Camada 7: Deployment

### Docker

```dockerfile
# Cada componente em container
- trae-os-brain       # Orquestrador
- trae-os-api         # API REST
- trae-os-workers     # Background workers
- postgresql          # Database
- redis               # Cache
- prometheus          # Monitoring
- grafana             # Dashboards
```

### Kubernetes (Produção)

```yaml
Pods:
- brain-pod (replicas: 2)
- api-pod (replicas: 3)
- worker-pod (replicas: 5)

Services:
- brain-service
- api-service

Ingress:
- api.traeos.com
- dashboard.traeos.com
```

## 🎯 Fluxos Críticos

### Auto-Healing

```
Erro Detectado
  ↓
Brain identifica módulo com problema
  ↓
Tenta restart automático
  ↓
Se falha novamente:
  → Escalação para humano
  → Notificação Slack/Email
  → Fallback para modo manual
```

### Auto-Scaling

```
Carga Alta Detectada
  ↓
Decision Engine analisa
  ↓
Recomenda alocação de recursos
  ↓
Kubernetes escala pods automaticamente
  ↓
Load balancer redistribui tráfego
```

### Continuous Learning

```
Decisão Tomada
  ↓
Resultado Observado
  ↓
Armazenado em Pinecone
  ↓
Próxima decisão similar:
  → Busca decisões passadas
  → Aprende com sucessos/falhas
  → Ajusta confiança
  → Melhora ao longo do tempo
```

---

**Desenvolvido com ❤️ pela equipe Mottivme Sales**
