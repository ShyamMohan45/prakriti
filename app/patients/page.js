"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Filter,
  FileSearch,
  MoreVertical,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from "lucide-react"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: "", mrn: "", age: "", condition: "", status: "Stable" })

  const [patients, setPatients] = useState([
    { id: "PR-8821", name: "John Doe", age: 52, gender: "Male", condition: "Congestive Heart Failure", status: "High Priority", lastAnalysis: "Today" },
    { id: "PR-8822", name: "Sarah Jenkins", age: 54, gender: "Female", condition: "Acute-on-Chronic Kidney Disease", status: "High Priority", lastAnalysis: "Yesterday" },
    { id: "PR-8823", name: "Robert Chen", age: 61, gender: "Male", condition: "Type 2 Diabetes Mellitus", status: "Stable", lastAnalysis: "3 days ago" },
    { id: "PR-8824", name: "Emily Watson", age: 38, gender: "Female", condition: "Asthma Exacerbation", status: "Under Review", lastAnalysis: "1 week ago" },
    { id: "PR-8825", name: "Marcus Johnson", age: 46, gender: "Male", condition: "Essential Hypertension", status: "Stable", lastAnalysis: "2 weeks ago" },
    { id: "PR-8826", name: "Elena Rostova", age: 67, gender: "Female", condition: "Bilateral Pneumonia", status: "High Priority", lastAnalysis: "3 weeks ago" },
  ])

  const filtered = patients.filter((pt) => {
    const matchesSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.condition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "high" && pt.status === "High Priority") ||
      (filterStatus === "stable" && pt.status === "Stable")

    return matchesSearch && matchesStatus
  })

  const handleAddPatient = (e) => {
    e.preventDefault()
    if (!newPatient.name) return
    const id = `PR-${Math.floor(8800 + Math.random() * 200)}`
    setPatients([
      {
        id,
        name: newPatient.name,
        age: Number(newPatient.age) || 45,
        gender: "Not specified",
        condition: newPatient.condition || "Under Assessment",
        status: newPatient.status || "Under Review",
        lastAnalysis: "Just now",
      },
      ...patients,
    ])
    setAddModalOpen(false)
    setNewPatient({ name: "", mrn: "", age: "", condition: "", status: "Stable" })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                Workspace
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Patients Directory</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Patient Roster Management
            </h1>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            Register Patient
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Clinical Consultation Spotlight Banner */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-4 h-48 lg:h-52 relative overflow-hidden group">
            <img
              src="/doctor_patient_consultation.jpg"
              alt="Physician Consultation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white dark:to-slate-900 hidden lg:block" />
          </div>
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <span>Active Clinical Cohort</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Physician-Led Longitudinal Patient Care</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Track complex inpatient differentials, longitudinal vitals trends, and dosha-adapted nutrition pathways with continuous algorithmic safety checks and human physician governance.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, MRN, condition..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            {["all", "high", "stable"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  filterStatus === tab
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {tab === "all" ? "All Patients" : tab === "high" ? "High Priority" : "Stable"}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">MRN Identifier</th>
                  <th className="px-6 py-3.5">Age & Gender</th>
                  <th className="px-6 py-3.5">Primary Diagnosis</th>
                  <th className="px-6 py-3.5">Clinical Priority</th>
                  <th className="px-6 py-3.5">Last Analysis</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {pt.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{pt.id}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {pt.age} yrs · {pt.gender}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {pt.condition}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={pt.status === "High Priority" ? "danger" : "success"}>
                        {pt.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {pt.lastAnalysis}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/diagnostics/analyze"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>Analyze</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Patient Record"
        description="Fill in patient demographics and clinical context."
      >
        <form onSubmit={handleAddPatient} className="space-y-4 pt-2">
          <Input
            label="Patient Full Name"
            required
            placeholder="e.g. Eleanor Vance"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
          <Input
            label="Age"
            type="number"
            required
            placeholder="e.g. 58"
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          />
          <Input
            label="Primary Admitting Concern"
            placeholder="e.g. Acute chest discomfort"
            value={newPatient.condition}
            onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Patient
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
