


import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { signToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 }
      )
    }

    const [rows] = await db.query(
      "SELECT * FROM email_otps WHERE email = ? AND otp = ?",
      [email, otp]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 401 }
      )
    }

    const record = rows[0]

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 401 }
      )
    }

    // Delete OTP
    await db.query("DELETE FROM email_otps WHERE email = ?", [email])

    // Get user
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    const user = users[0]
    const token = signToken(user)

    const cookieStore = await cookies()
    cookieStore.set("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    return NextResponse.json({ success: true, user })

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err)
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    )
  }
}
