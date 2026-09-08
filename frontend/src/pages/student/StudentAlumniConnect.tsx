import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Briefcase, Calendar, Users, Search,
  Star, ExternalLink, Video, CheckCircle2, Clock, MapPin,
  Building2, Send, Sparkles, FileText, ArrowRight
} from 'lucide-react'
import {
  alumniApi, type AlumniProfile, type AlumniMentorshipSlot, type AlumniJobReferral
} from '@/api/alumniApi'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function StudentAlumniConnect() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'slots' | 'referrals' | 'directory'>('slots')
  const [slots, setSlots] = useState<AlumniMentorshipSlot[]>([])
  const [referrals, setReferrals] = useState<AlumniJobReferral[]>([])
  const [directory, setDirectory] = useState<AlumniProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Booking slot modal state
  const [selectedSlot, setSelectedSlot] = useState<AlumniMentorshipSlot | null>(null)
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingSubmitting, setBookingSubmitting] = useState(false)

  // Referral request modal state
  const [selectedRef, setSelectedRef] = useState<AlumniJobReferral | null>(null)
  const [noteToAlumni, setNoteToAlumni] = useState('')
  const [cgpa, setCgpa] = useState('8.75')
  const [branch, setBranch] = useState('Computer Science & Engineering')
  const [refSubmitting, setRefSubmitting] = useState(false)

  // Directory search
  const [dirSearch, setDirSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [slotsData, refsData, dirData] = await Promise.all([
        alumniApi.getSlots(),
        alumniApi.getReferrals('OPEN'),
        alumniApi.getDirectory()
      ])
      setSlots(slotsData)
      setReferrals(refsData)
      setDirectory(dirData)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load Alumni Connect hub')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    try {
      setBookingSubmitting(true)
      await alumniApi.bookSlot(selectedSlot.id, {
        studentName: user?.fullName || 'Aarav Sharma',
        bookingNotes
      })
      toast.success('Mentorship session booked! Meeting link saved.')
      setSelectedSlot(null)
      setBookingNotes('')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Failed to book mentorship session')
    } finally {
      setBookingSubmitting(false)
    }
  }

  const handleApplyReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRef) return

    try {
      setRefSubmitting(true)
      await alumniApi.applyForReferral(selectedRef.id, {
        studentName: user?.fullName || 'Aarav Sharma',
        studentEmail: user?.email || 'student@careersetu.in',
        studentBranch: branch,
        studentCgpa: parseFloat(cgpa) || 8.5,
        noteToAlumni,
        resumeUrl: 'https://careersetu.in/resumes/passport-' + (user?.id || 'demo') + '.pdf'
      })
      toast.success(`Referral request sent to ${selectedRef.alumniName} at ${selectedRef.company}!`)
      setSelectedRef(null)
      setNoteToAlumni('')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit referral request')
    } finally {
      setRefSubmitting(false)
    }
  }

  const availableSlots = slots.filter(s => s.status === 'AVAILABLE')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
           style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)', borderColor: 'var(--border-light)' }}>
        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5 w-fit">
            <GraduationCap className="w-3.5 h-3.5" />
            Alum-Connect Network
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
            Connect with University Alumni
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Tap into your institution's alumni network at Google, Microsoft, Amazon, Zomato, and Atlassian for 1:1 mentorship, mock interviews, and internal job referrals.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800 p-1.5 rounded-xl self-start md:self-auto">
          {[
            { id: 'slots', label: '1:1 Mentorship Slots', icon: Calendar },
            { id: 'referrals', label: 'Job Referrals Board', icon: Briefcase },
            { id: 'directory', label: 'Alumni Directory', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                  : 'hover:text-blue-600'
              }`}
              style={activeTab !== tab.id ? { color: 'var(--text-secondary)' } : {}}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Based on Active Tab ───────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-xs" style={{ color: 'var(--text-muted)' }}>
          Loading alumni network resources...
        </div>
      ) : activeTab === 'slots' ? (
        /* ── Tab 1: Mentorship Slots ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Available 1:1 Alumni Sessions ({availableSlots.length})
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Verified alumni donate slots to review resumes & conduct mock vival
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <Clock className="w-10 h-10 mx-auto text-blue-400 opacity-60 mb-2" />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>All current slots are booked</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Check back soon as alumni open new time windows weekly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableSlots.map(slot => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition hover:shadow-lg"
                  style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded">
                        {slot.company} Alum
                      </span>
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3.5 h-3.5" /> {slot.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="text-sm font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {slot.topic}
                    </h3>

                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {slot.slotTime}
                    </p>

                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Mentor: <strong>{slot.alumniName}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSlot(slot)
                      setBookingNotes('')
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-white gradient-brand shadow-sm hover:opacity-90 transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book 1:1 Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'referrals' ? (
        /* ── Tab 2: Job Referrals Board ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Open Employee Job Referrals ({referrals.length})
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              1-Click referral requests fast-tracked directly to internal recruiters
            </span>
          </div>

          {referrals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <Briefcase className="w-10 h-10 mx-auto text-emerald-400 opacity-60 mb-2" />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No active referrals right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referrals.map(ref => (
                <div
                  key={ref.id}
                  className="p-5 rounded-2xl border space-y-3.5 transition hover:shadow-md flex flex-col justify-between"
                  style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                        {ref.company}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {ref.experienceLevel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {ref.jobTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ref.location}</span>
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Posted by {ref.alumniName}</span>
                    </div>

                    {ref.minEligibility && (
                      <p className="text-xs p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                        <strong>Target Criteria:</strong> {ref.minEligibility}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Req Code: {ref.jobCode || 'Internal'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRef(ref)
                        setNoteToAlumni('')
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Referral
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Tab 3: Alumni Network Directory ── */
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search alumni by company, name, skills..."
              value={dirSearch}
              onChange={e => setDirSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-400"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {directory
              .filter(a => !dirSearch || a.fullName.toLowerCase().includes(dirSearch.toLowerCase()) || a.currentCompany.toLowerCase().includes(dirSearch.toLowerCase()))
              .map(alum => (
                <div key={alum.id} className="p-4 rounded-xl border space-y-3" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm">
                      {alum.avatarInitials || alum.fullName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{alum.fullName}</h4>
                      <p className="text-xs font-semibold text-emerald-600">{alum.designation} @ {alum.currentCompany}</p>
                    </div>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Batch {alum.graduationYear} • {alum.location}
                  </p>
                  {alum.bio && (
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {alum.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border-light)' }}>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {alum.rating}
                    </span>
                    <button
                      onClick={() => setActiveTab('slots')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View Sessions →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Modal: Book 1:1 Session ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-xl space-y-4"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  Book 1:1 Mentorship Session
                </h2>
                <button onClick={() => setSelectedSlot(null)} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              <div className="p-3.5 rounded-xl border space-y-1 bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--border-light)' }}>
                <p className="text-xs font-bold text-blue-600">{selectedSlot.topic}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Mentor: <strong>{selectedSlot.alumniName}</strong> ({selectedSlot.company})
                </p>
                <p className="text-xs text-emerald-600 font-medium">Time: {selectedSlot.slotTime}</p>
              </div>

              <form onSubmit={handleBookSlot} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    What would you like help with during this session?
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Please review my distributed caching project architecture and mock interview me on high-concurrency Java questions."
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="p-2.5 rounded-lg border text-[11px] flex items-center gap-2 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300" style={{ borderColor: 'var(--border-light)' }}>
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>Your Career Passport profile & verified skills will be automatically attached for the mentor.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-brand disabled:opacity-60"
                  >
                    {bookingSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Request Referral ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedRef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  Request Employee Job Referral
                </h2>
                <button onClick={() => setSelectedRef(null)} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              <div className="p-3.5 rounded-xl border space-y-1 bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--border-light)' }}>
                <p className="text-xs font-bold text-emerald-600">{selectedRef.jobTitle}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Company: <strong>{selectedRef.company}</strong> • Referring Alumnus: <strong>{selectedRef.alumniName}</strong>
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Location: {selectedRef.location}</p>
              </div>

              <form onSubmit={handleApplyReferral} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Branch / Degree</label>
                    <input
                      type="text"
                      required
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Cumulative CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={cgpa}
                      onChange={e => setCgpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Personal Note to Alumnus
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly explain your key projects, why you're a great fit for this team, and why you'd value their referral..."
                    value={noteToAlumni}
                    onChange={e => setNoteToAlumni(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="p-2.5 rounded-lg border text-[11px] flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" style={{ borderColor: 'var(--border-light)' }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Your CareerSetu verified passport seal & resume link will be bundled with this request.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRef(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={refSubmitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 shadow-sm"
                  >
                    {refSubmitting ? 'Submitting...' : 'Submit Referral Request'}
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
