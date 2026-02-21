import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection
conn = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "password"),
    database=os.getenv("DB_NAME", "dxassist")
)

cursor = conn.cursor()

# Create medical_analyses table
create_table_sql = """
CREATE TABLE IF NOT EXISTS medical_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    summary LONGTEXT,
    conditions JSON,
    evidence JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
"""

try:
    cursor.execute(create_table_sql)
    conn.commit()
    print("✅ Table 'medical_analyses' created successfully!")
except Exception as e:
    print(f"❌ Error creating table: {e}")
finally:
    cursor.close()
    conn.close()
