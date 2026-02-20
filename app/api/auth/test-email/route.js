import { NextResponse } from "next/server"
import { getEmailConfig } from "@/lib/emailConfig"

export async function GET() {
  try {
    const emailConfig = getEmailConfig()

    return NextResponse.json({
      success: true,
      message: "Email configuration loaded successfully",
      config: {
        user: emailConfig.user ? "✓ configured" : "✗ missing",
        pass: emailConfig.pass ? "✓ configured" : "✗ missing",
        userValue: emailConfig.user || "not set",
        passLength: emailConfig.pass ? emailConfig.pass.length : 0
      }
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    )
  }
}
