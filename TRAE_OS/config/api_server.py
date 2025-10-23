#!/usr/bin/env python3
"""
TRAE OS - API Server
API REST para comunicação com o cérebro e módulos
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import logging

# Imports dos componentes TRAE
import sys
sys.path.append('..')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TRAE OS Brain API",
    description="API para controle do sistema TRAE OS",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class TaskRequest(BaseModel):
    module: str
    action: str
    data: Dict[str, Any] = {}
    priority: str = "medium"


class CommandRequest(BaseModel):
    command: str
    params: Dict[str, Any] = {}


class LeadInput(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    source: str = "api"


class DecisionRequest(BaseModel):
    type: str
    module: str
    data: Dict[str, Any]


# Estado global (em produção seria um banco de dados)
brain_state = {
    "running": False,
    "brain": None,
    "controller": None
}


@app.on_event("startup")
async def startup_event():
    """Inicializa o cérebro ao iniciar API"""
    logger.info("🚀 Starting TRAE OS Brain API...")


@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "name": "TRAE OS Brain API",
        "version": "1.0.0",
        "status": "operational",
        "brain_running": brain_state["running"]
    }


@app.get("/health")
async def health_check():
    """Health check do sistema"""
    return {
        "status": "healthy",
        "brain_active": brain_state["running"],
        "timestamp": "2025-01-15T10:00:00"
    }


@app.post("/brain/start")
async def start_brain(background_tasks: BackgroundTasks):
    """Inicia o cérebro"""
    if brain_state["running"]:
        raise HTTPException(status_code=400, detail="Brain already running")

    # Aqui seria a inicialização real do orquestrador
    brain_state["running"] = True

    return {
        "status": "started",
        "message": "TRAE OS Brain is now running"
    }


@app.post("/brain/stop")
async def stop_brain():
    """Para o cérebro"""
    if not brain_state["running"]:
        raise HTTPException(status_code=400, detail="Brain not running")

    brain_state["running"] = False

    return {
        "status": "stopped",
        "message": "TRAE OS Brain stopped"
    }


@app.get("/brain/status")
async def get_brain_status():
    """Retorna status completo do cérebro"""
    # Simulação - seria chamada real ao orquestrador
    return {
        "running": brain_state["running"],
        "modules": {
            "diagnostico": {"state": "idle", "priority": 2},
            "posicionamento": {"state": "idle", "priority": 2},
            "oferta": {"state": "idle", "priority": 2},
            "aquisicao": {"state": "running", "priority": 3},
            "pre_vendas": {"state": "running", "priority": 1},
            "vendas": {"state": "idle", "priority": 1},
            "onboarding": {"state": "idle", "priority": 2},
            "gestao": {"state": "running", "priority": 3}
        },
        "queue_size": 5,
        "memory_entries": 127
    }


@app.post("/tasks/add")
async def add_task(task: TaskRequest):
    """Adiciona tarefa à fila"""
    logger.info(f"📥 New task: {task.module}.{task.action}")

    # Validação
    valid_modules = ["diagnostico", "posicionamento", "oferta", "aquisicao",
                    "pre_vendas", "vendas", "onboarding", "gestao"]

    if task.module not in valid_modules:
        raise HTTPException(status_code=400, detail=f"Invalid module: {task.module}")

    # Adiciona à fila (simulado)
    task_id = f"task_{hash(task.json())}"

    return {
        "task_id": task_id,
        "status": "queued",
        "module": task.module,
        "action": task.action,
        "message": "Task added to queue successfully"
    }


@app.post("/leads/process")
async def process_lead(lead: LeadInput):
    """Processa novo lead através do SDR Bot"""
    logger.info(f"👤 Processing lead: {lead.email}")

    # Envia para SDR Agent
    result = {
        "lead_id": f"lead_{hash(lead.email)}",
        "status": "processing",
        "qualified": None,
        "message": "Lead sent to SDR Agent for processing"
    }

    # Simula processamento
    # Aqui seria chamada ao SDRAgent
    result["qualified"] = True
    result["score"] = 75
    result["next_action"] = "schedule_meeting"

    return result


@app.post("/decisions/request")
async def request_decision(decision_req: DecisionRequest):
    """Solicita decisão ao motor de decisão"""
    logger.info(f"🧠 Decision requested for {decision_req.module}")

    # Chama motor de decisão
    # Simulado por enquanto
    decision = {
        "decision_id": f"dec_{hash(decision_req.json())}",
        "module": decision_req.module,
        "actions": [
            {
                "action": "optimize_process",
                "priority": "high",
                "reason": "Performance below threshold"
            }
        ],
        "confidence": 0.85,
        "timestamp": "2025-01-15T10:00:00"
    }

    return decision


@app.get("/modules/{module_name}/status")
async def get_module_status(module_name: str):
    """Retorna status de um módulo específico"""
    valid_modules = ["diagnostico", "posicionamento", "oferta", "aquisicao",
                    "pre_vendas", "vendas", "onboarding", "gestao"]

    if module_name not in valid_modules:
        raise HTTPException(status_code=404, detail="Module not found")

    return {
        "module": module_name,
        "state": "running",
        "tasks_completed": 42,
        "tasks_pending": 5,
        "efficiency": 87.5,
        "last_activity": "2025-01-15T09:45:00"
    }


@app.post("/modules/{module_name}/execute")
async def execute_module_action(module_name: str, action: Dict[str, Any]):
    """Executa ação em um módulo específico"""
    logger.info(f"⚡ Executing {action.get('action')} on {module_name}")

    return {
        "module": module_name,
        "action": action.get("action"),
        "status": "executed",
        "result": {
            "success": True,
            "message": f"Action {action.get('action')} executed successfully"
        }
    }


@app.get("/memory/search")
async def search_memory(query: str, limit: int = 5):
    """Busca semântica na memória"""
    logger.info(f"🔍 Searching memory: {query}")

    # Simulado - seria chamada real ao SharedMemory
    results = [
        {
            "id": "mem_001",
            "content": "Previous diagnostic analysis...",
            "relevance": 0.95,
            "timestamp": "2025-01-10T10:00:00"
        },
        {
            "id": "mem_002",
            "content": "Lead qualification criteria...",
            "relevance": 0.88,
            "timestamp": "2025-01-12T14:30:00"
        }
    ]

    return {
        "query": query,
        "results": results[:limit],
        "total_found": len(results)
    }


@app.get("/analytics/overview")
async def get_analytics_overview():
    """Retorna overview de analytics do sistema"""
    return {
        "period": "last_30_days",
        "metrics": {
            "leads_processed": 1250,
            "leads_qualified": 438,
            "meetings_scheduled": 187,
            "deals_closed": 42,
            "revenue_generated": 420000,
            "conversion_rate": 3.36,
            "average_deal_value": 10000
        },
        "module_performance": {
            "diagnostico": {"executions": 15, "avg_duration_minutes": 120},
            "aquisicao": {"leads_generated": 1250, "cpl": 35},
            "pre_vendas": {"qualification_rate": 35, "meeting_rate": 15},
            "vendas": {"close_rate": 22.5, "avg_cycle_days": 14},
            "onboarding": {"activation_rate": 85, "nps": 68},
            "gestao": {"automation_rate": 78, "efficiency_gain": 45}
        },
        "health_score": 82
    }


@app.get("/analytics/module/{module_name}")
async def get_module_analytics(module_name: str, days: int = 30):
    """Analytics detalhado de um módulo"""
    return {
        "module": module_name,
        "period_days": days,
        "metrics": {
            "total_executions": 150,
            "success_rate": 94.5,
            "avg_duration_seconds": 45,
            "error_rate": 5.5
        },
        "trends": {
            "executions": [10, 12, 15, 18, 20, 22, 25],
            "success_rate": [90, 92, 93, 94, 95, 94, 94.5]
        }
    }


@app.post("/command")
async def execute_command(command: CommandRequest):
    """Executa comando no cérebro"""
    logger.info(f"⚡ Executing command: {command.command}")

    valid_commands = ["start_module", "stop_module", "clear_queue", "get_status"]

    if command.command not in valid_commands:
        raise HTTPException(status_code=400, detail="Invalid command")

    return {
        "command": command.command,
        "status": "executed",
        "result": {"success": True}
    }


@app.websocket("/ws/brain")
async def websocket_brain(websocket):
    """WebSocket para monitoramento em tempo real"""
    await websocket.accept()

    try:
        while True:
            # Envia status a cada 5 segundos
            status = await get_brain_status()
            await websocket.send_json(status)
            await asyncio.sleep(5)

    except Exception as e:
        logger.error(f"WebSocket error: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
