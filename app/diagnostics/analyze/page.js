


"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SeverityCard from "./SeverityCard";
import { useAuth } from "@/app/context/AuthContext";

/* Severity order for sorting */
const severityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export default function AnalyzePage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingToDB, setSavingToDB] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatEndRef = useRef(null);

  const handleAnalyze = async () => {
    if (!file) return;
    if (!user) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ SEND user_id to backend in header
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
        headers: {
          "x-user-id": user.id.toString(),
        },
        credentials: "include",
      });

      console.log("📡 [Analyze] Response status:", res.status);
      console.log("📡 [Analyze] Response ok:", res.ok);

      const text = await res.text();
      console.log("📡 [Analyze] Response text:", text);

      if (!res.ok) {
        console.error("❌ [Analyze] Server error:", res.status, text);
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const json = JSON.parse(text);
      console.log("✅ [Analyze] Parsed response:", json);

      setSavingToDB(true);

      // Set result from direct response fields
      setResult({
        summary: json.summary || "Clinical analysis completed.",
        conditions: Array.isArray(json.conditions) && json.conditions.length > 0
          ? json.conditions
          : [{
              name: "General Health Status",
              severity: "Low",
              justification: "No significant clinical abnormalities detected"
            }],
        evidence: Array.isArray(json.evidence) && json.evidence.length > 0
          ? json.evidence
          : ["No specific evidence markers found in the document."]
      });

      console.log("✅ [Analyze] Result set successfully");
      setSavingToDB(false);
      setChatMessages([]);
      setChatInput("");
    } catch (err) {
      console.error("❌ [Analyze] Error:", err);
      setError(err.message || "Unable to analyze document");
      setSavingToDB(false);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !result) return;

    const userMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: chatInput,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setStreaming(true);

    try {
      const response = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantMsgObj = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: "",
      };
      setChatMessages((prev) => [...prev, assistantMsgObj]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        assistantMessage += text;

        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMessage;
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: chatMessages.length + 1,
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Clinical Document Analysis
              </h1>
              <p className="text-slate-600 mt-2">Upload a clinical note to get instant AI-powered analysis</p>
            </div>
            <Link
              href="/diagnostics/history"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              📋 View Past Analyses
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {!user && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-red-800">
            ⚠️ <strong>Please login</strong> to analyze documents. Your analysis will be saved to your account.
          </div>
        )}

        {/* Upload Section */}
        {!result ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-blue-100">
            {/* Drag and Drop Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile && droppedFile.type === "application/pdf") {
                  setFile(droppedFile);
                  setError(null);
                } else {
                  setError("Please drop a PDF file");
                }
              }}
              className={`border-4 border-dashed rounded-2xl p-16 text-center transition cursor-pointer ${
                file
                  ? "border-green-400 bg-green-50"
                  : "border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100"
              }`}
            >
              <input
                type="file"
                id="pdf-input"
                accept=".pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile && selectedFile.type === "application/pdf") {
                    setFile(selectedFile);
                    setError(null);
                  } else {
                    setError("Please select a PDF file");
                  }
                }}
                className="hidden"
              />
              <label htmlFor="pdf-input" className="cursor-pointer">
                <div className="text-6xl mb-4">📄</div>
                {file ? (
                  <div>
                    <p className="text-2xl font-bold text-green-700">✓ {file.name}</p>
                    <p className="text-sm text-green-600 mt-2">Ready to analyze</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      Drag & drop your clinical note
                    </p>
                    <p className="text-slate-600 mb-4">or click to browse</p>
                    <p className="text-xs text-slate-500">Accepted format: PDF</p>
                  </div>
                )}
              </label>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || !file || !user}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2 ${
                  loading || !file || !user
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Analyzing...
                  </>
                ) : savingToDB ? (
                  <>
                    <span>💾</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Analyze Now
                  </>
                )}
              </button>

              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  className="px-8 py-4 rounded-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-800">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Info Cards */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold text-slate-900 mb-2">Smart Analysis</h3>
                <p className="text-sm text-slate-600">AI extracts clinical summaries and identifies key conditions</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-slate-900 mb-2">Ask Questions</h3>
                <p className="text-sm text-slate-600">Chat with AI about the analysis in real-time</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-slate-900 mb-2">Save History</h3>
                <p className="text-sm text-slate-600">All analyses are saved to your account for reference</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Results Section */}
        {result && (
          <div className="mt-12 space-y-8">
            {/* Back to Upload */}
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setChatMessages([]);
                setChatInput("");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              ← Analyze Another Document
            </button>

            {/* Clinical Summary */}
            {result?.summary && (
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
                <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="text-4xl">📋</span>
                  Clinical Summary
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            )}

            {/* Clinical Priorities */}
            {Array.isArray(result?.conditions) && result.conditions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-4xl">⚕️</span>
                  Clinical Priorities
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {[...result.conditions]
                    .sort(
                      (a, b) =>
                        (severityOrder[a.severity] || 99) -
                        (severityOrder[b.severity] || 99)
                    )
                    .map((c, i) => (
                      <SeverityCard key={i} condition={c} />
                    ))}
                </div>
              </div>
            )}

            {/* Evidence & Citations */}
            {Array.isArray(result?.evidence) && result.evidence.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-emerald-500">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🔍</span>
                  Evidence & Citations
                </h2>

                <ul className="space-y-3">
                  {result.evidence.map((e, i) => (
                    <li key={i} className="flex gap-3 text-slate-700">
                      <span className="text-emerald-500 font-bold flex-shrink-0">▸</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clinical Discussion Chat */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
                <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="text-4xl">💬</span>
                  Clinical Discussion
                </h2>
                <p className="text-slate-600 mb-6">
                  Ask follow-up questions about this analysis. The clinical assistant will provide evidence-based responses.
                </p>

                {/* Chat Messages */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto border border-slate-200 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <p>Ask a question about the clinical analysis...</p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-slate-200 text-slate-900 rounded-bl-none"
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
                          <div className="bg-slate-200 px-4 py-3 rounded-lg rounded-bl-none">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a clinical question..."
                    disabled={streaming}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-black"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={streaming || !chatInput.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}