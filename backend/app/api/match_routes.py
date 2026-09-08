from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.database import get_db
from app.models.entities import Analysis, Resume, JobDescription
from app.schemas.match import DirectAnalyzeRequest, MatchAnalysisResponse, OptimizationResponse
from app.services.scoring_engine import scoring_engine
from app.services.document_parser import document_parser
from app.services.report_generator import report_generator
from app.services.resume_optimizer import resume_optimizer

router = APIRouter(prefix="/match", tags=["Match Engine"])

@router.post("/analyze", response_model=MatchAnalysisResponse)
async def analyze_match_direct(
    request: DirectAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """Executes end-to-end Smart Match Engine on provided resume & JD texts or saved records."""
    resume_text = ""
    resume_filename = request.resume_filename or "Resume.pdf"
    
    if request.resume_id:
        r_rec = db.query(Resume).filter(Resume.id == request.resume_id).first()
        if not r_rec:
            raise HTTPException(status_code=404, detail="Resume record not found.")
        resume_text = r_rec.extracted_text
        resume_filename = r_rec.filename
    elif request.resume_text:
        resume_text = request.resume_text
    else:
        raise HTTPException(status_code=400, detail="Must provide either resume_id or resume_text.")

    jd_text = ""
    jd_title = request.jd_title or "Job Description"
    if request.jd_id:
        j_rec = db.query(JobDescription).filter(JobDescription.id == request.jd_id).first()
        if not j_rec:
            raise HTTPException(status_code=404, detail="Job description record not found.")
        jd_text = j_rec.raw_text
        jd_title = j_rec.title
    elif request.jd_text:
        jd_text = request.jd_text
    else:
        raise HTTPException(status_code=400, detail="Must provide either jd_id or jd_text.")

    if len(resume_text.strip()) < 30:
        raise HTTPException(status_code=400, detail="Resume text is too short or empty for meaningful NLP analysis.")
    if len(jd_text.strip()) < 30:
        raise HTTPException(status_code=400, detail="Job description is too short or empty for meaningful NLP analysis.")

    results = scoring_engine.analyze(
        resume_text=resume_text,
        jd_text=jd_text,
        resume_filename=resume_filename,
        jd_title=jd_title
    )

    # If resume_id or jd_id weren't provided, create records to store raw text
    if not request.resume_id:
        r_rec = Resume(
            filename=resume_filename,
            file_type="text/plain",
            extracted_text=resume_text
        )
        db.add(r_rec)
        db.commit()
        db.refresh(r_rec)
        request.resume_id = r_rec.id

    if not request.jd_id:
        j_rec = JobDescription(
            title=jd_title,
            raw_text=jd_text
        )
        db.add(j_rec)
        db.commit()
        db.refresh(j_rec)
        request.jd_id = j_rec.id

    analysis_record = Analysis(
        resume_id=request.resume_id,
        jd_id=request.jd_id,
        resume_filename=resume_filename,
        jd_title=jd_title,
        overall_score=results["overall_score"],
        match_level=results["match_level"],
        scores=results["scores"],
        matched_skills=results["matched_skills"],
        partial_skills=results["partial_skills"],
        missing_skills=results["missing_skills"],
        experience=results["experience"],
        education=results["education"],
        insight=results["insight"],
        recommendations=results["recommendations"],
        breakdown=results["breakdown"]
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    results["id"] = analysis_record.id
    results["created_at"] = analysis_record.created_at
    return results

@router.post("/analyze-files")
async def analyze_match_from_files(
    resume_file: UploadFile = File(...),
    jd_text: Optional[str] = Form(None),
    jd_file: Optional[UploadFile] = File(None),
    jd_title: Optional[str] = Form("Target Role"),
    db: Session = Depends(get_db)
):
    """Uploads documents and runs Smart Match Engine."""
    res_bytes = await resume_file.read()
    resume_text = document_parser.parse_upload(resume_file, res_bytes)
    resume_filename = resume_file.filename or "Resume.pdf"

    final_jd_text = ""
    final_jd_title = jd_title or "Job Description"

    if jd_file and jd_file.filename:
        jd_bytes = await jd_file.read()
        final_jd_text = document_parser.parse_upload(jd_file, jd_bytes)
        final_jd_title = jd_file.filename
    elif jd_text and jd_text.strip():
        final_jd_text = jd_text.strip()
    else:
        raise HTTPException(status_code=400, detail="Must provide either JD text or a JD document file.")

    results = scoring_engine.analyze(
        resume_text=resume_text,
        jd_text=final_jd_text,
        resume_filename=resume_filename,
        jd_title=final_jd_title
    )

    r_rec = Resume(
        filename=resume_filename,
        file_type=resume_file.content_type or "application/octet-stream",
        extracted_text=resume_text
    )
    db.add(r_rec)
    db.commit()
    db.refresh(r_rec)

    j_rec = JobDescription(
        title=final_jd_title,
        raw_text=final_jd_text
    )
    db.add(j_rec)
    db.commit()
    db.refresh(j_rec)

    analysis_record = Analysis(
        resume_id=r_rec.id,
        jd_id=j_rec.id,
        resume_filename=resume_filename,
        jd_title=final_jd_title,
        overall_score=results["overall_score"],
        match_level=results["match_level"],
        scores=results["scores"],
        matched_skills=results["matched_skills"],
        partial_skills=results["partial_skills"],
        missing_skills=results["missing_skills"],
        experience=results["experience"],
        education=results["education"],
        insight=results["insight"],
        recommendations=results["recommendations"],
        breakdown=results["breakdown"]
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    results["id"] = analysis_record.id
    results["created_at"] = analysis_record.created_at
    return results

@router.post("/{analysis_id}/optimize", response_model=OptimizationResponse)
def optimize_resume_match(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """
    Optimizes candidate resume using AI:
    - Incorporates missing skills into appropriate categories
    - Aligns professional summary with job mission
    - Transforms weak bullet points using Google X-Y-Z quantifiable metric formula
    - Recalculates increased ATS score
    """
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    # Retrieve original text
    r_rec = db.query(Resume).filter(Resume.id == record.resume_id).first() if record.resume_id else None
    j_rec = db.query(JobDescription).filter(JobDescription.id == record.jd_id).first() if record.jd_id else None

    if not r_rec or not j_rec:
        raise HTTPException(
            status_code=400,
            detail="Original resume text or JD text not accessible for optimization."
        )

    original_analysis_dict = {
        "overall_score": record.overall_score,
        "match_level": record.match_level,
        "scores": record.scores,
        "matched_skills": record.matched_skills,
        "partial_skills": record.partial_skills,
        "missing_skills": record.missing_skills,
        "experience": record.experience,
        "education": record.education,
        "insight": record.insight,
        "recommendations": record.recommendations
    }

    # Run Optimizer
    opt_result = resume_optimizer.optimize(
        original_resume_text=r_rec.extracted_text,
        jd_text=j_rec.raw_text,
        original_analysis=original_analysis_dict,
        resume_filename=record.resume_filename,
        jd_title=record.jd_title
    )

    # Persist in DB
    record.is_optimized = 1
    record.optimized_score = opt_result["optimized_score"]
    record.optimization_data = {
        "original_score": opt_result["original_score"],
        "optimized_score": opt_result["optimized_score"],
        "score_boost": opt_result["score_boost"],
        "original_scores": opt_result["original_scores"],
        "optimized_scores": opt_result["optimized_scores"],
        "summary_changes": opt_result["summary_changes"],
        "skills_added": opt_result["skills_added"],
        "bullet_improvements": opt_result["bullet_improvements"]
    }
    record.optimized_resume_text = opt_result["optimized_resume_text"]
    db.commit()

    return {
        "analysis_id": record.id,
        "original_score": opt_result["original_score"],
        "optimized_score": opt_result["optimized_score"],
        "score_boost": opt_result["score_boost"],
        "original_scores": opt_result["original_scores"],
        "optimized_scores": opt_result["optimized_scores"],
        "summary_changes": opt_result["summary_changes"],
        "skills_added": opt_result["skills_added"],
        "bullet_improvements": opt_result["bullet_improvements"],
        "optimized_resume_text": opt_result["optimized_resume_text"],
        "optimized_analysis": opt_result["optimized_analysis"]
    }

@router.get("/{analysis_id}", response_model=MatchAnalysisResponse)
def get_match_analysis(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Match analysis record not found.")

    return {
        "id": record.id,
        "resume_filename": record.resume_filename,
        "jd_title": record.jd_title,
        "overall_score": record.overall_score,
        "match_level": record.match_level,
        "scores": record.scores,
        "weights": {
            "required_skills": 40,
            "semantic_similarity": 25,
            "experience": 20,
            "preferred_skills": 10,
            "education": 5
        },
        "matched_skills": record.matched_skills,
        "partial_skills": record.partial_skills,
        "missing_skills": record.missing_skills,
        "experience": record.experience,
        "education": record.education,
        "insight": record.insight,
        "recommendations": record.recommendations,
        "breakdown": record.breakdown,
        "is_optimized": bool(record.is_optimized),
        "optimized_score": record.optimized_score,
        "optimization_data": record.optimization_data,
        "optimized_resume_text": record.optimized_resume_text,
        "created_at": record.created_at
    }

@router.get("/{analysis_id}/pdf")
def download_pdf_report(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Match analysis record not found.")

    analysis_data = {
        "resume_filename": record.resume_filename,
        "jd_title": record.jd_title,
        "overall_score": record.overall_score,
        "match_level": record.match_level,
        "scores": record.scores,
        "matched_skills": record.matched_skills,
        "partial_skills": record.partial_skills,
        "missing_skills": record.missing_skills,
        "experience": record.experience,
        "education": record.education,
        "insight": record.insight,
        "recommendations": record.recommendations
    }

    pdf_buffer = report_generator.generate_pdf(
        analysis_data,
        optimization_data=record.optimization_data if record.is_optimized else None
    )
    
    filename = f"Matchly_{'Optimized_' if record.is_optimized else ''}Report_{record.resume_filename.replace(' ', '_')}_{record.id}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{analysis_id}/optimized-resume-pdf")
def download_optimized_resume_pdf(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """Generates and streams a clean, professional PDF of the newly optimized resume."""
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record or not record.optimized_resume_text:
        raise HTTPException(status_code=404, detail="Optimized resume text not found. Run optimization first.")

    pdf_buffer = report_generator.generate_clean_resume_pdf(
        record.optimized_resume_text,
        candidate_name=record.resume_filename
    )
    
    filename = f"Optimized_Resume_{record.resume_filename.replace(' ', '_')}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
