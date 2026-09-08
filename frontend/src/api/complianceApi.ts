import { apiClient } from './apiClient';

export interface MandatoryInternship {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  companyId: string | null;
  companyName: string;
  internshipTitle: string;
  track: string;
  requiredCredits: number;
  completedHours: number;
  totalRequiredHours: number;
  monthlyStipend: number;
  stipendCompliant: boolean;
  corporateSupervisorName: string;
  corporateSupervisorEmail: string;
  corporateSupervisorStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  facultyMentorName: string;
  facultyMentorStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  status: 'IN_PROGRESS' | 'AWAITING_DUAL_SIGNOFF' | 'COMPLETED' | 'CREDIT_AWARDED';
  completionCertificateHash: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface InternshipLogbookEntry {
  id: string;
  internshipId: string;
  weekNumber: number;
  weekRange: string;
  tasksCompleted: string;
  skillsApplied: string;
  hoursLogged: number;
  status: 'SUBMITTED' | 'SUPERVISOR_APPROVED' | 'REVISION_REQUESTED';
  supervisorComments: string | null;
  submittedAt: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  complainantName: string;
  complainantEmail: string;
  complainantRole: string;
  category: 'DPDP_DATA_ERASURE' | 'CONSENT_REVOCATION' | 'STIPEND_DEFAULT' | 'UNFAIR_EVALUATION' | 'WORKPLACE_SAFETY';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  subject: string;
  description: string;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'ESCALATED';
  resolutionRemarks: string | null;
  resolvedByOfficer: string | null;
  slaDeadline: string;
  resolvedAt: string | null;
  createdAt: string;
}

export interface ComplianceAuditEvent {
  id: string;
  eventType: string;
  actorEmail: string;
  actorRole: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface ComplianceDashboardStats {
  totalMandatoryInternships: number;
  completedDualSignOffs: number;
  stipendComplianceRatePct: number;
  totalGrievances: number;
  openGrievances: number;
  resolvedGrievances: number;
  totalAuditEvents: number;
}

export interface CreateInternshipRequest {
  companyName: string;
  internshipTitle: string;
  track?: string;
  requiredCredits?: number;
  totalRequiredHours?: number;
  monthlyStipend: number;
  corporateSupervisorName: string;
  corporateSupervisorEmail: string;
  facultyMentorName: string;
  startDate: string;
  endDate: string;
}

export interface SubmitLogbookRequest {
  weekNumber: number;
  weekRange: string;
  tasksCompleted: string;
  skillsApplied: string;
  hoursLogged: number;
}

export interface SignOffRequest {
  roleType: 'SUPERVISOR' | 'FACULTY';
  approved: boolean;
  remarks?: string;
}

export interface CreateGrievanceRequest {
  category: string;
  priority: string;
  subject: string;
  description: string;
}

export interface ResolveGrievanceRequest {
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'ESCALATED';
  resolutionRemarks: string;
}

export const complianceApi = {
  // Internships
  getMyInternships: async (): Promise<MandatoryInternship[]> => {
    const res = await apiClient.get<MandatoryInternship[]>('/internships/my');
    return res.data;
  },

  getAllInternships: async (): Promise<MandatoryInternship[]> => {
    const res = await apiClient.get<MandatoryInternship[]>('/internships');
    return res.data;
  },

  getInternshipById: async (id: string): Promise<MandatoryInternship> => {
    const res = await apiClient.get<MandatoryInternship>(`/internships/${id}`);
    return res.data;
  },

  createInternship: async (req: CreateInternshipRequest): Promise<MandatoryInternship> => {
    const res = await apiClient.post<MandatoryInternship>('/internships', req);
    return res.data;
  },

  getLogbookEntries: async (internshipId: string): Promise<InternshipLogbookEntry[]> => {
    const res = await apiClient.get<InternshipLogbookEntry[]>(`/internships/${internshipId}/logbook`);
    return res.data;
  },

  submitLogbookEntry: async (internshipId: string, req: SubmitLogbookRequest): Promise<InternshipLogbookEntry> => {
    const res = await apiClient.post<InternshipLogbookEntry>(`/internships/${internshipId}/logbook`, req);
    return res.data;
  },

  submitDualSignOff: async (internshipId: string, req: SignOffRequest): Promise<MandatoryInternship> => {
    const res = await apiClient.post<MandatoryInternship>(`/internships/${internshipId}/sign-off`, req);
    return res.data;
  },

  // Grievances
  getMyGrievances: async (): Promise<GrievanceTicket[]> => {
    const res = await apiClient.get<GrievanceTicket[]>('/grievances/my');
    return res.data;
  },

  getAllGrievances: async (): Promise<GrievanceTicket[]> => {
    const res = await apiClient.get<GrievanceTicket[]>('/grievances');
    return res.data;
  },

  getGrievanceById: async (id: string): Promise<GrievanceTicket> => {
    const res = await apiClient.get<GrievanceTicket>(`/grievances/${id}`);
    return res.data;
  },

  createGrievance: async (req: CreateGrievanceRequest): Promise<GrievanceTicket> => {
    const res = await apiClient.post<GrievanceTicket>('/grievances', req);
    return res.data;
  },

  updateGrievanceStatus: async (id: string, req: ResolveGrievanceRequest): Promise<GrievanceTicket> => {
    const res = await apiClient.put<GrievanceTicket>(`/grievances/${id}/status`, req);
    return res.data;
  },

  // Audit & Dashboard
  getStats: async (): Promise<ComplianceDashboardStats> => {
    const res = await apiClient.get<ComplianceDashboardStats>('/compliance/stats');
    return res.data;
  },

  getAuditEvents: async (): Promise<ComplianceAuditEvent[]> => {
    const res = await apiClient.get<ComplianceAuditEvent[]>('/compliance/audit');
    return res.data;
  }
};
