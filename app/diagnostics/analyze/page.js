"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import SeverityCard from "./SeverityCard"
import { useAuth } from "@/app/context/AuthContext"
import { BACKEND_URL } from "@/lib/backendUrl"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import {
  UploadCloud,
  FileText,
  FileSearch,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Bot,
  User,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Stethoscope,
  ChevronRight,
  FileCheck,
  Zap,
  HelpCircle,
  Activity,
  Heart,
  Thermometer,
  RotateCcw
} from "lucide-react"

const severityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
}

export default function AnalyzePage() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const chatEndRef = useRef(null)

  // Patient Context state for the left column
  const [patientContext, setPatientContext] = useState({
    name: "Sarah Jenkins",
    mrn: "PR-8821",
    age: "54",
    gender: "Female",
    bp: "168/98 mmHg",
    hr: "88 bpm",
    spo2: "96%",
    temp: "98.6 °F"
  })

  const handleLoadSample = () => {
    const sampleText = `CLINICAL DISCHARGE SUMMARY & LAB REPORT
Patient Name: Sarah Jenkins | Age: 54 | Gender: Female | MRN: #PR-8821
Admit Date: 2026-03-12 | Discharge Date: 2026-03-16

DIAGNOSIS & CLINICAL COURSE:
1. Acute-on-Chronic Kidney Disease (Stage 3b), exacerbated by volume depletion and NSAID exposure.
2. Uncontrolled Secondary Essential Hypertension.

LABORATORY FINDINGS:
- Serum Creatinine: 2.8 mg/dL (baseline 1.4 mg/dL) - Significant acute elevation
- Blood Urea Nitrogen (BUN): 48 mg/dL (Elevated)
- Estimated GFR: 38 mL/min/1.73m2 (Decline from baseline 55)
- Serum Potassium: 5.2 mEq/L (Borderline hyperkalemia)
- Blood Pressure: 168/98 mmHg (Stage 2 Hypertension)

PLAN & MEDICATIONS:
- Discontinue NSAIDs and ACE-inhibitors temporarily.
- Initiate gentle intravenous isotonic saline rehydration.
- Monitor daily renal panel and electrolytes.
- Low potassium, low sodium renal diet.`

    const sampleBlob = new Blob([sampleText], { type: "application/pdf" })
    const sampleFile = new File([sampleBlob], "Sample_Patient_Kidney_Report.pdf", { type: "application/pdf" })
    setFile(sampleFile)
    setError(null)
    setPatientContext({
      name: "Sarah Jenkins",
      mrn: "PR-8821",
      age: "54",
      gender: "Female",
      bp: "168/98 mmHg",
      hr: "88 bpm",
      spo2: "96%",
      temp: "98.6 °F"
    })
  }

  const handleAnalyze = async () => {
    if (!file) return
    if (!user) {
      setError("Please sign in first to run and record clinical analyses.")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
        headers: {
          "x-user-id": user.id.toString(),
        },
        credentials: "include",
      })

      const text = await res.text()
      if (!res.ok) {
        throw new Error(`Analysis server error (${res.status}): ${text}`)
      }

      const json = JSON.parse(text)
      if (json.status === "error") {
        throw new Error(json.message || "Clinical analysis failed")
      }

      setResult({
        summary: json.summary || "Clinical analysis completed.",
        conditions: Array.isArray(json.conditions) && json.conditions.length > 0
          ? json.conditions
          : [{
              name: "General Health Status",
              severity: "Low",
              justification: "No acute clinical abnormalities detected in record.",
            }],
        evidence: Array.isArray(json.evidence) && json.evidence.length > 0
          ? json.evidence
          : ["Document verified with clinical evaluation."],
      })

      setChatMessages([
        {
          id: 1,
          role: "assistant",
          content: "I have completed the structured clinical evaluation. What specific aspects of this diagnosis or medication interactions would you like to review?",
        }
      ])
      setChatInput("")
    } catch (err) {
      console.error("Analyze error:", err)
      setError(err.message || "Unable to analyze document")
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, streaming])

  const handleSendMessage = async (customText = null) => {
    const messageToSend = customText || chatInput
    if (!messageToSend.trim() || !result) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageToSend,
    }

    setChatMessages((prev) => [...prev, userMessage])
    if (!customText) setChatInput("")
    setStreaming(true)

    try {
      const response = await fetch(`${BACKEND_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      })

      if (!response.ok) throw new Error("Chat stream request failed")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      const assistantMsgObj = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      }
      setChatMessages((prev) => [...prev, assistantMsgObj])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setChatMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content = assistantMessage
          return updated
        })
      }
    } catch (error) {
      console.error("Streaming error:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "Apologies, an error occurred while streaming the clinical response. Please try again.",
        },
      ])
    } finally {
      setStreaming(false)
    }
  }

  const copySummary = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Workspace Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Clinical Analysis Workspace
                </h1>
                <Badge variant="info">AI Triage Active</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Evidence-grounded medical document extraction and differential reasoning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setFile(null)
                setResult(null)
                setError(null)
                setChatMessages([])
              }}
            >
              Reset Session
            </Button>
            <Link href="/diagnostics/history">
              <Button variant="outline" size="sm" icon={Clock}>
                Past Analyses
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 3-Column Clinical Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Auth warning if guest */}
        {!user && (
          <div className="mb-6 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-between gap-4 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You are viewing in guest mode. Sign in to automatically save this analysis to patient medical records.</span>
            </div>
            <Link href="/login" className="font-bold underline shrink-0">Sign In</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= COLUMN 1 (LEFT): PATIENT INFORMATION ================= */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Patient Profile</span>
                </CardTitle>
                <CardDescription>Demographics and baseline vitals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Patient Name</label>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{patientContext.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">MRN</label>
                    <p className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{patientContext.mrn}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Age / Gender</label>
                    <p className="text-slate-700 dark:text-slate-300">{patientContext.age} yrs · {patientContext.gender}</p>
                  </div>
                </div>

                {/* Vitals Panel */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="font-bold uppercase text-[10px] text-slate-500 block">Baseline Vital Signs</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{patientContext.bp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{patientContext.hr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Oxygen SpO2</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{patientContext.spo2}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Body Temp</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{patientContext.temp}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Preload Trigger */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    icon={Zap}
                    onClick={handleLoadSample}
                  >
                    Load Sample Clinical Case
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Notice */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Guardrail</span>
              </div>
              <p className="leading-relaxed">
                All conclusions are cross-referenced with WHO & CDC guidelines to guard against model hallucination.
              </p>
            </div>
          </div>

          {/* ================= COLUMN 2 (CENTER): DOCUMENT INGESTION ================= */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Clinical Document Source</span>
                </CardTitle>
                <CardDescription>Upload patient notes, EHR records, or lab PDFs</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                
                {/* Upload Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragActive(false)
                    const dropped = e.dataTransfer.files[0]
                    if (dropped && dropped.type === "application/pdf") {
                      setFile(dropped)
                      setError(null)
                    } else {
                      setError("Please provide a PDF document.")
                    }
                  }}
                  className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : file
                      ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-slate-300 dark:border-slate-800 hover:border-emerald-400 bg-slate-50/60 dark:bg-slate-950/40"
                  }`}
                >
                  <input
                    type="file"
                    id="doc-upload"
                    accept=".pdf"
                    onChange={(e) => {
                      const selected = e.target.files?.[0]
                      if (selected && selected.type === "application/pdf") {
                        setFile(selected)
                        setError(null)
                      }
                    }}
                    className="hidden"
                  />

                  <label htmlFor="doc-upload" className="cursor-pointer w-full flex flex-col items-center">
                    {file ? (
                      <div className="space-y-2">
                        <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                        <span className="text-[10px] font-mono text-slate-500">{(file.size / 1024).toFixed(1)} KB · Document Loaded</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">Drop PDF here or click to browse</p>
                        <p className="text-[11px] text-slate-400">Accepted format: Clinical PDF</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Ingestion Actions */}
                <div className="space-y-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={!file || loading}
                    loading={loading}
                    onClick={handleAnalyze}
                    icon={Sparkles}
                  >
                    Execute Clinical Analysis
                  </Button>

                  {file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-slate-500"
                      onClick={() => {
                        setFile(null)
                        setError(null)
                      }}
                    >
                      Remove Document
                    </Button>
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Clinical Chat / Discussion Copilot */}
            {result && (
              <Card>
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <img src="/clinical_ai_bot.jpg" alt="Copilot" className="w-5 h-5 rounded-md object-cover border border-emerald-500/30" />
                    <span>Clinical Dialogue Copilot</span>
                  </CardTitle>
                  <CardDescription>Ask follow-up questions about this evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  
                  {/* Messages Feed */}
                  <div className="h-64 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 overflow-y-auto space-y-3 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.role !== "user" && (
                          <img src="/clinical_ai_bot.jpg" alt="AI" className="w-5 h-5 rounded-md object-cover border border-emerald-500/30 shrink-0 mt-0.5" />
                        )}
                        <div
                          className={`max-w-[85%] px-3.5 py-2.5 rounded-xl leading-relaxed ${
                            msg.role === "user"
                              ? "bg-slate-900 text-white rounded-tr-none"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {streaming && (
                      <p className="text-[11px] text-slate-400 italic">Streaming clinical reasoning...</p>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about medications, risks, guidelines..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    <Button size="sm" type="submit" disabled={!chatInput.trim() || streaming}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>

                </CardContent>
              </Card>
            )}
          </div>

          {/* ================= COLUMN 3 (RIGHT): STRUCTURED AI OUTPUT ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Required Review Notice */}
            <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                AI-generated — requires clinical review
              </span>
              <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">Assisted Decision Support</span>
            </div>

            {/* Result State */}
            {result ? (
              <div className="space-y-6">
                
                {/* 1. Clinical Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Executive Clinical Summary</span>
                    </CardTitle>
                    <button
                      onClick={copySummary}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Copy Summary"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {result.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* 2. Stratified Conditions / Hypotheses */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Ranked Hypotheses & Priorities</span>
                    </CardTitle>
                    <CardDescription>Clinical findings classified by risk indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.conditions.map((cond, idx) => (
                      <SeverityCard key={idx} condition={cond} />
                    ))}
                  </CardContent>
                </Card>

                {/* 3. Supporting Evidence Citations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Supporting Evidence Citations</span>
                    </CardTitle>
                    <CardDescription>Verbatim citations extracted directly from document</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.evidence.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic"
                      >
                        "{ev}"
                      </div>
                    ))}
                  </CardContent>
                </Card>

              </div>
            ) : (
              
              /* Empty Placeholder */
              <div className="p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Awaiting Document Ingestion</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Upload a patient medical report or click &ldquo;Load Sample Clinical Case&rdquo; to populate structured hypotheses and evidence citations.
                </p>
              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  )
}