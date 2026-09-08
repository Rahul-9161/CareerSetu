import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Search, Filter, Sparkles, CheckCircle2,
  AlertCircle, ChevronRight, X, Loader2, ArrowUpRight
} from 'lucide-react'
import { facultyApi, type CurriculumCourse } from '@/api/facultyApi'
import { useAuthStore } from '@/store/authStore'

export default function CurriculumMappingPage() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState<CurriculumCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [form, setForm] = useState({
    courseCode: '',
    courseTitle: '',
    department: 'Computer Science & Engineering',
    semester: 7,
    aicteCredits: 4,
    syllabusSummary: '',
    industryRelevance: 'VERY_HIGH',
    alignmentScore: 92.0,
    skillsInput: '',
    nepCategory: 'Advanced Technical Specialization (NEP 14-Credit)',
    facultyLead: user?.fullName ?? 'Dr. Meenakshi Sundaram'
  })

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await facultyApi.getCurriculumCourses()
      setCourses(data)
    } catch (err) {
      console.error('Failed to load courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const skillsArray = form.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      await facultyApi.createCurriculumCourse({
        courseCode: form.courseCode,
        courseTitle: form.courseTitle,
        department: form.department,
        semester: Number(form.semester),
        aicteCredits: Number(form.aicteCredits),
        syllabusSummary: form.syllabusSummary,
        industryRelevance: form.industryRelevance,
        alignmentScore: Number(form.alignmentScore),
        mappedSkillsJson: JSON.stringify(skillsArray),
        nepCategory: form.nepCategory,
        facultyLead: form.facultyLead
      })

      setShowModal(false)
      // reset
      setForm({
        courseCode: '',
        courseTitle: '',
        department: 'Computer Science & Engineering',
        semester: 7,
        aicteCredits: 4,
        syllabusSummary: '',
        industryRelevance: 'VERY_HIGH',
        alignmentScore: 92.0,
        skillsInput: '',
        nepCategory: 'Advanced Technical Specialization (NEP 14-Credit)',
        facultyLead: user?.fullName ?? 'Dr. Meenakshi Sundaram'
      })
      await loadCourses()
    } catch (err) {
      console.error('Failed to create course:', err)
      alert('Failed to map course. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const departments = ['ALL', ...Array.from(new Set(courses.map(c => c.department)))]

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.mappedSkillsJson.toLowerCase().includes(search.toLowerCase())
    const matchesDept = selectedDept === 'ALL' || c.department === selectedDept
    return matchesSearch && matchesDept
  })

  const avgAlignment = courses.length
    ? Math.round((courses.reduce((acc, c) => acc + c.alignmentScore, 0) / courses.length) * 10) / 10
    : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              AICTE NEP 2020 Framework
            </span>
            <span className="text-xs text-slate-400">Industry-Academia Syllabus Mapping</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Curriculum Skill Alignment Engine
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Bridge university course syllabi with corporate skill benchmarks and track real-time NEP credit compliance.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Map New Course
        </button>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs text-slate-500 font-medium">Mapped Courses</p>
          <p className="text-xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>{courses.length}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">100% Active in Syllabi</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs text-slate-500 font-medium">Average Industry Fit</p>
          <p className="text-xl font-bold font-display mt-1 text-emerald-600">{avgAlignment}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Corporate Hiring Matrix</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs text-slate-500 font-medium">AICTE Total Credits</p>
          <p className="text-xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            {courses.reduce((acc, c) => acc + c.aicteCredits, 0)} Credits
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">NEP 2020 14-Credit Aligned</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs text-slate-500 font-medium">Top Competencies</p>
          <p className="text-xl font-bold font-display mt-1 text-purple-600">Cloud & AI</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Highest hiring correlation</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course code, title, or skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-blue-400"
            style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 flex-shrink-0">Department:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading curriculum catalog...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <p className="text-sm text-slate-500">No curriculum courses match your search criteria.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
            let parsedSkills: string[] = []
            try {
              parsedSkills = JSON.parse(course.mappedSkillsJson || '[]')
            } catch {
              parsedSkills = []
            }

            return (
              <div
                key={course.id}
                className="p-6 rounded-2xl border transition hover:shadow-sm space-y-4"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                        {course.courseCode}
                      </span>
                      <h3 className="text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                        {course.courseTitle}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {course.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Semester {course.semester} • {course.aicteCredits} AICTE Academic Credits • Faculty Lead: <span className="font-medium text-slate-700">{course.facultyLead}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600 flex items-center justify-end gap-1 font-display">
                        <Sparkles className="w-4 h-4" /> {course.alignmentScore}%
                      </div>
                      <p className="text-[11px] text-slate-400">Industry Fit Matrix</p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-xl font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {course.industryRelevance.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Syllabus Summary */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {course.syllabusSummary}
                </p>

                {/* Competency Category & Skills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">NEP Framework:</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-200">
                      {course.nepCategory}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-slate-400 mr-1">Skills:</span>
                    {parsedSkills.map((sk: string) => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal: Map New Course */}
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
                    Map University Course to Industry Skills
                  </h3>
                  <p className="text-xs text-slate-500">AICTE NEP 2020 syllabus alignment registration</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Course Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. CS401"
                      value={form.courseCode}
                      onChange={e => setForm({ ...form, courseCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400 font-mono"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Course Title *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Distributed Systems & Cloud"
                      value={form.courseTitle}
                      onChange={e => setForm({ ...form, courseTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                    <select
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Semester *</label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={8}
                      value={form.semester}
                      onChange={e => setForm({ ...form, semester: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">AICTE Credits *</label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={8}
                      value={form.aicteCredits}
                      onChange={e => setForm({ ...form, aicteCredits: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Syllabus Overview *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Key concepts, lab exercises, and architectural paradigms covered..."
                    value={form.syllabusSummary}
                    onChange={e => setForm({ ...form, syllabusSummary: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Industry Relevance</label>
                    <select
                      value={form.industryRelevance}
                      onChange={e => setForm({ ...form, industryRelevance: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    >
                      <option value="VERY_HIGH">VERY HIGH</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MODERATE">MODERATE</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Alignment Benchmark (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={100}
                      value={form.alignmentScore}
                      onChange={e => setForm({ ...form, alignmentScore: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mapped Industry Skills (Comma Separated) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Kubernetes, gRPC, Kafka, Consensus, Docker"
                    value={form.skillsInput}
                    onChange={e => setForm({ ...form, skillsInput: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NEP Category</label>
                    <input
                      type="text"
                      value={form.nepCategory}
                      onChange={e => setForm({ ...form, nepCategory: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Faculty Lead</label>
                    <input
                      type="text"
                      value={form.facultyLead}
                      onChange={e => setForm({ ...form, facultyLead: e.target.value })}
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
                    Save Mapping
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
