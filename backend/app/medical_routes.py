from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader
import io

from app.ai import analyze_medical_file  # reuse your existing AI logic

router = APIRouter()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""

        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        return text

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF extraction failed: {str(e)}")


@router.post("/analyze-medical-pdf")
async def analyze_medical_pdf(file: UploadFile = File(...)):
    try:
        # Read file
        content = await file.read()

        # Extract text
        text = extract_text_from_pdf(content)

        if not text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in PDF.")

        # Create structured medical prompt
        prompt = f"""
        You are a medical AI assistant.
        Analyze and summarize the following medical report in structured format:

        - Patient Name
        - Age
        - Diagnosis
        - Key Findings
        - Lab Results (if present)
        - Medications
        - Risk Level (Low / Medium / High)
        - Recommendations

        Report:
        {text}
        """

        # Use your existing AI function
        result = analyze_medical_file(prompt)

        return {
            "status": "success",
            "summary": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))