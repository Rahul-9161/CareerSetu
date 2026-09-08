import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, Building2, GraduationCap, MapPin, Star,
  Globe, ExternalLink, Calendar, Briefcase, Award, Sparkles, Filter
} from 'lucide-react'
import { alumniApi, type AlumniProfile } from '@/api/alumniApi'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function AlumniDirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL')

  useEffect(() => {
    fetchDirectory()
  }, [])

  const fetchDirectory = async (query?: string) => {
    try {
      setLoading(true)
      const data = await alumniApi.getDirectory(query)
      setAlumni(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load alumni directory')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDirectory(search)
  }

  const filteredAlumni = alumni.filter(a => {
    if (selectedCompany === 'ALL') return true
    return a.currentCompany.toLowerCase().includes(selectedCompany.toLowerCase())
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
          CareerSetu Alumni Network Directory
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Connect with verified university alumni working at premier global product firms and leading Indian tech companies.
        </p>
      </div>

      {/* ── Search & Filter Bar ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search alumni by name, company, batch, or skill (e.g. Google, Distributed Systems)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-400"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-semibold text-white gradient-brand"
          >
            Search
          </button>
        </form>

        {/* Company filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'Google', 'Microsoft', 'Amazon', 'Zomato', 'Atlassian'].map(company => (
            <button
              key={company}
              onClick={() => setSelectedCompany(company)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCompany === company
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-200/50'
              }`}
              style={selectedCompany !== company ? { color: 'var(--text-secondary)' } : {}}
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      {/* ── Directory Cards Grid ──────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-12 text-xs" style={{ color: 'var(--text-muted)' }}>
          Loading alumni directory profiles...
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border space-y-2" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <Users className="w-8 h-8 mx-auto text-blue-400 opacity-60" />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No alumni matching your search</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try broader search keywords or reset company filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlumni.map(alum => (
            <div
              key={alum.id}
              className="p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:shadow-lg transition"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="space-y-3">
                {/* Avatar and basic info */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm">
                    {alum.avatarInitials || alum.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {alum.fullName}
                      </h3>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" /> {alum.rating}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                      {alum.designation} @ {alum.currentCompany}
                    </p>
                    <p className="text-[11px] truncate flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <GraduationCap className="w-3.5 h-3.5" /> Batch of {alum.graduationYear} • {alum.degree.split(' ')[0]}
                    </p>
                  </div>
                </div>

                {/* Location & Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-3 h-3" /> {alum.location}
                  </div>
                  {alum.bio && (
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {alum.bio}
                    </p>
                  )}
                </div>

                {/* Expertise tags */}
                {alum.expertise && (
                  <div className="flex flex-wrap gap-1">
                    {alum.expertise.split(',').slice(0, 4).map(skill => (
                      <span
                        key={skill.trim()}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                        style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Giving back impact metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-center text-xs" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="font-bold text-blue-600">{alum.totalMenteesHelped}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Mentees Guided</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="font-bold text-emerald-600">{alum.totalReferralsGiven}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Referrals Given</div>
                  </div>
                </div>
              </div>

              {/* Social and action buttons */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-2">
                  {alum.linkedinUrl && (
                    <a href={alum.linkedinUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border hover:text-blue-600 transition" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {alum.githubUrl && (
                    <a href={alum.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border hover:text-slate-900 dark:hover:text-white transition" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <Link
                  to="/student/alumni"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white gradient-brand flex items-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" /> Connect
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
