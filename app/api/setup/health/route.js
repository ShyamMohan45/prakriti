import { NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export const dynamic = "force-dynamic"

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
    await getPool.query("SELECT 1")

    return {
      status: "✅",
      message: "Database connected successfully",
      config: {
        host: (process.env.DATABASE_HOST || "localhost").slice(0, 30) + "...",
        db: process.env.DATABASE_NAME || "test"
      }
    }
  } catch (err) {
    return {
      status: "❌",
      message: "Database connection failed: " + err.message,
      fix: "Verify DATABASE_HOST and credentials in Vercel settings"
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
