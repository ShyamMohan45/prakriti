


import { getPool } from "@/lib/db"
import { NextResponse } from "next/server"
import { signToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req) {
  try {
    const { email, otp } = await req.json()

    console.log("🔐 [OTP Verify] Attempting verification")
    console.log("📧 Email:", email)
    console.log("🔑 OTP received:", otp, "(type:", typeof otp, ")")

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 }
      )
    }

    // Trim the OTP to remove any whitespace
    const otpTrimmed = String(otp).trim()
    console.log("🔑 OTP trimmed:", otpTrimmed)

    // First check all OTPs for this email
    const [allRecords] = await db.query(
      "SELECT email, otp, expires_at FROM email_otps WHERE email = ?",
      [email]
    )
    
    console.log("📋 OTP records found for email:", allRecords.length)
    allRecords.forEach((r, i) => {
      console.log(`   Record ${i}: otp="${r.otp}" (type: ${typeof r.otp}), expires_at=${r.expires_at}`)
    })

    const [rows] = await db.query(
      "SELECT * FROM email_otps WHERE email = ? AND otp = ?",
      [email, otpTrimmed]
    )

    console.log("✅ Matching OTP found:", rows.length > 0)

    if (rows.length === 0) {
      console.warn("❌ OTP mismatch or not found")
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 401 }
      )
    }

    const record = rows[0]

    if (new Date(record.expires_at) < new Date()) {
      console.warn("⏰ OTP expired at:", record.expires_at)
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 401 }
      )
    }

    console.log("✅ OTP valid")

    // Delete OTP
    await db.query("DELETE FROM email_otps WHERE email = ?", [email])
    console.log("🗑️ OTP deleted")

    // Get user
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      console.error("❌ User not found:", email)
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    const user = users[0]
    console.log("✅ User found:", user.email)

    const token = signToken(user)

    const cookieStore = await cookies()
    cookieStore.set("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    console.log("✅ OTP verification successful for:", email)
    return NextResponse.json({ success: true, user })

  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err)
    console.error("Stack:", err.stack)
    return NextResponse.json(
      { message: "Verification failed: " + err.message },
      { status: 500 }
    )
  }
}
