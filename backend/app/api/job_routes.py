from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.entities import JobDescription
from app.services.document_parser import document_parser
from app.services.text_preprocessor import text_preprocessor

router = APIRouter(prefix="/job-description", tags=["Job Description"])

@router.post("/upload")
async def upload_job_description(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    title: Optional[str] = Form("Job Description"),
    db: Session = Depends(get_db)
):
    """Uploads JD via document file (PDF/DOCX) or directly via submitted raw text."""
    extracted_text = ""
    
    if file and file.filename:
        content_bytes = await file.read()
        extracted_text = document_parser.parse_upload(file, content_bytes)
        if not title or title == "Job Description":
            title = file.filename
    elif raw_text and raw_text.strip():
        extracted_text = raw_text.strip()
    else:
        raise HTTPException(
            status_code=400,
            detail="Must provide either a valid JD document file (PDF/DOCX) or job description text."
        )

    sections = text_preprocessor.segment_jd(extracted_text)
    
    jd_record = JobDescription(
        title=title or "Job Description",
        raw_text=extracted_text,
        structured_sections=sections
    )
    db.add(jd_record)
    db.commit()
    db.refresh(jd_record)

    return {
        "id": jd_record.id,
        "title": jd_record.title,
        "character_count": len(extracted_text),
        "sections_detected": [k for k, v in sections.items() if v.strip()],
        "message": "Job description successfully registered and analyzed."
    }
