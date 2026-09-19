"use client"

import * as React from "react"

export function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = "",
  id,
  ...props
}) {
  const inputId = id || React.useId()

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
        )}
        <input
          id={inputId}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 rounded-xl border ${
            error
              ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
          } bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-950 ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  )
}
