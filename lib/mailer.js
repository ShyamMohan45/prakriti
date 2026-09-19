import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOTPEmail(to, otp) {
  await transporter.sendMail({
    from: `"Prakriti Clinical AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Prakriti Login OTP",
    html: `
      <div style="font-family: Arial;">
        <h2>Your OTP</h2>
        <p>Use the OTP below to login:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  })
}
