"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileSearch,
  Mic,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  BrainCircuit,
  Stethoscope,
  Sparkles,
  Lock,
  Globe2,
  TrendingUp,
  Star,
  Layers,
  BookOpen,
  AlertTriangle,
  FileCheck,
  Zap,
  Users,
  Eye,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Leaf,
  Utensils,
  HeartPulse
} from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/50">
        
        {/* Subtle Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Next-Generation Healthcare Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Transform Clinical Data Into{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Actionable Intelligence
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Prakriti helps healthcare professionals understand clinical information faster with AI-assisted summarization, analysis and intelligent insights.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/diagnostics/analyze"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-sm transition active:scale-[0.98]"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Clinical Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://prakriti-gamma.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-sm shadow-sm transition active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Take Health Assessment</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition active:scale-[0.98]"
                >
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Clinician Oversight
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Evidence Grounded
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Encrypted & Isolated
                </span>
              </div>
            </div>

            {/* Right: Realistic 2D Clinical AI Interface Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all">
                
                {/* Mockup Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Patient: John Doe</p>
                      <p className="text-[11px] text-slate-500">Age: 52 · Male · MRN: #PR-8821</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      AI Confidence: 94%
                    </span>
                  </div>
                </div>

                {/* Mockup Tabs */}
                <div className="px-6 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`pb-2.5 border-b-2 transition ${
                      activeTab === "summary"
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Clinical Summary
                  </button>
                  <button
                    onClick={() => setActiveTab("findings")}
                    className={`pb-2.5 border-b-2 transition ${
                      activeTab === "findings"
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Key Findings
                  </button>
                  <button
                    onClick={() => setActiveTab("insights")}
                    className={`pb-2.5 border-b-2 transition ${
                      activeTab === "insights"
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    AI Insights
                  </button>
                </div>

                {/* Mockup Content */}
                <div className="p-6 space-y-4">
                  {activeTab === "summary" && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Patient presents with progressive exertional dyspnea, bilateral lower-extremity edema, and elevated BNP levels. Findings point toward decompensated congestive heart failure with secondary renal hypoperfusion.
                      </p>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        <span className="font-semibold text-slate-900 dark:text-white block">Admitting Symptoms:</span>
                        <p>Orthopnea (2 pillows), nocturnal cough, 4kg fluid weight gain over 10 days.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "findings" && (
                    <div className="space-y-2.5">
                      {[
                        "Serum BNP elevated to 840 pg/mL (Normal &lt; 100 pg/mL)",
                        "Transthoracic Echocardiogram: LVEF reduced to 38%",
                        "Serum Creatinine elevated to 1.8 mg/dL (Baseline 1.1 mg/dL)",
                        "Chest X-Ray: Bilateral interstitial infiltrates with Kerley B lines"
                      ].map((finding, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span dangerouslySetInnerHTML={{ __html: finding }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "insights" && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Primary Hypothesis</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">High Priority</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Acute Decompensated Heart Failure (HFrEF)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Recommend intravenous loop diuretics and echocardiography correlation.</p>
                      </div>
                    </div>
                  )}

                  {/* AI Disclaimer Line */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      AI-generated — requires clinical review
                    </span>
                    <span className="font-mono">WHO / CDC Validated</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= 2. TRUST SECTION ================= */}
      <section className="py-12 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "AI-Assisted", desc: "Augments medical workflows without replacing physician intuition" },
              { label: "Clinician-Focused", desc: "Designed around standard diagnostic reasoning paths" },
              { label: "Secure & Private", desc: "Account-level isolation and confidential clinical processing" },
              { label: "Human-in-the-Loop", desc: "Physicians maintain final authority on every diagnostic record" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{item.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= 3. FEATURES MATRIX ================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Engineered for Modern Clinical Workflows
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Every feature in Prakriti is designed to turn complex, scattered medical documentation into structured clinical clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Clinical Note Summarization",
              desc: "Quickly synthesize dense admission notes, lab reports, and discharge summaries into standardized clinical briefs.",
              icon: FileText,
            },
            {
              title: "AI-Assisted Analysis",
              desc: "Extract relevant biomarkers, abnormal laboratory findings, and diagnostic signals in seconds.",
              icon: BrainCircuit,
            },
            {
              title: "Hypothesis Generation",
              desc: "Formulate differential diagnostic hypotheses stratified by severity, accompanied by line-by-line evidence references.",
              icon: Activity,
            },
            {
              title: "Patient Records",
              desc: "Maintain a clear longitudinal timeline of previous analyses to observe patient trajectories over time.",
              icon: Users,
            },
            {
              title: "Document Intelligence",
              desc: "Direct multi-page PDF ingestion with automated text extraction and biomedical entity recognition.",
              icon: FileCheck,
            },
            {
              title: "AI Assistant",
              desc: "Engage in conversational clinical dialogue to query contraindications, guidelines, and diagnostic criteria in real time.",
              icon: Sparkles,
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Explore capability</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )
          })}
        </div>
      </section>


      {/* ================= DIET ACCORDING TO BODY / CLINICAL STATE ================= */}
      <section id="diet-by-body" className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-emerald-500/5 to-slate-50 dark:from-[#090d16] dark:via-emerald-950/20 dark:to-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
              <Leaf className="w-3.5 h-3.5" />
              <span>Personalized Nutrition & Body Constitution</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Diet According to Body State
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
              Select the clinical pathway that best reflects your current body state. Prakriti dynamically aligns evidence-based dietary recommendations, bio-available recipes, and targeted nutrition to support optimal recovery and vitality.
            </p>
          </div>

          {/* Interactive Ayurvedic Health Assessment Callout Banner */}
          <div className="mb-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl relative overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 h-72 lg:h-full relative overflow-hidden group">
              <img
                src="/ayurvedic_herbal_wellness.jpg"
                alt="Ayurvedic Botanical Specialist preparing herbs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[260px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-slate-900/60 dark:to-slate-900/90 hidden lg:block" />
            </div>

            <div className="lg:col-span-7 p-8 sm:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Interactive Assessment</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Discover Your Prakriti & Ayurvedic Health Profile
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Take the official Ayurvedic questionnaire to determine your unique dosha constitution (Vata, Pitta, or Kapha). Get an instant, evidence-grounded wellness assessment tailored to your body&apos;s individual metabolic tendencies.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free & Open</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Results</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Personalized Dosha Guidance</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://prakriti-gamma.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-98 transition-all duration-200"
                >
                  <span>Take Health Assessment</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>

          {/* 3 Core Body State Gateways */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Pathway 1: Feel Healthy */}
            <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Asymptomatic · Preventive
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Baseline Monitoring
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                  Optimal Balance · Feel Good Nutrition
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Routine preventive health analysis and energizing nutrition designed for active metabolism, digestion efficiency, and sustained cellular vitality.
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Recommended Recipes:</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span><strong>Sprouted Moong</strong> — High Protein, No Cooking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span><strong>Vegetable Salad</strong> — Light & High Fiber</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span><strong>Lemon Juice</strong> — Hydration & Vitamin C</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/feel-healthy"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-98"
              >
                <span>Explore Baseline Diet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pathway 2: Feel Concise */}
            <div className="group rounded-3xl border border-teal-500/30 dark:border-teal-500/30 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-teal-500/60 transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-teal-500 to-emerald-500 text-slate-950 font-bold text-[10px] rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    Early Indicators · Targeted Care
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Symptom Evaluation
                </h3>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-3">
                  Nutrient Replenishment · Feel Concise
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Context-aware nutritional intervention for early fatigue, digestive sensitivity, or emerging symptoms requiring easily absorbable micronutrients.
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Recommended Recipes:</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span><strong>Vegetable Millet Khichdi</strong> — Easy Digestion, Low GI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span><strong>Palak Dal</strong> — Iron Rich & Plant Protein</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span><strong>Pomegranate Juice</strong> — Blood Building Antioxidant</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/feel-concise"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all active:scale-98"
              >
                <span>Explore Targeted Diet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pathway 3: Serious Disease */}
            <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    High-Risk · Ongoing Care
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Advanced Investigation
                </h3>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-3">
                  Therapeutic Diet · Organ Support
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Soothing, restorative dietary support designed to minimize gastrointestinal strain, decrease systemic inflammation, and support ongoing medical treatment.
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Recommended Recipes:</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span><strong>Vegetable Khichdi</strong> — Therapeutic & Gentle</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span><strong>Healing Fruits</strong> — Bio-Available Micronutrients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span><strong>Herbal Teas</strong> — Anti-Inflammatory & Soothing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/feel-concern_about_serious_disease"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <span>Explore Therapeutic Diet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Visual Showcase: All 9 Clinical Recipes with Images */}
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Evidence-Grounded Clinical Recipe Collection
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Carefully tailored nutritional recipes for each body condition
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  9 Verified Recipes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Sprouted Moong Salad",
                  category: "Feel Good · Baseline",
                  diet: "High Protein",
                  img: "/SproutedMoong.jpg",
                  href: "/Recipesoffeelgood/sproutedmoong"
                },
                {
                  title: "Fresh Vegetable Salad",
                  category: "Feel Good · Baseline",
                  diet: "Light & High Fiber",
                  img: "/vegetable-salad.jpg",
                  href: "/Recipesoffeelgood/vegetablesalad"
                },
                {
                  title: "Cleansing Lemon Juice",
                  category: "Feel Good · Baseline",
                  diet: "Hydration & Vitamin C",
                  img: "/lemon_juice.jpg",
                  href: "/Recipesoffeelgood/lemonjuice"
                },
                {
                  title: "Vegetable Millet Khichdi",
                  category: "Feel Concise · Targeted",
                  diet: "Low GI & Gluten Free",
                  img: "/Vegetable-Millet-Khichdi.jpg",
                  href: "/Recipeoffeelingconcise/milletkhichdi"
                },
                {
                  title: "Palak Dal",
                  category: "Feel Concise · Targeted",
                  diet: "Iron Rich & Protein",
                  img: "/palak-dal.jpg",
                  href: "/Recipeoffeelingconcise/palakdal"
                },
                {
                  title: "Pomegranate Juice",
                  category: "Feel Concise · Targeted",
                  diet: "Antioxidant & Blood Builder",
                  img: "/pomegrante_juice.jpg",
                  href: "/Recipeoffeelingconcise/pomegrante"
                },
                {
                  title: "Therapeutic Vegetable Khichdi",
                  category: "Disease Care · Therapeutic",
                  diet: "Healing & Organ Support",
                  img: "/vegetablekhichdi.jpg",
                  href: "/Recipefordisease/vegetablekhichdi"
                },
                {
                  title: "Restorative Fruits",
                  category: "Disease Care · Therapeutic",
                  diet: "Gentle Micronutrients",
                  img: "/fruits.jpg",
                  href: "/Recipefordisease/fruits"
                },
                {
                  title: "Medicinal Herbal Teas",
                  category: "Disease Care · Therapeutic",
                  diet: "Anti-Inflammatory",
                  img: "/herbalteas.jpg",
                  href: "/Recipefordisease/herbalteas"
                }
              ].map((recipe, idx) => (
                <Link
                  key={idx}
                  href={recipe.href}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={recipe.img}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/75 backdrop-blur-md text-emerald-400 border border-white/10">
                        {recipe.diet}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        {recipe.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                        {recipe.title}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/40 transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* ================= 4. HOW IT WORKS (WORKFLOW TIMELINE) ================= */}
      <section className="py-24 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
              From Raw Documents to Diagnostic Clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Ingest PDF clinical notes, lab reports, or patient histories via drag-and-drop.",
              },
              {
                step: "02",
                title: "Analyze",
                desc: "Prakriti extracts entities, laboratory values, and cross-references authoritative medical guidelines.",
              },
              {
                step: "03",
                title: "Review",
                desc: "Inspect stratified condition priorities, risk indicators, and verbatim source quotations.",
              },
              {
                step: "04",
                title: "Act",
                desc: "Use evidence-grounded insights to inform care decisions, follow-up tests, or clinical discussions.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative space-y-3"
              >
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  STEP // {step.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= 5. PRODUCT PREVIEW ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Platform Interface
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            An Interface Designed for Focus & Speed
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Clean typography, structured clinical sections, and instant access to patient histories.
          </p>
        </div>

        {/* Real-World Clinical Setting Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl group">
            <img
              src="/clinical_doctor_ai.jpg"
              alt="Physician using clinical diagnostic AI in hospital"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-md inline-block mb-1.5 shadow-sm">
                  Point-of-Care Deployment
                </span>
                <h4 className="text-lg font-bold">Empowering Clinicians at Bedside</h4>
                <p className="text-xs text-slate-300">Synchronized with patient charts and diagnostic decision workflows</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">99.4% Precision</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Real-World Clinical Workflow</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for Hospitals, Clinics & Diagnostic Centers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Medical environments demand immediate, verifiable evidence. Prakriti fits seamlessly into clinician daily rounds, streamlining documentation review while preserving human diagnostic control.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <img src="/clinical_ai_bot.jpg" alt="Bot" className="w-11 h-11 rounded-xl object-cover border border-emerald-500/30 shrink-0 shadow-sm" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Conversational Clinical Copilot</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Instant voice & text reasoning on patient symptoms, contraindications, and ACC/AHA guidelines.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Ayurvedic Constitution & Targeted Diet</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Grounded nutrition protocols tailored directly to the patient's biological condition and dosha profile.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dashboard Showcase Frame */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clinical Analysis Workspace</h3>
              <p className="text-xs text-slate-500">Live multi-stage analysis pipeline</p>
            </div>
            <Link
              href="/diagnostics/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
            >
              Open Live Workspace <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">01 Document Ingestion</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Sample_Nephrology_Panel.pdf</p>
              <p className="text-xs text-slate-500">Extracted 2,400 tokens · 12 clinical lab indicators</p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-2">
              <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">02 Analysis Status</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Completed in 1.8s</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">2 differential conditions identified</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">03 Clinical Review</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Ready for Physician Review</p>
              <p className="text-xs text-slate-500">Verified against WHO & KDIGO guidelines</p>
            </div>
          </div>

        </div>
      </section>


      {/* ================= 6. SECURITY & TRUST ================= */}
      <section id="security" className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl group">
              <img
                src="/doctor_patient_consultation.jpg"
                alt="Physician and Patient Clinical Consultation"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-md inline-block mb-1 shadow-sm">
                  Human-in-the-Loop
                </span>
                <h4 className="text-lg font-bold">Strengthening the Clinician-Patient Bond</h4>
                <p className="text-xs text-slate-300">Prakriti handles cognitive documentation burden so clinicians can focus on human care.</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Responsible AI & Governance
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
                  Built on Trust, Privacy, and Human Oversight
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                  Healthcare data requires uncompromising security. Prakriti is architected with strict tenant data isolation, zero commercial data resale, and human-in-the-loop validation principles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Tenant Isolation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Records are stored per user identifier with no cross-tenant model training.</p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Auditable Reasoning</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Every condition extracted includes verbatim quotations from the original document.</p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Clinician Authority</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">AI provides assistive suggestions; clinical diagnosis remains with the licensed physician.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= 7. FINAL CTA ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Bring intelligence into your clinical workflow.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Start analyzing medical notes, lab panels, and discharge summaries with evidence-grounded AI.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              Get Started
            </Link>
            <Link
              href="/diagnostics/analyze"
              className="px-8 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition"
            >
              Try Document Analysis
            </Link>
          </div>
        </div>
      </section>


      {/* ================= 8. FOOTER ================= */}
      <footer id="about" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-600 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  PRAKRITI
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Modern clinical intelligence and document analysis platform for healthcare practitioners. Evidence-grounded and clinician-supervised.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">Overview</Link></li>
                <li><Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">Workspace</Link></li>
                <li><Link href="/patients" className="hover:text-slate-900 dark:hover:text-white transition">Patients</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">Clinical AI</h4>
              <ul className="space-y-2">
                <li><Link href="/diagnostics/analyze" className="hover:text-slate-900 dark:hover:text-white transition">Document Analysis</Link></li>
                <li><Link href="/history" className="hover:text-slate-900 dark:hover:text-white transition">Voice Consultation</Link></li>
                <li><Link href="/chat" className="hover:text-slate-900 dark:hover:text-white transition">AI Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">Security & Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#security" className="hover:text-slate-900 dark:hover:text-white transition">Data Isolation</Link></li>
                <li><Link href="#security" className="hover:text-slate-900 dark:hover:text-white transition">Governance</Link></li>
                <li><Link href="#about" className="hover:text-slate-900 dark:hover:text-white transition">Clinical Disclaimer</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© {new Date().getFullYear()} Prakriti Healthcare AI. All rights reserved.</p>
            <p className="text-[11px]">Designed for clinical decision support. Not a substitute for professional medical judgment.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}