import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.resume_optimizer import resume_optimizer
from app.services.scoring_engine import scoring_engine
from app.services.report_generator import report_generator

client = TestClient(app)

SAMPLE_DIR = Path(__file__).resolve().parent.parent.parent / "sample_data"

def test_resume_optimizer_boost():
    # Take Junior Python Developer resume and Backend Developer JD (moderate original match)
    with open(SAMPLE_DIR / "jds" / "backend_developer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_2_junior_python_dev.pdf", "rb") as f:
        from app.services.document_parser import document_parser
        res_text = document_parser.extract_from_pdf(f.read())

    # 1. Original analysis
    orig_analysis = scoring_engine.analyze(
        resume_text=res_text,
        jd_text=jd_text,
        resume_filename="resume_2_junior_python_dev.pdf",
        jd_title="Python Backend Developer"
    )

    # 2. Run optimizer
    opt_result = resume_optimizer.optimize(
        original_resume_text=res_text,
        jd_text=jd_text,
        original_analysis=orig_analysis,
        resume_filename="resume_2_junior_python_dev.pdf",
        jd_title="Python Backend Developer"
    )

    assert "optimized_score" in opt_result
    assert "score_boost" in opt_result
    assert opt_result["optimized_score"] >= opt_result["original_score"]
    assert len(opt_result["skills_added"]) > 0
    assert "Kubernetes" in [s["name"] for s in opt_result["skills_added"]] or "Terraform" in [s["name"] for s in opt_result["skills_added"]]
    assert len(opt_result["bullet_improvements"]) > 0

def test_optimized_pdf_report_generation():
    with open(SAMPLE_DIR / "jds" / "backend_developer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_2_junior_python_dev.pdf", "rb") as f:
        from app.services.document_parser import document_parser
        res_text = document_parser.extract_from_pdf(f.read())

    orig_analysis = scoring_engine.analyze(res_text, jd_text)
    opt_result = resume_optimizer.optimize(res_text, jd_text, orig_analysis)

    pdf_buffer = report_generator.generate_pdf(
        analysis_data=orig_analysis,
        optimization_data=opt_result
    )
    assert pdf_buffer.getbuffer().nbytes > 2000

    clean_resume_pdf = report_generator.generate_clean_resume_pdf(opt_result["optimized_resume_text"])
    assert clean_resume_pdf.getbuffer().nbytes > 1500

def test_api_optimize_endpoint():
    with open(SAMPLE_DIR / "jds" / "backend_developer_jd.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
    with open(SAMPLE_DIR / "resumes" / "resume_2_junior_python_dev.pdf", "rb") as f:
        from app.services.document_parser import document_parser
        res_text = document_parser.extract_from_pdf(f.read())

    # Create initial match analysis
    payload = {
        "resume_text": res_text,
        "resume_filename": "resume_2_junior_python_dev.pdf",
        "jd_text": jd_text,
        "jd_title": "Python Backend Developer"
    }
    init_resp = client.post("/api/match/analyze", json=payload)
    assert init_resp.status_code == 200
    analysis_id = init_resp.json()["id"]

    # Call optimize endpoint
    opt_resp = client.post(f"/api/match/{analysis_id}/optimize")
    assert opt_resp.status_code == 200
    data = opt_resp.json()
    assert data["optimized_score"] >= data["original_score"]
    assert len(data["skills_added"]) > 0

    # Fetch updated analysis record
    get_resp = client.get(f"/api/match/{analysis_id}")
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["is_optimized"] is True
    assert get_data["optimized_score"] is not None

    # Download updated PDF
    pdf_resp = client.get(f"/api/match/{analysis_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
