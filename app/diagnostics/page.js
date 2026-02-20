

"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function Home() {
  const root = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  const router = useRouter()
  const { user, loading } = useAuth()

  const handleEnterDxAssist = () => {
    if (loading) return

    if (!user) {
      router.push("/login")
    } else {
      router.push("/diagnostics/analyze")
    }
  }

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const move = (e) => {
      root.current?.style.setProperty("--cx", `${e.clientX}px`)
      root.current?.style.setProperty("--cy", `${e.clientY}px`)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <main
      ref={root}
      className="relative bg-[#f5f9ff] text-black overflow-hidden"
    >
    
      <div
        className="
          pointer-events-none fixed inset-0 z-10
          bg-[radial-gradient(600px_at_var(--cx)_var(--cy),rgba(37,99,235,0.12),transparent_70%)]
        "
      />

      {/* HERO */}
      <section className="min-h-screen flex items-center px-[14vw]">
        <div className="max-w-5xl">
          <p className="text-[11px] tracking-[0.45em] text-slate-500 mb-10">
            CLINICAL INTELLIGENCE SYSTEM
          </p>

          <h1 className="text-[7.5vw] leading-[0.95] font-extrabold text-slate-900">
            Medicine
            <br />
            requires
            <br />
            <span className="text-blue-600/70">clarity</span>
          </h1>

          <p className="mt-16 text-xl text-slate-600 max-w-2xl">
            Most clinical decisions begin with fragmented narratives,
            incomplete signals, and cognitive pressure.
          </p>

          <p className="mt-6 text-xl text-slate-600 max-w-2xl">
            DxAssist exists to reduce ambiguity —
            not by replacing clinicians,
            but by organizing medical reasoning.
          </p>
        </div>
      </section>

     
      <section className="min-h-screen px-[14vw] flex items-center">
        <div className="w-full">
          <p className="text-[11px] tracking-[0.45em] text-slate-500 mb-12">
            FROM CHAOS TO SIGNAL
          </p>

          <div className="space-y-20">
            <h2
              className="font-black uppercase leading-none text-slate-900"
              style={{
                fontSize: "9vw",
                transform: `translateX(${Math.min(scrollY * 0.08, 120)}px)`,
              }}
            >
              Symptoms
            </h2>

            <h2
              className="font-black uppercase leading-none text-slate-400"
              style={{
                fontSize: "9vw",
                transform: `translateX(${Math.max(-scrollY * 0.08, -120)}px)`,
              }}
            >
              Context
            </h2>

            <h2
              className="font-black uppercase leading-none text-slate-300"
              style={{
                fontSize: "9vw",
              }}
            >
              Evidence
            </h2>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen px-[14vw] flex items-center">
        <div className="grid grid-cols-12 w-full gap-y-20">
          <div className="col-span-4">
            <p className="text-[11px] tracking-[0.45em] text-slate-500 mb-6">
              REASONING LAYER
            </p>
            <h3 className="text-4xl font-semibold leading-snug text-slate-900">
              Explainable
              <br />
              medical intelligence
            </h3>
          </div>

          <div className="col-span-6 col-start-7 space-y-10 text-slate-600 text-lg">
            <p>
              DxAssist transforms narrative clinical notes into
              structured reasoning paths.
            </p>

            <p>
              Probabilities are derived from medical literature,
              guidelines, and contextual patient signals —
              never intuition alone.
            </p>

            <p>
              Every recommendation can be interrogated,
              traced, and understood.
            </p>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen px-[14vw] flex items-center bg-gradient-to-br from-white via-[#f8fafc] to-[#f0f4f9] relative overflow-hidden">
        
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl z-10">
          <p className="text-[11px] tracking-[0.45em] text-emerald-600 font-semibold mb-8 uppercase">
            Clinical Confidence & Decision Support
          </p>

          <h2 className="text-[4vw] leading-tight font-bold mb-8 text-slate-900">
            Decisions should feel
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              grounded — not rushed
            </span>
          </h2>

          <p className="mb-12 text-lg text-slate-600 leading-relaxed max-w-2xl">
            Transform unstructured clinical notes into structured diagnostic insights powered by evidence-backed AI reasoning. Every recommendation is traceable and explainable.
          </p>

      
          <div className="flex flex-col gap-6 mb-16">
            <div className="relative inline-block group w-fit">
           
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:blur-2xl" />
              
              
              <button
                onClick={handleEnterDxAssist}
                disabled={loading}
                className="
                  relative px-10 py-4 rounded-lg font-bold text-lg
                  bg-gradient-to-r from-emerald-500 to-cyan-500
                  text-white
                  shadow-lg shadow-emerald-500/40
                  hover:shadow-emerald-500/60
                  hover:scale-[1.05]
                  active:scale-95
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  uppercase tracking-wide
                  flex items-center gap-3
                "
              >
                <span className="text-xl">✨</span>
                {loading ? "Checking session…" : "Enter DxAssist Now"}
                <span className="text-xl">→</span>
              </button>
            </div>

        
             <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-slate-600 font-medium mb-4">
                Alternatively, diagnose skin conditions by uploading an image:
              </p>
              
              <div className="relative inline-block group w-fit">
                
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
                
               
                <button
                  className="
                    relative px-8 py-3 rounded-lg font-semibold text-base
                    bg-white border-2 border-teal-500
                    text-teal-600
                    hover:bg-teal-50
                    hover:scale-[1.03]
                    active:scale-95
                    transition-all duration-300
                    uppercase tracking-wide
                    flex items-center gap-2
                  "
                  onClick={() => window.open("https://prakriti-gamma.vercel.app/", "_blank")}
                >
                  <span>🖼️</span>
                  Prakriti Analysis
                  <span>→</span>
                </button>
              </div>
            </div>
          </div> 
          

         
          <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-200">
            {[
              { icon: "🔒", title: "Privacy-First", desc: "Zero data resale" },
              { icon: "📚", title: "Evidence-Backed", desc: "RAG technology" },
              { icon: "✓", title: "Clinician-Trusted", desc: "AI assists, humans decide" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-slate-600 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <footer className="py-28 text-center text-xs text-slate-500">
        DxAssist supports clinical decision-making.
        <br />
        It does not replace professional medical judgment.
      </footer>
    </main>
  )
}