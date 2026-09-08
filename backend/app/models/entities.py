import datetime as dt
from datetime import timezone
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

_utcnow = lambda: dt.datetime.now(timezone.utc).replace(tzinfo=None)  # Store as naive UTC for SQLite compatibility

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_path = Column(String(500), nullable=True)
    extracted_text = Column(Text, nullable=False)
    structured_sections = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="Job Description")
    raw_text = Column(Text, nullable=False)
    structured_sections = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    jd_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="SET NULL"), nullable=True)
    
    resume_filename = Column(String(255), default="Resume")
    jd_title = Column(String(255), default="Job Description")
    
    overall_score = Column(Float, nullable=False)
    match_level = Column(String(50), nullable=False) # Strong Match, Good Match, Moderate Match, Weak Match
    
    scores = Column(JSON, nullable=False)
    matched_skills = Column(JSON, nullable=False)
    partial_skills = Column(JSON, nullable=False)
    missing_skills = Column(JSON, nullable=False)
    
    experience = Column(JSON, nullable=False)
    education = Column(JSON, nullable=False)
    
    insight = Column(Text, nullable=False)
    recommendations = Column(JSON, nullable=False)
    breakdown = Column(JSON, nullable=True)
    
    # Optimization fields
    is_optimized = Column(Integer, default=0)
    optimized_score = Column(Float, nullable=True)
    optimization_data = Column(JSON, nullable=True)
    optimized_resume_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=_utcnow)

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    aliases = Column(JSON, default=list)

