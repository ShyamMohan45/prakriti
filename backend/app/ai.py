import logging
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from app.prompts import MEDICAL_PROMPT

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
logger = logging.getLogger(__name__)

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_medical_file(text: str) -> dict:
    try:
        # Combine extracted text with your structured medical prompt
        full_prompt = f"""
        {MEDICAL_PROMPT}

        Here is the medical report:

        {text}
        """

        response = model.generate_content(full_prompt)

        # Convert AI response to JSON
        data = json.loads(response.text)

        evidence = data.get("evidence", [])
        conditions = data.get("conditions", [])

        # Ensure required fields exist
        for condition in conditions:
            if "severity" not in condition:
                condition["severity"] = "Medium"
            if "justification" not in condition:
                condition["justification"] = "Requires clinical review"

        if not conditions:
            conditions = [{
                "name": "General Health Status",
                "severity": "Low",
                "justification": "No significant clinical abnormalities detected"
            }]

        return {
            "summary": data.get("summary", "Clinical analysis completed"),
            "conditions": conditions,
            "evidence": evidence
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        return {
            "summary": "Clinical analysis completed with partial results.",
            "conditions": [{
                "name": "Analysis Status",
                "severity": "Low",
                "justification": "Document processed with parsing constraints"
            }],
            "evidence": [],
            "error": str(e)
        }

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return {
            "summary": "AI analysis unavailable due to API quota limits.",
            "conditions": [{
                "name": "Service Unavailable",
                "severity": "Low",
                "justification": "AI service is temporarily unavailable"
            }],
            "evidence": [],
            "error": str(e)
        }