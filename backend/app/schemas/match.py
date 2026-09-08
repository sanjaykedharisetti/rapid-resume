from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class SkillDetail(BaseModel):
    name: str
    category: str = "General"
    match_type: str = "exact"  # exact, normalized, semantic
    importance: str = "required"  # required, preferred
    similarity: Optional[float] = None
    related_resume_skill: Optional[str] = None
    reason: Optional[str] = None

class MissingSkillDetail(BaseModel):
    name: str
    category: str = "General"
    importance: str = "required"
    reason: str

class ExperienceAnalysis(BaseModel):
    required: Optional[float] = None
    detected: Optional[float] = None
    status: str
    details: str

class EducationAnalysis(BaseModel):
    status: str
    detected_degrees: List[str] = []
    required_degrees: List[str] = []
    details: str

class RecommendationItem(BaseModel):
    id: int
    title: str
    type: str
    description: str
    action: str

class ScoreBreakdown(BaseModel):
    required_skills: float
    semantic_similarity: float
    experience: float
    education: float
    preferred_skills: float

class MatchAnalysisResponse(BaseModel):
    id: Optional[int] = None
    resume_filename: str = "Resume"
    jd_title: str = "Job Description"
    overall_score: float
    match_level: str
    scores: ScoreBreakdown
    weights: Dict[str, float]
    matched_skills: List[SkillDetail]
    partial_skills: List[SkillDetail]
    missing_skills: List[MissingSkillDetail]
    experience: ExperienceAnalysis
    education: EducationAnalysis
    insight: str
    recommendations: List[RecommendationItem]
    breakdown: Optional[Dict[str, Any]] = None
    
    # Optimization info
    is_optimized: Optional[bool] = False
    optimized_score: Optional[float] = None
    optimization_data: Optional[Dict[str, Any]] = None
    optimized_resume_text: Optional[str] = None
    
    created_at: Optional[datetime] = None

class DirectAnalyzeRequest(BaseModel):
    resume_text: Optional[str] = None
    resume_id: Optional[int] = None
    resume_filename: Optional[str] = "Uploaded_Resume.pdf"
    jd_text: Optional[str] = None
    jd_id: Optional[int] = None
    jd_title: Optional[str] = "Job Description"

class HistoryItemResponse(BaseModel):
    id: int
    resume_filename: str
    jd_title: str
    overall_score: float
    match_level: str
    is_optimized: Optional[bool] = False
    optimized_score: Optional[float] = None
    created_at: datetime

class HistoryListResponse(BaseModel):
    total: int
    items: List[HistoryItemResponse]

class OptimizationResponse(BaseModel):
    analysis_id: int
    original_score: float
    optimized_score: float
    score_boost: float
    original_scores: ScoreBreakdown
    optimized_scores: ScoreBreakdown
    summary_changes: Dict[str, str]
    skills_added: List[Dict[str, Any]]
    bullet_improvements: List[Dict[str, Any]]
    optimized_resume_text: str
    optimized_analysis: MatchAnalysisResponse
