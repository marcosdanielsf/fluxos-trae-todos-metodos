#!/usr/bin/env python3
"""
TRAE OS - Motor de Decisão
Sistema de IA que toma decisões inteligentes baseado em contexto e dados
"""

from typing import Dict, Any, List, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class DecisionType(Enum):
    """Tipos de decisões"""
    STRATEGIC = "strategic"  # Decisões estratégicas de longo prazo
    TACTICAL = "tactical"    # Decisões táticas de médio prazo
    OPERATIONAL = "operational"  # Decisões operacionais do dia a dia


class DecisionEngine:
    """
    Motor de Decisão do TRAE OS

    Responsabilidades:
    - Tomar decisões automáticas baseadas em dados
    - Priorizar tarefas
    - Otimizar recursos
    - Recomendar ações
    - Aprender com resultados
    """

    def __init__(self, config: Dict[str, Any], shared_memory):
        self.config = config
        self.memory = shared_memory
        self.decision_rules = self._load_decision_rules()
        self.ml_models = {}

        logger.info("🎯 Decision Engine initialized")

    def _load_decision_rules(self) -> Dict[str, Any]:
        """Carrega regras de decisão"""
        return {
            # Regras para Diagnóstico
            "diagnostico": {
                "icp_clarity_threshold": 70,
                "channel_efficiency_threshold": 50,
                "metrics_health_threshold": 60
            },

            # Regras para Aquisição
            "aquisicao": {
                "min_leads_per_day": 10,
                "max_cpl": 50,  # Custo por lead
                "min_conversion_rate": 2.0
            },

            # Regras para SDR
            "pre_vendas": {
                "min_qualification_score": 60,
                "max_response_time_hours": 24,
                "ideal_contact_attempts": 5
            },

            # Regras para Vendas
            "vendas": {
                "min_discovery_duration_minutes": 30,
                "follow_up_max_days": 7,
                "proposal_validity_days": 30
            },

            # Regras para CS
            "onboarding": {
                "min_health_score": 70,
                "churn_risk_threshold": 40,
                "upsell_opportunity_score": 75
            }
        }

    async def decide(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Toma decisão baseada em contexto

        Args:
            context: Contexto com dados relevantes

        Returns:
            Decisão com ações recomendadas
        """
        decision_type = context.get("type", DecisionType.OPERATIONAL)
        module = context.get("module")
        data = context.get("data", {})

        logger.info(f"🧠 Making decision for {module} ({decision_type})")

        # Busca contexto histórico
        historical_context = await self.memory.get_context(module, limit=5)

        # Aprende com decisões passadas
        learning = await self.memory.learn_from_outcomes(module)

        # Aplica regras de decisão
        rule_based_decision = self._apply_rules(module, data)

        # Aplica IA/ML (se disponível)
        ml_decision = await self._apply_ml(module, data, historical_context)

        # Combina decisões
        final_decision = self._combine_decisions(
            rule_based_decision,
            ml_decision,
            learning
        )

        # Armazena decisão para aprendizado futuro
        await self.memory.store_decision({
            "module": module,
            "type": decision_type.value if isinstance(decision_type, DecisionType) else decision_type,
            "context": context,
            "decision": final_decision,
            "timestamp": "2025-01-15T10:00:00"
        })

        return final_decision

    def _apply_rules(self, module: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Aplica regras de negócio"""
        rules = self.decision_rules.get(module, {})
        decisions = {
            "actions": [],
            "priority": "medium",
            "confidence": 0.8
        }

        # Exemplo: Regras para SDR
        if module == "pre_vendas":
            lead_score = data.get("lead_score", 0)

            if lead_score >= rules.get("min_qualification_score", 60):
                decisions["actions"].append({
                    "action": "qualify_and_proceed",
                    "reason": f"Lead score ({lead_score}) above threshold"
                })
                decisions["priority"] = "high"
            else:
                decisions["actions"].append({
                    "action": "nurture_campaign",
                    "reason": f"Lead score ({lead_score}) below threshold"
                })
                decisions["priority"] = "low"

        # Exemplo: Regras para CS
        elif module == "onboarding":
            health_score = data.get("health_score", 0)

            if health_score < rules.get("churn_risk_threshold", 40):
                decisions["actions"].append({
                    "action": "intervention_required",
                    "urgency": "critical",
                    "reason": f"Health score ({health_score}) indicates churn risk"
                })
                decisions["priority"] = "critical"

            elif health_score > rules.get("upsell_opportunity_score", 75):
                decisions["actions"].append({
                    "action": "upsell_opportunity",
                    "reason": f"Health score ({health_score}) indicates upsell opportunity"
                })

        return decisions

    async def _apply_ml(self, module: str, data: Dict[str, Any], historical_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aplica modelos de Machine Learning"""
        # Aqui seria integração com modelos ML treinados
        # Por enquanto, retorna decisão baseada em heurísticas

        ml_decision = {
            "actions": [],
            "confidence": 0.7,
            "model_used": "heuristic_v1"
        }

        # Exemplo de ML: Predição de conversão
        if module == "vendas":
            # Simula predição de probabilidade de fechamento
            conversion_probability = self._predict_conversion_probability(data, historical_context)

            if conversion_probability > 0.7:
                ml_decision["actions"].append({
                    "action": "prioritize_lead",
                    "reason": f"High conversion probability: {conversion_probability:.2%}"
                })
            elif conversion_probability < 0.3:
                ml_decision["actions"].append({
                    "action": "deprioritize_lead",
                    "reason": f"Low conversion probability: {conversion_probability:.2%}"
                })

        return ml_decision

    def _combine_decisions(self, rule_based: Dict[str, Any], ml_based: Dict[str, Any], learning: Dict[str, Any]) -> Dict[str, Any]:
        """Combina diferentes tipos de decisões"""
        combined = {
            "actions": [],
            "priority": rule_based.get("priority", "medium"),
            "confidence": (rule_based.get("confidence", 0.5) + ml_based.get("confidence", 0.5)) / 2,
            "reasoning": {
                "rule_based": rule_based,
                "ml_based": ml_based,
                "learning": learning
            }
        }

        # Combina ações
        combined["actions"].extend(rule_based.get("actions", []))
        combined["actions"].extend(ml_based.get("actions", []))

        # Remove duplicatas
        combined["actions"] = self._deduplicate_actions(combined["actions"])

        # Ajusta baseado em aprendizado
        if learning.get("success_rate", 0) < 0.5:
            combined["confidence"] *= 0.8  # Reduz confiança se histórico ruim

        return combined

    def _deduplicate_actions(self, actions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove ações duplicadas"""
        seen = set()
        unique_actions = []

        for action in actions:
            action_key = action.get("action")
            if action_key not in seen:
                seen.add(action_key)
                unique_actions.append(action)

        return unique_actions

    def _predict_conversion_probability(self, data: Dict[str, Any], historical_context: List[Dict[str, Any]]) -> float:
        """Prediz probabilidade de conversão"""
        # Modelo simplificado
        probability = 0.5

        # Fatores que aumentam probabilidade
        if data.get("engagement_score", 0) > 70:
            probability += 0.2

        if data.get("budget_confirmed"):
            probability += 0.15

        if data.get("decision_maker"):
            probability += 0.15

        # Fatores históricos
        if historical_context:
            avg_conversion = sum(
                1 for ctx in historical_context
                if ctx.get("outcome") == "converted"
            ) / len(historical_context)
            probability = (probability + avg_conversion) / 2

        return min(probability, 1.0)

    async def optimize_resource_allocation(self, resources: Dict[str, Any], demands: Dict[str, Any]) -> Dict[str, Any]:
        """Otimiza alocação de recursos"""
        logger.info("⚙️  Optimizing resource allocation...")

        allocation = {}

        # Algoritmo simples de alocação baseado em prioridade
        total_priority = sum(d.get("priority", 1) for d in demands.values())

        for module, demand in demands.items():
            priority = demand.get("priority", 1)
            allocation[module] = {
                "percentage": (priority / total_priority) * 100,
                "resources_allocated": resources.get("total", 0) * (priority / total_priority)
            }

        return allocation

    async def recommend_next_actions(self, current_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Recomenda próximas ações"""
        recommendations = []

        # Análise do estado atual
        for module, state in current_state.items():
            if state.get("status") == "bottleneck":
                recommendations.append({
                    "module": module,
                    "action": "increase_resources",
                    "priority": "high",
                    "reason": "Bottleneck detected"
                })

            if state.get("efficiency", 100) < 50:
                recommendations.append({
                    "module": module,
                    "action": "process_optimization",
                    "priority": "medium",
                    "reason": "Low efficiency"
                })

        # Ordena por prioridade
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 3))

        return recommendations
