import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Award, Layers, Target, TrendingUp, CheckCircle,
  ArrowRight, RefreshCw, Sparkles, Building2, ShieldCheck, Users,
  BarChart3, ExternalLink, PlusCircle
} from 'lucide-react'
import {
  facultyApi,
  type FacultyStats,
  type CurriculumCourse,
  type StudentEndorsement,
  type CapstoneProject
} from '@/api/facultyApi'
import { useAuthStore } from '@/store/authStore'

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [stats, setStats] = useState<FacultyStats | null>(null)
  const [courses, setCourses] = useState<CurriculumCourse[]>([])
  const [endorsements, setEndorsements] = useState<StudentEndorsement[]>([])
  const [projects, setProjects] = useState<CapstoneProject[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [st, crs, ends, projs] = await Promise.all([
        facultyApi.getStats(),
        facultyApi.getCurriculumCourses(),
        facultyApi.getEndorsements(),
        facultyApi.getProjects()
      ])
      setStats(st)
      setCourses(crs)
      setEndorsements(ends)
      setProjects(projs)
    } catch (err) {
      console.error('Failed to load faculty dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Academic & Industry Bridge
            </span>
            <span className="text-xs text-slate-400">AICTE NEP 2020 Framework</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Faculty Intelligence & Academic Portal
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.fullName ?? 'Professor'}. Manage curriculum skill alignment, student honors endorsements, and corporate capstones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border hover:bg-slate-50 transition"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/faculty/endorsements')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
          >
            <Award className="w-4 h-4" /> Endorse Candidate
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Curriculum Alignment',
            value: stats ? `${stats.avgCurriculumAlignment}%` : '92.5%',
            subtext: `${stats?.totalCourses ?? 4} Courses mapped to industry`,
            icon: BookOpen,
            color: 'var(--color-brand-500)',
            link: '/faculty/curriculum'
          },
          {
            label: 'Verified Endorsements',
            value: stats?.totalEndorsements ?? 3,
            subtext: 'SHA-256 stamped on Career Passport',
            icon: Award,
            color: 'hsl(262,72%,52%)',
            link: '/faculty/endorsements'
          },
          {
            label: 'Industry Capstones',
            value: stats?.activeCapstoneProjects ?? 3,
            subtext: 'Co-supervised with corporate mentors',
            icon: Layers,
            color: 'hsl(148,60%,42%)',
            link: '/faculty/projects'
          },
          {
            label: 'Placement Ready Students',
            value: stats?.placementReadyCount ?? 2,
            subtext: `${stats?.totalMockEvaluations ?? 3} Mock vivas evaluated`,
            icon: Target,
            color: 'hsl(38,92%,48%)',
            link: '/faculty/evaluations'
          },
        ].map(({ label, value, subtext, icon: Icon, color, link }) => (
          <div
            key={label}
            onClick={() => navigate(link)}
            className="p-5 rounded-2xl border cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Curriculum Skill Radar & Recent Endorsements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curriculum Alignment Spotlight */}
        <div className="lg:col-span-2 p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base font-display flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <BookOpen className="w-4 h-4 text-blue-600" />
                University Curriculum & NEP 2020 Skill Alignment
              </h2>
              <p className="text-xs text-slate-500">Real-time benchmark of syllabus topics against corporate hiring matrices.</p>
            </div>
            <button
              onClick={() => navigate('/faculty/curriculum')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View Full Syllabus <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 4).map(course => {
              let parsedSkills: string[] = []
              try {
                parsedSkills = JSON.parse(course.mappedSkillsJson || '[]')
              } catch {
                parsedSkills = []
              }

              return (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border transition hover:shadow-sm"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {course.courseCode}
                        </span>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {course.courseTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {course.department} • Semester {course.semester} • {course.aicteCredits} AICTE Credits
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 justify-end">
                          <Sparkles className="w-3.5 h-3.5" /> {course.alignmentScore}%
                        </div>
                        <p className="text-[10px] text-slate-400">Industry Fit</p>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {course.industryRelevance.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Mapped Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">Skills:</span>
                    {parsedSkills.map((sk: string) => (
                      <span key={sk} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions & Recent Endorsements */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="p-6 rounded-2xl border space-y-3" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>
              Faculty Portals & Workflows
            </h3>
            <p className="text-xs text-slate-500">Quickly jump to specialized academic and mentoring workflows.</p>

            <div className="space-y-2 pt-1">
              {[
                { title: 'Curriculum Skill Mapping', desc: 'Map course topics to industry skills & NEP credits', href: '/faculty/curriculum', icon: BookOpen, color: 'text-blue-600' },
                { title: 'Student Endorsement Studio', desc: 'Issue verifiable recommendation letters', href: '/faculty/endorsements', icon: Award, color: 'text-purple-600' },
                { title: 'Industry Capstone Projects', desc: 'Co-supervise student capstones with corporate mentors', href: '/faculty/projects', icon: Layers, color: 'text-emerald-600' },
                { title: 'Mock Viva & Evaluations', desc: 'Grade technical depth & placement readiness', href: '/faculty/evaluations', icon: Target, color: 'text-amber-600' },
              ].map(({ title, desc, href, icon: Icon, color }) => (
                <div
                  key={title}
                  onClick={() => navigate(href)}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm cursor-pointer transition"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
                >
                  <div className={`p-2 rounded-lg bg-slate-100 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Endorsements Card */}
          <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm font-display flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Endorsements
              </h3>
              <button
                onClick={() => navigate('/faculty/endorsements')}
                className="text-xs text-blue-600 hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-2.5">
              {endorsements.slice(0, 3).map(end => (
                <div
                  key={end.id}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{end.studentName}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      {end.ratingTier.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{end.specializationArea}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                    Hash: {end.verificationHash.slice(0, 16)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Capstone Projects Showcase */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base font-display flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Layers className="w-4 h-4 text-emerald-600" />
              Active Joint Industry-Academia Capstones
            </h2>
            <p className="text-xs text-slate-500">Corporate co-supervised final year projects, milestones, and corporate mentors.</p>
          </div>
          <button
            onClick={() => navigate('/faculty/projects')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Manage Capstones <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border space-y-3 flex flex-col justify-between"
              style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    {proj.stage.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{proj.progressPercentage}%</span>
                </div>
                <h4 className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {proj.projectTitle}
                </h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> {proj.industryPartner}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Students: <span className="text-slate-600 font-medium">{proj.studentNames}</span>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${proj.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Mentor: {proj.corporateMentorName ?? 'Industry Expert'}</span>
                  {proj.finalGrade && (
                    <span className="font-bold text-emerald-600">Grade: {proj.finalGrade}/10</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
