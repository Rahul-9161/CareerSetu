import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Plus, ThumbsUp, MessageCircle, Sparkles,
  Award, ShieldCheck, CheckCircle2, User, Send, Filter
} from 'lucide-react'
import { alumniApi, type AlumniDiscussionPost } from '@/api/alumniApi'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function AlumniCommunityPage() {
  const { user } = useAuthStore()
  const [discussions, setDiscussions] = useState<AlumniDiscussionPost[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<AlumniDiscussionPost | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // New question state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postCategory, setPostCategory] = useState('OFF_CAMPUS_REFERRALS')

  // Reply answer state
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    fetchDiscussions()
  }, [category])

  const fetchDiscussions = async () => {
    try {
      setLoading(true)
      const data = await alumniApi.getDiscussions(category === 'ALL' ? undefined : category)
      setDiscussions(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load discussions')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      toast.error('Please fill in title and description')
      return
    }

    try {
      setSubmitting(true)
      await alumniApi.createDiscussion({
        title,
        content,
        category: postCategory,
        authorName: user?.fullName || 'Student',
        authorRole: user?.primaryRole === 'ALUMNI' ? 'ALUMNI' : 'STUDENT',
        companyOrBranch: user?.primaryRole === 'ALUMNI' ? 'Verified Alumnus' : '4th Year • CSE'
      })
      toast.success('Question posted to alumni community!')
      setModalOpen(false)
      setTitle('')
      setContent('')
      fetchDiscussions()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create discussion post')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePinAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !answer) return

    try {
      setSubmitting(true)
      await alumniApi.pinAnswer(selectedPost.id, answer, user?.fullName || 'Senior Alumnus')
      toast.success('Official alumni guidance pinned successfully!')
      setReplyModalOpen(false)
      setAnswer('')
      fetchDiscussions()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
            <MessageSquare className="w-6 h-6 text-purple-500" />
            Alum-Connect Community AMA Desk
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ask questions on off-campus hiring, MS admissions, resume filters, and receive verified answers from working alumni.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Ask a Question
        </button>
      </div>

      {/* ── Category Filters ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
        {[
          { label: 'All Discussions', val: 'ALL' },
          { label: 'Off-Campus Hiring', val: 'OFF_CAMPUS_REFERRALS' },
          { label: 'Higher Studies & MS', val: 'HIGHER_STUDIES' },
          { label: 'Interview Prep', val: 'INTERVIEW_PREP' },
          { label: 'Career Growth & Offers', val: 'CAREER_GROWTH' },
        ].map(cat => (
          <button
            key={cat.val}
            onClick={() => setCategory(cat.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              category === cat.val
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-slate-200/50'
            }`}
            style={category !== cat.val ? { color: 'var(--text-secondary)' } : {}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Discussion Feed ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-12 text-xs" style={{ color: 'var(--text-muted)' }}>
          Loading community discussions...
        </div>
      ) : discussions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border space-y-2" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <MessageSquare className="w-8 h-8 mx-auto text-purple-400 opacity-60" />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No discussions in this category</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Be the first to ask an insightful question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map(post => (
            <div
              key={post.id}
              className="p-6 rounded-2xl border space-y-4 transition hover:shadow-md"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              {/* Question metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{post.authorName}</span>
                  <span style={{ color: 'var(--text-muted)' }}>• {post.companyOrBranch}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 uppercase">
                  {post.category.replace('_', ' ')}
                </span>
              </div>

              {/* Title and question */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>
              </div>

              {/* Pinned Alumnus Answer */}
              {post.pinnedAnswer ? (
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%)', borderColor: 'rgba(147, 51, 234, 0.2)' }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="w-4 h-4" /> Verified Alumnus Answer by {post.pinnedByAlumni}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {post.pinnedAnswer}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg border text-xs flex items-center justify-between"
                     style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>No pinned answer yet. Alumni are invited to answer!</span>
                  <button
                    onClick={() => {
                      setSelectedPost(post)
                      setReplyModalOpen(true)
                    }}
                    className="text-xs font-semibold text-purple-600 hover:underline"
                  >
                    Answer Question
                  </button>
                </div>
              )}

              {/* Engagement metrics and actions */}
              <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:text-purple-600 cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> {post.likesCount} Upvotes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.repliesCount} Responses
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPost(post)
                    setReplyModalOpen(true)
                  }}
                  className="px-3 py-1 rounded-lg font-semibold border hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-600 transition flex items-center gap-1"
                  style={{ borderColor: 'var(--border-default)' }}
                >
                  <Send className="w-3 h-3" /> Contribute Advice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Ask a Question ──────────────────────────────────────────── */}
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
                  Ask the Alumni Community
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Category</label>
                  <select
                    value={postCategory}
                    onChange={e => setPostCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  >
                    <option value="OFF_CAMPUS_REFERRALS">Off-Campus Hiring & Referrals</option>
                    <option value="HIGHER_STUDIES">Higher Studies (MS/PhD Abroad)</option>
                    <option value="INTERVIEW_PREP">System Design & Interview Prep</option>
                    <option value="CAREER_GROWTH">Career Growth & Compensation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Question Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to transition from services company to product SDE?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Detailed Context</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific details about your current year, preparation status, or choices..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
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
                    {submitting ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Contribute Alumnus Advice ───────────────────────────────── */}
      <AnimatePresence>
        {replyModalOpen && (
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
                  Contribute Verified Advice
                </h2>
                <button onClick={() => setReplyModalOpen(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>

              {selectedPost && (
                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs" style={{ borderColor: 'var(--border-light)' }}>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedPost.title}</p>
                </div>
              )}

              <form onSubmit={handlePinAnswer} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Your Guidance & Actionable Advice
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Share concrete steps, learning resources, and mental models from your industry journey..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyModalOpen(false)}
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
                    {submitting ? 'Submitting...' : 'Submit & Pin Advice'}
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
