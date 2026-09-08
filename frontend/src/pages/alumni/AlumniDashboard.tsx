import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Users, Calendar, Briefcase, MessageSquare, Star,
  Award, ArrowUpRight, CheckCircle2, Clock, Video, Sparkles,
  ExternalLink, ChevronRight, AlertCircle, Plus, Send
} from 'lucide-react'
import { alumniApi, type AlumniProfile, type AlumniMentorshipSlot, type AlumniJobReferral, type AlumniStats } from '@/api/alumniApi'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function AlumniDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<AlumniStats | null>(null)
  const [profile, setProfile] = useState<AlumniProfile | null>(null)
  const [slots, setSlots] = useState<AlumniMentorshipSlot[]>([])
  const [referrals, setReferrals] = useState<AlumniJobReferral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, profRes, slotsRes, refsRes] = await Promise.all([
        alumniApi.getStats(),
        alumniApi.getMyProfile().catch(() => null),
        alumniApi.getSlots(),
        alumniApi.getReferrals()
      ])
      setStats(statsRes)
      setProfile(profRes)
      setSlots(slotsRes)
      setReferrals(refsRes)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load alumni dashboard metrics')
    } finally {
      setLoading(false)
    }
  }

  const bookedSlots = slots.filter(s => s.status === 'BOOKED')
  const openReferrals = referrals.filter(r => r.status === 'OPEN')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Header Banner ────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
           style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', borderColor: 'var(--border-light)' }}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Verified Alum-Connect Partner
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {profile?.currentCompany || 'Google'} • Batch {profile?.graduationYear || 2020}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {profile?.fullName || user?.fullName || 'Alumnus'}!
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            {profile?.designation || 'Senior Software Engineer'} at <strong className="text-emerald-600 dark:text-emerald-400">{profile?.currentCompany || 'Google'}</strong>.
            Empowering the next generation of engineers with high-impact 1:1 mentorship and internal referrals.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/alumni/mentorship"
            className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Open Mentorship Slot
          </Link>
          <Link
            to="/alumni/referrals"
            className="px-4 py-2.5 rounded-xl font-semibold text-sm border transition flex items-center gap-2"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            <Briefcase className="w-4 h-4 text-emerald-500" /> Post Job Referral
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Mentees Guided',
            value: profile?.totalMenteesHelped || stats?.completedSessions || 42,
            icon: Users,
            sub: 'Students coached 1:1',
            color: 'text-blue-500 bg-blue-500/10'
          },
          {
            label: 'Referrals Given',
            value: profile?.totalReferralsGiven || 18,
            icon: Briefcase,
            sub: 'Submitted into ATS',
            color: 'text-emerald-500 bg-emerald-500/10'
          },
          {
            label: 'Open Referrals',
            value: stats?.openReferrals || openReferrals.length || 4,
            icon: Award,
            sub: 'Active internal roles',
            color: 'text-amber-500 bg-amber-500/10'
          },
          {
            label: 'Alumni Rating',
            value: `${profile?.rating || 4.96} ★`,
            icon: Star,
            sub: 'Peer satisfaction score',
            color: 'text-purple-500 bg-purple-500/10'
          }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Two-Column Main Content ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Mentorship Sessions */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Scheduled 1:1 Sessions</h2>
            </div>
            <Link to="/alumni/mentorship" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Manage Slots <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookedSlots.length === 0 ? (
            <div className="p-6 rounded-xl border text-center space-y-2" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}>
              <Clock className="w-8 h-8 mx-auto text-blue-400 opacity-60" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No booked sessions right now</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add availability slots so ambitious students can book mock sessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookedSlots.map(slot => (
                <div key={slot.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                     style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                        {slot.slotTime}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {slot.durationMinutes} mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{slot.topic}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Student: <strong className="text-blue-600">{slot.bookedByStudentName}</strong>
                    </p>
                    {slot.bookingNotes && (
                      <p className="text-xs italic line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                        "{slot.bookingNotes}"
                      </p>
                    )}
                  </div>
                  <a
                    href={slot.meetingLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Video className="w-3.5 h-3.5" /> Start Meet
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Job Referrals Desk */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Your Active Job Referrals</h2>
            </div>
            <Link to="/alumni/referrals" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
              Referral Desk <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {openReferrals.length === 0 ? (
            <div className="p-6 rounded-xl border text-center space-y-2" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}>
              <Briefcase className="w-8 h-8 mx-auto text-emerald-400 opacity-60" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No active referrals posted</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Share openings from your company to help students bypass screening queues.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openReferrals.map(ref => (
                <div key={ref.id} className="p-4 rounded-xl border space-y-2"
                     style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{ref.jobTitle}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {ref.company} • {ref.location} ({ref.experienceLevel})
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-600">
                      {ref.applicationsCount} applicants
                    </span>
                  </div>
                  {ref.minEligibility && (
                    <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                      <strong>Eligibility:</strong> {ref.minEligibility}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Req: {ref.jobCode || 'Internal'}</span>
                    <Link to="/alumni/referrals" className="text-emerald-600 hover:underline font-semibold flex items-center gap-1">
                      Review Applicants <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Community AMA & Giving Back Insights ───────────────────────────── */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Alumni AMA Community & Discussion Forum
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Students asking for off-campus advice, salary negotiation benchmarks, and GRE/MS guidance.
            </p>
          </div>
          <Link
            to="/alumni/community"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5"
            style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            View All Discussions <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              category: 'OFF-CAMPUS HIRING',
              title: 'How to prepare for off-campus Google and Microsoft hiring in final year?',
              author: 'Kavya Iyer • 3rd Year CSE',
              replies: '4 verified replies',
              badge: 'bg-blue-500/10 text-blue-600'
            },
            {
              category: 'HIGHER STUDIES',
              title: 'MS in US/Europe vs. 2 years Indian Big Tech SDE experience?',
              author: 'Aryan Mehta • 4th Year IT',
              replies: '6 verified replies',
              badge: 'bg-purple-500/10 text-purple-600'
            },
            {
              category: 'CAREER GROWTH',
              title: 'Negotiating your first compensation package as a Tier-2/3 college graduate',
              author: 'Rohan Varma • 4th Year CSE',
              replies: '8 verified replies',
              badge: 'bg-emerald-500/10 text-emerald-600'
            }
          ].map(post => (
            <div key={post.title} className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                 style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}>
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.badge}`}>
                  {post.category}
                </span>
                <h3 className="text-xs font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <span>{post.author}</span>
                <span className="font-medium text-purple-600">{post.replies}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
