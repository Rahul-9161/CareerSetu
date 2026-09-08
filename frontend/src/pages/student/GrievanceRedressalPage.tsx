import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Scale,
  Calendar,
  UserCheck,
  FileCheck2
} from 'lucide-react';
import {
  complianceApi,
  type GrievanceTicket
} from '@/api/complianceApi';

export const GrievanceRedressalPage: React.FC = () => {
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Grievance Modal
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('DPDP_DATA_ERASURE');
  const [priority, setPriority] = useState('HIGH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complianceApi.getMyGrievances();
      setTickets(data);
    } catch (err: unknown) {
      console.error(err);
      setError('Unable to fetch statutory grievance tickets. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await complianceApi.createGrievance({
        category,
        priority,
        subject,
        description
      });
      setShowModal(false);
      setSubject('');
      setDescription('');
      await loadTickets();
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to submit statutory grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DPDP_DATA_ERASURE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">DPDP Right to Erasure</span>;
      case 'CONSENT_REVOCATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">DPDP Consent Revocation</span>;
      case 'STIPEND_DEFAULT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Stipend Non-Compliance</span>;
      case 'UNFAIR_EVALUATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Academic Evaluation Dispute</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">Workplace Safety / POSH</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved by Officer
          </span>
        );
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Under Investigation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" />
            Open & Queued
          </span>
        );
    }
  };

  const calculateDaysLeft = (deadline: string) => {
    const diffMs = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} Days Remaining` : 'SLA Escalated';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Statutory Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-3">
              <Scale className="w-4 h-4 text-purple-400" />
              DPDP Act 2023 Section 13 & UGC Statutory Compliance
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Statutory Grievance Redressal & Data Rights Desk
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
              File binding statutory appeals for digital privacy rights (right to erasure, consent withdrawal),
              mandatory internship stipend defaults, or academic assessment disputes with guaranteed 30-day resolution SLAs.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            File Statutory Grievance
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SLA Commitment Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">30-Day Statutory SLA</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every grievance ticket is legally bound to formal inquiry and resolution within 30 days under Indian DPDP Act 2023 regulations.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">Data Subject Rights (SR)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full support for right to access, right to rectification, right to erasure, and automated consent ledger withdrawal.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Audited Resolution Order</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Resolution reports are signed off by the platform Chief Compliance Officer and logged immutably in the audit registry.
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" />
            Your Submitted Grievance Tickets ({tickets.length})
          </h2>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No Active Grievances</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              You have not filed any statutory complaints or data subject requests. All internship and privacy operations are in good standing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
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
                    {getStatusBadge(ticket.status)}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {calculateDaysLeft(ticket.slaDeadline)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Filed on: {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span>Complainant: {ticket.complainantName} ({ticket.complainantRole})</span>
                  </div>

                  {ticket.resolvedByOfficer && (
                    <div className="text-emerald-400 flex items-center gap-1 font-medium">
                      <UserCheck className="w-3.5 h-3.5" />
                      Presided By: {ticket.resolvedByOfficer}
                    </div>
                  )}
                </div>

                {ticket.resolutionRemarks && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Formal Resolution Findings & Corrective Orders:
                    </div>
                    <p className="text-slate-300 leading-relaxed">{ticket.resolutionRemarks}</p>
                    {ticket.resolvedAt && (
                      <div className="text-[11px] text-slate-400 pt-1">
                        Resolved on: {new Date(ticket.resolvedAt).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                Submit Statutory Grievance / Appeal
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Grievance Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="DPDP_DATA_ERASURE">DPDP Act Section 13: Right to Data Erasure / Forgetting</option>
                  <option value="CONSENT_REVOCATION">DPDP Act: Revocation of Telemetry & Partner Data Sharing</option>
                  <option value="STIPEND_DEFAULT">AICTE Norms: Internship Stipend Default or Delay</option>
                  <option value="UNFAIR_EVALUATION">Academic: Disputed Viva / Capstone / Internship Evaluation</option>
                  <option value="WORKPLACE_SAFETY">UGC & POSH: Workplace Harassment / Safety Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority Classification</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="HIGH">High (Statutory SLA: Immediate Fast-Track)</option>
                  <option value="MEDIUM">Medium (Normal 30-Day Inquiry)</option>
                  <option value="LOW">Low (Informational / Process Inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Subject / Summary</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Request for deletion of obsolete assessment audio records"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Detailed Description & Evidence</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide explicit facts, timestamps, company names, and statutory provisions invoked..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                Submissions are logged under DPDP statutory obligations. False representations may be subject to platform review.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-50"
                >
                  {submitting ? 'Lodging...' : 'File Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceRedressalPage;
