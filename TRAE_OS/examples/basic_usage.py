#!/usr/bin/env python3
"""
TRAE OS - Exemplos de Uso Básico
Demonstra como usar o sistema TRAE OS
"""

import asyncio
import sys
sys.path.append('..')

from brain.orchestrator.core_orchestrator import TraeOrchestratorBrain, Priority, BrainController
from brain.agents.diagnostic_agent import DiagnosticAgent
from brain.agents.sdr_agent import SDRAgent
from brain.memory.shared_memory import SharedMemory
from brain.decision_engine.decision_engine import DecisionEngine


async def example_1_basic_orchestrator():
    """
    Exemplo 1: Uso básico do orquestrador
    """
    print("\n" + "="*60)
    print("EXEMPLO 1: Orquestrador Básico")
    print("="*60 + "\n")

    # Configuração
    config = {
        "environment": "development",
        "modules_enabled": ["diagnostico", "pre_vendas", "vendas"]
    }

    # Cria o cérebro
    brain = TraeOrchestratorBrain(config)

    # Adiciona tarefa de diagnóstico
    brain.add_task({
        "name": "diagnostic_company_xyz",
        "module": "diagnostico",
        "action": "execute",
        "priority": Priority.HIGH,
        "data": {
            "company_name": "Empresa XYZ",
            "industry": "Technology",
            "employees": 50
        }
    })

    print("✅ Tarefa adicionada à fila")
    print(f"📊 Status: {brain.get_status()}")


async def example_2_sdr_agent():
    """
    Exemplo 2: Uso do SDR Agent para processar lead
    """
    print("\n" + "="*60)
    print("EXEMPLO 2: SDR Agent - Processamento de Lead")
    print("="*60 + "\n")

    # Configuração
    config = {
        "qualification_criteria": {
            "min_score": 60,
            "company_size_range": "50-200"
        }
    }

    # Cria SDR Agent
    sdr = SDRAgent(config)

    # Lead de exemplo
    lead = {
        "name": "João Silva",
        "email": "joao.silva@empresaxyz.com",
        "company": "Empresa XYZ",
        "job_title": "CEO",
        "phone": "+55 11 99999-9999",
        "source": "linkedin"
    }

    # Processa o lead
    print("📞 Processando lead...")
    result = await sdr.execute({
        "data": lead
    })

    print(f"\n✅ Lead processado!")
    print(f"📊 Status: {result['status']}")

    if result['status'] == 'qualified_and_scheduled':
        print(f"⭐ Score: {result['score']['score']}/100")
        print(f"📅 Reunião agendada para: {result['meeting']['date']}")
        print(f"🤝 Handoff para Closer: {result['handoff']['assigned_closer']}")
    elif result['status'] == 'in_nurture':
        print(f"⏰ Follow-up agendado para: {result['followup']['scheduled_date']}")
    else:
        print(f"❌ Desqualificado: {result['score']['disqualification_reason']}")


async def example_3_diagnostic_agent():
    """
    Exemplo 3: Uso do Diagnostic Agent
    """
    print("\n" + "="*60)
    print("EXEMPLO 3: Diagnostic Agent - Análise Empresarial")
    print("="*60 + "\n")

    # Configuração
    config = {}

    # Cria Diagnostic Agent
    diagnostic = DiagnosticAgent(config)

    # Dados da empresa
    company_data = {
        "company_name": "Tech Startup Inc",
        "industry": "SaaS",
        "employees": 25,
        "monthly_revenue": 100000,
        "current_channels": ["Instagram", "LinkedIn", "Email"],
        "main_pain_points": ["Crescimento lento", "Alta CAC"]
    }

    # Executa diagnóstico
    print("🔍 Executando diagnóstico 360°...")
    result = await diagnostic.execute({
        "data": company_data
    })

    print(f"\n✅ Diagnóstico completo!")
    print(f"\n📊 Análise de ICP:")
    print(f"   Clarity Score: {result['icp']['clarity_score']}/100")
    print(f"   Personas: {result['icp']['segments_identified']}")

    print(f"\n📡 Auditoria de Canais:")
    for channel, perf in result['channels']['channel_performance'].items():
        print(f"   {channel}: {perf['score']}/100 ({perf['leads_month']} leads/mês)")

    print(f"\n💡 Recomendações:")
    for rec in result['recommendations']:
        print(f"   • {rec}")


