"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { BACKEND_URL } from "@/lib/backendUrl"
import {
  Mic,
  MicOff,
  Search,
  BookOpen,
  Globe2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Stethoscope,
  FileText,
  AlertCircle,
  ExternalLink,
  Volume2
} from "lucide-react"

export default function KnowledgeBasePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [query, setQuery] = useState("")
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (recording) {
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recording])

  const startRecording = async () => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        setProcessing(true)
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const formData = new FormData()
        formData.append("file", audioBlob)

        try {
          const res = await fetch(`${BACKEND_URL}/api/speech`, {
            method: "POST",
            body: formData,
          })

          const data = await res.json()
          router.push(
            `/voice-result?question=${encodeURIComponent(
              data.user || "Voice Query"
            )}&answer=${encodeURIComponent(data.reply || "No response generated")}`
          )
        } catch (err) {
          console.error("Speech processing failed:", err)
          alert("Unable to process voice recording. Please ensure voice backend is running.")
        } finally {
          setProcessing(false)
        }
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)
    } catch (err) {
      console.error("Microphone access denied:", err)
      alert("Microphone permission required for clinical voice inquiry.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Banner */}
      <section className="relative pt-16 pb-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Clinical Knowledge & Voice AI Lab
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Evidence-First Medical Intelligence & Voice Consultation
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Query standardized clinical guidelines or speak directly with our automated clinical voice assistant for instant evidence-grounded differential insights.
          </p>

          {/* Search Bar */}
          <div className="mt-10 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    if (!user) router.push("/login")
                    else router.push(`/chat?q=${encodeURIComponent(query)}`)
                  }
                }}
                placeholder="Search medical conditions, ICD-10 codes, clinical biomarkers..."
                className="w-full pl-14 pr-32 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none focus:border-teal-500 shadow-sm"
              />
              <div className="absolute right-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500">
                <span>↵ Enter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* ================= VOICE CONSULTATION HUB ================= */}
        <div className="mb-16 p-8 sm:p-12 rounded-3xl border border-teal-200/70 dark:border-teal-900/50 bg-gradient-to-br from-teal-50/60 via-white to-cyan-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-teal-950/20 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-100/60 dark:bg-teal-950">
                <Volume2 className="w-3.5 h-3.5" />
                Speech-to-Clinical-Reasoning
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Interactive Voice Medical Assistant
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Record your medical inquiry or symptoms verbally. Our Whisper speech pipeline transcribes and TinyLlama synthesizes actionable clinical recommendations.
              </p>
            </div>

            {/* Voice Recording Control */}
            <div className="flex flex-col items-center gap-4">
              {processing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full border-4 border-teal-500 border-t-transparent animate-spin flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-teal-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 animate-pulse">
                    Synthesizing Speech...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {recording && (
                      <span className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                    )}
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 active:scale-95 ${
                        recording
                          ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 animate-pulse"
                          : "bg-gradient-to-tr from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/30 hover:scale-105"
                      }`}
                    >
                      {recording ? (
                        <MicOff className="w-8 h-8" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {recording ? `Recording: ${formatTime(recordingTime)}` : "Tap to Speak"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {recording ? "Click again when done" : "Multi-lingual speech supported"}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= LITERATURE & GUIDELINES GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Sources */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-teal-500" />
              Primary Grounding Medical Authorities
            </h3>

            {[
              {
                title: "WHO Clinical Practice Guidelines",
                desc: "Standardized diagnostic workflows, therapeutic guidelines, and respiratory infection protocols verified across global cohorts.",
                tag: "Global Advisory",
                badge: "WHO Approved",
                icon: Globe2,
              },
              {
                title: "CDC Infectious Disease Protocols",
                desc: "Real-time epidemiological advisories, antimicrobial resistance matrices, and diagnostic decision frameworks.",
                tag: "National Standard",
                badge: "CDC Validated",
                icon: ShieldCheck,
              },
              {
                title: "Mayo Clinic Clinical Reference Library",
                desc: "Deep differential diagnosis indexes, comprehensive laboratory threshold normalizations, and rare presentation markers.",
                tag: "Tertiary Evidence",
                badge: "Peer Reviewed",
                icon: Stethoscope,
              },
              {
                title: "ICMR Clinical Consensus Guidelines",
                desc: "Region-specific health protocols adapted for local clinical epidemiology, pathology variations, and tropical medicine.",
                tag: "Regional Guideline",
                badge: "ICMR Standard",
                icon: BookOpen,
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-teal-500/50 transition-all flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: RAG Architecture Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Anti-Hallucination Guardrails
              </h4>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  DxAssist uses constrained semantic search over validated clinical literature before running LLM generation.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    ✓ Grounded Generation
                  </span>
                  Responses cite WHO, CDC, or Mayo Clinic guidelines with every response.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    ✓ Traceable Evidence
                  </span>
                  Clinical citations link directly to specific sections for clinician auditability.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}