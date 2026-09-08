import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Building2, Plus, Search, Filter, CheckCircle,
  Clock, GitBranch, ExternalLink, X, Loader2, Award, Edit3
} from 'lucide-react'
import { facultyApi, type CapstoneProject } from '@/api/facultyApi'
import { useAuthStore } from '@/store/authStore'

export default function CapstoneProjectsPage() {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<CapstoneProject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStage, setSelectedStage] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<CapstoneProject | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Create form state
  const [createForm, setCreateForm] = useState({
    projectTitle: '',
    industryPartner: 'TechCorp India',
    corporateMentorName: '',
    facultyGuideName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
    studentNames: '',
    stage: 'PROPOSAL',
    progressPercentage: 15,
    domainArea: 'Cloud Native & Edge AI',
    milestoneNotes: '',
    repoUrl: ''
  })

  // Update stage form state
  const [updateForm, setUpdateForm] = useState({
    stage: 'MID_TERM',
    progressPercentage: 50,
    finalGrade: 9.0,
    milestoneNotes: ''
  })

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await facultyApi.getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load capstones:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await facultyApi.createProject({
        ...createForm,
        progressPercentage: Number(createForm.progressPercentage)
      })
      setShowCreateModal(false)
      setCreateForm({
        projectTitle: '',
        industryPartner: 'TechCorp India',
        corporateMentorName: '',
        facultyGuideName: user?.fullName ?? 'Dr. Meenakshi Sundaram',
        studentNames: '',
        stage: 'PROPOSAL',
        progressPercentage: 15,
        domainArea: 'Cloud Native & Edge AI',
        milestoneNotes: '',
        repoUrl: ''
      })
      await loadProjects()
    } catch (err) {
      console.error('Failed to create capstone:', err)
      alert('Failed to register project. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenUpdate = (proj: CapstoneProject) => {
    setSelectedProject(proj)
    setUpdateForm({
      stage: proj.stage,
      progressPercentage: proj.progressPercentage,
      finalGrade: proj.finalGrade ?? 9.0,
      milestoneNotes: proj.milestoneNotes ?? ''
    })
  }

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return
    setSubmitting(true)
    try {
      await facultyApi.updateProjectStage(selectedProject.id, {
        stage: updateForm.stage,
        progressPercentage: Number(updateForm.progressPercentage),
        finalGrade: updateForm.stage === 'COMPLETED' || updateForm.stage === 'FINAL_VIVA' ? Number(updateForm.finalGrade) : undefined,
        milestoneNotes: updateForm.milestoneNotes
      })
      setSelectedProject(null)
      await loadProjects()
    } catch (err) {
      console.error('Failed to update stage:', err)
      alert('Failed to update milestone. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stages = ['ALL', 'PROPOSAL', 'MID_TERM', 'INDUSTRY_REVIEW', 'FINAL_VIVA', 'COMPLETED']

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.industryPartner.toLowerCase().includes(search.toLowerCase()) ||
      p.studentNames.toLowerCase().includes(search.toLowerCase()) ||
      (p.corporateMentorName && p.corporateMentorName.toLowerCase().includes(search.toLowerCase()))
    const matchesStage = selectedStage === 'ALL' || p.stage === selectedStage
    return matchesSearch && matchesStage
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Industry-Academia Co-Supervision
            </span>
            <span className="text-xs text-slate-400">Joint Capstone & Viva Tracking</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Industry Capstone Projects
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Track collaborative industry-sponsored final year projects, review corporate mentor feedback, and conduct final viva assessments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Register Capstone
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search project title, partner, or students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-emerald-400"
            style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 flex-shrink-0">Stage:</span>
          {stages.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedStage === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            Loading capstone projects...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <p className="text-sm text-slate-500">No industry capstone projects found matching your criteria.</p>
          </div>
        ) : (
          filtered.map(proj => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl border transition hover:shadow-sm space-y-4"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                      {proj.stage.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                      {proj.projectTitle}
                    </h3>
                    {proj.domainArea && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {proj.domainArea}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <Building2 className="w-3.5 h-3.5" /> {proj.industryPartner}
                    </span>
                    <span>•</span>
                    <span>Corporate Mentor: <strong className="text-slate-700">{proj.corporateMentorName ?? 'Industry Lead'}</strong></span>
                    <span>•</span>
                    <span>Faculty Guide: <strong className="text-slate-700">{proj.facultyGuideName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {proj.finalGrade && (
                    <div className="text-right">
                      <p className="text-base font-bold font-display text-emerald-600">{proj.finalGrade} / 10</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Viva Score</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleOpenUpdate(proj)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Milestone & Viva
                  </button>
                </div>
              </div>

              {/* Progress and Student details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Project Completion:</span>
                    <span className="font-bold text-slate-800">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Student Team:</span>{' '}
                    <span className="font-semibold text-slate-800">{proj.studentNames}</span>
                  </div>
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <GitBranch className="w-3 h-3" /> Repository <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Milestone Notes */}
              {proj.milestoneNotes && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">Latest Review Notes:</span> {proj.milestoneNotes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Register Capstone */}
      <AnimatePresence>
        {showCreateModal && (
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
                    Register Industry-Academia Capstone Project
                  </h3>
                  <p className="text-xs text-slate-500">Joint final year collaborative engineering and R&D project</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Autonomous UAV Dispatch System for Emergency Medical Delivery"
                    value={createForm.projectTitle}
                    onChange={e => setCreateForm({ ...createForm, projectTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Industry Partner *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. TechCorp India"
                      value={createForm.industryPartner}
                      onChange={e => setCreateForm({ ...createForm, industryPartner: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Corporate Mentor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Patel"
                      value={createForm.corporateMentorName}
                      onChange={e => setCreateForm({ ...createForm, corporateMentorName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Student Names *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aarav Sharma, Divya Nair"
                      value={createForm.studentNames}
                      onChange={e => setCreateForm({ ...createForm, studentNames: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Technical Domain</label>
                    <input
                      type="text"
                      placeholder="e.g. Edge AI & Distributed Systems"
                      value={createForm.domainArea}
                      onChange={e => setCreateForm({ ...createForm, domainArea: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Initial Stage</label>
                    <select
                      value={createForm.stage}
                      onChange={e => setCreateForm({ ...createForm, stage: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    >
                      <option value="PROPOSAL">Proposal</option>
                      <option value="MID_TERM">Mid Term</option>
                      <option value="INDUSTRY_REVIEW">Industry Review</option>
                      <option value="FINAL_VIVA">Final Viva</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Code Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={createForm.repoUrl}
                      onChange={e => setCreateForm({ ...createForm, repoUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Milestone Description & Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Describe deliverable expectations, architecture milestones, and timeline..."
                    value={createForm.milestoneNotes}
                    onChange={e => setCreateForm({ ...createForm, milestoneNotes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-400"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
                    Register Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Update Stage & Grade */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-4"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <h3 className="font-bold text-base font-display" style={{ color: 'var(--text-primary)' }}>
                    Update Project Stage & Viva Grade
                  </h3>
                  <p className="text-xs text-slate-500">{selectedProject.projectTitle}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStage} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Stage Progression *</label>
                    <select
                      value={updateForm.stage}
                      onChange={e => setUpdateForm({ ...updateForm, stage: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    >
                      <option value="PROPOSAL">Proposal</option>
                      <option value="MID_TERM">Mid Term</option>
                      <option value="INDUSTRY_REVIEW">Industry Review</option>
                      <option value="FINAL_VIVA">Final Viva</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Progress Percentage (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={updateForm.progressPercentage}
                      onChange={e => setUpdateForm({ ...updateForm, progressPercentage: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Final Viva Grade (Out of 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={10}
                    value={updateForm.finalGrade}
                    onChange={e => setUpdateForm({ ...updateForm, finalGrade: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border outline-none"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Milestone & Viva Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter review notes or external examiner feedback..."
                    value={updateForm.milestoneNotes}
                    onChange={e => setUpdateForm({ ...updateForm, milestoneNotes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none"
                    style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
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
                    Save Progress
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
