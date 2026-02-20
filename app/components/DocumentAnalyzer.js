"use client"

import { useState, useRef, useEffect } from "react"

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setAnalysis(null)
      setChatMessages([])
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a PDF file")
      return
    }

    setAnalyzing(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setAnalysis(result)
      setChatMessages([
        {
          id: 1,
          role: "assistant",
          content: `Analysis Complete!\n\nSummary: ${result.summary}\n\nConditions Identified: ${result.conditions?.join(", ") || "None"}`,
        },
      ])
    } catch (error) {
      alert("Error analyzing document: " + error.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !analysis) return

    const userMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: chatInput,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setStreaming(true)

    try {
      const response = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      })

      if (!response.ok) throw new Error("Chat failed")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      const assistantMsgObj = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: "",
      }
      setChatMessages((prev) => [...prev, assistantMsgObj])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        assistantMessage += text

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
          id: chatMessages.length + 1,
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ])
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Clinical Document Analysis
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <span className="text-4xl mb-2">📄</span>
                    <span className="text-sm text-slate-600">
                      {file ? file.name : "Upload Clinical PDF"}
                    </span>
                  </label>
                </div>

                {file && (
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Document"}
                  </button>
                )}
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">
                    Analysis Results
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Summary
                      </h4>
                      <p className="text-sm text-slate-700">
                        {analysis.summary}
                      </p>
                    </div>

                    {analysis.conditions && analysis.conditions.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-900 mb-2">
                          Conditions Identified
                        </h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {analysis.conditions.map((cond, i) => (
                            <li key={i}>• {cond}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.evidence && analysis.evidence.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">
                          Evidence
                        </h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {analysis.evidence.map((evt, i) => (
                            <li key={i}>• {evt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          {analysis && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Clinical Discussion
                </h3>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[500px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-slate-100 text-slate-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {streaming && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Ask about the analysis..."
                    disabled={streaming}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={streaming || !chatInput.trim()}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
