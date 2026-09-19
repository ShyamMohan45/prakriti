"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl
                 border border-slate-200/80 dark:border-slate-800
                 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
                 text-slate-600 dark:text-slate-300
                 hover:text-emerald-600 dark:hover:text-emerald-400
                 hover:border-emerald-400/40 dark:hover:border-emerald-500/40
                 shadow-sm hover:shadow transition-all duration-300 active:scale-95"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  )
}
