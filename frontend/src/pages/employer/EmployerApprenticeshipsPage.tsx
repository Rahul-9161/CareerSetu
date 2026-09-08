import React, { useEffect, useState } from 'react'
import {
  Users,
  Building2,
  FileCheck2,
  Landmark,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  TrendingUp,
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {
  apprenticeshipApi,
  type NatsContractResponse,
  type DbtDisbursementResponse,
  type CreateNatsContractRequest
} from '../../api/apprenticeshipApi'

export const EmployerApprenticeshipsPage: React.FC = () => {
  const { user } = useAuthStore()
  const employerId = user?.id || '86d87057-4912-4c92-a427-a463e018b454'
  const employerName = user?.fullName || 'TechCorp India Technologies'

  const [contracts, setContracts] = useState<NatsContractResponse[]>([])
  const [disbursements, setDisbursements] = useState<DbtDisbursementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [signingContractId, setSigningContractId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states for new contract
  const [newContract, setNewContract] = useState<CreateNatsContractRequest>({
    studentId: '212ac01c-bcb2-42b0-9179-243964025db4',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@careersetu.in',
    institutionId: 'inst-nit-surathkal',
    institutionName: 'National Institute of Technology Surathkal',
    employerId,
    employerName,
    tradeDiscipline: 'Full Stack Cloud & DevOps Engineering',
    apprenticeshipType: 'GRADUATE_APPRENTICE',
    stipendTotalMonthly: 22000,
    govSubsidyDbtShare: 4500,
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    durationMonths: 12,
    boatRegion: 'BOAT_WESTERN_REGION',
    bankAccountMasked: 'XXXX-XXXX-4921',
    bankIfscCode: 'SBIN0001234'
  })

  // Form states for DBT claim
  const [claimMonthYear, setClaimMonthYear] = useState('April 2026')
  const [claimDaysAttended, setClaimDaysAttended] = useState(26)
  const [claimEmployerPaid, setClaimEmployerPaid] = useState(15500)
  const [submittingClaim, setSubmittingClaim] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const contractsRes = await apprenticeshipApi.getEmployerContracts(employerId)
      setContracts(contractsRes)
      if (contractsRes.length > 0) {
        setSelectedContractId(contractsRes[0].id)
        const disbRes = await apprenticeshipApi.getContractDisbursements(contractsRes[0].id)
        setDisbursements(disbRes)
      }
    } catch (err: any) {
      console.error('Failed to load employer apprenticeship data:', err)
      setMessage({ type: 'error', text: 'Failed to load apprenticeship contracts.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [employerId])

  const handleContractSelect = async (cId: string) => {
    setSelectedContractId(cId)
    try {
      const disbRes = await apprenticeshipApi.getContractDisbursements(cId)
      setDisbursements(disbRes)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignContract = async (contractId: string) => {
    try {
      setSigningContractId(contractId)
      const updated = await apprenticeshipApi.signContract(contractId, {
        party: 'EMPLOYER',
        signerName: employerName,
        signerRole: 'AUTHORIZED_SIGNATORY_HR'
      })
      setContracts(prev => prev.map(c => c.id === contractId ? updated : c))
      setMessage({ type: 'success', text: 'Contract signed by Employer with Digital Certificate!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to sign contract.' })
    } finally {
      setSigningContractId(null)
    }
  }

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await apprenticeshipApi.createContract(newContract)
      setContracts(prev => [created, ...prev])
      setShowCreateModal(false)
      setMessage({ type: 'success', text: `NATS 2.0 Contract ${created.contractNumber} successfully drafted!` })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to draft contract.' })
    }
  }

  const handleGenerateClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContractId) return
    try {
      setSubmittingClaim(true)
      const newDisb = await apprenticeshipApi.generateDbtClaim({
        contractId: selectedContractId,
        monthYear: claimMonthYear,
        daysAttended: claimDaysAttended,
        employerPaidAmount: claimEmployerPaid
      })
      setDisbursements(prev => [newDisb, ...prev])
      setShowClaimModal(false)
      setMessage({ type: 'success', text: `DBT Reimbursement Claim submitted to PFMS for ${claimMonthYear}!` })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to submit DBT subsidy claim.' })
    } finally {
      setSubmittingClaim(false)
    }
  }

  const totalApprentices = contracts.length
  const totalMonthlyStipendOutflow = contracts.reduce((acc, c) => acc + c.stipendTotalMonthly, 0)
  const totalGovtSubsidyReclaimed = disbursements.reduce((acc, d) => acc + d.govtSubsidyDbtAmount, 0)
  const netEmployerShare = contracts.reduce((acc, c) => acc + c.employerContributionShare, 0)

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> NATS 2.0 Host Establishment
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> BOAT Western Region
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> PFMS Direct Benefit Transfer
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Apprenticeship Contracts & DBT Subsidy Claims
            </h1>
            <p className="text-slate-400 mt-1.5 max-w-2xl text-sm md:text-base">
              Manage NATS 2.0 apprentice agreements, certify monthly attendance, and claim
              25% (up to ₹4,500/month) Direct Benefit Transfer subsidy directly from the Ministry of Education.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowClaimModal(true)}
              disabled={contracts.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium shadow-lg shadow-amber-900/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Generate DBT Claim
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-900/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Issue NATS Contract
            </button>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Apprentices</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalApprentices}</div>
            <p className="text-xs text-slate-400 mt-1">Graduate & technician trainees</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Stipends</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">₹{totalMonthlyStipendOutflow.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Gross committed monthly stipend</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Govt DBT Subsidy Claimed</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400">₹{totalGovtSubsidyReclaimed.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Credited directly to trainees</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Employer Cost</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400">₹{netEmployerShare.toLocaleString()}<span className="text-xs text-slate-400">/mo</span></div>
            <p className="text-xs text-slate-400 mt-1">Net industry cost after DBT subsidy</p>
          </div>
        </div>
      </div>

      {/* Contracts Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              NATS 2.0 Apprenticeship Roster & Tripartite Approvals
            </h2>
            <p className="text-xs text-slate-400">
              Registered apprentices with BOAT Western Region and tripartite signatures.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
            {contracts.length} Records
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contracts.map(c => (
            <div
              key={c.id}
              onClick={() => handleContractSelect(c.id)}
              className={`rounded-2xl bg-slate-900/70 border p-6 transition-all cursor-pointer ${
                selectedContractId === c.id ? 'border-emerald-500 shadow-lg shadow-emerald-950/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-amber-400">{c.contractNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      {c.boatRegion}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">{c.tradeDiscipline}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Apprentice: <strong className="text-slate-200">{c.studentName}</strong> ({c.studentEmail}) • Institute: <strong className="text-slate-200">{c.institutionName}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Monthly Breakdown</div>
                  <div className="text-xl font-bold text-white">
                    ₹{c.stipendTotalMonthly.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-400">
                    Employer Pays: ₹{c.employerContributionShare.toLocaleString()} | MoE DBT: ₹{c.govSubsidyDbtShare.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Signatory status & actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-slate-400 uppercase font-semibold">Student Apprentice</div>
                  <div className="text-slate-200 font-medium mt-1">{c.studentName}</div>
                  <div className="mt-1">
                    {c.studentSignedAt ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Signed ({new Date(c.studentSignedAt).toLocaleDateString()})
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Signature
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-slate-400 uppercase font-semibold">Host Employer</div>
                  <div className="text-slate-200 font-medium mt-1">{c.employerName}</div>
                  <div className="mt-1">
                    {c.employerSignedAt ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Signed ({new Date(c.employerSignedAt).toLocaleDateString()})
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSignContract(c.id)
                        }}
                        disabled={signingContractId === c.id}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow"
                      >
                        {signingContractId === c.id ? 'Signing...' : 'Sign with DSC'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-slate-400 uppercase font-semibold">Academic Institute</div>
                  <div className="text-slate-200 font-medium mt-1">{c.institutionName}</div>
                  <div className="mt-1">
                    {c.institutionSignedAt ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Endorsed ({new Date(c.institutionSignedAt).toLocaleDateString()})
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Endorsement
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <span>Tenure: {c.startDate} to {c.endDate} ({c.durationMonths} Months)</span>
                <span>Bank: {c.bankAccountMasked} ({c.bankIfscCode})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Contract DBT Claims Ledger */}
      {selectedContractId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                Monthly Direct Benefit Transfer (DBT) Claims & PFMS Status
              </h2>
              <p className="text-xs text-slate-400">
                Monthly reimbursement vouchers submitted to Ministry of Education / PFMS.
              </p>
            </div>
            <button
              onClick={() => setShowClaimModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Month Claim
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Month</th>
                  <th className="py-3.5 px-4 font-semibold">Attendance</th>
                  <th className="py-3.5 px-4 font-semibold">Employer Paid</th>
                  <th className="py-3.5 px-4 font-semibold">Govt DBT Subsidy</th>
                  <th className="py-3.5 px-4 font-semibold">Total Disbursed</th>
                  <th className="py-3.5 px-4 font-semibold">PFMS Status</th>
                  <th className="py-3.5 px-4 font-semibold">PFMS Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {disbursements.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{d.monthYear}</td>
                    <td className="py-3.5 px-4 text-slate-300">{d.daysAttended} / 26 Days</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">₹{d.employerPaidAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-medium">₹{d.govtSubsidyDbtAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-white font-bold">₹{d.totalStipendAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> {d.dbtStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      <div>{d.paymentReferenceNumber}</div>
                      <div className="text-[11px] text-slate-500">{d.cpsmsPaymentId}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Contract */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              Issue New NATS 2.0 Apprenticeship Contract
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Draft a tripartite contract under the Apprentices Act with National Apprenticeship Training Scheme.
            </p>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Apprentice Name</label>
                  <input
                    type="text"
                    value={newContract.studentName}
                    onChange={e => setNewContract({ ...newContract, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Apprentice Email</label>
                  <input
                    type="email"
                    value={newContract.studentEmail}
                    onChange={e => setNewContract({ ...newContract, studentEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Trade / Discipline</label>
                  <input
                    type="text"
                    value={newContract.tradeDiscipline}
                    onChange={e => setNewContract({ ...newContract, tradeDiscipline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={newContract.institutionName}
                    onChange={e => setNewContract({ ...newContract, institutionName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Total Monthly Stipend (₹)</label>
                  <input
                    type="number"
                    value={newContract.stipendTotalMonthly}
                    onChange={e => {
                      const total = Number(e.target.value)
                      setNewContract({
                        ...newContract,
                        stipendTotalMonthly: total,
                        govSubsidyDbtShare: Math.min(4500, Math.floor(total * 0.25))
                      })
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Govt DBT Subsidy Share (₹)</label>
                  <input
                    type="number"
                    value={newContract.govSubsidyDbtShare}
                    onChange={e => setNewContract({ ...newContract, govSubsidyDbtShare: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    value={newContract.durationMonths}
                    onChange={e => setNewContract({ ...newContract, durationMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30"
                >
                  Generate & Submit Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Claim */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Generate Monthly DBT Subsidy Claim
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Certify apprentice attendance to trigger 25% DBT disbursement via PFMS directly to student bank account.
            </p>

            <form onSubmit={handleGenerateClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Month & Year</label>
                <input
                  type="text"
                  value={claimMonthYear}
                  onChange={e => setClaimMonthYear(e.target.value)}
                  placeholder="e.g. April 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Days Attended (out of 26)</label>
                <input
                  type="number"
                  value={claimDaysAttended}
                  max={26}
                  min={1}
                  onChange={e => setClaimDaysAttended(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Employer Paid Share (₹)</label>
                <input
                  type="number"
                  value={claimEmployerPaid}
                  onChange={e => setClaimEmployerPaid(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Landmark className="w-4 h-4" /> PFMS Auto-Calculation
                </div>
                Govt DBT Subsidy Claim: <strong className="text-amber-300">₹4,500.00</strong> will be credited directly to the student's Aadhaar seeded bank account.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50"
                >
                  {submittingClaim ? 'Processing...' : 'Submit Claim to PFMS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default EmployerApprenticeshipsPage
