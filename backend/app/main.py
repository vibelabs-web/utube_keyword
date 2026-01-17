from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.routers import youtube, comments

# FastAPI app instance
app = FastAPI(
    title="Zettel API",
    description="Backend API for Zettel - YouTube Transcript Note-taking System",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "zettel-api",
        "version": "0.1.0"
    }

# Startup event - create tables
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    await engine.dispose()

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Zettel API",
        "docs": "/docs",
        "health": "/health"
    }

# Router registration
app.include_router(youtube.router, prefix="/api/v1/youtube", tags=["youtube"])
app.include_router(comments.router, prefix="/api/v1/comments", tags=["comments"])
