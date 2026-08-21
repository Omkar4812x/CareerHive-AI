import json
import httpx
import logging
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("LLMService")

class LLMService:
    """
    Abstraction layer for AI LLM inference (supports Ollama local, OpenAI API, or Heuristic Rule Engine).
    """
    def __init__(self):
        self.provider = settings.LLM_PROVIDER.lower()
        self.ollama_url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        self.ollama_model = settings.OLLAMA_MODEL
        self.openai_key = settings.OPENAI_API_KEY

    async def generate_json(self, system_prompt: str, user_prompt: str, fallback_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates structured JSON output from LLM prompt or returns intelligent heuristic fallback.
        """
        if self.provider == "ollama":
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        self.ollama_url,
                        json={
                            "model": self.ollama_model,
                            "prompt": f"{system_prompt}\n\n{user_prompt}\n\nRespond ONLY with valid JSON.",
                            "stream": False,
                            "format": "json"
                        }
                    )
                    if resp.status_code == 200:
                        text_response = resp.json().get("response", "")
                        return json.loads(text_response)
            except Exception as e:
                logger.warning(f"Ollama call failed: {e}. Using heuristic fallbacks.")

        elif self.provider == "openai" and self.openai_key:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {self.openai_key}"},
                        json={
                            "model": "gpt-3.5-turbo",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            "response_format": {"type": "json_object"}
                        }
                    )
                    if resp.status_code == 200:
                        content = resp.json()["choices"][0]["message"]["content"]
                        return json.loads(content)
            except Exception as e:
                logger.warning(f"OpenAI call failed: {e}. Using heuristic fallbacks.")

        return fallback_dict

llm_service = LLMService()
