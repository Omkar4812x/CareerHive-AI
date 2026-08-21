import asyncio
import json
import logging
from typing import Dict, List, Set, Any
from datetime import datetime

logger = logging.getLogger("SSEManager")

class SSEManager:
    """
    Manages live event streams (SSE) for frontend real-time agent updates.
    """
    def __init__(self):
        self._queues: Dict[str, Set[asyncio.Queue]] = {}

    async def subscribe(self, mission_id: str) -> asyncio.Queue:
        if mission_id not in self._queues:
            self._queues[mission_id] = set()
        queue = asyncio.Queue()
        self._queues[mission_id].add(queue)
        logger.info(f"Client subscribed to SSE for mission: {mission_id}")
        return queue

    def unsubscribe(self, mission_id: str, queue: asyncio.Queue):
        if mission_id in self._queues:
            self._queues[mission_id].discard(queue)
            if not self._queues[mission_id]:
                del self._queues[mission_id]
        logger.info(f"Client unsubscribed from SSE for mission: {mission_id}")

    async def broadcast(self, mission_id: str, event_type: str, data: Dict[str, Any]):
        event_payload = {
            "mission_id": mission_id,
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        if mission_id in self._queues:
            for q in list(self._queues[mission_id]):
                try:
                    await q.put(event_payload)
                except Exception as e:
                    logger.error(f"Error putting event to queue: {e}")

sse_manager = SSEManager()
