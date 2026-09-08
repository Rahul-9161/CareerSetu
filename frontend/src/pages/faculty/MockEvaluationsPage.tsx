import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, Search, Filter, Sparkles, CheckCircle2,
  AlertTriangle, XCircle, X, Loader2, Award, User, BookOpen
} from 'lucide-react'
import { facultyApi, type MockEvaluation } from '@/api/facultyApi'
import { useAuthStore } from '@/store/authStore'

export default function MockEvaluationsPage() {
  const { user } = useAuthStore()
  const [evaluations, setEvaluations] = useState<MockEvaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [form, setForm] = useState({
    studentName: 'Aarav Sharma',
    studentRollNo: '22CSE041',
    evaluatorName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
    track: 'Full Stack & Cloud Architecture',
    technicalScore: 90,
    problemSolvingScore: 88,
    communicationScore: 92,
    nepReadinessScore: 95,
    rubricFeedback: '',
    recommendedActions: '',
    readinessStatus: 'PLACEMENT_READY'
  })

  const loadEvaluations = async () => {
    setLoading(true)
    try {
      const data = await facultyApi.getEvaluations()
      setEvaluations(data)
    } catch (err) {
      console.error('Failed to load evaluations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvaluations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await facultyApi.createEvaluation({
        studentName: form.studentName,
        studentRollNo: form.studentRollNo,
        evaluatorName: form.evaluatorName,
        track: form.track,
        technicalScore: Number(form.technicalScore),
        problemSolvingScore: Number(form.problemSolvingScore),
        communicationScore: Number(form.communicationScore),
        nepReadinessScore: Number(form.nepReadinessScore),
        rubricFeedback: form.rubricFeedback,
        recommendedActions: form.recommendedActions,
        readinessStatus: form.readinessStatus
      })
      setShowModal(false)
      setForm({
        studentName: '',
        studentRollNo: '',
        evaluatorName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
        track: 'Full Stack & Cloud Architecture',
        technicalScore: 85,
        problemSolvingScore: 85,
        communicationScore: 85,
        nepReadinessScore: 85,
        rubricFeedback: '',
        recommendedActions: '',
        readinessStatus: 'PLACEMENT_READY'
      })
      await loadEvaluations()
    } catch (err) {
      console.error('Failed to create evaluation:', err)
      alert('Failed to record evaluation. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'PLACEMENT_READY':
        return {
          icon: CheckCircle2,
          text: 'Placement Ready',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }
      case 'NEEDS_PRACTICE':
        return {
          icon: AlertTriangle,
          text: 'Needs Practice',
          className: 'bg-amber-100 text-amber-800 border-amber-300'
        }
      default:
        return {
          icon: XCircle,
          text: 'Intervention Required',
          className: 'bg-rose-100 text-rose-800 border-rose-300'
        }
    }
  }

  const filtered = evaluations.filter(ev => {
    const matchesSearch =
      ev.studentName.toLowerCase().includes(search.toLowerCase()) ||
      ev.track.toLowerCase().includes(search.toLowerCase()) ||
      (ev.studentRollNo && ev.studentRollNo.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || ev.readinessStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Technical Viva & Interview Feedback
            </span>
            <span className="text-xs text-slate-400">4-Dimensional Rubric Assessment</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Mock Viva & Placement Readiness
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Evaluate student technical acumen, code structure, communication rigor, and recommend personalized academic interventions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
        >
          <Target className="w-4 h-4" /> Record Mock Viva
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, roll number, or track..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-amber-400"
            style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 flex-shrink-0">Readiness:</span>
          {['ALL', 'PLACEMENT_READY', 'NEEDS_PRACTICE', 'INTERVENTION_REQUIRED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
            Loading mock viva assessments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <p className="text-sm text-slate-500">No mock evaluations match your filters.</p>
          </div>
        ) : (
          filtered.map(ev => {
            const badge = getStatusBadge(ev.readinessStatus)
            const BadgeIcon = badge.icon
            return (
              <div
                key={ev.id}
                className="p-6 rounded-2xl border transition hover:shadow-sm space-y-4"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                        {ev.studentName}
                      </h3>
                      {ev.studentRollNo && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ev.studentRollNo}
                        </span>
                      )}
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {ev.track}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Evaluated by <strong className="text-slate-700">{ev.evaluatorName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold font-display text-slate-800">{ev.overallScore} / 100</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Overall Rating</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-xl font-bold border flex items-center gap-1.5 ${badge.className}`}>
                      <BadgeIcon className="w-3.5 h-3.5" /> {badge.text}
                    </span>
                  </div>
                </div>

                {/* 4-Criterion Rubric breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">Technical Depth</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{ev.technicalScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">Problem Solving</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{ev.problemSolvingScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">Communication</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{ev.communicationScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">NEP Competency</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{ev.nepReadinessScore}%</p>
                  </div>
                </div>

                {/* Detailed Feedback & Interventions */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <strong className="text-slate-700 block mb-0.5">Faculty Rubric Observations:</strong>
                    <p className="text-slate-600 leading-relaxed">{ev.rubricFeedback}</p>
                  </div>
                  {ev.recommendedActions && (
                    <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                      <strong className="text-blue-800 block mb-0.5">Recommended Academic Interventions:</strong>
                      <p className="text-blue-700 leading-relaxed">{ev.recommendedActions}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal: Record Viva */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <h3 className="font-bold text-base font-display" style={{ color: 'var(--text-primary)' }}>
                    Record Technical Viva Assessment
                  </h3>
                  <p className="text-xs text-slate-500">Rubric-based evaluation for campus placement preparation</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Student Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={form.studentName}
                      onChange={e => setForm({ ...form, studentName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Roll / Enrollment No *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 22CSE041"
                      value={form.studentRollNo}
                      onChange={e => setForm({ ...form, studentRollNo: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Interview Track *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Full Stack & Cloud Architecture"
                      value={form.track}
                      onChange={e => setForm({ ...form, track: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Evaluator Name</label>
                    <input
                      type="text"
                      value={form.evaluatorName}
                      onChange={e => setForm({ ...form, evaluatorName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                {/* 4-dimensional score inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Technical (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.technicalScore}
                      onChange={e => setForm({ ...form, technicalScore: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Problem Solving</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.problemSolvingScore}
                      onChange={e => setForm({ ...form, problemSolvingScore: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Communication</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.communicationScore}
                      onChange={e => setForm({ ...form, communicationScore: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NEP Competency</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.nepReadinessScore}
                      onChange={e => setForm({ ...form, nepReadinessScore: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Detailed Rubric Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Specific strengths observed in coding, debugging, architecture, and behavioral presence..."
                    value={form.rubricFeedback}
                    onChange={e => setForm({ ...form, rubricFeedback: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recommended Academic Interventions</label>
                  <input
                    type="text"
                    placeholder="e.g. Review B-tree indexes; practice LeetCode DP; mock presentation"
                    value={form.recommendedActions}
                    onChange={e => setForm({ ...form, recommendedActions: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Placement Readiness Verdict</label>
                  <select
                    value={form.readinessStatus}
                    onChange={e => setForm({ ...form, readinessStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none font-semibold"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  >
                    <option value="PLACEMENT_READY">Placement Ready (Tier-1 Super Dream)</option>
                    <option value="NEEDS_PRACTICE">Needs Practice (Targeted Refinement)</option>
                    <option value="INTERVENTION_REQUIRED">Intervention Required (Faculty Remedial)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border font-medium text-slate-600 hover:bg-slate-50"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white gradient-brand font-semibold shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Evaluation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
