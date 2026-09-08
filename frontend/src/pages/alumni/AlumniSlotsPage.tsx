import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Video, Plus, CheckCircle2, User, FileText,
  Copy, ExternalLink, Filter, Search, Sparkles
} from 'lucide-react'
import { alumniApi, type AlumniMentorshipSlot } from '@/api/alumniApi'
import toast from 'react-hot-toast'

export default function AlumniSlotsPage() {
  const [slots, setSlots] = useState<AlumniMentorshipSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // New slot form state
  const [topic, setTopic] = useState('')
  const [slotTime, setSlotTime] = useState('')
  const [duration, setDuration] = useState(45)
  const [customLink, setCustomLink] = useState('')

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      setLoading(true)
      const data = await alumniApi.getSlots()
      setSlots(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load mentorship slots')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !slotTime) {
      toast.error('Please enter topic and slot time')
      return
    }

    try {
      setSubmitting(true)
      await alumniApi.createSlot({
        topic,
        slotTime,
        durationMinutes: duration,
        meetingLink: customLink || undefined
      })
      toast.success('Mentorship slot opened successfully!')
      setModalOpen(false)
      setTopic('')
      setSlotTime('')
      setCustomLink('')
      fetchSlots()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create slot')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredSlots = slots.filter(s => {
    if (filterStatus === 'ALL') return true
    return s.status === filterStatus
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            1:1 Mentorship Availability Desk
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Schedule and manage your mock interview sessions and portfolio teardowns for junior students.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Open New Slot
        </button>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--border-light)' }}>
        {['ALL', 'AVAILABLE', 'BOOKED', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200/50'
            }`}
            style={filterStatus !== status ? { color: 'var(--text-secondary)' } : {}}
          >
            {status} ({slots.filter(s => status === 'ALL' || s.status === status).length})
          </button>
        ))}
      </div>

      {/* ── Slot Cards Grid ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          Loading mentorship availability slots...
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border space-y-3" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <Calendar className="w-10 h-10 mx-auto text-blue-400 opacity-60" />
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>No slots found</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Click "Open New Slot" to create availability for students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlots.map(slot => (
            <div
              key={slot.id}
              className="p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition hover:shadow-md"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    slot.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : slot.status === 'BOOKED'
                      ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {slot.status}
                  </span>
                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3.5 h-3.5" /> {slot.durationMinutes} mins
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {slot.topic}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {slot.slotTime}
                  </p>
                </div>

                {slot.status === 'BOOKED' && (
                  <div className="p-3 rounded-xl border text-xs space-y-1.5"
                       style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}>
                    <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      Booked by: <span className="text-blue-600">{slot.bookedByStudentName}</span>
                    </div>
                    {slot.bookingNotes && (
                      <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                        "{slot.bookingNotes}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-light)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Platform: {slot.meetingPlatform}
                </span>

                {slot.meetingLink && (
                  <a
                    href={slot.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal to Open New Slot ────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
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
                  Open Mentorship Slot
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Session Topic / Focus Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems & System Design Mock"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Date & Time Slot (IST)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturday • 5:00 PM IST"
                    value={slotTime}
                    onChange={e => setSlotTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Duration (Minutes)
                    </label>
                    <select
                      value={duration}
                      onChange={e => setDuration(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Custom Meet Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={customLink}
                      onChange={e => setCustomLink(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none"
                      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
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
                    {submitting ? 'Creating...' : 'Open Slot'}
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
