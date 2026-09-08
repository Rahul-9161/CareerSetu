import React, { useEffect, useState } from 'react'
import {
  Award,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileCheck2,
  Building2,
  Download,
  GraduationCap,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  BarChart3,
  ExternalLink
} from 'lucide-react'
import {
  accreditationApi,
  type AccreditationReport,
  type DepartmentMetric,
  type ProgressionRecord,
  type SimulationResponse,
  type NirfDcsExport
} from '../../api/accreditationApi'

export const AccreditationDashboardPage: React.FC = () => {
  const [report, setReport] = useState<AccreditationReport | null>(null)
  const [departments, setDepartments] = useState<DepartmentMetric[]>([])
  const [records, setRecords] = useState<ProgressionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'ALL' | 'CAMPUS_PLACEMENT' | 'HIGHER_STUDIES' | 'COMPETITIVE_EXAM_QUALIFIED'>('ALL')
  const [selectedDept, setSelectedDept] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Simulator state
  const [simAdditionalOffers, setSimAdditionalOffers] = useState<number>(35)
  const [simMedianSalary, setSimMedianSalary] = useState<number>(16.0)
  const [simHigherStudies, setSimHigherStudies] = useState<number>(85)
  const [simResult, setSimResult] = useState<SimulationResponse | null>(null)
  const [simulating, setSimulating] = useState(false)

  // Export state
  const [exportData, setExportData] = useState<NirfDcsExport | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [repRes, deptRes, recRes] = await Promise.all([
        accreditationApi.getLatestReport('2025-26'),
        accreditationApi.getDepartmentMetrics(),
        accreditationApi.getProgressionRecords()
      ])
      setReport(repRes)
      setDepartments(deptRes)
      setRecords(recRes)

      // Run default simulation
      const sim = await accreditationApi.simulateNirf({
        projectedAdditionalOffers: 35,
        projectedMedianSalaryLpa: 16.0,
        higherStudiesTarget: 85
      })
      setSimResult(sim)
    } catch (err: any) {
      console.error('Failed to load accreditation data:', err)
      setMessage({ type: 'error', text: 'Failed to load accreditation reports.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRunSimulation = async (additional: number, median: number, higherStudies: number) => {
    try {
      setSimulating(true)
      const sim = await accreditationApi.simulateNirf({
        projectedAdditionalOffers: additional,
        projectedMedianSalaryLpa: median,
        higherStudiesTarget: higherStudies
      })
      setSimResult(sim)
    } catch (err) {
      console.error(err)
    } finally {
      setSimulating(false)
    }
  }

  const handleVerifyRecord = async (id: string) => {
    try {
      setVerifyingId(id)
      const updated = await accreditationApi.verifyRecord(id, 'VERIFIED_BY_TPO')
      setRecords(prev => prev.map(r => r.id === id ? updated : r))
      setMessage({ type: 'success', text: `Verified offer proof for ${updated.studentName} (${updated.rollNumber})` })
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification failed.' })
    } finally {
      setVerifyingId(null)
    }
  }

  const handleOpenExport = async () => {
    try {
      const data = await accreditationApi.exportNirfDcs('2025-26')
      setExportData(data)
      setShowExportModal(true)
    } catch (err) {
      console.error(err)
    }
  }

  const filteredRecords = records.filter(r => {
    const matchesDept = selectedDept === 'ALL' || r.department.toLowerCase().includes(selectedDept.toLowerCase())
    let matchesTab = true
    if (activeTab === 'CAMPUS_PLACEMENT') {
      matchesTab = r.progressionType.includes('PLACEMENT')
    } else if (activeTab === 'HIGHER_STUDIES') {
      matchesTab = r.progressionType.includes('HIGHER_STUDIES')
    } else if (activeTab === 'COMPETITIVE_EXAM_QUALIFIED') {
      matchesTab = r.progressionType === 'COMPETITIVE_EXAM_QUALIFIED'
    }
    const matchesSearch = !searchQuery ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organizationOrUniversity.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesTab && matchesSearch
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Banner with YouTube-Ready Aesthetics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" /> NIRF 2026 Ranking Suite
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> NAAC A++ (CGPA 3.82)
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <FileCheck2 className="w-3.5 h-3.5" /> NBA Tier-1 Accredited
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Institutional Accreditation & Placement Audit Engine
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
              Automated statutory compliance for Ministry of Education NIRF (Graduation Outcome GO),
              NAAC Criterion 5.2.1/5.2.2 verifiable evidence vault, and NBA program-wise student outcome tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenExport}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" /> Export NIRF DCS
            </button>
          </div>
        </div>

        {/* Institution Info Badge bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200 text-sm">{report?.institutionName || 'National Institute of Technology Surathkal'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-mono">Academic Year: {report?.academicYear || '2025-26'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>IQAC Sign-off: <strong className="text-slate-200">{report?.iqacCoordinatorName || 'Prof. K. R. Venkatraman'}</strong></span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {report?.auditStatus.replace(/_/g, ' ') || 'IQAC VERIFIED'}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p>{message.text}</p>
        </div>
      )}

      {/* Top Metrics Row: NIRF GO Radial / Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NIRF GO Score Gauge */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-amber-500/30 p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">NIRF GO Score</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{report?.nirfGoScore || 84.6}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-xs font-medium text-amber-300">
            {report?.nirfRankBandEstimate || 'Rank 12 - 18 National'}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>GPH: 38.2 / 40</span>
            <span>GMS: 28.4 / 40</span>
          </div>
        </div>

        {/* NAAC Criterion 5.2 */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/50 border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">NAAC Metric 5.2</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{report?.naacPlacementRatio || 87.29}%</span>
            <span className="text-xs text-emerald-400">Placed</span>
          </div>
          <div className="mt-2 text-xs text-emerald-300 font-medium">
            + {report?.naacProgressionRatio || 8.0}% Higher Studies
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Graduates: {report?.totalGraduatingBatch || 850}</span>
            <span>Placed: {report?.totalPlaced || 742}</span>
          </div>
        </div>

        {/* Median CTC */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Median Package (GMS)</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">₹{report?.medianSalaryLpa || 14.5}</span>
            <span className="text-xs text-slate-400">LPA</span>
          </div>
          <div className="mt-2 text-xs text-cyan-300 font-medium">
            Average: ₹{report?.averageSalaryLpa || 16.8} LPA
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Highest: ₹{report?.highestSalaryLpa || 54.0} LPA</span>
            <span className="text-emerald-400">+18% YoY Growth</span>
          </div>
        </div>

        {/* NBA Criterion 4 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">NBA Criterion 4 Index</span>
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{report?.nbaPlacementIndex || 0.95}</span>
            <span className="text-xs text-slate-400">/ 1.0</span>
          </div>
          <div className="mt-2 text-xs text-indigo-300 font-medium">
            Tier-1 Substantial Equivalency
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Washington Accord</span>
            <span className="text-emerald-400 font-semibold">Tier-1 Valid</span>
          </div>
        </div>
      </div>

      {/* Section 1: Interactive "What-If" Ranking Simulator */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-amber-400" />
              Statutory Ranking Simulator: What-If Placement Impact Engine
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Simulate how converting additional campus placements or driving higher median CTC impacts the NIRF Graduation Outcome (GO) formula in real-time.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Real-time Formula Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Controls Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Projected Additional Campus Offers</span>
                <span className="text-amber-400 font-mono">+{simAdditionalOffers} Offers</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simAdditionalOffers}
                onChange={e => {
                  const val = Number(e.target.value)
                  setSimAdditionalOffers(val)
                  handleRunSimulation(val, simMedianSalary, simHigherStudies)
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0 Offers</span>
                <span>+50 Offers</span>
                <span>+100 Offers</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Target Median Salary (GMS Benchmark)</span>
                <span className="text-cyan-400 font-mono">₹{simMedianSalary.toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="25.0"
                step="0.5"
                value={simMedianSalary}
                onChange={e => {
                  const val = Number(e.target.value)
                  setSimMedianSalary(val)
                  handleRunSimulation(simAdditionalOffers, val, simHigherStudies)
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹10.0 LPA</span>
                <span>₹17.5 LPA</span>
                <span>₹25.0 LPA</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Higher Studies Progression Target</span>
                <span className="text-emerald-400 font-mono">{simHigherStudies} Students</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={simHigherStudies}
                onChange={e => {
                  const val = Number(e.target.value)
                  setSimHigherStudies(val)
                  handleRunSimulation(simAdditionalOffers, simMedianSalary, val)
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>20 Students</span>
                <span>85 Students</span>
                <span>150 Students</span>
              </div>
            </div>
          </div>

          {/* Results Projection Card */}
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Projected NIRF Standing
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">Current Score</div>
                  <div className="text-xl font-bold text-slate-300">{simResult?.currentGoScore || 84.6}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="text-xs text-amber-400 font-semibold">Simulated Score</div>
                  <div className="text-2xl font-extrabold text-amber-400">{simResult?.projectedGoScore || 88.2}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Rank Band:</span>
                  <span className="font-semibold text-slate-300">{simResult?.currentRankBand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Rank Band:</span>
                  <span className="font-bold text-emerald-400">{simResult?.projectedRankBand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPH Placement Delta:</span>
                  <span className="font-mono text-cyan-400">+{simResult?.gphDelta} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GMS Salary Delta:</span>
                  <span className="font-mono text-cyan-400">+{simResult?.gmsDelta} pts</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-amber-300 font-semibold block mb-1">IQAC Strategic Recommendation:</strong>
              {simResult?.recommendationText}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Department-wise NBA Criterion 4 Outcome Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Department-Wise Accreditation Outcomes (NBA Criterion 4 Matrix)
            </h2>
            <p className="text-xs text-slate-400">
              Departmental breakdown measuring placement percentages, core engineering distribution, and median CTCs.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            {departments.length} Engineering Programs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map(d => (
            <div
              key={d.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    NBA: {d.nbaPlacementScore} / 40
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {Math.round((d.placedStudents / d.graduatedStudents) * 100)}% Placed
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mt-2">{d.department}</h3>

                <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Intake / Graduated:</span>
                    <strong className="text-slate-200">{d.intakeCapacity} / {d.graduatedStudents}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Placed Students:</span>
                    <strong className="text-emerald-400">{d.placedStudents} Students</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Higher Studies:</span>
                    <strong className="text-slate-200">{d.higherStudiesStudents} Students</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Sector Share:</span>
                    <strong className="text-amber-400">{d.coreSectorPlacedPercentage}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Median Package:</span>
                <span className="text-sm font-bold text-cyan-300">₹{d.medianPackageLpa} LPA</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Verifiable NAAC Criterion 5.2 Evidence Vault */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              NAAC Criterion 5.2 Verifiable Progression & Offer Evidence Vault
            </h2>
            <p className="text-xs text-slate-400">
              Audit-ready roster of outgoing students with verifiable offer letters, payslips, and admission proofs for NAAC peer review committees.
            </p>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {['ALL', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDept === dept
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('CAMPUS_PLACEMENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'CAMPUS_PLACEMENT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Placements (5.2.1)
            </button>
            <button
              onClick={() => setActiveTab('HIGHER_STUDIES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'HIGHER_STUDIES' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Higher Education (5.2.2)
            </button>
            <button
              onClick={() => setActiveTab('COMPETITIVE_EXAM_QUALIFIED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'COMPETITIVE_EXAM_QUALIFIED' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              GATE / Exam Qualifiers (5.2.3)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, roll no, org..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Student & Roll No</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Organization / University</th>
                <th className="py-3.5 px-4 font-semibold">Role / Program</th>
                <th className="py-3.5 px-4 font-semibold">Package (CTC)</th>
                <th className="py-3.5 px-4 font-semibold">Status & Proof</th>
                <th className="py-3.5 px-4 font-semibold text-right">TPO Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{r.studentName}</div>
                    <div className="text-xs text-slate-400 font-mono">{r.rollNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 text-xs">{r.department}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{r.organizationOrUniversity}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{r.designationOrProgram}</td>
                  <td className="py-3.5 px-4 font-semibold text-cyan-300">
                    {r.annualPackageLpa && r.annualPackageLpa > 0 ? `₹${r.annualPackageLpa} LPA` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> {r.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{r.appointmentOrAdmissionRef}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.verificationStatus === 'VERIFIED_BY_TPO' ? (
                      <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Endorsed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyRecord(r.id)}
                        disabled={verifyingId === r.id}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                      >
                        {verifyingId === r.id ? 'Verifying...' : 'Verify Proof'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Official NIRF DCS Format Export */}
      {showExportModal && exportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                NIRF Data Capturing System (DCS) Official Export
              </h3>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {exportData.institutionCode}
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-slate-300 text-sm mb-2">{exportData.institutionName}</div>
                <div className="grid grid-cols-2 gap-3 text-slate-400">
                  <div>Academic Year: <strong className="text-white">{exportData.academicYear}</strong></div>
                  <div>Sanctioned Intake: <strong className="text-white">{exportData.sanctionedIntake}</strong></div>
                  <div>Total Actual Graduates: <strong className="text-white">{exportData.totalActualGraduates}</strong></div>
                  <div>Students Placed: <strong className="text-emerald-400">{exportData.studentsPlaced}</strong></div>
                  <div>Median Salary (LPA): <strong className="text-cyan-400">₹{exportData.medianSalaryPlaced} LPA</strong></div>
                  <div>Higher Studies Selected: <strong className="text-white">{exportData.studentsHigherStudies}</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  DCS JSON Schema Payload
                </div>
                <pre className="text-[11px] font-mono text-amber-300/90 bg-slate-900 p-3 rounded-lg overflow-x-auto max-h-44 border border-slate-800">
                  {JSON.stringify(exportData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `NIRF_DCS_SURATHKAL_${exportData.academicYear}.json`
                  a.click()
                  setShowExportModal(false)
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
              >
                Download Official JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AccreditationDashboardPage
