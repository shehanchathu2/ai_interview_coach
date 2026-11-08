from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()


@router.post("/extract-cv")
async def extract_cv(file: UploadFile = File(...)):

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    pdf_bytes = await file.read()

    if len(pdf_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="PDF must be smaller than 5 MB."
        )

    if not pdf_bytes.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file."
        )

    try:
        cv_text = extract_text_from_pdf(pdf_bytes)

        return {
            "success": True,
            "cv_text": cv_text
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )