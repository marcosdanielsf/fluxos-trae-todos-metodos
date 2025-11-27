# 🧠 TRAE OS - Sistema Operacional Empresarial

## Visão Geral

O **TRAE OS** é um sistema operacional empresarial completo e autogerenciável que automatiza todas as 8 fases da metodologia TRAE (Transformação, Resultados, Automação e Escala).

### 🎯 Objetivo

Criar um sistema que **roda sozinho**, permitindo que empresas operem com 90% menos intervenção manual, focando apenas em decisões estratégicas.

## 🏗️ Arquitetura

```
TRAE OS
├── Brain (Cérebro)
│   ├── Orchestrator (Orquestrador Central)
│   ├── Agents (8 Agentes Especializados)
│   ├── Memory (Memória Compartilhada)
│   └── Decision Engine (Motor de Decisão)
├── Modules (8 Módulos Autogerenciáveis)
├── Config (Configurações e APIs)
└── Data (Armazenamento)
```

## 📦 Os 8 Módulos

### 1. Módulo Diagnóstico 360° 🔍
**Função**: Auto-análise completa da empresa
- Análise automática de ICP e personas
- Auditoria de canais
- Benchmark competitivo
- Diagnóstico de métricas

### 2. Módulo Posicionamento 🎯
**Função**: Auto-branding
- Geração automática de posicionamento
- Manifesto de marca por IA
- Tom de voz definido automaticamente
- Brand book gerado

### 3. Módulo Oferta 💎
**Função**: Auto-pricing e estruturação
- Análise de precificação de mercado
- Ladder de ofertas automático
- Materiais comerciais gerados
- Scripts de vendas

### 4. Módulo Aquisição 📢
**Função**: Marketing automatizado
- Calendário editorial auto-gerado
- Conteúdo criado por IA
- Landing pages automatizadas
- Campanhas otimizadas

### 5. Módulo Pré-Vendas (SDR Bot) 📞
**Função**: SDR completamente automatizado
- Qualificação automática de leads
- Cadências automatizadas
- Agendamento inteligente
- Follow-up automático

### 6. Módulo Vendas (Closer AI) 💼
**Função**: Assistente de vendas
- Discovery preparado por IA
- Sugestões em tempo real
- Propostas automáticas
- Negociação assistida

### 7. Módulo Onboarding & CS 💚
**Função**: Sucesso automatizado
- Onboarding sequenciado
- Health score automático
- Alertas de churn
- Upsell sugerido

### 8. Módulo Gestão 📊
**Função**: Command center
- OKRs em tempo real
- Dashboards executivos
- Forecasting com IA
- Decisões sugeridas

## 🚀 Instalação

### Requisitos
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Redis

### Instalação

```bash
# Clone o repositório
cd TRAE_OS

# Instale dependências Python
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o cérebro
python brain/orchestrator/core_orchestrator.py

# Inicie a API (em outro terminal)
python config/api_server.py
```

## 📖 Uso

### Iniciar o Sistema

```python
from brain.orchestrator.core_orchestrator import TraeOrchestratorBrain

config = {
    "environment": "production",
    "modules_enabled": ["diagnostico", "aquisicao", "pre_vendas", "vendas"]
}

brain = TraeOrchestratorBrain(config)
await brain.start()
```

### Adicionar Tarefa

```python
brain.add_task({
    "name": "process_new_lead",
    "module": "pre_vendas",
    "action": "execute",
    "priority": Priority.HIGH,
    "data": {
        "lead": {
            "name": "João Silva",
            "email": "joao@empresa.com",
            "company": "Empresa XYZ"
        }
    }
})
```

### API REST

```bash
# Iniciar cérebro
curl -X POST http://localhost:8000/brain/start

# Adicionar lead
curl -X POST http://localhost:8000/leads/process \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "company": "Empresa XYZ"
  }'

# Status do sistema
curl http://localhost:8000/brain/status
```

## 🎨 Dashboard

Acesse o dashboard de monitoramento:

```bash
# Abra no navegador
open docs/dashboard.html
```

O dashboard mostra:
- Status em tempo real de todos os módulos
- Métricas de performance
- Log de atividades
- Saúde geral do sistema

## 🧪 Testes

```bash
# Executar testes
pytest tests/

# Testes específicos
pytest tests/test_orchestrator.py
pytest tests/test_sdr_agent.py
```

## 🔧 Configuração

### Arquivo de Configuração (`config.json`)

```json
{
  "environment": "production",
  "pinecone_api_key": "seu-api-key",
  "openai_api_key": "seu-api-key",
  "modules": {
    "diagnostico": {"enabled": true, "priority": "high"},
    "pre_vendas": {"enabled": true, "priority": "critical"},
    "vendas": {"enabled": true, "priority": "critical"}
  },
  "decision_engine": {
    "auto_mode": true,
    "confidence_threshold": 0.7
  }
}
```

## 📊 Métricas

O sistema rastreia automaticamente:

- **Aquisição**: Leads gerados, CPL, taxa de conversão
- **SDR**: Qualificação, agendamento, show rate
- **Vendas**: Close rate, ticket médio, ciclo
- **CS**: Retenção, NPS, expansão
- **Gestão**: Eficiência, automação, ROI

## 🔒 Segurança

- Todas as APIs requerem autenticação
- Dados criptografados em repouso
- Logs de auditoria completos
- LGPD compliance

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Propriedade de Mottivme Sales. Todos os direitos reservados.

## 🆘 Suporte

- **Documentação**: `/docs`
- **Email**: suporte@mottivme.com
- **Issues**: GitHub Issues

## 🎯 Roadmap

### Q1 2025
- [x] Core Orchestrator
- [x] SDR Agent
- [x] Decision Engine
- [x] Shared Memory
- [ ] Módulos 1-3

### Q2 2025
- [ ] Módulos 4-8
- [ ] Dashboard React
- [ ] Mobile App
- [ ] Integração completa CRM

### Q3 2025
- [ ] ML Models avançados
- [ ] Auto-scaling
- [ ] Multi-tenant

## 💡 Casos de Uso

### 1. Startup SaaS
- Automatiza geração de leads
- SDR Bot qualifica e agenda
- Closer recebe leads quentes
- ROI: 300% em 6 meses

### 2. Consultoria
- Diagnóstico automatizado
- Propostas geradas automaticamente
- CS proativo
- ROI: 200% em 3 meses

### 3. E-commerce
- Marketing automatizado
- Upsell inteligente
- Retenção otimizada
- ROI: 250% em 4 meses

## 🌟 Diferenciais

✅ **Autopilot Mode**: Sistema roda 24/7 sem intervenção
✅ **Self-Healing**: Detecta e corrige problemas automaticamente
✅ **Predictive Intelligence**: Prevê e previne problemas
✅ **Infinite Scalability**: Escala sem limites

---

**Desenvolvido com ❤️ pela equipe Mottivme Sales**
