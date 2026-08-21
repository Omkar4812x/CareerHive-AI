import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.api import profile_routes, mission_routes, job_routes, agent_routes

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("CareerHiveMain")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CareerHive AI Database...")
    await init_db()
    logger.info("CareerHive AI Backend Server Ready!")
    yield

app = FastAPI(
    title="CareerHive AI — Multi-Agent Job Search Platform",
    description="Autonomous multi-agent system powered by TinyFish for live web job discovery, verification, deduplication, and resume compatibility scoring.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Setup
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
if "*" not in origins:
    origins.extend(["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(profile_routes.router)
app.include_router(mission_routes.router)
app.include_router(job_routes.router)
app.include_router(agent_routes.router)

@app.get("/")
async def root():
    return {
        "status": "ONLINE",
        "app_name": "CareerHive AI Backend",
        "version": "1.0.0",
        "tinyfish_enabled": bool(settings.TINYFISH_API_KEY),
        "llm_provider": settings.LLM_PROVIDER,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
