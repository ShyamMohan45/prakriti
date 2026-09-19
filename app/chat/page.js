"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { BACKEND_URL } from "@/lib/backendUrl"
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ShieldCheck,
  History,
  FileText,
  Activity,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  Volume2
} from "lucide-react"

export const dynamic = "force-dynamic"

const SAMPLE_PROMPTS = [
  {
    title: "Cross-Reactivity Evaluation",
    query: "Evaluate cross-reactivity risk for cephalosporins in a patient with a confirmed amoxicillin-induced IgE rash.",
    category: "Pharmacotherapy"
  },
  {
    title: "Differential Reasoning",
    query: "Differential diagnosis for 42M presenting with acute subacute pleuritic chest pain, friction rub, and PR depression.",
    category: "Cardiology"
  },
  {
    title: "ACC/AHA Guidelines Check",
    query: "Summarize 2024 guideline-directed medical therapy (GDMT) staging for heart failure with reduced ejection fraction (HFrEF).",
    category: "Guidelines"
  },
  {
    title: "Lab Panel Interpretation",
    query: "Explain clinical implications of serum ferritin >1200 ng/mL with normal transferrin saturation and elevated CRP.",
    category: "Hematology"
  }
]

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  const initialQuery = searchParams.get("q") || ""
  const [input, setInput] = useState(initialQuery)
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [attachedFile, setAttachedFile] = useState(null)
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const fileInputRef = useRef(null)

  // Past Sessions (persisted in local state)
  const [sessions, setSessions] = useState([
    { id: "s-1", title: "Amoxicillin cross-reactivity query", date: "Today" },
    { id: "s-2", title: "Hypertension Stage 2 review", date: "Yesterday" },
    { id: "s-3", title: "Pediatric amoxicillin dosing check", date: "3 days ago" }
  ])
  const [activeSessionId, setActiveSessionId] = useState("s-1")

  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  // Initial query execution
  useEffect(() => {
    if (initialQuery && user && messages.length === 0) {
      executeSend(initialQuery)
    }
  }, [initialQuery, user])

  // Auto-scroll on new message / token stream
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streaming])

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // Voice recording handlers
  async function toggleRecording() {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        audioChunksRef.current = []

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data)
        }

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          stream.getTracks().forEach((t) => t.stop())

          // Post to speech backend
          try {
            const formData = new FormData()
            formData.append("file", audioBlob, "recording.webm")

            const res = await fetch(`${BACKEND_URL}/api/speech`, {
              method: "POST",
              body: formData,
            })
            if (res.ok) {
              const data = await res.json()
              if (data.user) {
                setInput(data.user)
                if (data.reply) {
                  // Direct reply received from speech backend
                  setMessages((prev) => [
                    ...prev,
                    { role: "user", text: data.user, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { role: "bot", text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                  ])
                  return
                }
              }
            } else {
              fallbackSpeechRecognition()
            }
          } catch (err) {
            console.warn("Speech API unavailable, attempting Web Speech API fallback:", err)
            fallbackSpeechRecognition()
          }
        }

        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
      } catch (err) {
        console.error("Microphone permission denied:", err)
        fallbackSpeechRecognition()
      }
    }
  }

  function fallbackSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = "en-US"
      recognition.onstart = () => setIsRecording(true)
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput((prev) => (prev ? prev + " " + transcript : transcript))
      }
      recognition.onerror = () => setIsRecording(false)
      recognition.onend = () => setIsRecording(false)
      recognition.start()
    } else {
      alert("Microphone access is unavailable or denied in your browser.")
    }
  }

  async function executeSend(textToSend) {
    const trimmed = textToSend.trim()
    if (!trimmed || streaming) return

    let finalQuery = trimmed
    if (attachedFile) {
      finalQuery = `[Attached Document: ${attachedFile.name}]\n\n${trimmed}`
      setAttachedFile(null)
    }

    setInput("")
    setStreaming(true)

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { role: "user", text: finalQuery, time: now }])

    let botText = ""
    setMessages((prev) => [...prev, { role: "bot", text: "", time: now }])

    try {
      const res = await fetch(`${BACKEND_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalQuery }),
      })

      if (!res.body) {
        throw new Error("No response body received from clinical streaming endpoint")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        botText += chunk

        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: "bot", text: botText, time: now }
          return copy
        })
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "bot",
          text: `⚠️ **Clinical Connection Error**: Unable to stream response from Prakriti AI Engine (${err.message}). Please ensure backend is running at ${BACKEND_URL}.`,
          time: now
        }
      ])
    } finally {
      setStreaming(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      executeSend(input)
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
    }
  }

  function copyMessage(text, index) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function startNewSession() {
    const newId = `s-${Date.now()}`
    const newSession = {
      id: newId,
      title: "New Clinical Inquiry",
      date: "Just now"
    }
    setSessions([newSession, ...sessions])
    setActiveSessionId(newId)
    setMessages([])
    setInput("")
  }

  function clearCurrentChat() {
    if (window.confirm("Clear all messages in the active clinical session?")) {
      setMessages([])
    }
  }

  function exportTranscript() {
    const content = messages.map(m => `[${m.time || ""}] ${m.role === "user" ? "CLINICIAN" : "PRAKRITI AI"}:\n${m.text}\n`).join("\n---\n\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prakriti-clinical-transcript-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Format bot text with bold and bullet highlights
  function renderFormattedText(text) {
    const lines = text.split("\n")
    return (
      <div className="space-y-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return <h4 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">{line.replace("### ", "")}</h4>
          }
          if (line.startsWith("## ")) {
            return <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-1.5">{line.replace("## ", "")}</h3>
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{line.replace(/^[-*]\s+/, "")}</span>
              </div>
            )
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 font-medium">
                <span className="text-emerald-500">{line.match(/^\d+\./)[0]}</span>
                <span>{line.replace(/^\d+\.\s+/, "")}</span>
              </div>
            )
          }
          return <p key={idx} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
        })}
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 🔹 LEFT SIDEBAR: SESSION HISTORY & TEMPLATES */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-xl flex flex-col shrink-0 overflow-hidden relative z-20`}
      >
        {sidebarOpen && (
          <div className="w-72 flex flex-col h-full p-4">
            
            {/* New Session Button */}
            <button
              onClick={startNewSession}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-xs transition active:scale-98 mb-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Clinical Inquiry</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">⌘K</span>
            </button>

            {/* Session Roster */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                  <History className="w-3 h-3" />
                  <span>Recent Sessions</span>
                </div>
                <div className="space-y-1">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                        activeSessionId === s.id
                          ? "bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-slate-700/60"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <span className="truncate w-full">{s.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{s.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Sources Badge */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Clinical Evidence Base</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    PubMed Central
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    WHO Guidelines
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    ICD-10-CM
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    CDC Staging
                  </span>
                </div>
              </div>
            </div>

            {/* Model & System Status */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Prakriti Core v3.2</span>
                </div>
                <span className="font-mono text-[10px]">Active</span>
              </div>
            </div>

          </div>
        )}
      </aside>

      {/* 🔹 MAIN CONVERSATION WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Control Bar */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src="/clinical_ai_bot.jpg"
                alt="Prakriti AI"
                className="w-8 h-8 rounded-xl object-cover border border-emerald-500/30 shadow-sm"
              />
              <div>
                <h2 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Clinical Copilot</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium border border-emerald-500/20">
                    Live Stream
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={exportTranscript}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Export Transcript"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={clearCurrentChat}
                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Clear Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Conversation Stream Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          
          {/* Empty State: Quick Prompt Starters */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto py-12 sm:py-16 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                <img
                  src="/clinical_ai_bot.jpg"
                  alt="Prakriti Clinical AI Copilot"
                  className="w-24 h-24 rounded-full object-cover shadow-2xl border-2 border-emerald-500/40 relative z-10 mx-auto"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Prakriti Clinical Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                Evidence-grounded medical AI assistant for differential diagnosis, drug interaction safety, and guideline adherence.
              </p>

              {/* Sample Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {SAMPLE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => executeSend(p.query)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                        {p.category}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {p.query}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 max-w-3xl ${
                m.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {/* Bot Avatar */}
              {m.role === "bot" && (
                <div className="relative shrink-0 mt-1">
                  <img
                    src="/clinical_ai_bot.jpg"
                    alt="Prakriti AI"
                    className="w-8 h-8 rounded-xl object-cover shadow-md border border-emerald-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
              )}

              {/* Message Bubble Card */}
              <div
                className={`group relative rounded-2xl px-5 py-4 text-sm transition-all ${
                  m.role === "user"
                    ? "bg-slate-900 dark:bg-emerald-600 text-white dark:text-slate-950 rounded-br-sm shadow-md"
                    : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-bl-sm shadow-sm"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 dark:border-slate-800">
                  <span className="text-[11px] font-bold tracking-wide uppercase opacity-75">
                    {m.role === "user" ? "Attending Clinician" : "Prakriti Intelligence"}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">
                    {m.time}
                  </span>
                </div>

                {/* Message Content */}
                {m.role === "bot" ? (
                  m.text ? (
                    renderFormattedText(m.text)
                  ) : (
                    <div className="flex items-center gap-2 py-2 text-xs text-emerald-500 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Synthesizing medical literature & clinical evidence…</span>
                    </div>
                  )
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{m.text}</p>
                )}

                {/* Bot Message Footer Actions */}
                {m.role === "bot" && m.text && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        Evidence Grounded
                      </span>
                    </div>
                    <button
                      onClick={() => copyMessage(m.text, idx)}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1 border border-slate-300 dark:border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Bottom Anchor */}
          <div ref={bottomRef} className="h-6" />
        </div>

        {/* 🔹 BOTTOM FIXED INPUT CONSOLE */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Active Attachment Pill */}
            {attachedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                <FileText className="w-3.5 h-3.5" />
                <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Form Box */}
            <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 shadow-inner focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
              
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.csv,.json,.doc,.docx"
              />

              {/* File Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="pl-3.5 pr-2 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Attach medical document or lab report"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Main Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask clinical questions, dosage inquiries, or differential reasoning..."
                className="flex-1 bg-transparent py-3.5 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none leading-normal min-h-[48px] max-h-32"
              />

              {/* Microphone Voice Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isRecording
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title={isRecording ? "Stop voice recording" : "Dictate clinical query"}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="text-[11px] font-mono">{recordingSeconds}s</span>
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Submit Send Button */}
              <button
                type="button"
                onClick={() => executeSend(input)}
                disabled={!input.trim() || streaming}
                className="mr-2.5 p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition shadow-sm active:scale-95"
                title="Send query"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Safety Notice */}
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Prakriti AI provides clinical decision support. Always verify with patient records.</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px]">Return ↵ to send</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs">
        Initializing Prakriti Clinical Copilot…
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}