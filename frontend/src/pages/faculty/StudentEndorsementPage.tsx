import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, ShieldCheck, Plus, Search, Copy, Check,
  Sparkles, ExternalLink, X, Loader2, UserCheck, FileText
} from 'lucide-react'
import { facultyApi, type StudentEndorsement } from '@/api/facultyApi'
import { useAuthStore } from '@/store/authStore'

export default function StudentEndorsementPage() {
  const { user } = useAuthStore()
  const [endorsements, setEndorsements] = useState<StudentEndorsement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    studentName: 'Aarav Sharma',
    studentRollNo: '22CSE041',
    facultyName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
    facultyDesignation: 'Professor & Dean of Academic Alliances',
    facultyDepartment: 'Computer Science & Engineering',
    specializationArea: 'Distributed Systems & Cloud Architecture',
    endorsementText: '',
    ratingTier: 'TOP_5_PERCENT'
  })

  const loadEndorsements = async () => {
    setLoading(true)
    try {
      const data = await facultyApi.getEndorsements()
      setEndorsements(data)
    } catch (err) {
      console.error('Failed to load endorsements:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEndorsements()
  }, [])

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await facultyApi.createEndorsement({
        studentName: form.studentName,
        studentRollNo: form.studentRollNo,
        facultyName: form.facultyName,
        facultyDesignation: form.facultyDesignation,
        facultyDepartment: form.facultyDepartment,
        specializationArea: form.specializationArea,
        endorsementText: form.endorsementText,
        ratingTier: form.ratingTier
      })
      setShowModal(false)
      setForm({
        studentName: '',
        studentRollNo: '',
        facultyName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
        facultyDesignation: 'Professor & Dean of Academic Alliances',
        facultyDepartment: 'Computer Science & Engineering',
        specializationArea: '',
        endorsementText: '',
        ratingTier: 'TOP_5_PERCENT'
      })
      await loadEndorsements()
    } catch (err) {
      console.error('Failed to create endorsement:', err)
      alert('Failed to issue endorsement. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = endorsements.filter(e =>
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.specializationArea.toLowerCase().includes(search.toLowerCase()) ||
    e.facultyName.toLowerCase().includes(search.toLowerCase()) ||
    e.studentRollNo?.toLowerCase().includes(search.toLowerCase())
  )

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'TOP_5_PERCENT':
        return { text: 'Top 5% Cohort', bg: 'bg-amber-100 text-amber-800 border-amber-300' }
      case 'TOP_10_PERCENT':
        return { text: 'Top 10% Cohort', bg: 'bg-purple-100 text-purple-800 border-purple-300' }
      case 'HONORS':
        return { text: 'Academic Honors', bg: 'bg-blue-100 text-blue-800 border-blue-300' }
      default:
        return { text: 'Recommended', bg: 'bg-slate-100 text-slate-700 border-slate-300' }
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Verifiable Academic Endorsement
            </span>
            <span className="text-xs text-slate-400">Cryptographically Signed on Career Passport</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Student Recommendation & Honors Studio
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Issue tamper-proof faculty recommendation letters with SHA-256 digital stamps to elevate student candidacy for Super-Dream placement drives.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
        >
          <Award className="w-4 h-4" /> Issue Endorsement
        </button>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-2xl border flex items-center justify-between gap-4 bg-linear-to-r from-blue-50/50 via-purple-50/50 to-indigo-50/50 border-blue-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Recruiter-Verifiable Academic Credentials</h4>
            <p className="text-[11px] text-slate-600">
              Every endorsement published here generates an immutable SHA-256 cryptographic seal embedded directly into the candidate's Career Passport and PDF export.
            </p>
          </div>
        </div>
        <span className="hidden md:inline-flex text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white border border-blue-200 text-blue-700">
          SHA-256 Verified
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student name, roll number, or domain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-purple-400"
          style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Endorsements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
            Loading verifiable endorsements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <p className="text-sm text-slate-500">No student endorsements found matching your query.</p>
          </div>
        ) : (
          filtered.map(end => {
            const tierBadge = getTierBadge(end.ratingTier)
            return (
              <div
                key={end.id}
                className="p-6 rounded-2xl border transition hover:shadow-sm space-y-4 relative overflow-hidden"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                        {end.studentName}
                      </h3>
                      {end.studentRollNo && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {end.studentRollNo}
                        </span>
                      )}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${tierBadge.bg}`}>
                        {tierBadge.text}
                      </span>
                    </div>
                    <p className="text-xs text-purple-600 font-semibold">
                      Specialization: {end.specializationArea}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </div>
                </div>

                {/* Recommendation Letter Body */}
                <div className="p-4 rounded-xl border bg-slate-50/60 border-slate-200/60 text-xs text-slate-700 leading-relaxed font-serif italic">
                  "{end.endorsementText}"
                </div>

                {/* Footer: Faculty Signoff and Verification Hash */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{end.facultyName}</p>
                    <p className="text-[11px] text-slate-500">{end.facultyDesignation} • {end.facultyDepartment}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Digital Seal:</span>
                    <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
                      {end.verificationHash.slice(0, 18)}...{end.verificationHash.slice(-6)}
                    </span>
                    <button
                      onClick={() => handleCopy(end.verificationHash)}
                      className="p-1.5 rounded-lg border hover:bg-slate-100 text-slate-500 transition"
                      title="Copy full cryptographic hash"
                    >
                      {copiedHash === end.verificationHash ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal: Issue Endorsement */}
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
                    Issue Academic Endorsement & Recommendation
                  </h3>
                  <p className="text-xs text-slate-500">Signs a verifiable recommendation into the student's Career Passport</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={form.studentName}
                      onChange={e => setForm({ ...form, studentName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Roll / Enrollment Number *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 22CSE041"
                      value={form.studentRollNo}
                      onChange={e => setForm({ ...form, studentRollNo: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Specialization Domain *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. High-Performance Distributed Systems"
                      value={form.specializationArea}
                      onChange={e => setForm({ ...form, specializationArea: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cohort Honors Tier *</label>
                    <select
                      value={form.ratingTier}
                      onChange={e => setForm({ ...form, ratingTier: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    >
                      <option value="TOP_5_PERCENT">Top 5% Cohort</option>
                      <option value="TOP_10_PERCENT">Top 10% Cohort</option>
                      <option value="HONORS">Academic Honors</option>
                      <option value="RECOMMENDED">Faculty Recommended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recommendation Letter / Assessment *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the student's technical depth, lab contributions, problem solving rigor, and why corporate recruiters should prioritize them..."
                    value={form.endorsementText}
                    onChange={e => setForm({ ...form, endorsementText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-purple-400 font-serif leading-relaxed"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Faculty Name</label>
                    <input
                      type="text"
                      value={form.facultyName}
                      onChange={e => setForm({ ...form, facultyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={form.facultyDesignation}
                      onChange={e => setForm({ ...form, facultyDesignation: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Department</label>
                    <input
                      type="text"
                      value={form.facultyDepartment}
                      onChange={e => setForm({ ...form, facultyDepartment: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
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
                    Sign & Publish Endorsement
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
