
import mysql.connector
import os
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DATABASE_HOST"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASS"),
        database=os.getenv("DATABASE_NAME"),
    )


def save_analysis(user_id, summary, conditions, evidence):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO medical_analyses (user_id, summary, conditions, evidence)
        VALUES (%s, %s, %s, %s)
        """,
        (
            user_id,
            summary,
            json.dumps(conditions),
            json.dumps(evidence)
        )
    )

    conn.commit()
    cursor.close()
    conn.close()


def get_analyses_by_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, summary, conditions, evidence, created_at
        FROM medical_analyses
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    for row in rows:
        row["conditions"] = json.loads(row["conditions"]) if row["conditions"] else []
        row["evidence"] = json.loads(row["evidence"]) if row["evidence"] else []

    return rows
























