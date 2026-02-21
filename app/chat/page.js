

"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  const initialQuery = searchParams.get("q") || ""
  const [input, setInput] = useState(initialQuery)
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)

  const bottomRef = useRef(null)


  useEffect(() => {
    if (initialQuery && user && messages.length === 0) {
      sendMessage()
    }
  
  }, [initialQuery, user])

  
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || streaming) return

    const userMessage = input
    setInput("")
    setStreaming(true)

    setMessages((prev) => [...prev, { role: "user", text: userMessage }])

    let botText = ""
    setMessages((prev) => [...prev, { role: "bot", text: "" }])

    try {
      const res = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        botText += chunk

        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: "bot", text: botText }
          return copy
        })
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to AI service." },
      ])
    } finally {
      setStreaming(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white px-[10vw] pt-24">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">
        🩺 Clinical Assistant
      </h1>

      
      <div className="space-y-6 pb-48">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                m.role === "user"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-black rounded-br-sm"
                  : "bg-white/10 text-white border border-white/10 rounded-bl-sm"
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-70">
                {m.role === "user" ? "You" : "DxAssist"}
              </div>
              {m.text}
            </div>
          </div>
        ))}

        {/* 🔧 FIX: scroll anchor spacing */}
        <div ref={bottomRef} className="h-24" />
      </div>

      {/* INPUT */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent px-[10vw] py-6 backdrop-blur-xl">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a clinical question…"
            className="
              w-full bg-white/5 border border-white/10
              rounded-2xl px-6 py-4 text-base text-white
              placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-teal-400
              shadow-xl
            "
          />
          {streaming && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-teal-400 animate-pulse">
              Thinking…
            </span>
          )}
        </div>
      </div>
    </main>
  )
}