"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import {
  Activity,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  ArrowLeft
} from "lucide-react"

function EmailOTPLoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUser } = useAuth()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [devOtp, setDevOtp] = useState("")

  // Auto-fill email from query param
  useEffect(() => {
    const e = searchParams.get("email")
    if (e) {
      setEmail(e)
      setStep(2) // If coming from signup or email link, advance to OTP step directly
    }
  }, [searchParams])

  // Countdown timer for resend
  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  async function sendOTP() {
    setError("")
    if (!email) {
      setError("Please enter your registered email address")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to dispatch verification code")
      }

      if (data.debugOtp) {
        setDevOtp(data.debugOtp)
      }

      setStep(2)
      setResendCooldown(30)
    } catch (err) {
      setError(err.message || "Unable to send verification code")
    } finally {
      setLoading(false)
    }
  }

  async function verifyOTP(e) {
    if (e) e.preventDefault()
    setError("")

    if (!otp.trim()) {
      setError("Please enter the 6-digit code")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired OTP")
      }

      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {step === 1 ? "Email Verification" : "Enter Security Code"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {step === 1
                ? "Authenticate via one-time secure access code"
                : `Check your inbox at ${email || "your email"}`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dev Mode OTP Indicator (if available) */}
          {devOtp && (
            <div className="mb-6 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Code: <strong>{devOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(devOtp)}
                className="px-2 py-1 rounded bg-emerald-600 text-white font-medium text-[11px] hover:bg-emerald-500 transition"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Step 1: Input Email */}
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); sendOTP() }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Input OTP */
            <form onSubmit={verifyOTP} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Change email
                  </button>
                </div>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="276442"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-lg font-mono font-bold tracking-widest text-center focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend and Spam Hint */}
              <div className="pt-2 flex flex-col items-center gap-2 text-center">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={sendOTP}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-40 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive email? Resend code"}
                </button>

                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                  Tip: Please check your <strong>Spam / Junk</strong> or <strong>Promotions</strong> folder if the email is not in your inbox.
                </p>
              </div>
            </form>
          )}

          {/* Bottom Back Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/login"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to password login</span>
            </Link>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function EmailOTPLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs">
        Loading verification portal…
      </div>
    }>
      <EmailOTPLoginContent />
    </Suspense>
  )
}