async def example_4_shared_memory():
    """
    Exemplo 4: Sistema de Memória Compartilhada
    """
    print("\n" + "="*60)
    print("EXEMPLO 4: Sistema de Memória Compartilhada")
    print("="*60 + "\n")

    # Configuração
    config = {
        "pinecone_api_key": "sua-api-key",
        "openai_api_key": "sua-api-key",
        "index_name": "trae-os-memory"
    }

    # Cria memória compartilhada
    memory = SharedMemory(config)

    # Armazena informação
    print("💾 Armazenando na memória...")
    await memory.store(
        key="diagnostic_empresa_xyz",
        data={
            "company": "Empresa XYZ",
            "icp_score": 85,
            "main_challenges": ["Escalar vendas", "Automatizar processos"]
        },
        metadata={
            "module": "diagnostico",
            "date": "2025-01-15"
        }
    )

    # Busca semântica
    print("\n🔍 Buscando na memória...")
    results = await memory.search(
        query="empresas com desafio de escalar vendas",
        top_k=3
    )

    print(f"📚 Encontrados {len(results)} resultados relevantes")

    # Recupera contexto
    print("\n📖 Recuperando contexto do módulo diagnóstico...")
    context = await memory.get_context("diagnostico", limit=5)

    print(f"✅ {len(context)} entradas de contexto recuperadas")


async def example_5_decision_engine():
    """
    Exemplo 5: Motor de Decisão
    """
    print("\n" + "="*60)
    print("EXEMPLO 5: Motor de Decisão IA")
    print("="*60 + "\n")

    # Configuração
    config = {}

    # Memória compartilhada
    memory = SharedMemory({
        "pinecone_api_key": "sua-api-key",
        "openai_api_key": "sua-api-key",
        "index_name": "trae-os-memory"
    })

    # Cria motor de decisão
    decision_engine = DecisionEngine(config, memory)

    # Contexto de decisão
    context = {
        "type": "operational",
        "module": "pre_vendas",
        "data": {
            "lead_score": 85,
            "company_size": "50-200",
            "budget_confirmed": True,
            "decision_maker": True
        }
    }

    # Solicita decisão
    print("🧠 Solicitando decisão ao motor...")
    decision = await decision_engine.decide(context)

    print(f"\n✅ Decisão tomada!")
    print(f"📊 Confiança: {decision['confidence']:.2%}")
    print(f"⚡ Prioridade: {decision['priority']}")

    print(f"\n🎯 Ações recomendadas:")
    for action in decision['actions']:
        print(f"   • {action['action']}: {action['reason']}")


async def example_6_full_pipeline():
    """
    Exemplo 6: Pipeline completo - Lead → Qualificação → Agendamento
    """
    print("\n" + "="*60)
    print("EXEMPLO 6: Pipeline Completo de Vendas")
    print("="*60 + "\n")

    # 1. Lead entra no sistema
    lead = {
        "name": "Maria Santos",
        "email": "maria@startup.com",
        "company": "Startup Inovadora",
        "job_title": "CEO",
        "phone": "+55 11 98888-8888",
        "source": "landing_page"
    }

    print("1️⃣ Lead captado via landing page")
    print(f"   Nome: {lead['name']}")
    print(f"   Empresa: {lead['company']}")

    # 2. SDR Agent processa
    sdr = SDRAgent({})
    print("\n2️⃣ SDR Agent processando...")

    result = await sdr.execute({"data": lead})

    print(f"   ✅ Status: {result['status']}")

    if result['status'] == 'qualified_and_scheduled':
        print(f"   ⭐ Score: {result['score']['score']}/100")
        print(f"   📅 Reunião: {result['meeting']['date']}")

        # 3. Handoff para Closer
        print("\n3️⃣ Handoff automático para Closer")
        print(f"   Closer: {result['handoff']['assigned_closer']}")
        print(f"   Briefing: {result['handoff']['briefing']}")

        print("\n✅ Pipeline completo executado com sucesso!")
        print("   Lead → Qualificado → Reunião Agendada → Closer Notificado")


async def main():
    """Executa todos os exemplos"""
    print("\n")
    print("🧠 TRAE OS - Exemplos de Uso")
    print("="*60)

    # Executa exemplos
    await example_1_basic_orchestrator()
    await asyncio.sleep(1)

    await example_2_sdr_agent()
    await asyncio.sleep(1)

    await example_3_diagnostic_agent()
    await asyncio.sleep(1)

    await example_4_shared_memory()
    await asyncio.sleep(1)

    await example_5_decision_engine()
    await asyncio.sleep(1)

    await example_6_full_pipeline()

    print("\n" + "="*60)
    print("✅ Todos os exemplos executados com sucesso!")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
