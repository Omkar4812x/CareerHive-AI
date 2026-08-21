import logging
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from app.services.sse_manager import sse_manager

logger = logging.getLogger("BaseAgent")

class BaseAgent:
    """
    Base class for all CareerHive AI Agents.
    """
    def __init__(self, agent_name: str, agent_role: str):
        self.agent_name = agent_name
        self.agent_role = agent_role

    async def log_event(self, mission_id: str, log_level: str, message: str, details: Optional[Dict[str, Any]] = None):
        """
        Logs event and broadcasts it over SSE to frontend.
        """
        logger.info(f"[{self.agent_name}] [{log_level}] {message}")
        await sse_manager.broadcast(
            mission_id=mission_id,
            event_type="AGENT_LOG",
            data={
                "agent_name": self.agent_name,
                "agent_role": self.agent_role,
                "log_level": log_level,
                "message": message,
                "details": details or {},
                "timestamp": datetime.utcnow().isoformat()
            }
        )

    async def update_task_progress(self, mission_id: str, task_id: str, status: str, items_count: int = 0, results_summary: Optional[str] = None):
        """
        Broadcasting real-time task progress to Mission Control.
        """
        await sse_manager.broadcast(
            mission_id=mission_id,
            event_type="TASK_PROGRESS",
            data={
                "task_id": task_id,
                "agent_name": self.agent_name,
                "status": status,
                "items_count": items_count,
                "results_summary": results_summary,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
