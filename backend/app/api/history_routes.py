from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.entities import Analysis
from app.schemas.match import HistoryListResponse, HistoryItemResponse

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=HistoryListResponse)
def get_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Retrieves all past match analyses ordered by most recent."""
    total = db.query(Analysis).count()
    records = db.query(Analysis).order_by(Analysis.created_at.desc()).offset(skip).limit(limit).all()
    
    items = [
        HistoryItemResponse(
            id=r.id,
            resume_filename=r.resume_filename or "Resume.pdf",
            jd_title=r.jd_title or "Job Description",
            overall_score=r.overall_score,
            match_level=r.match_level,
            is_optimized=bool(r.is_optimized),
            optimized_score=r.optimized_score,
            created_at=r.created_at
        )
        for r in records
    ]
    
    return HistoryListResponse(total=total, items=items)

@router.delete("/{analysis_id}")
def delete_history_item(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """Deletes a past analysis record."""
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    
    db.delete(record)
    db.commit()
    return {"message": f"Analysis record #{analysis_id} deleted successfully.", "id": analysis_id}
