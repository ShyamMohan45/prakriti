import mysql from "mysql2/promise"

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")
    
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || "localhost",
      user: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASS || "passsword",
      database: process.env.DATABASE_NAME || "dxassist",
    })

    console.log("✅ Database connection successful!")
    await connection.end()
    return { success: true }
  } catch (err) {
    console.error("❌ Database connection failed:", err.message)
    return { success: false, error: err.message }
  }
}
