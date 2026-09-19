
"use client"

import { useEffect, useState } from "react"

export default function Chatbot({ initialQuery }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (initialQuery) {
      setMessages([
        { role: "user", text: initialQuery },
        { role: "bot", text: "Preparing clinical response…" },
      ])
    }
  }, [initialQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-[10vw] py-24">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">
        🩺 Clinical Assistant
      </h2>

      <div className="backdrop-blur-xl bg-white/70 border border-slate-200 rounded-2xl p-8 space-y-5 shadow-2xl">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                m.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm"
                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
              }`}
            >
              <span className="block text-xs font-semibold mb-1 opacity-70">
                {m.role === "user" ? "Clinician" : "Prakriti AI"}
              </span>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}