



import { getPool } from "@/lib/db"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createTables } from "@/lib/dbUtils"
import { getEmailConfig } from "@/lib/emailConfig"

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
      const [users] = await getPool.query(
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

    const {
      user: emailUser,
      pass: emailPass,
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      from: emailFrom,
    } = getEmailConfig()

    console.log("📧 Email User:", emailUser ? "Set (" + emailUser + ")" : "Not set")
    console.log("📧 Email Pass:", emailPass ? "Set (length: " + emailPass.length + ")" : "Not set")

    if (!emailUser || !emailPass) {
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
      await getPool.query("DELETE FROM email_otps WHERE email = ?", [email])
      console.log("✅ [OTP] Deleted old OTPs")

      const [insertResult] = await getPool.query(
        "INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      )
      console.log("✅ [OTP] OTP stored in database with ID:", insertResult.insertId)
      console.log("   Email:", email)
      console.log("   OTP:", otp)
      console.log("   Expires at:", expiresAt)

      // Verify it was stored
      const [verify] = await getPool.query(
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
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      requireTLS: !emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    console.log("🚀 [OTP] Sending email via SMTP...")

    const senderAddress = emailFrom.includes("<") ? emailFrom : `"Prakriti Clinical AI" <${emailFrom}>`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Prakriti Verification Code</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; background: #090d16; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff;">PRAKRITI</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #10b981; font-weight: 500;">Clinical Intelligence Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a; font-weight: 600;">Your Security Verification Code</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                You requested a sign-in verification code for your Prakriti clinical workspace account. Use the one-time password below to authenticate:
              </p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #059669;">${otp}</span>
              </div>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                ⏰ <strong>Valid for 10 minutes.</strong> Never share this code with anyone.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                If you did not initiate this request, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
              Prakriti Clinical AI Diagnostics &bull; Encrypted Medical Portal
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: `Your Prakriti Verification Code: ${otp}`,
      html: htmlContent,
      text: `Your Prakriti verification code is: ${otp}. It is valid for 10 minutes.`,
    })

    console.log("✅ [OTP] Email sent successfully to:", email)

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      debugOtp: process.env.NODE_ENV !== "production" ? otp : undefined
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
