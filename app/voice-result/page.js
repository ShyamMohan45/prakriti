"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Mic,
  Bot,
  ArrowLeft,
  Copy,
  Check,
  FileText,
  ShieldAlert,
  Sparkles,
  MessageSquare
} from "lucide-react"

function VoiceResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const question = params.get("question")
  const answer = params.get("answer")

  const copyAnswer = () => {
    if (answer) {
      navigator.clipboard.writeText(answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-500 mb-8 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Knowledge Base
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 mb-3">
            <Mic className="w-3.5 h-3.5" />
            Voice Consultation Synthesis
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clinical Voice Inquiry Result
          </h1>
        </div>

        <section className="space-y-8">
          
          {/* Transcribed User Question */}
          <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <Mic className="w-4 h-4 text-teal-500" />
              <span>Transcribed Speech Query</span>
            </div>
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {question ? `"${question}"` : "No voice question detected"}
            </p>
          </div>

          {/* AI Clinical Response */}
          <div className="p-8 rounded-3xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-white via-white to-teal-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 shadow-sm relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>AI Clinical Assistant Recommendation</span>
              </div>

              <button
                onClick={copyAnswer}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
              {answer || "No response generated"}
            </p>

            {/* Follow-up CTA */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Grounding: WHO & CDC clinical reference matrices
              </span>
              <Link
                href="/diagnostics/analyze"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Analyze Accompanying Medical File
              </Link>
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              This response is synthesized by artificial intelligence for informational and clinical decision-support purposes only. It is not an official prescription or diagnosis. Always consult a licensed healthcare practitioner.
            </p>
          </div>

        </section>
      </div>
    </main>
  )
}

export default function VoiceResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading result...</div>}>
      <VoiceResultContent />
    </Suspense>
  )
}
