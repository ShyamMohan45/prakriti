
import os
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from typing import Generator

from app.ai import analyze_medical_file
from app.db import save_analysis, get_analyses_by_user
from app.auth import get_user

load_dotenv()  

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

app = FastAPI(title="Medical AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if HF_TOKEN:
    client = InferenceClient(api_key=HF_TOKEN)

SYSTEM_MESSAGE = {
    "role": "system",
    "content": (
        "You are a clinical assistant. "
        "Always cite WHO, CDC, NHS, or Mayo Clinic. "
        "Provide evidence-based medical information and include a disclaimer."
    ),
}

class ChatRequest(BaseModel):
    message: str




@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    user=Depends(get_user)
):
    temp_path = f"temp_{file.filename}"

    try:
        # Save uploaded file temporarily
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        # Run AI analysis
        result = analyze_medical_file(temp_path)

        # Store in DB (per user)
        save_analysis(
            user_id=user["id"],
            summary=result["summary"],
            conditions=result["conditions"],
            evidence=result.get("evidence", [])
        )

        # Return complete result with all fields
        return {
            "status": "success",
            "summary": result.get("summary", ""),
            "conditions": result.get("conditions", []),
            "evidence": result.get("evidence", [])
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "summary": "Analysis failed",
            "conditions": [],
            "evidence": []
        }

    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)



#  View Past Analyses Endpoint

@app.get("/analyses")
def get_past_analyses(user=Depends(get_user)):
    data = get_analyses_by_user(user["id"])
    return {
        "status": "success",
        "data": data
    }


# Streaming Chat Endpoint for Document Analysis

@app.post("/chat/stream")
def chat_stream(req: ChatRequest):
    """
    Stream clinical assistant responses for document analysis feedback.
    Requires HUGGINGFACEHUB_API_TOKEN environment variable.
    """
    if not HF_TOKEN:
        return {
            "status": "error",
            "message": "HuggingFace API token not configured"
        }

    def generator() -> Generator[str, None, None]:
        try:
            stream = client.chat_completion(
                model="meta-llama/Meta-Llama-3-8B-Instruct",
                messages=[
                    SYSTEM_MESSAGE,
                    {"role": "user", "content": req.message},
                ],
                max_tokens=500,
                temperature=0.7,
                stream=True,
            )

            for chunk in stream:
                if not chunk.choices:
                    continue

                delta = chunk.choices[0].delta
                if not delta:
                    continue

                text = delta.get("content")
                if text:
                    yield text

        except Exception as e:
            yield f"\n[Error: {str(e)}]\n"

    return StreamingResponse(generator(), media_type="text/plain")


@app.get("/health")
def health():
    return {"status": "DxAssist Clinical Backend Running"}


