from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.api import api_router
from app.services.semantic_matcher import semantic_matcher

# Create database tables automatically
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm Sentence Transformer embedding model in memory
    print("Pre-warming Sentence Transformer model...")
    semantic_matcher.get_model()
    print("Matchly AI Engine initialized successfully!")
    yield
    print("Matchly AI Backend shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Resume & Job Description Matching System powered by Smart Match Engine.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API endpoints under /api
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Matchly AI Smart Match Engine",
        "version": "1.0.0",
        "model": settings.EMBEDDING_MODEL_NAME,
        "weights": {
            "required_skills": settings.WEIGHT_REQUIRED_SKILLS,
            "semantic_similarity": settings.WEIGHT_SEMANTIC_SIMILARITY,
            "experience": settings.WEIGHT_EXPERIENCE,
            "preferred_skills": settings.WEIGHT_PREFERRED_SKILLS,
            "education": settings.WEIGHT_EDUCATION
        }
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Matchly AI – Intelligent Resume & Job Description Matching System API",
        "docs": "/docs",
        "health": "/api/health"
    }
