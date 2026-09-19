"use client"

import { AlertTriangle, AlertCircle, CheckCircle2, Activity } from "lucide-react"

export default function SeverityCard({ condition }) {
  const severity = condition.severity || "Low"

  const config = {
    High: {
      border: "border-rose-300 dark:border-rose-900/60 hover:border-rose-500",
      bg: "bg-rose-50/70 dark:bg-rose-950/20",
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      icon: AlertTriangle,
      iconColor: "text-rose-500",
    },
    Medium: {
      border: "border-amber-300 dark:border-amber-900/60 hover:border-amber-500",
      bg: "bg-amber-50/70 dark:bg-amber-950/20",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
      iconColor: "text-amber-500",
    },
    Low: {
      border: "border-emerald-300 dark:border-emerald-900/60 hover:border-emerald-500",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
    },
  }[severity] || {
    border: "border-slate-300 dark:border-slate-800",
    bg: "bg-slate-50 dark:bg-slate-900/40",
    badge: "bg-slate-100 text-slate-700",
    icon: Activity,
    iconColor: "text-slate-500",
  }

  const IconComponent = config.icon

  return (
    <div
      className={`relative p-6 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <IconComponent className={`w-5 h-5 ${config.iconColor} shrink-0`} />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
              {condition.name}
            </h4>
          </div>

          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badge} shrink-0`}
          >
            {severity} Risk
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
          {condition.justification}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 pl-7 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Clinical finding</span>
        <span>Auditable</span>
      </div>
    </div>
  )
}
