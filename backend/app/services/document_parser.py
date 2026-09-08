import os
import io
from pathlib import Path
from fastapi import UploadFile, HTTPException
import fitz  # PyMuPDF
import docx  # python-docx
from app.config import settings

class DocumentParser:
    """Extracts clean text and metadata from PDF and DOCX documents with robust error handling."""

    @staticmethod
    def validate_file(file: UploadFile, content_bytes: bytes) -> None:
        # Check size
        if len(content_bytes) > settings.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
            )
        
        # Check extension
        ext = Path(file.filename or "").suffix.lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Only {', '.join(settings.ALLOWED_EXTENSIONS)} files are supported."
            )

    @staticmethod
    def extract_from_pdf(content_bytes: bytes) -> str:
        try:
            doc = fitz.open(stream=content_bytes, filetype="pdf")
            if doc.is_encrypted:
                raise HTTPException(status_code=400, detail="Encrypted or password-protected PDF files cannot be processed.")
            
            text_parts = []
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                if page_text:
                    text_parts.append(page_text.strip())
            
            full_text = "\n\n".join(text_parts).strip()
            if not full_text:
                raise HTTPException(
                    status_code=400,
                    detail="No extractable text found in PDF. Scanned or image-only PDFs without OCR text cannot be analyzed."
                )
            return full_text
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {str(e)}")

    @staticmethod
    def extract_from_docx(content_bytes: bytes) -> str:
        try:
            doc_stream = io.BytesIO(content_bytes)
            doc = docx.Document(doc_stream)
            
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            
            # Also extract text inside tables
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        paragraphs.append(row_text)
            
            full_text = "\n\n".join(paragraphs).strip()
            if not full_text:
                raise HTTPException(status_code=400, detail="The DOCX document is empty or contains no extractable text.")
            return full_text
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse DOCX document: {str(e)}")

    @classmethod
    def parse_upload(cls, file: UploadFile, content_bytes: bytes) -> str:
        cls.validate_file(file, content_bytes)
        ext = Path(file.filename or "").suffix.lower()
        if ext == ".pdf":
            return cls.extract_from_pdf(content_bytes)
        elif ext == ".docx":
            return cls.extract_from_docx(content_bytes)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'.")

document_parser = DocumentParser()
