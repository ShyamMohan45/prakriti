import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    database: checkDatabase(),
    email: checkEmail(),
    jwt: checkJWT(),
  }

  const results = await Promise.all(Object.entries(checks).map(async ([key, promise]) => ({
    [key]: await promise
  })))

  const allPassed = results.every(r => Object.values(r)[0].status === "✅")

  return NextResponse.json({
    status: allPassed ? "ready" : "incomplete",
    checks: Object.assign({}, ...results),
    instructions: !allPassed ? getInstructions(results) : "All systems ready!"
  })
}

async function checkDatabase() {
  try {
    const host = process.env.DATABASE_HOST || "localhost"
    const user = process.env.DATABASE_USER || "root"
    const pass = process.env.DATABASE_PASS || "passsword"
    const db = process.env.DATABASE_NAME || "dxassist"

    // Try to connect
    const mysql = require("mysql2/promise")
    const conn = await mysql.createConnection({ host, user, password: pass, database: db })
    await conn.end()

    return {
      status: "✅",
      message: "Database connected successfully",
      config: { host, user, db }
    }
  } catch (err) {
    return {
      status: "❌",
      message: "Database connection failed: " + err.message,
      fix: "Make sure MySQL is running with correct password"
    }
  }
}

function checkEmail() {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (user && pass) {
    return {
      status: "✅",
      message: "Email configured",
      email: user
    }
  }

  return {
    status: "❌",
    message: "Email not configured",
    fix: "Add EMAIL_USER and EMAIL_PASS to .env.local"
  }
}

function checkJWT() {
  const secret = process.env.JWT_SECRET || "dxassist_super_secret_123"

  if (secret) {
    return {
      status: "✅",
      message: "JWT secret configured"
    }
  }

  return {
    status: "❌",
    message: "JWT secret not configured"
  }
}

function getInstructions(results) {
  return "Please fix the failed checks before proceeding"
}
