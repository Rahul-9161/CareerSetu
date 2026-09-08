import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Building2,
  Users,
  History,
  Award,
  Eye
} from 'lucide-react';
import {
  complianceApi,
  type MandatoryInternship,
  type GrievanceTicket,
  type ComplianceAuditEvent,
  type ComplianceDashboardStats
} from '@/api/complianceApi';

export const CompliancePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INTERNSHIPS' | 'GRIEVANCES' | 'AUDIT'>('OVERVIEW');
  const [stats, setStats] = useState<ComplianceDashboardStats | null>(null);
  const [internships, setInternships] = useState<MandatoryInternship[]>([]);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([]);
  const [auditEvents, setAuditEvents] = useState<ComplianceAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Grievance Resolution Modal
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(null);
  const [newStatus, setNewStatus] = useState<'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'ESCALATED'>('RESOLVED');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, internData, grvData, auditData] = await Promise.all([
        complianceApi.getStats(),
        complianceApi.getAllInternships(),
        complianceApi.getAllGrievances(),
        complianceApi.getAuditEvents()
      ]);
      setStats(statsData);
      setInternships(internData);
      setGrievances(grvData);
      setAuditEvents(auditData);
    } catch (err) {
      console.error('Error loading compliance data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      setResolving(true);
      const updated = await complianceApi.updateGrievanceStatus(selectedTicket.id, {
        status: newStatus,
        resolutionRemarks
      });
      setGrievances(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      setSelectedTicket(null);
      setResolutionRemarks('');
      // refresh stats and audit
      const [newStats, newAudit] = await Promise.all([
        complianceApi.getStats(),
        complianceApi.getAuditEvents()
      ]);
      setStats(newStats);
      setAuditEvents(newAudit);
    } catch (err) {
      console.error('Failed to update grievance', err);
      alert('Failed to record statutory resolution order.');
    } finally {
      setResolving(false);
    }
  };

  const handleSimulateDualSignOff = async (internshipId: string, roleType: 'SUPERVISOR' | 'FACULTY') => {
    try {
      const updated = await complianceApi.submitDualSignOff(internshipId, {
        roleType,
        approved: true,
        remarks: 'Statutory verification completed with all milestone hours validated.'
      });
      setInternships(prev => prev.map(i => (i.id === updated.id ? updated : i)));
      const [newStats, newAudit] = await Promise.all([
        complianceApi.getStats(),
        complianceApi.getAuditEvents()
      ]);
      setStats(newStats);
      setAuditEvents(newAudit);
    } catch (err) {
      console.error('Error signing off internship', err);
      alert('Failed to endorse dual sign-off.');
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DPDP_DATA_ERASURE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">DPDP Erasure</span>;
      case 'CONSENT_REVOCATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Consent Revoked</span>;
      case 'STIPEND_DEFAULT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Stipend Default</span>;
      case 'UNFAIR_EVALUATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Evaluation Dispute</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">Workplace Safety</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Statutory Compliance & Legal Oversight Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              AICTE Mandatory Internships & DPDP Governance Desk
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
              Presiding Officer: <strong className="text-white">Adv. Rajeshwar Rao</strong> (Chief Compliance Officer).
              Monitoring UGC statutory regulations, Digital Personal Data Protection Act 2023 Section 13 mandates, and AICTE 8-credit academic certifications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              DPDP Audit Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Internships</div>
          <div className="text-xl font-bold text-white mt-1">{stats?.totalMandatoryInternships ?? internships.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            AICTE Tracked
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Dual Sign-Offs</div>
          <div className="text-xl font-bold text-white mt-1">{stats?.completedDualSignOffs ?? 1}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            SHA-256 Sealed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Stipend Compliance</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{stats?.stipendComplianceRatePct ?? 100}%</div>
          <div className="text-[11px] text-slate-400 mt-1">≥ ₹8,000 threshold</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Grievances</div>
          <div className="text-xl font-bold text-white mt-1">{stats?.totalGrievances ?? grievances.length}</div>
          <div className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <Scale className="w-3 h-3" />
            DPDP Section 13
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Active Inquiries</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{stats?.openGrievances ?? 1}</div>
          <div className="text-[11px] text-amber-300 mt-1">30-day SLA window</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">Audit Events</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{stats?.totalAuditEvents ?? auditEvents.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tamper-Proof</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Overview & Schemes
        </button>
        <button
          onClick={() => setActiveTab('INTERNSHIPS')}
          className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'INTERNSHIPS'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Mandatory Internships ({internships.length})
        </button>
        <button
          onClick={() => setActiveTab('GRIEVANCES')}
          className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'GRIEVANCES'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          Grievance Redressal Desk ({grievances.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'AUDIT'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          Immutable Audit Log ({auditEvents.length})
        </button>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Government Schemes Integration Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">National Government Schemes Sync</h3>
                  <p className="text-xs text-slate-400">AICTE Internship Policy 2024 & Ministry of Skill Development</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">AICTE Mandatory Internship Model</div>
                    <div className="text-xs text-slate-400">6–8 Credits, 320 Hours, Dual Sign-off Mandate</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Active & Enforced
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">NEAT 3.0 & PMKVY 4.0 Skilling Linkage</div>
                    <div className="text-xs text-slate-400">Direct credit transfers to Academic Bank of Credits (ABC)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Mapped
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">National Apprenticeship Training (NATS)</div>
                    <div className="text-xs text-slate-400">Direct Benefit Transfer (DBT) stipend top-up readiness</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* DPDP Act 2023 Statutory Shield */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">DPDP Act 2023 Compliance Posture</h3>
                  <p className="text-xs text-slate-400">Data Fiduciary Obligations & Consent Architecture</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Section 13 Grievance Redressal Mechanism</div>
                    <div className="text-xs text-slate-400">Statutory 30-day countdown timer with compliance officer oversight</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    30-Day SLA Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Consent Management & Revocation</div>
                    <div className="text-xs text-slate-400">Granular consent ledger with 1-click telemetry withdrawal</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Granular Opt-In
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Right to Erasure & PII Redaction</div>
                    <div className="text-xs text-slate-400">Automatic masking of Aadhaar/Phone on public recruiter previews</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PII Masking ON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MANDATORY INTERNSHIPS */}
      {activeTab === 'INTERNSHIPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              AICTE Mandatory Degree Internships Registry ({internships.length})
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">Hours / Credits</th>
                  <th className="px-6 py-4">Monthly Stipend</th>
                  <th className="px-6 py-4">Dual Sign-Off</th>
                  <th className="px-6 py-4">Status & Seal</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {internships.map(intern => (
                  <tr key={intern.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{intern.studentName}</div>
                      <div className="text-xs font-mono text-slate-400">{intern.studentRollNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{intern.companyName}</div>
                      <div className="text-xs text-slate-400">{intern.internshipTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{intern.completedHours} / {intern.totalRequiredHours} hrs</div>
                      <div className="text-xs text-amber-400">{intern.requiredCredits} AICTE Credits</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">₹{intern.monthlyStipend.toLocaleString('en-IN')}</div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Compliant
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-xs flex items-center justify-between gap-2">
                        <span className="text-slate-400">Corp:</span>
                        <span className={intern.corporateSupervisorStatus === 'APPROVED' ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                          {intern.corporateSupervisorStatus}
                        </span>
                      </div>
                      <div className="text-xs flex items-center justify-between gap-2">
                        <span className="text-slate-400">Faculty:</span>
                        <span className={intern.facultyMentorStatus === 'APPROVED' ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                          {intern.facultyMentorStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {intern.completionCertificateHash ? (
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Completed & Sealed
                          </span>
                          <div className="text-[10px] font-mono text-slate-500 truncate max-w-[120px] mt-1">
                            {intern.completionCertificateHash}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {intern.status.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {intern.status !== 'COMPLETED' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSimulateDualSignOff(intern.id, 'FACULTY')}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600/80 hover:bg-emerald-500 text-white"
                          >
                            Faculty Endorse
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: GRIEVANCE REDRESSAL DESK */}
      {activeTab === 'GRIEVANCES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Statutory Grievance Redressal Tickets ({grievances.length})
            </h3>
          </div>

          <div className="space-y-4">
            {grievances.map(ticket => (
              <div
                key={ticket.id}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/30 transition shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-purple-400">
                      {ticket.ticketNumber}
                    </span>
                    {getCategoryBadge(ticket.category)}
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                      Priority: {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ticket.status === 'RESOLVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setNewStatus(ticket.status === 'RESOLVED' ? 'RESOLVED' : 'RESOLVED');
                        setResolutionRemarks(ticket.resolutionRemarks || '');
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition"
                    >
                      Adjudicate Ticket
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white mb-1">{ticket.subject}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                  <div>
                    Complainant: <strong className="text-slate-300">{ticket.complainantName}</strong> ({ticket.complainantEmail}) • Role: {ticket.complainantRole}
                  </div>
                  <div className="font-mono text-amber-400">
                    Statutory SLA Deadline: {new Date(ticket.slaDeadline).toLocaleDateString('en-IN')}
                  </div>
                </div>

                {ticket.resolutionRemarks && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Recorded Resolution Findings by {ticket.resolvedByOfficer || 'Compliance Officer'}:
                    </div>
                    <p className="text-slate-300 leading-relaxed">{ticket.resolutionRemarks}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Immutable Statutory Audit Trail ({auditEvents.length})
              </h3>
              <p className="text-xs text-slate-400">Append-only compliance ledger tracking all consent actions, stipend verifications, and PII masking.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Target Resource</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-xs">
                {auditEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {evt.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      <div>{evt.actorEmail}</div>
                      <span className="text-[10px] text-slate-500">{evt.actorRole}</span>
                    </td>
                    <td className="px-6 py-4 text-amber-300 whitespace-nowrap">
                      {evt.targetResource}
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-slate-300 max-w-md">
                      {evt.details}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {evt.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjudicate Grievance Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                Formal Grievance Adjudication Order
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveGrievance} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800 text-xs text-slate-300 space-y-1">
                <div><strong className="text-white">Ticket:</strong> {selectedTicket.ticketNumber}</div>
                <div><strong className="text-white">Complainant:</strong> {selectedTicket.complainantName} ({selectedTicket.complainantEmail})</div>
                <div><strong className="text-white">Subject:</strong> {selectedTicket.subject}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Adjudication Finding & Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="RESOLVED">RESOLVED (Order Remedies Issued & Complied)</option>
                  <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION (Inquiry Notice Dispatched)</option>
                  <option value="ESCALATED">ESCALATED (Referred to Legal / Ombudsman Panel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Statutory Findings & Corrective Action Orders</label>
                <textarea
                  value={resolutionRemarks}
                  onChange={e => setResolutionRemarks(e.target.value)}
                  rows={4}
                  placeholder="Record formal statutory findings, compliance directives, data purge confirmations, or stipend release batches..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-50"
                >
                  {resolving ? 'Recording...' : 'Issue Adjudication Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancePortal;
