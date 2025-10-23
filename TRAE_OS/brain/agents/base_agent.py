#!/usr/bin/env python3
"""
TRAE OS - Base Agent
Classe base para todos os agentes especializados do sistema
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    Classe base abstrata para todos os agentes TRAE

    Cada agente representa um módulo do sistema e tem:
    - Habilidades específicas
    - Memória contextual
    - Capacidade de decisão
    - Interface com outros agentes
    """

    def __init__(self, name: str, config: Dict[str, Any]):
        self.name = name
        self.config = config
        self.memory = []
        self.skills = []
        self.status = "initialized"

        logger.info(f"🤖 Agent {self.name} initialized")

    @abstractmethod
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Executa tarefa principal do agente"""
        pass

    @abstractmethod
    async def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analisa dados e retorna insights"""
        pass

    @abstractmethod
    async def decide(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Toma decisão baseada em contexto"""
        pass

    def add_memory(self, event: Dict[str, Any]):
        """Adiciona evento à memória do agente"""
        event["timestamp"] = datetime.now().isoformat()
        self.memory.append(event)

        # Limita tamanho da memória
        if len(self.memory) > 1000:
            self.memory = self.memory[-1000:]

    def get_recent_memory(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retorna memórias recentes"""
        return self.memory[-limit:]

    async def communicate(self, target_agent: str, message: Dict[str, Any]) -> Dict[str, Any]:
        """Comunica com outro agente"""
        logger.info(f"📨 {self.name} → {target_agent}: {message.get('type', 'message')}")

        return {
            "from": self.name,
            "to": target_agent,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }

    def get_status(self) -> Dict[str, Any]:
        """Retorna status do agente"""
        return {
            "name": self.name,
            "status": self.status,
            "skills": self.skills,
            "memory_size": len(self.memory)
        }
