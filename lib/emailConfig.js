export function getEmailConfig() {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const host = process.env.EMAIL_HOST || "smtp.gmail.com"
  const port = Number(process.env.EMAIL_PORT || 587)
  const secure = process.env.EMAIL_SECURE === "true"
  const from = process.env.EMAIL_FROM || user

  // Log for debugging
  console.log("📧 Email Config - USER:", user ? "✓ set" : "✗ missing")
  console.log("📧 Email Config - PASS:", pass ? "✓ set" : "✗ missing")

  if (!user || !pass) {
    console.error("❌ EMAIL credentials are not configured!")
    console.error("Please ensure EMAIL_USER and EMAIL_PASS are set in .env.local")
  }

  return { user, pass, host, port, secure, from }
}
