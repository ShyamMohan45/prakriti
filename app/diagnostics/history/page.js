"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import SeverityCard from "../analyze/SeverityCard"
import { BACKEND_URL } from "@/lib/backendUrl"
import {
  Clock,
  Search,
  FileText,
  Calendar,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Stethoscope
} from "lucide-react"

export default function PastAnalysesPage() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false)
      return
    }

    fetch(`${BACKEND_URL}/analyses`, {
      credentials: "include",
      headers: {
        "x-user-id": user.id.toString(),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setAnalyses(json.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching analyses:", err)
        setLoading(false)
      })
  }, [user])

  const filteredAnalyses = analyses.filter((a) => {
    const term = searchTerm.toLowerCase()
    const matchSummary = a.summary?.toLowerCase().includes(term)
    const matchConditions = a.conditions?.some((c) =>
      c.name?.toLowerCase().includes(term)
    )
    return matchSummary || matchConditions
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                href="/diagnostics/analyze"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 mb-2 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Analysis Workspace
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Patient Diagnostic Records History
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Auditable longitudinal timeline of previously uploaded clinical notes and AI evaluations
              </p>
            </div>

            <Link
              href="/diagnostics/analyze"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Analysis
            </Link>
          </div>

          {/* Search Filter */}
          {user && analyses.length > 0 && (
            <div className="mt-6 relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by diagnosis, finding, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Loading patient historical records...</p>
          </div>
        )}

        {/* Not Signed in */}
        {!loading && !user && (
          <div className="p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Please sign in to access your confidential diagnostic records and past AI findings.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-md"
            >
              Sign In to DxAssist
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!loading && user && analyses.length === 0 && (
          <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No Previous Records Found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              You have not analyzed any medical documents yet. Upload a PDF clinical note to start building your record history.
            </p>
            <Link
              href="/diagnostics/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze First Document
            </Link>
          </div>
        )}

        {/* Timeline of Records */}
        {!loading && user && analyses.length > 0 && (
          <div className="space-y-8">
            {filteredAnalyses.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">
                No analyses match your search criteria.
              </p>
            ) : (
              filteredAnalyses.map((item) => (
                <div
                  key={item.id}
                  className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{new Date(item.created_at).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 w-fit">
                      Record #{item.id}
                    </span>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Clinical Executive Summary
                    </h3>
                    <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Conditions */}
                  {Array.isArray(item.conditions) && item.conditions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Clinical Prioritization
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {item.conditions.map((c, idx) => (
                          <SeverityCard key={idx} condition={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence Citations */}
                  {Array.isArray(item.evidence) && item.evidence.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Referenced Clinical Evidence
                      </h4>
                      <div className="space-y-2">
                        {item.evidence.map((ev, idx) => (
                          <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 italic pl-3 border-l-2 border-emerald-400">
                            "{ev}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
