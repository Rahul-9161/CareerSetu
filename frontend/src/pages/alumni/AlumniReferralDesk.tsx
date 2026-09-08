import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Plus, Users, CheckCircle2, XCircle, ExternalLink,
  Building, MapPin, Award, FileText, ChevronRight, Send, AlertCircle
} from 'lucide-react'
import {
  alumniApi, type AlumniJobReferral, type AlumniReferralApplication
} from '@/api/alumniApi'
import toast from 'react-hot-toast'

export default function AlumniReferralDesk() {
  const [referrals, setReferrals] = useState<AlumniJobReferral[]>([])
  const [selectedRef, setSelectedRef] = useState<AlumniJobReferral | null>(null)
  const [applications, setApplications] = useState<AlumniReferralApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingApps, setLoadingApps] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // New referral form state
  const [company, setCompany] = useState('Google')
  const [jobTitle, setJobTitle] = useState('')
  const [jobCode, setJobCode] = useState('')
  const [location, setLocation] = useState('Bengaluru, India (Hybrid)')
  const [experienceLevel, setExperienceLevel] = useState('0-2 Years')
  const [minEligibility, setMinEligibility] = useState('')
  const [openingsCount, setOpeningsCount] = useState(2)
  const [portalApplyLink, setPortalApplyLink] = useState('')

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    try {
      setLoading(true)
      const data = await alumniApi.getReferrals()
      setReferrals(data)
      if (data.length > 0 && !selectedRef) {
        selectReferral(data[0])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load referrals')
    } finally {
      setLoading(false)
    }
  }

  const selectReferral = async (ref: AlumniJobReferral) => {
    setSelectedRef(ref)
    try {
      setLoadingApps(true)
      const apps = await alumniApi.getReferralApplications(ref.id)
      setApplications(apps)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applicant list')
    } finally {
      setLoadingApps(false)
    }
  }

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !jobTitle) {
      toast.error('Please enter company and job title')
      return
    }

    try {
      setSubmitting(true)
      const created = await alumniApi.createReferral({
        company,
        jobTitle,
        jobCode: jobCode || undefined,
        location,
        experienceLevel,
        minEligibility: minEligibility || undefined,
        openingsCount,
        portalApplyLink: portalApplyLink || undefined
      })
      toast.success('Internal job referral posted successfully!')
      setModalOpen(false)
      setJobTitle('')
      setJobCode('')
      setMinEligibility('')
      fetchReferrals()
      selectReferral(created)
    } catch (err) {
      console.error(err)
      toast.error('Failed to post referral')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const feedback = status === 'REFERRED'
        ? 'Verified CareerSetu passport profile. Directly submitted into company ATS internal referral portal.'
        : 'Thank you for reaching out. Please gain more hands-on production experience in the core stack.'
      await alumniApi.updateApplicationStatus(appId, status, feedback)
      toast.success(status === 'REFERRED' ? 'Student referred to ATS!' : 'Application status updated')
      if (selectedRef) {
        selectReferral(selectedRef)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update application status')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Internal Employee Referral Desk
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Share direct employee referral openings from your current employer and fast-track top verified students.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Post New Referral Opening
        </button>
      </div>

      {/* ── Layout: Left Referrals List, Right Applicants Kanban ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of posted referrals */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center justify-between">
            <span>Your Active Openings ({referrals.length})</span>
          </h2>

          {loading ? (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
              Loading openings...
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-6 rounded-2xl border text-center" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <Briefcase className="w-8 h-8 mx-auto text-emerald-400 opacity-60 mb-2" />
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>No referrals posted yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {referrals.map(ref => {
                const isSelected = selectedRef?.id === ref.id
                return (
                  <div
                    key={ref.id}
                    onClick={() => selectReferral(ref)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                        : 'hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    style={{ background: 'var(--surface-card)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" /> {ref.company}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                        {ref.applicationsCount} applicants
                      </span>
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{ref.jobTitle}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {ref.location} • {ref.experienceLevel}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column: Selected Referral Details & Applicants */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRef ? (
            <div className="p-6 rounded-2xl border space-y-5" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              {/* Header of selected referral */}
              <div className="border-b pb-4 space-y-2" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                    {selectedRef.company} Internal Req: {selectedRef.jobCode || 'N/A'}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Openings: {selectedRef.openingsCount}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {selectedRef.jobTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedRef.location}</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {selectedRef.experienceLevel}</span>
                </div>
                {selectedRef.minEligibility && (
                  <p className="text-xs p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                    <strong>Target Criteria:</strong> {selectedRef.minEligibility}
                  </p>
                )}
              </div>

              {/* Applicants list */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span>Student Referral Requests ({applications.length})</span>
                </h3>

                {loadingApps ? (
                  <div className="text-center py-6 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Loading applicant cards...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border text-xs" style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
                    No student applications yet for this opening.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl border space-y-3"
                        style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{app.studentName}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                                CGPA: {app.studentCgpa || 8.5}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {app.studentBranch || 'Computer Science & Engineering'} • {app.studentEmail}
                            </p>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                            app.status === 'REFERRED'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : app.status === 'DECLINED'
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        {app.noteToAlumni && (
                          <p className="text-xs italic p-2.5 rounded-lg border bg-white dark:bg-slate-800"
                             style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                            "{app.noteToAlumni}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-light)' }}>
                          <div className="flex items-center gap-3">
                            {app.resumeUrl && (
                              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                                <FileText className="w-3.5 h-3.5" /> Career Passport Resume
                              </a>
                            )}
                            {app.portfolioUrl && (
                              <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline flex items-center gap-1 font-semibold">
                                <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                              </a>
                            )}
                          </div>

                          {app.status === 'PENDING' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'DECLINED')}
                                className="px-3 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'REFERRED')}
                                className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Refer to ATS
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select an opening from the left column to inspect student applicants.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Post New Referral ───────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl border shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  Post Internal Employee Referral Opening
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              <form onSubmit={handleCreateReferral} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Company</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Internal Req Code</label>
                    <input
                      type="text"
                      placeholder="e.g. GOOG-SWE2-2024"
                      value={jobCode}
                      onChange={e => setJobCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Job Title / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer II (Cloud Data Platforms)"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={e => setExperienceLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value="New Grad 2025">New Grad 2025</option>
                      <option value="0-2 Years">0-2 Years</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3+ Years">3+ Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Eligibility & Required Skills</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. CGPA > 7.5, strong proficiency in Java/Go, clean coding and DSA fundamentals"
                    value={minEligibility}
                    onChange={e => setMinEligibility(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Official Job Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://careers.google.com/jobs/..."
                    value={portalApplyLink}
                    onChange={e => setPortalApplyLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-brand disabled:opacity-60"
                  >
                    {submitting ? 'Publishing...' : 'Publish Referral Opening'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
