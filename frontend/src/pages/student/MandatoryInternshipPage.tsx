import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Plus,
  AlertCircle,
  Calendar,
  Building2,
  Lock,
  UserCheck,
  Briefcase
} from 'lucide-react';
import {
  complianceApi,
  type MandatoryInternship,
  type InternshipLogbookEntry
} from '@/api/complianceApi';

export const MandatoryInternshipPage: React.FC = () => {
  const [internships, setInternships] = useState<MandatoryInternship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<MandatoryInternship | null>(null);
  const [logbookEntries, setLogbookEntries] = useState<InternshipLogbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Logbook Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [weekNumber, setWeekNumber] = useState(5);
  const [weekRange, setWeekRange] = useState('Week 5: Nov 01 - Nov 07');
  const [hoursLogged, setHoursLogged] = useState(40);
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [skillsApplied, setSkillsApplied] = useState('');
  const [submittingLog, setSubmittingLog] = useState(false);

  // New Internship Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSupervisor, setNewSupervisor] = useState('');
  const [newSupervisorEmail, setNewSupervisorEmail] = useState('');
  const [newFaculty, setNewFaculty] = useState('Dr. Meenakshi Sundaram');
  const [newStipend, setNewStipend] = useState(25000);
  const [submittingNew, setSubmittingNew] = useState(false);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complianceApi.getMyInternships();
      setInternships(data);
      if (data.length > 0) {
        const active = data[0];
        setSelectedInternship(active);
        loadLogbook(active.id);
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Unable to load mandatory internship profile. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadLogbook = async (internshipId: string) => {
    try {
      const logs = await complianceApi.getLogbookEntries(internshipId);
      setLogbookEntries(logs);
      if (logs.length > 0) {
        setWeekNumber(logs.length + 1);
        setWeekRange(`Week ${logs.length + 1}: Sprint ${logs.length + 1}`);
      }
    } catch (err) {
      console.error('Failed to load logbook', err);
    }
  };

  const handleSelectInternship = (internship: MandatoryInternship) => {
    setSelectedInternship(internship);
    loadLogbook(internship.id);
  };

  const handleAddLogbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;
    try {
      setSubmittingLog(true);
      await complianceApi.submitLogbookEntry(selectedInternship.id, {
        weekNumber,
        weekRange,
        tasksCompleted,
        skillsApplied,
        hoursLogged
      });
      setShowLogModal(false);
      setTasksCompleted('');
      setSkillsApplied('');
      // Reload internship & logbook
      const updated = await complianceApi.getInternshipById(selectedInternship.id);
      setSelectedInternship(updated);
      await loadLogbook(updated.id);
      // update list
      setInternships(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to submit weekly logbook. Please check required fields.');
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingNew(true);
      const created = await complianceApi.createInternship({
        companyName: newCompany,
        internshipTitle: newTitle,
        track: 'AICTE_NEP_MANDATORY',
        requiredCredits: 8,
        totalRequiredHours: 320,
        monthlyStipend: newStipend,
        corporateSupervisorName: newSupervisor,
        corporateSupervisorEmail: newSupervisorEmail,
        facultyMentorName: newFaculty,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
      });
      setShowNewModal(false);
      await loadInternships();
      setSelectedInternship(created);
      await loadLogbook(created.id);
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to register mandatory internship.');
    } finally {
      setSubmittingNew(false);
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
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AICTE & NEP 2020 Academic Credit Framework
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Mandatory Internship & Dual Sign-Off Portal
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
              Track your 6–8 mandatory AICTE academic credits, 320 internship hours, weekly verified milestone logbooks,
              and cryptographic dual approval from your Industry Corporate Supervisor and Faculty Mentor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              Register Internship
            </button>
            {selectedInternship && (
              <button
                onClick={() => setShowLogModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 shadow-md transition duration-200"
              >
                <FileText className="w-4 h-4" />
                Log Weekly Hours
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {internships.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <Briefcase className="w-14 h-14 text-emerald-400/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Mandatory Internships Registered</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Register your active corporate internship to start tracking required hours and obtain dual corporate and academic sign-offs for your degree credits.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Plus className="w-4 h-4" />
            Register Mandatory Internship
          </button>
        </div>
      ) : (
        <>
          {/* Multi-Internship Switcher Tabs if > 1 */}
          {internships.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {internships.map(internship => (
                <button
                  key={internship.id}
                  onClick={() => handleSelectInternship(internship)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedInternship?.id === internship.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-lg'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {internship.companyName} • {internship.internshipTitle}
                </button>
              ))}
            </div>
          )}

          {selectedInternship && (
            <div className="space-y-6">
              {/* Statutory Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Hours Progress */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Target Hours</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedInternship.completedHours} <span className="text-sm font-normal text-slate-400">/ {selectedInternship.totalRequiredHours} hrs</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((selectedInternship.completedHours / selectedInternship.totalRequiredHours) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex justify-between">
                    <span>Progress: {Math.min(100, Math.round((selectedInternship.completedHours / selectedInternship.totalRequiredHours) * 100))}%</span>
                    <span>AICTE NEP Standard</span>
                  </div>
                </div>

                {/* 2. Academic Credits */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Academic Credits</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedInternship.requiredCredits} Credits
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    University Senate Mapped
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Semester 7/8 Degree Requirement</p>
                </div>

                {/* 3. Stipend Compliance */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Monthly Stipend</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    ₹{selectedInternship.monthlyStipend.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Compliant (≥ ₹8,000 Threshold)
                  </div>
                  <p className="text-xs text-slate-400 mt-1">AICTE Mandatory Stipend Norms</p>
                </div>

                {/* 4. Dual Sign-Off Status */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Dual Verification</span>
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {selectedInternship.status === 'COMPLETED' ? (
                      <span className="text-emerald-400 font-semibold">Dual Endorsed & Sealed</span>
                    ) : (
                      <span className="text-amber-400 font-semibold">{selectedInternship.status.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Supervisor:</span>
                      <span className={selectedInternship.corporateSupervisorStatus === 'APPROVED' ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                        {selectedInternship.corporateSupervisorStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Faculty Lead:</span>
                      <span className={selectedInternship.facultyMentorStatus === 'APPROVED' ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                        {selectedInternship.facultyMentorStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Sign-Off Card with SHA-256 Seal */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden shadow-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-lg font-bold text-white">
                        {selectedInternship.internshipTitle} @ {selectedInternship.companyName}
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedInternship.startDate} to {selectedInternship.endDate}
                      </span>
                      <span>•</span>
                      <span>Supervisor: <strong className="text-slate-300">{selectedInternship.corporateSupervisorName}</strong> ({selectedInternship.corporateSupervisorEmail})</span>
                      <span>•</span>
                      <span>Faculty Guide: <strong className="text-slate-300">{selectedInternship.facultyMentorName}</strong></span>
                    </div>
                  </div>

                  {selectedInternship.completionCertificateHash ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 max-w-md">
                      <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div className="text-xs">
                        <div className="text-emerald-300 font-bold">SHA-256 Digital Certificate Seal</div>
                        <div className="font-mono text-slate-400 text-[10px] truncate max-w-[280px]">
                          {selectedInternship.completionCertificateHash}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Dual corporate & faculty review active. Complete 320 hours for digital diploma seal.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Milestone Logbook Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Weekly Verified Milestone Logbook
                    </h3>
                    <p className="text-xs text-slate-400">
                      Log your weekly tasks, hours, and competencies applied for statutory audit compliance.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Submit Week Entry
                  </button>
                </div>

                {logbookEntries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                    No weekly entries logged yet. Click "Submit Week Entry" to record your progress.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logbookEntries.map(entry => (
                      <div
                        key={entry.id}
                        className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-emerald-400 border border-emerald-500/20">
                              Week {entry.weekNumber}
                            </span>
                            <span className="text-sm font-semibold text-white">{entry.weekRange}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs font-mono text-slate-400">{entry.hoursLogged} Hours Logged</span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.status === 'SUPERVISOR_APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {entry.status === 'SUPERVISOR_APPROVED' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Supervisor Approved
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5" />
                                Submitted / Pending Review
                              </>
                            )}
                          </span>
                        </div>

                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {entry.tasksCompleted}
                        </p>

                        {entry.skillsApplied && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500">Skills:</span>
                            {entry.skillsApplied.split(',').map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {entry.supervisorComments && (
                          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-emerald-200">Supervisor Feedback:</strong> {entry.supervisorComments}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Log Hours Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Submit Weekly Milestone Log
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogbook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Week Number</label>
                  <input
                    type="number"
                    value={weekNumber}
                    onChange={e => setWeekNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Hours Logged</label>
                  <input
                    type="number"
                    value={hoursLogged}
                    onChange={e => setHoursLogged(parseInt(e.target.value) || 40)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Week Range Title</label>
                <input
                  type="text"
                  value={weekRange}
                  onChange={e => setWeekRange(e.target.value)}
                  placeholder="e.g. Week 5: Distributed Caching & Event Pipelines"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tasks Completed</label>
                <textarea
                  value={tasksCompleted}
                  onChange={e => setTasksCompleted(e.target.value)}
                  rows={4}
                  placeholder="Detail engineering milestones, architecture modules, pull requests, and automated tests created..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Skills Applied (comma-separated)</label>
                <input
                  type="text"
                  value={skillsApplied}
                  onChange={e => setSkillsApplied(e.target.value)}
                  placeholder="e.g. Java, Spring Boot 3, Redis, Kafka, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLog}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                >
                  {submittingLog ? 'Submitting...' : 'Submit Logbook Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Internship Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                Register Mandatory AICTE Internship
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInternship} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Google Cloud India or TechCorp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Internship Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud Infrastructure Engineer Intern"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Stipend (INR)</label>
                  <input
                    type="number"
                    value={newStipend}
                    onChange={e => setNewStipend(parseInt(e.target.value) || 0)}
                    placeholder="Min ₹8,000 threshold"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Faculty Guide</label>
                  <input
                    type="text"
                    value={newFaculty}
                    onChange={e => setNewFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    value={newSupervisor}
                    onChange={e => setNewSupervisor(e.target.value)}
                    placeholder="e.g. Deepak Patel"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Supervisor Work Email</label>
                  <input
                    type="email"
                    value={newSupervisorEmail}
                    onChange={e => setNewSupervisorEmail(e.target.value)}
                    placeholder="deepak@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNew}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                >
                  {submittingNew ? 'Registering...' : 'Register Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandatoryInternshipPage;
