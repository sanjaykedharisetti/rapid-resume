from fastapi import APIRouter
from app.api.resume_routes import router as resume_router
from app.api.job_routes import router as job_router
from app.api.match_routes import router as match_router
from app.api.history_routes import router as history_router

api_router = APIRouter()
api_router.include_router(resume_router)
api_router.include_router(job_router)
api_router.include_router(match_router)
api_router.include_router(history_router)
