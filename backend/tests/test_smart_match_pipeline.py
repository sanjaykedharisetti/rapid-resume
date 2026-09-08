import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.config import settings
from app.services.document_parser import document_parser
from app.services.skill_normalizer import skill_normalizer
from app.services.skill_extractor import skill_extractor
from app.services.semantic_matcher import semantic_matcher
from app.services.experience_analyzer import experience_analyzer
from app.services.education_analyzer import education_analyzer
from app.services.scoring_engine import scoring_engine
from app.services.report_generator import report_generator

client = TestClient(app)

SAMPLE_DIR = Path(__file__).resolve().parent.parent.parent / "sample_data"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "weights" in data
    assert data["weights"]["required_skills"] == 0.40

def test_skill_normalization():
    assert skill_normalizer.normalize("ml") == "Machine Learning"
    assert skill_normalizer.normalize("nlp") == "Natural Language Processing"
    assert skill_normalizer.normalize("js") == "JavaScript"
    assert skill_normalizer.normalize("ts") == "TypeScript"
    assert skill_normalizer.normalize("react.js") == "React"
    assert skill_normalizer.normalize("reactjs") == "React"
    assert skill_normalizer.normalize("postgres") == "PostgreSQL"
    assert skill_normalizer.normalize("scikit learn") == "Scikit-learn"
    assert skill_normalizer.normalize("amazon web services") == "AWS"
    assert skill_normalizer.get_category("FastAPI") == "Backend"
    assert skill_normalizer.get_category("React") == "Frontend"

def test_document_parser_pdf():
    pdf_path = SAMPLE_DIR / "resumes" / "resume_1_senior_ml_engineer.pdf"
    assert pdf_path.exists()
    with open(pdf_path, "rb") as f:
        bytes_data = f.read()
    text = document_parser.extract_from_pdf(bytes_data)
    assert len(text) > 100
    assert "Machine Learning" in text
    assert "PyTorch" in text

def test_document_parser_docx():
    docx_path = SAMPLE_DIR / "resumes" / "resume_3_frontend_react_dev.docx"
    assert docx_path.exists()
    with open(docx_path, "rb") as f:
        bytes_data = f.read()
    text = document_parser.extract_from_docx(bytes_data)
    assert len(text) > 100
    assert "Frontend" in text
    assert "React" in text

def test_skill_extractor():
    text = "Requirements:\nRequires 3+ years in Python, FastAPI, Docker, and SQL.\n\nNice to have:\nAWS and Kubernetes."
    extracted = skill_extractor.extract_jd_skills(text)
    req_names = [s["canonical"] for s in extracted["required"]]
    pref_names = [s["canonical"] for s in extracted["preferred"]]
    
    assert "Python" in req_names
    assert "FastAPI" in req_names
    assert "Docker" in req_names
    assert "SQL" in req_names
    assert "Kubernetes" in pref_names or "AWS" in pref_names

def test_semantic_matcher():
    sim = semantic_matcher.compute_similarity(
        "Built predictive models using Scikit-learn and Python.",
        "Experience in machine learning model development and predictive analytics."
    )
    assert sim > 0.40  # Clear semantic alignment

def test_experience_analyzer():
    jd = "Requires 3+ years of hands-on experience in backend engineering."
    res = "Senior Developer with 4 years of experience building APIs."
    res_eval = experience_analyzer.evaluate(res, jd)
    assert res_eval["required"] == 3.0
    assert res_eval["detected"] == 4.0
    assert res_eval["status"] in ["meets_requirement", "exceeds_requirement"]
    assert res_eval["score"] == 100.0

def test_education_analyzer():
    jd = "Requires Bachelor's degree in Computer Science or related field."
    res = "Education: B.Tech in Computer Science from top university."
    edu_eval = education_analyzer.evaluate(res, jd)
    assert edu_eval["status"] == "satisfied"
    assert edu_eval["score"] == 100.0

def test_end_to_end_scoring_engine():
    with open(SAMPLE_DIR / "jds" / "ml_engineer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_1_senior_ml_engineer.pdf", "rb") as f:
        pdf_bytes = f.read()
    res_text = document_parser.extract_from_pdf(pdf_bytes)
    
    analysis = scoring_engine.analyze(
        resume_text=res_text,
        jd_text=jd_text,
        resume_filename="resume_1_senior_ml_engineer.pdf",
        jd_title="Machine Learning Engineer"
    )
    
    assert analysis["overall_score"] >= 75
    assert analysis["match_level"] in ["Good Match", "Strong Match"]
    assert len(analysis["matched_skills"]) > 0
    assert len(analysis["recommendations"]) > 0
    assert "Machine Learning" in [s["name"] for s in analysis["matched_skills"]]

def test_scoring_engine_differentiation():
    """Verify that a Frontend resume scores much lower on an ML JD than an ML resume."""
    with open(SAMPLE_DIR / "jds" / "ml_engineer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_3_frontend_react_dev.docx", "rb") as f:
        docx_bytes = f.read()
    res_text = document_parser.extract_from_docx(docx_bytes)
    
    frontend_on_ml = scoring_engine.analyze(
        resume_text=res_text,
        jd_text=jd_text,
        resume_filename="resume_3_frontend_react_dev.docx",
        jd_title="Machine Learning Engineer"
    )
    # Frontend dev should have low score on ML Engineer role
    assert frontend_on_ml["overall_score"] < 55
    assert len(frontend_on_ml["missing_skills"]) > 2

def test_pdf_report_generation():
    with open(SAMPLE_DIR / "jds" / "backend_developer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_2_junior_python_dev.pdf", "rb") as f:
        res_bytes = f.read()
    res_text = document_parser.extract_from_pdf(res_bytes)
    
    analysis = scoring_engine.analyze(
        resume_text=res_text,
        jd_text=jd_text,
        resume_filename="resume_2_junior_python_dev.pdf",
        jd_title="Python Backend Developer"
    )
    
    pdf_buffer = report_generator.generate_pdf(analysis)
    assert pdf_buffer.getbuffer().nbytes > 1000  # Non-empty valid PDF

def test_api_analyze_and_history():
    with open(SAMPLE_DIR / "jds" / "backend_developer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_2_junior_python_dev.pdf", "rb") as f:
        res_text = document_parser.extract_from_pdf(f.read())
        
    payload = {
        "resume_text": res_text,
        "resume_filename": "resume_2_junior_python_dev.pdf",
        "jd_text": jd_text,
        "jd_title": "Python Backend Developer"
    }
    resp = client.post("/api/match/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_score" in data
    assert "scores" in data
    analysis_id = data["id"]
    
    # Test fetch by id
    get_resp = client.get(f"/api/match/{analysis_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == analysis_id
    
    # Test fetch history
    hist_resp = client.get("/api/history")
    assert hist_resp.status_code == 200
    hist_data = hist_resp.json()
    assert hist_data["total"] >= 1
    
    # Test download PDF
    pdf_resp = client.get(f"/api/match/{analysis_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
