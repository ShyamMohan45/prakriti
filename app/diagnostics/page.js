"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  FileText,
  Scan,
  Layers,
  ExternalLink,
  CheckCircle2
} from "lucide-react"

export default function DiagnosticsGatePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleEnter = () => {
    if (loading) return
    if (!user) {
      router.push("/login")
    } else {
      router.push("/diagnostics/analyze")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 mb-8">
            <Activity className="w-3.5 h-3.5" />
            Clinical Decision Support System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto">
            Transform Clinical Data into{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Decisive Medical Clarity
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Most clinical decisions begin with fragmented narratives and cognitive pressure. Prakriti organizes clinical reasoning, cites peer-reviewed evidence, and surfaces risk priorities.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleEnter}
              disabled={loading}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{loading ? "Checking Session..." : "Launch Document Analysis"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => window.open("https://prakriti-gamma.vercel.app/", "_blank")}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-teal-500/40 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100/60 dark:hover:bg-teal-950/50 font-semibold text-base transition-all"
            >
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>Prakriti Ayurvedic Health Assessment</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-10 border-t border-slate-200 dark:border-slate-800 text-left">
            {[
              { title: "Privacy-First", desc: "Zero patient data resale or cross-training", icon: ShieldCheck },
              { title: "Evidence-Backed", desc: "Verbatim citations from WHO and CDC", icon: Layers },
              { title: "Clinician-Controlled", desc: "AI assists, medical professionals decide", icon: Stethoscope }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* Structured Reasoning Pathways */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            From Chaos to Signal
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            Structured Diagnostic Transformation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "Phase 1",
              title: "Clinical Symptoms",
              desc: "Disentangles complex patient narratives, chronological symptom onset, and reported severity indicators.",
              icon: Activity
            },
            {
              step: "Phase 2",
              title: "Contextual Correlation",
              desc: "Correlates findings against baseline vital indicators, past medical history, and longitudinal lab trends.",
              icon: FileText
            },
            {
              step: "Phase 3",
              title: "Evidence Synthesis",
              desc: "Delivers prioritized differential diagnosis with full traceability back to medical literature.",
              icon: CheckCircle2
            }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Clinical Diagnostic Modalities Showcase */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Multimodal Modalities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Engineered for Modern Clinical Ecosystems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lab Diagnostics */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg group">
              <div className="h-60 relative overflow-hidden">
                <img
                  src="/clinical_lab_diagnostics.jpg"
                  alt="Clinical Diagnostic Laboratory Automation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md inline-block mb-1">
                    Automated Lab Extraction
                  </span>
                  <h4 className="text-base font-bold">High-Throughput Analyzers & Biomarkers</h4>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Seamlessly parse chemistry panels, CBC counts, liver enzymes, and renal function markers with instant abnormal range flags.
                </p>
              </div>
            </div>

            {/* Radiology & Tomography */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg group">
              <div className="h-60 relative overflow-hidden">
                <img
                  src="/clinical_radiology_scan.jpg"
                  alt="Clinical Radiology MRI Reading Suite"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-md inline-block mb-1">
                    Diagnostic Imaging Corroboration
                  </span>
                  <h4 className="text-base font-bold">Multi-Monitor Tomography & Scans</h4>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Correlate radiologist narrative impressions from MRI, CT, and Ultrasound reports with longitudinal clinical notes and differential hypotheses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}