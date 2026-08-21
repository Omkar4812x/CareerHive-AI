import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    TINYFISH_API_KEY: str = os.getenv("TINYFISH_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./careerhive.db")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "heuristic") # 'heuristic', 'ollama', 'openai'
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "careerhive_secret_key_12345")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
