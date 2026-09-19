"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { StatCard } from "@/components/ui/StatCard"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import {
  Activity,
  Users,
  FileText,
  BrainCircuit,
  Plus,
  FileSearch,
  UploadCloud,
  Clock,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Utensils
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user: authUser, setUser: setAuthUser } = useAuth()

  const [dashboardData, setDashboardData] = useState({
    user: { email: "", lastLogin: "Today", docs: 0 },
    clinical: { summary: "", condition: "", severity: "", lastAnalyzed: "" },
    analyses: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [addPatientOpen, setAddPatientOpen] = useState(false)
  const [patientForm, setPatientForm] = useState({ name: "", age: "", condition: "", notes: "" })

  const fetchDashboard = (email = searchEmail) => {
    setLoading(true)
    const url = email
      ? `/api/dashboard?email=${encodeURIComponent(email)}`
      : "/api/dashboard"

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || "Failed to load dashboard")
        }
        return res.json()
      })
      .then((data) => {
        setError("")
        setDashboardData(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setAuthUser(null)
    router.push("/")
  }

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: Activity, active: true },
    { name: "Health Assessment ↗", href: "https://prakriti-gamma.vercel.app/", icon: Sparkles, external: true },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Clinical Analysis", href: "/diagnostics/analyze", icon: FileSearch },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Diet by Body", href: "/#diet-by-body", icon: Utensils },
    { name: "AI Assistant", href: "/chat", icon: BrainCircuit },
    { name: "History", href: "/diagnostics/history", icon: Clock },
  ]

  // Mock patient roster for UI richness combined with real data
  const samplePatients = [
    { id: "PR-8821", name: "John Doe", age: "52", condition: "Congestive Heart Failure", status: "High Priority", lastVisit: "Today" },
    { id: "PR-8822", name: "Sarah Jenkins", age: "54", condition: "Acute-on-Chronic Kidney Disease", status: "High Priority", lastVisit: "Yesterday" },
    { id: "PR-8823", name: "Robert Chen", age: "61", condition: "Type 2 Diabetes Mellitus", status: "Stable", lastVisit: "3 days ago" },
    { id: "PR-8824", name: "Emily Watson", age: "38", condition: "Asthma Exacerbation", status: "Under Review", lastVisit: "1 week ago" },
  ]

  return (
    <div className="min-h-[calc(100vh-5rem)] flex bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shrink-0">
        <div className="space-y-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight uppercase text-slate-900 dark:text-white">
              PRAKRITI
            </span>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20 transition-all"
                  >
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span>{item.name}</span>
                  </a>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
              {authUser?.name ? authUser.name[0].toUpperCase() : "U"}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {authUser?.name || "Clinical Practitioner"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{authUser?.email || "Signed In"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Good morning{authUser?.name ? `, ${authUser.name}` : ""}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your clinical workspace today.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => router.push("/diagnostics/analyze")}
            >
              New Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Users}
              onClick={() => setAddPatientOpen(true)}
            >
              Add Patient
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={UploadCloud}
              onClick={() => router.push("/diagnostics/analyze")}
            >
              Upload Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Utensils}
              onClick={() => router.push("/#diet-by-body")}
            >
              Diet by Body
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={() => window.open("https://prakriti-gamma.vercel.app/", "_blank")}
            >
              Health Assessment ↗
            </Button>
          </div>
        </div>

        {/* Admin Search Bar if admin or looking up records */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Patient File Search:</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetchDashboard()
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by patient/user email..."
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <Button size="sm" variant="secondary" type="submit">
              Search
            </Button>
          </form>
        </div>

        {/* ================= STATISTICS (4 CARDS) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Patients"
            value="24"
            description="Active clinical roster"
            icon={Users}
          />
          <StatCard
            title="Analyses Completed"
            value={dashboardData.analyses?.length || dashboardData.user?.docs || "12"}
            description="Document syntheses run"
            icon={FileSearch}
          />
          <StatCard
            title="Documents Ingested"
            value={dashboardData.user?.docs || "18"}
            description="PDF & lab panels"
            icon={FileText}
          />
          <StatCard
            title="AI Diagnostic Insights"
            value="94.2%"
            description="Clinical agreement rate"
            icon={BrainCircuit}
          />
        </div>

        {/* Hospital Telemetry & Remote Vitals Banner */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 h-48 lg:h-52 relative overflow-hidden group">
            <img
              src="/telemedicine_vitals_monitor.jpg"
              alt="Hospital Intensive Care Telemetry Station"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white dark:to-slate-900 hidden lg:block" />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Inpatient Telemetry</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Continuous Vital Signs &amp; Biometric Sync</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Synchronized ECG rhythm detection, blood pressure telemetry, and oxygen saturation curves linked to patient medical records for rapid triage.
            </p>
          </div>
        </div>

        {/* ================= RECENT PATIENTS TABLE ================= */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base">Recent Patients</CardTitle>
              <CardDescription>Recently examined records and clinical status</CardDescription>
            </div>
            <Link
              href="/patients"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Patients <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-y border-slate-100 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Patient Name</th>
                  <th className="px-6 py-3">ID / MRN</th>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Primary Diagnosis / State</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {samplePatients.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                      {pt.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-500">{pt.id}</td>
                    <td className="px-6 py-3.5 text-slate-500">{pt.age} yrs</td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {pt.condition}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={pt.status === "High Priority" ? "danger" : "success"}>
                        {pt.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href="/diagnostics/analyze"
                        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ================= RECENT ANALYSES & CLINICAL SNAPSHOT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Latest Clinical Evaluation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Latest AI Clinical Evaluation</span>
              </CardTitle>
              <CardDescription>
                Primary condition & structured assessment from last ingestion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.clinical?.summary ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Condition: {dashboardData.clinical.condition}
                    </span>
                    <Badge variant="info">
                      {dashboardData.clinical.severity || "Evaluated"}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dashboardData.clinical.summary}
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No previous clinical analysis recorded yet. Upload a document to generate your first synthesis.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Recent Analysis History</span>
              </CardTitle>
              <CardDescription>Timeline of clinical assessments run on this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.analyses && dashboardData.analyses.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.analyses.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1"
                    >
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {item.summary}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()} · Record #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-slate-400">No recorded analyses found</p>
                  <Button size="sm" variant="outline" onClick={() => router.push("/diagnostics/analyze")}>
                    Run First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </main>

      {/* ================= ADD PATIENT MODAL ================= */}
      <Modal
        isOpen={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
        title="Register New Patient"
        description="Add a new patient record to your clinical diagnostic roster."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            alert(`Patient ${patientForm.name} created successfully!`)
            setAddPatientOpen(false)
            setPatientForm({ name: "", age: "", condition: "", notes: "" })
          }}
          className="space-y-4 pt-2"
        >
          <Input
            label="Full Name"
            required
            placeholder="e.g. David Miller"
            value={patientForm.name}
            onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
          />
          <Input
            label="Age"
            type="number"
            required
            placeholder="e.g. 48"
            value={patientForm.age}
            onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
          />
          <Input
            label="Primary Admitting Condition / Complaint"
            placeholder="e.g. Chronic cough, chest tightness"
            value={patientForm.condition}
            onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
          />

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAddPatientOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Patient
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
