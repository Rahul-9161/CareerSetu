import React, { useEffect, useState } from 'react'
import {
  Award,
  CreditCard,
  RefreshCw,
  CheckCircle,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck2,
  ArrowUpRight,
  Landmark,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {
  apprenticeshipApi,
  type ApaarStudentOverview,
  type NatsContractResponse,
  type DbtDisbursementResponse
} from '../../api/apprenticeshipApi'

export const StudentApprenticeshipsPage: React.FC = () => {
  const { user } = useAuthStore()
  const studentId = user?.id || '212ac01c-bcb2-42b0-9179-243964025db4'
  const studentName = user?.fullName || 'Aarav Sharma'

  const [apaarData, setApaarData] = useState<ApaarStudentOverview | null>(null)
  const [contracts, setContracts] = useState<NatsContractResponse[]>([])
  const [disbursements, setDisbursements] = useState<DbtDisbursementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [syncingCredits, setSyncingCredits] = useState(false)
  const [signingContractId, setSigningContractId] = useState<string | null>(null)
  const [apaarInput, setApaarInput] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkingApaar, setLinkingApaar] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [apaarRes, contractsRes, disbRes] = await Promise.all([
        apprenticeshipApi.getApaarOverview(studentId),
        apprenticeshipApi.getStudentContracts(studentId),
        apprenticeshipApi.getStudentDisbursements(studentId)
      ])
      setApaarData(apaarRes)
      setContracts(contractsRes)
      setDisbursements(disbRes)
    } catch (err: any) {
      console.error('Failed to load apprenticeship data:', err)
      setMessage({ type: 'error', text: 'Failed to load apprenticeship records.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [studentId])

  const handleSyncAbc = async () => {
    try {
      setSyncingCredits(true)
      setMessage(null)
      const updated = await apprenticeshipApi.syncAbcCredits(studentId)
      setApaarData(updated)
      setMessage({ type: 'success', text: 'ABC Credits synchronized with DigiLocker National Academic Depository!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to sync ABC credits.' })
    } finally {
      setSyncingCredits(false)
    }
  }

  const handleLinkApaar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apaarInput.trim()) return
    try {
      setLinkingApaar(true)
      const res = await apprenticeshipApi.linkApaar({
        studentId,
        studentName,
        apaarId: apaarInput.trim()
      })
      setApaarData(res)
      setShowLinkModal(false)
      setMessage({ type: 'success', text: 'APAAR ID successfully linked & verified via DigiLocker!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to link APAAR ID.' })
    } finally {
      setLinkingApaar(false)
    }
  }

  const handleSignContract = async (contractId: string) => {
    try {
      setSigningContractId(contractId)
      const updated = await apprenticeshipApi.signContract(contractId, {
        party: 'STUDENT',
        signerName: studentName,
        signerRole: 'STUDENT_APPRENTICE'
      })
      setContracts(prev => prev.map(c => c.id === contractId ? updated : c))
      setMessage({ type: 'success', text: 'NATS 2.0 Apprenticeship Contract signed with Aadhaar eSign!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to sign contract.' })
    } finally {
      setSigningContractId(null)
    }
  }

  const totalDbtGovtDisbursed = disbursements.reduce((acc, d) => acc + d.govtSubsidyDbtAmount, 0)
  const totalEmployerDisbursed = disbursements.reduce((acc, d) => acc + d.employerPaidAmount, 0)
  const totalStipendDisbursed = disbursements.reduce((acc, d) => acc + d.totalStipendAmount, 0)

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> NATS 2.0 Portal
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified ABC
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Direct Benefit Transfer (DBT)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Apprenticeships, DBT Stipends & APAAR ID
            </h1>
            <p className="text-slate-400 mt-1.5 max-w-2xl text-sm md:text-base">
              Manage your National Apprenticeship Training Scheme contracts, Academic Bank of Credits (ABC)
              and Direct Benefit Transfer (DBT) monthly stipend ledger via PFMS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncAbc}
              disabled={syncingCredits || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncingCredits ? 'animate-spin' : ''}`} />
              {syncingCredits ? 'Syncing ABC...' : 'Sync DigiLocker ABC'}
            </button>
            {!apaarData?.apaarId && (
              <button
                onClick={() => setShowLinkModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium shadow-lg shadow-amber-900/30 transition-all"
              >
                <CreditCard className="w-4 h-4" /> Link APAAR ID
              </button>
            )}
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

      {/* Grid: APAAR Card & DBT Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DigiLocker APAAR ID Card */}
        <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">APAAR / ABC Identity</h2>
                  <p className="text-xs text-slate-400">One Nation One Student ID</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> DigiLocker Verified
              </span>
            </div>

            <div className="my-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Automated Permanent Academic Account Registry</div>
              <div className="text-xl font-mono font-bold text-amber-300 mt-1 tracking-wider">
                {apaarData?.apaarId || 'Not Linked'}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Holder: <strong className="text-slate-200">{apaarData?.studentName || studentName}</strong></span>
                <span>MoE / AICTE Reg</span>
              </div>
            </div>

            {/* Credit Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Academic Bank of Credits</span>
                <span className="font-semibold text-emerald-400">
                  {apaarData?.totalCreditsEarned || 0} / {apaarData?.totalCreditsRequired || 160} Credits
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((apaarData?.totalCreditsEarned || 0) / (apaarData?.totalCreditsRequired || 160)) * 100
                    )}%`
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Credits automatically transferable for degree curriculum fulfillment under NEP 2020.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Last ABC Sync:</span>
            <span className="text-slate-200">
              {apaarData?.records?.[0]?.syncedAt ? new Date(apaarData.records[0].syncedAt).toLocaleDateString() : 'Today'}
            </span>
          </div>
        </div>

        {/* DBT Stipend Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Received</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">₹{totalStipendDisbursed.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Total NATS 2.0 stipends to date</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-cyan-400 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Processed
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DBT Govt Subsidy</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-amber-400">₹{totalDbtGovtDisbursed.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Directly credited via PFMS / Aadhaar</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-amber-400/90 flex items-center gap-1 font-medium">
              <Landmark className="w-3.5 h-3.5" /> Govt of India NATS share
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry Share</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-emerald-400">₹{totalEmployerDisbursed.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Paid directly by host employer</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-emerald-400/90 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Bank Payroll NEFT / IMPS
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Active NATS 2.0 Apprenticeship Contracts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
              NATS 2.0 Tripartite Apprenticeship Contracts
            </h2>
            <p className="text-xs text-slate-400">
              Legally binding tripartite apprenticeship contracts under the Apprentices Act, 1961 (as amended).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            {contracts.length} Contract(s) Active
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">No active apprenticeship contracts found.</p>
            <p className="text-xs text-slate-500 mt-1">Apply for verified NATS 2.0 apprenticeship roles from your dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contracts.map(c => (
              <div
                key={c.id}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all p-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-amber-400">{c.contractNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {c.boatRegion}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1.5">{c.tradeDiscipline}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Type: <strong className="text-slate-300">{c.apprenticeshipType.replace(/_/g, ' ')}</strong></span>
                      <span>•</span>
                      <span>Duration: <strong className="text-slate-300">{c.durationMonths} Months</strong></span>
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Total Monthly Stipend</div>
                    <div className="text-2xl font-bold text-white">₹{c.stipendTotalMonthly.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <div className="text-xs text-amber-400 font-medium">
                      Govt DBT: ₹{c.govSubsidyDbtShare.toLocaleString()} | Employer: ₹{c.employerContributionShare.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Tripartite Parties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">1. Apprentice</div>
                    <div className="font-semibold text-sm text-slate-200 mt-1">{c.studentName}</div>
                    <div className="text-xs text-slate-400">{c.studentEmail}</div>
                    <div className="mt-2 text-xs flex items-center gap-1">
                      {c.studentSignedAt ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Signed ({new Date(c.studentSignedAt).toLocaleDateString()})
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSignContract(c.id)}
                          disabled={signingContractId === c.id}
                          className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow"
                        >
                          {signingContractId === c.id ? 'Signing...' : 'Aadhaar eSign Now'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">2. Host Employer</div>
                    <div className="font-semibold text-sm text-slate-200 mt-1">{c.employerName}</div>
                    <div className="text-xs text-slate-400">Industry Partner</div>
                    <div className="mt-2 text-xs flex items-center gap-1">
                      {c.employerSignedAt ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Signed ({new Date(c.employerSignedAt).toLocaleDateString()})
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pending Signature
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">3. Academic Institution</div>
                    <div className="font-semibold text-sm text-slate-200 mt-1">{c.institutionName}</div>
                    <div className="text-xs text-slate-400">Autonomous Institute</div>
                    <div className="mt-2 text-xs flex items-center gap-1">
                      {c.institutionSignedAt ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
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

                {/* Footer details */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 gap-3">
                  <div className="flex items-center gap-4">
                    <span>Period: <strong className="text-slate-300">{c.startDate} to {c.endDate}</strong></span>
                    <span>PFMS Code: <strong className="text-slate-300">{c.pfmsBeneficiaryCode || 'PFMS-BEN-8841'}</strong></span>
                  </div>
                  <div className="text-slate-400">
                    DBT Account: <strong className="text-slate-300">{c.bankAccountMasked} ({c.bankIfscCode})</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Direct Benefit Transfer (DBT) Monthly Stipend Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              Direct Benefit Transfer (DBT) & Stipend Disbursement Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Audited monthly disbursements processed through Public Financial Management System (PFMS) and host employer payroll.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
            {disbursements.length} Vouchers
          </span>
        </div>

        {disbursements.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">No disbursement vouchers available yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Month & Voucher</th>
                  <th className="py-3.5 px-4 font-semibold">Employer</th>
                  <th className="py-3.5 px-4 font-semibold">Days Attended</th>
                  <th className="py-3.5 px-4 font-semibold">Employer Share</th>
                  <th className="py-3.5 px-4 font-semibold">Govt DBT Subsidy</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">PFMS Status</th>
                  <th className="py-3.5 px-4 font-semibold">Ref / UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {disbursements.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{d.monthYear}</div>
                      <div className="text-xs text-slate-400 font-mono">{d.contractNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{d.employerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">{d.daysAttended} / 26</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-emerald-400">₹{d.employerPaidAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-medium text-amber-400">₹{d.govtSubsidyDbtAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-white">₹{d.totalStipendAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> {d.dbtStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      <div>{d.paymentReferenceNumber || '—'}</div>
                      <div className="text-[11px] text-slate-500">{d.cpsmsPaymentId || ''}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Academic Bank of Credits (ABC) Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              National Academic Depository (NAD / ABC) Transcript
            </h2>
            <p className="text-xs text-slate-400">
              Verified curricular & industry apprenticeship credits accredited under APAAR ID.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            {apaarData?.records?.length || 0} Accredited Courses
          </span>
        </div>

        {apaarData?.records?.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <p className="text-slate-400">No credits synced yet. Click "Sync DigiLocker ABC" to fetch records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {apaarData?.records?.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-cyan-400">{r.courseCode}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
                      {r.creditStatus}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm mt-2">{r.courseTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1">{r.institutionName}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Grade: <strong className="text-amber-300">{r.gradeEarned || 'A+'}</strong></span>
                  <span className="font-bold text-emerald-400 text-sm">{r.creditsAwarded} Credits</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Link APAAR ID */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Link APAAR / One Nation One Student ID
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your 12-digit automated permanent academic account registry ID issued by the Ministry of Education.
            </p>

            <form onSubmit={handleLinkApaar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  APAAR ID (12 Digits)
                </label>
                <input
                  type="text"
                  placeholder="e.g. APAAR-9182-4412-8809"
                  value={apaarInput}
                  onChange={e => setApaarInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> DigiLocker Consent
                </div>
                By linking, you consent to pulling verified academic transcripts and credit records from the Academic Bank of Credits (ABC).
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkingApaar || !apaarInput.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50"
                >
                  {linkingApaar ? 'Verifying...' : 'Verify & Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default StudentApprenticeshipsPage
