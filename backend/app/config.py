from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Matchly AI - Intelligent Resume and Job Description Matching System"
    API_V1_PREFIX: str = "/api"
    
    # Model Config
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    
    # Smart Match Engine Configurable Weights
    WEIGHT_REQUIRED_SKILLS: float = Field(default=0.40, description="Weight for required skills match (40 percent)")
    WEIGHT_SEMANTIC_SIMILARITY: float = Field(default=0.25, description="Weight for semantic text similarity (25 percent)")
    WEIGHT_EXPERIENCE: float = Field(default=0.20, description="Weight for experience match (20 percent)")
    WEIGHT_PREFERRED_SKILLS: float = Field(default=0.10, description="Weight for preferred skills match (10 percent)")
    WEIGHT_EDUCATION: float = Field(default=0.05, description="Weight for education match (5 percent)")
    
    # Matching Thresholds
    SEMANTIC_MATCH_HIGH_THRESHOLD: float = 0.70
    SEMANTIC_MATCH_PARTIAL_THRESHOLD: float = 0.35
    
    # File Limits
    MAX_FILE_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB
    ALLOWED_EXTENSIONS: list[str] = [".pdf", ".docx"]
    
    # Paths
    SKILLS_FILE_PATH: Path = BASE_DIR / "data" / "skills.json"
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    DATABASE_URL: str = "sqlite:///./matchly.db"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "*"]

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

