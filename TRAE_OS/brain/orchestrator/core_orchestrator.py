#!/usr/bin/env python3
"""
TRAE OS - Orquestrador Central de IA
Cérebro que coordena todos os 8 módulos do sistema TRAE
"""

import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModuleState(Enum):
    """Estados possíveis de cada módulo"""
    IDLE = "idle"
    RUNNING = "running"
    WAITING = "waiting"
    ERROR = "error"
    COMPLETED = "completed"


class Priority(Enum):
    """Níveis de prioridade de tarefas"""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


class TraeOrchestratorBrain:
    """
    Orquestrador Central do TRAE OS

    Responsabilidades:
    - Coordenar os 8 módulos
    - Tomar decisões baseadas em contexto
    - Gerenciar fluxo de dados entre módulos
    - Priorizar tarefas automaticamente
    - Monitorar saúde do sistema
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.modules = {
            "diagnostico": {"state": ModuleState.IDLE, "priority": Priority.HIGH},
            "posicionamento": {"state": ModuleState.IDLE, "priority": Priority.HIGH},
            "oferta": {"state": ModuleState.IDLE, "priority": Priority.HIGH},
            "aquisicao": {"state": ModuleState.IDLE, "priority": Priority.MEDIUM},
            "pre_vendas": {"state": ModuleState.IDLE, "priority": Priority.CRITICAL},
            "vendas": {"state": ModuleState.IDLE, "priority": Priority.CRITICAL},
            "onboarding": {"state": ModuleState.IDLE, "priority": Priority.HIGH},
            "gestao": {"state": ModuleState.IDLE, "priority": Priority.MEDIUM}
        }

        self.task_queue = []
        self.context_memory = {}
        self.running = False

        logger.info("🧠 TRAE OS Brain initialized")

    async def start(self):
        """Inicia o orquestrador"""
        self.running = True
        logger.info("🚀 TRAE OS Brain starting...")

        tasks = [
            self.monitor_modules(),
            self.process_task_queue(),
            self.health_check(),
            self.optimize_resources()
        ]

        await asyncio.gather(*tasks)

    async def monitor_modules(self):
        """Monitora continuamente o estado de todos os módulos"""
        while self.running:
            logger.info("📊 Monitoring modules...")

            for module_name, module_info in self.modules.items():
                state = module_info["state"]

                if state == ModuleState.ERROR:
                    await self.handle_module_error(module_name)
                elif state == ModuleState.WAITING:
                    await self.check_module_dependencies(module_name)

            await asyncio.sleep(5)  # Check every 5 seconds

    async def process_task_queue(self):
        """Processa fila de tarefas por prioridade"""
        while self.running:
            if self.task_queue:
                # Ordena por prioridade
                self.task_queue.sort(key=lambda x: x["priority"].value)

                task = self.task_queue.pop(0)
                logger.info(f"🎯 Processing task: {task['name']}")

                await self.execute_task(task)

            await asyncio.sleep(1)

    async def execute_task(self, task: Dict[str, Any]):
        """Executa uma tarefa e coordena módulos necessários"""
        module = task.get("module")
        action = task.get("action")
        data = task.get("data", {})

        logger.info(f"⚡ Executing {action} on module {module}")

        # Atualiza estado do módulo
        self.modules[module]["state"] = ModuleState.RUNNING

        # Aqui seria a chamada para o módulo específico
        result = await self.call_module(module, action, data)

        # Armazena contexto na memória
        self.store_context(module, action, result)

        # Verifica próximos passos
        await self.decide_next_steps(module, result)

        self.modules[module]["state"] = ModuleState.COMPLETED

        return result

    async def call_module(self, module: str, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Chama um módulo específico"""
        # Simulação - aqui seria a chamada real para o agente do módulo
        logger.info(f"📞 Calling {module}.{action} with data: {data}")

        # Simula processamento
        await asyncio.sleep(1)

        return {
            "status": "success",
            "module": module,
            "action": action,
            "timestamp": datetime.now().isoformat(),
            "result": f"Executed {action} successfully"
        }

    def store_context(self, module: str, action: str, result: Dict[str, Any]):
        """Armazena contexto na memória para decisões futuras"""
        context_key = f"{module}_{action}_{datetime.now().isoformat()}"

        self.context_memory[context_key] = {
            "module": module,
            "action": action,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

        logger.info(f"💾 Context stored: {context_key}")

    async def decide_next_steps(self, module: str, result: Dict[str, Any]):
        """
        IA de Decisão: Determina próximos passos baseado em resultados

        Fluxo lógico dos módulos:
        1. Diagnóstico → Posicionamento
        2. Posicionamento → Oferta
        3. Oferta → Aquisição
        4. Aquisição → Pré-Vendas
        5. Pré-Vendas → Vendas
        6. Vendas → Onboarding
        7. Onboarding → Gestão (loop contínuo)
        """

        next_steps = {
            "diagnostico": ["posicionamento"],
            "posicionamento": ["oferta"],
            "oferta": ["aquisicao"],
            "aquisicao": ["pre_vendas"],
            "pre_vendas": ["vendas"],
            "vendas": ["onboarding"],
            "onboarding": ["gestao"],
            "gestao": ["aquisicao", "pre_vendas"]  # Loop de otimização
        }

        if module in next_steps:
            for next_module in next_steps[module]:
                logger.info(f"🎯 Decided next step: {next_module}")

                # Adiciona tarefa à fila
                self.add_task({
                    "name": f"auto_trigger_{next_module}",
                    "module": next_module,
                    "action": "execute",
                    "priority": self.modules[next_module]["priority"],
                    "data": {
                        "triggered_by": module,
                        "context": result
                    }
                })

    def add_task(self, task: Dict[str, Any]):
        """Adiciona tarefa à fila"""
        self.task_queue.append(task)
        logger.info(f"➕ Task added to queue: {task['name']}")

    async def handle_module_error(self, module: str):
        """Trata erros em módulos"""
        logger.error(f"❌ Handling error in module: {module}")

        # Estratégias de recuperação
        # 1. Retry automático
        # 2. Escalação para humano
        # 3. Rollback

        self.modules[module]["state"] = ModuleState.IDLE

    async def check_module_dependencies(self, module: str):
        """Verifica se dependências de um módulo estão satisfeitas"""
        logger.info(f"🔍 Checking dependencies for {module}")
        # Lógica de verificação de dependências
        pass

    async def health_check(self):
        """Verifica saúde geral do sistema"""
        while self.running:
            healthy_modules = sum(
                1 for m in self.modules.values()
                if m["state"] != ModuleState.ERROR
            )

            health_percentage = (healthy_modules / len(self.modules)) * 100

            logger.info(f"💚 System Health: {health_percentage:.1f}%")

            if health_percentage < 80:
                logger.warning("⚠️  System health below 80%")

            await asyncio.sleep(30)  # Check every 30 seconds

    async def optimize_resources(self):
        """Otimiza recursos e prioridades dinamicamente"""
        while self.running:
            # Ajusta prioridades baseado em métricas
            # Por exemplo: se muitos leads entrando, aumenta prioridade de pré-vendas

            logger.info("⚙️  Optimizing resources...")
            await asyncio.sleep(60)  # Optimize every minute

    def get_status(self) -> Dict[str, Any]:
        """Retorna status completo do sistema"""
        return {
            "timestamp": datetime.now().isoformat(),
            "running": self.running,
            "modules": {
                name: {
                    "state": info["state"].value,
                    "priority": info["priority"].value
                }
                for name, info in self.modules.items()
            },
            "queue_size": len(self.task_queue),
            "memory_entries": len(self.context_memory)
        }

    async def stop(self):
        """Para o orquestrador gracefully"""
        logger.info("🛑 Stopping TRAE OS Brain...")
        self.running = False


# Sistema de comandos para controle externo
class BrainController:
    """Interface de controle para o cérebro"""

    def __init__(self, brain: TraeOrchestratorBrain):
        self.brain = brain

    async def execute_command(self, command: str, params: Dict[str, Any] = None):
        """Executa comando no cérebro"""
        params = params or {}

        commands = {
            "start_module": self._start_module,
            "stop_module": self._stop_module,
            "get_status": self._get_status,
            "add_task": self._add_task,
            "clear_queue": self._clear_queue,
            "get_memory": self._get_memory
        }

        if command in commands:
            return await commands[command](params)
        else:
            return {"error": f"Unknown command: {command}"}

    async def _start_module(self, params: Dict[str, Any]):
        module = params.get("module")
        if module in self.brain.modules:
            self.brain.modules[module]["state"] = ModuleState.RUNNING
            return {"status": "success", "message": f"Module {module} started"}
        return {"status": "error", "message": f"Module {module} not found"}

    async def _stop_module(self, params: Dict[str, Any]):
        module = params.get("module")
        if module in self.brain.modules:
            self.brain.modules[module]["state"] = ModuleState.IDLE
            return {"status": "success", "message": f"Module {module} stopped"}
        return {"status": "error", "message": f"Module {module} not found"}

    async def _get_status(self, params: Dict[str, Any]):
        return self.brain.get_status()

    async def _add_task(self, params: Dict[str, Any]):
        self.brain.add_task(params)
        return {"status": "success", "message": "Task added"}

    async def _clear_queue(self, params: Dict[str, Any]):
        self.brain.task_queue.clear()
        return {"status": "success", "message": "Queue cleared"}

    async def _get_memory(self, params: Dict[str, Any]):
        return {
            "memory_size": len(self.brain.context_memory),
            "recent_entries": list(self.brain.context_memory.items())[-10:]
        }


# Exemplo de uso
async def main():
    """Exemplo de inicialização do cérebro"""
    config = {
        "environment": "development",
        "log_level": "INFO",
        "modules_enabled": ["diagnostico", "posicionamento", "oferta",
                          "aquisicao", "pre_vendas", "vendas",
                          "onboarding", "gestao"]
    }

    brain = TraeOrchestratorBrain(config)
    controller = BrainController(brain)

    # Adiciona tarefa inicial
    brain.add_task({
        "name": "initial_diagnostic",
        "module": "diagnostico",
        "action": "execute",
        "priority": Priority.HIGH,
        "data": {
            "company": "Empresa Exemplo",
            "trigger": "manual"
        }
    })

    # Inicia o cérebro
    try:
        await brain.start()
    except KeyboardInterrupt:
        await brain.stop()


if __name__ == "__main__":
    asyncio.run(main())
