import { apiClient as api } from './apiClient'

export interface ApaarCreditRecord {
  id: string
  courseCode: string
  courseTitle: string
  institutionName: string
  creditsAwarded: number
  academicYear: string
  semester?: string
  gradeEarned?: string
  digilockerDocId?: string
  creditStatus: 'SYNCED' | 'PENDING_VERIFICATION' | 'REJECTED'
  syncedAt?: string
}

export interface ApaarStudentOverview {
  studentId: string
  studentName: string
  apaarId?: string
  isDigilockerVerified: boolean
  totalCreditsEarned: number
  totalCreditsRequired: number
  records: ApaarCreditRecord[]
}

export interface LinkApaarRequest {
  studentId: string
  studentName?: string
  apaarId: string
  digilockerToken?: string
}

export interface NatsContractResponse {
  id: string
  contractNumber: string
  studentId: string
  studentName: string
  studentEmail: string
  institutionId?: string
  institutionName: string
  employerId: string
  employerName: string
  tradeDiscipline: string
  apprenticeshipType: 'GRADUATE_APPRENTICE' | 'TECHNICIAN_APPRENTICE' | 'OPTIONAL_TRADE' | 'TECHNICIAN_VOCATIONAL'
  stipendTotalMonthly: number
  govSubsidyDbtShare: number
  employerContributionShare: number
  startDate: string
  endDate: string
  durationMonths: number
  boatRegion: string
  status: 'PROPOSED' | 'STUDENT_SIGNED' | 'INSTITUTION_SIGNED' | 'EMPLOYER_SIGNED' | 'APPROVED_BY_BOAT' | 'COMPLETED' | 'TERMINATED'
  studentSignedAt?: string
  institutionSignedAt?: string
  employerSignedAt?: string
  approvedByBoatAt?: string
  pfmsBeneficiaryCode?: string
  bankAccountMasked?: string
  bankIfscCode?: string
  createdAt: string
}

export interface CreateNatsContractRequest {
  studentId: string
  studentName: string
  studentEmail: string
  institutionId?: string
  institutionName: string
  employerId: string
  employerName: string
  tradeDiscipline: string
  apprenticeshipType: string
  stipendTotalMonthly: number
  govSubsidyDbtShare: number
  startDate: string
  endDate: string
  durationMonths: number
  boatRegion: string
  bankAccountMasked?: string
  bankIfscCode?: string
}

export interface SignContractRequest {
  party: 'STUDENT' | 'INSTITUTION' | 'EMPLOYER'
  signerName: string
  signerRole?: string
}

export interface DbtDisbursementResponse {
  id: string
  contractId: string
  contractNumber: string
  studentId: string
  studentName: string
  employerId: string
  employerName: string
  monthYear: string
  totalStipendAmount: number
  govtSubsidyDbtAmount: number
  employerPaidAmount: number
  daysAttended: number
  paymentReferenceNumber?: string
  cpsmsPaymentId?: string
  dbtStatus: 'CLAIM_SUBMITTED' | 'VERIFIED_BY_EMPLOYER' | 'PROCESSED_BY_PFMS' | 'DISBURSED_TO_ACCOUNT' | 'REJECTED'
  scheduledDisbursementDate?: string
  disbursedDate?: string
  notes?: string
}

export interface GenerateDbtClaimRequest {
  contractId: string
  monthYear: string
  daysAttended: number
  employerPaidAmount: number
}

export const apprenticeshipApi = {
  getApaarOverview: async (studentId: string): Promise<ApaarStudentOverview> => {
    const res = await api.get(`/apprenticeships/apaar/student/${studentId}`)
    return res.data
  },

  linkApaar: async (req: LinkApaarRequest): Promise<ApaarStudentOverview> => {
    const res = await api.post('/apprenticeships/apaar/link', req)
    return res.data
  },

  syncAbcCredits: async (studentId: string): Promise<ApaarStudentOverview> => {
    const res = await api.post(`/apprenticeships/apaar/sync-abc/${studentId}`)
    return res.data
  },

  getStudentContracts: async (studentId: string): Promise<NatsContractResponse[]> => {
    const res = await api.get(`/apprenticeships/contracts/student/${studentId}`)
    return res.data
  },

  getEmployerContracts: async (employerId: string): Promise<NatsContractResponse[]> => {
    const res = await api.get(`/apprenticeships/contracts/employer/${employerId}`)
    return res.data
  },

  createContract: async (req: CreateNatsContractRequest): Promise<NatsContractResponse> => {
    const res = await api.post('/apprenticeships/contracts', req)
    return res.data
  },

  signContract: async (contractId: string, req: SignContractRequest): Promise<NatsContractResponse> => {
    const res = await api.patch(`/apprenticeships/contracts/${contractId}/sign`, req)
    return res.data
  },

  getContractDisbursements: async (contractId: string): Promise<DbtDisbursementResponse[]> => {
    const res = await api.get(`/apprenticeships/disbursements/contract/${contractId}`)
    return res.data
  },

  getStudentDisbursements: async (studentId: string): Promise<DbtDisbursementResponse[]> => {
    const res = await api.get(`/apprenticeships/disbursements/student/${studentId}`)
    return res.data
  },

  generateDbtClaim: async (req: GenerateDbtClaimRequest): Promise<DbtDisbursementResponse> => {
    const res = await api.post('/apprenticeships/disbursements/generate-claim', req)
    return res.data
  }
}
