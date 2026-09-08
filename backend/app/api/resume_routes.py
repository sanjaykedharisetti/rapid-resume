from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Resume
from app.services.document_parser import document_parser
from app.services.text_preprocessor import text_preprocessor

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Uploads and parses resume (PDF/DOCX), extracting structured text sections."""
    content_bytes = await file.read()
    extracted_text = document_parser.parse_upload(file, content_bytes)
    
    sections = text_preprocessor.segment_resume(extracted_text)
    
    resume_record = Resume(
        filename=file.filename or "Uploaded_Resume.pdf",
        file_type=file.content_type or "application/octet-stream",
        extracted_text=extracted_text,
        structured_sections=sections
    )
    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)
    
    return {
        "id": resume_record.id,
        "filename": resume_record.filename,
        "character_count": len(extracted_text),
        "sections_detected": [k for k, v in sections.items() if v.strip()],
        "message": "Resume successfully uploaded and parsed."
    }
