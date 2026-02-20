// Email configuration with fallback support
export function getEmailConfig() {
  const user = process.env.EMAIL_USER || "shyammohanfaujdaar@gmail.com"
  const pass = process.env.EMAIL_PASS || "yimn mwvi yqms voat"

  // Log for debugging
  console.log("📧 Email Config - USER:", user ? "✓ set" : "✗ missing")
  console.log("📧 Email Config - PASS:", pass ? "✓ set" : "✗ missing")

  if (!user || !pass) {
    console.error("❌ EMAIL credentials are not configured!")
    console.error("Please ensure EMAIL_USER and EMAIL_PASS are set in .env.local")
  }

  return { user, pass }
}
