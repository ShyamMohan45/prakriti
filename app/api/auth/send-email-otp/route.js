



import { getPool } from "@/lib/db"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createTables } from "@/lib/dbUtils"

export async function POST(req) {
  try {
    // Ensure tables exist
    await createTables()

    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 })
    }

    console.log("📧 [OTP] Attempting to send OTP to:", email)

    // Check if email exists in users table
    try {
      const [users] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      )

      if (users.length === 0) {
        console.warn("⚠️ [OTP] Email not registered:", email)
        return NextResponse.json(
          { message: "Email not registered. Please sign up first." },
          { status: 404 }
        )
      }

      console.log("✅ [OTP] Email found in database")
    } catch (queryErr) {
      console.error("❌ [OTP] Database query error:", queryErr)
      throw queryErr
    }

    // Check email credentials with fallback
    const emailUser = process.env.EMAIL_USER || "shyammohanfaujdaar@gmail.com"
    const emailPass = process.env.EMAIL_PASS || "yimn mwvi yqms voat"

    console.log("📧 Email User:", emailUser ? "Set (" + emailUser + ")" : "Not set")
    console.log("📧 Email Pass:", emailPass ? "Set (length: " + emailPass.length + ")" : "Not set")

    if (!emailUser || !emailPass || emailUser === "YOUR_EMAIL" || emailPass === "YOUR_PASSWORD") {
      return NextResponse.json(
        { message: "Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env.local" },
        { status: 500 }
      )
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    console.log("🔑 [OTP] Generated OTP:", otp, "(type:", typeof otp, ")")
    console.log("⏰ [OTP] Expires at:", expiresAt)

    // Store OTP in database
    try {
      await db.query("DELETE FROM email_otps WHERE email = ?", [email])
      console.log("✅ [OTP] Deleted old OTPs")

      const [insertResult] = await db.query(
        "INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      )
      console.log("✅ [OTP] OTP stored in database with ID:", insertResult.insertId)
      console.log("   Email:", email)
      console.log("   OTP:", otp)
      console.log("   Expires at:", expiresAt)

      // Verify it was stored
      const [verify] = await db.query(
        "SELECT email, otp, expires_at FROM email_otps WHERE email = ?",
        [email]
      )
      console.log("✅ [OTP] Verification - Records in DB:", verify.length)
      verify.forEach((r) => {
        console.log(`   Stored: email="${r.email}", otp="${r.otp}" (type: ${typeof r.otp}), expires_at=${r.expires_at}`)
      })
    } catch (dbErr) {
      console.error("❌ [OTP] Database storage error:", dbErr)
      throw dbErr
    }

    // Send email
    console.log("📨 [OTP] Configuring email transporter...")
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    console.log("🚀 [OTP] Sending email...")
    
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: "Your DxAssist OTP Code",
      html: "<h2>Your OTP Code: <strong>" + otp + "</strong></h2><p>Valid for 10 minutes</p>",
      text: "Your OTP is " + otp + ". Valid for 10 minutes.",
    })

    console.log("✅ [OTP] Email sent successfully!")

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully"
    })

  } catch (err) {
    console.error("❌ [OTP] ERROR:", err.message)
    console.error("❌ [OTP] Full error:", err)
    
    return NextResponse.json(
      { 
        message: "Failed to send OTP: " + (err.message || "Unknown error")
      },
      { status: 500 }
    )
  }
}




















// import { NextResponse } from "next/server"
// import nodemailer from "nodemailer"
// import crypto from "crypto"

// // in-memory store (OK for now, later move to DB/Redis)
// const otpStore = new Map()

// export async function POST(req) {
//   try {
//     const { email } = await req.json()

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required" },
//         { status: 400 }
//       )
//     }

//     // generate 6-digit OTP
//     const otp = crypto.randomInt(100000, 999999).toString()
//     const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

//     otpStore.set(email, { otp, expiresAt })

//     
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     })

//     await transporter.sendMail({
//       from: `"DxAssist" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your DxAssist Verification Code",
//       html: `
//         <div style="font-family: Arial">
//           <h2>Your OTP Code</h2>
//           <p><b>${otp}</b></p>
//           <p>This code expires in 5 minutes.</p>
//         </div>
//       `,
//     })

//     console.log("EMAIL OTP:", email, otp)

//     return NextResponse.json({ success: true })

//   } catch (err) {
//     console.error("EMAIL OTP ERROR:", err)

//     return NextResponse.json(
//       { message: "Failed to send OTP" },
//       { status: 500 }
//     )
//   }
// }
