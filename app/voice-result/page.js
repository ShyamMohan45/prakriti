"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function VoiceResultContent() {
  const params = useSearchParams()
  const router = useRouter()

  const question = params.get("question")
  const answer = params.get("answer")

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-900 px-[10vw] py-24">
      <button
        onClick={() => router.back()}
        className="text-sm text-teal-600 mb-12"
      >
        ← Back
      </button>

      <section className="max-w-4xl space-y-12">
        <div>
          <p className="text-xs tracking-widest text-slate-500 mb-2">
            YOUR QUESTION
          </p>
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-lg">
            {question || "No question detected"}
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest text-slate-500 mb-2">
            AI RESPONSE
          </p>
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-lg leading-relaxed">
            {answer || "No response generated"}
          </div>
        </div>

        <div className="pt-10 text-xs text-slate-500">
          This response is generated using AI and is not a medical diagnosis.
          Always consult a qualified healthcare professional.
        </div>
      </section>
    </main>
  )
}

export default function VoiceResultPage() {
  return (
    <Suspense fallback={null}>
      <VoiceResultContent />
    </Suspense>
  )
}
