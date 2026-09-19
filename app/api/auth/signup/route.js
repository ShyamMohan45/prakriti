



import { getPool } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { createTables } from "@/lib/dbUtils"

export const dynamic = "force-dynamic"

export async function POST(req) {
  try {
    await createTables()

    const { name, email, mobile, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const hash = await bcrypt.hash(password, 10)

    const [result] = await getPool.query(
      "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name, email, mobile, hash]
    )

    const user = { id: result.insertId, name, email }

  
    return NextResponse.json({ success: true, user })

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      )
    }

    console.error("SIGNUP ERROR:", err)
    return NextResponse.json(
      { success: false, message: err.message || "Signup failed" },
      { status: 500 }
    )
  }
}
