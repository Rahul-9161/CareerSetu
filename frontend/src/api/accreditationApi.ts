import { apiClient as api } from './apiClient'

export interface AccreditationReport {
  id: string
  academicYear: string
  institutionName: string
  nirfGoScore: number
  nirfRankBandEstimate: string
  totalGraduatingBatch: number
  totalPlaced: number
  totalHigherStudies: number
  medianSalaryLpa: number
  averageSalaryLpa: number
  highestSalaryLpa: number
  naacPlacementRatio: number
  naacProgressionRatio: number
  nbaPlacementIndex: number
  auditStatus: 'DRAFT' | 'IQAC_VERIFIED' | 'NIRF_DCS_PUBLISHED'
  iqacCoordinatorName: string
  generatedAt: string
}

export interface DepartmentMetric {
  id: string
  department: string
  intakeCapacity: number
  graduatedStudents: number
  placedStudents: number
  higherStudiesStudents: number
  medianPackageLpa: number
  nbaPlacementScore: number
  coreSectorPlacedPercentage: number
}

export interface ProgressionRecord {
  id: string
  studentId?: string
  studentName: string
  rollNumber: string
  department: string
  progressionType: 'CAMPUS_PLACEMENT' | 'OFF_CAMPUS_PLACEMENT' | 'HIGHER_STUDIES_INDIA' | 'HIGHER_STUDIES_ABROAD' | 'COMPETITIVE_EXAM_QUALIFIED' | 'ENTREPRENEURSHIP'
  organizationOrUniversity: string
  designationOrProgram: string
  annualPackageLpa?: number
  appointmentOrAdmissionRef?: string
  proofDocumentUrl?: string
  verificationStatus: 'VERIFIED_BY_TPO' | 'PENDING_PROOF' | 'REJECTED'
  verifiedAt?: string
  createdAt: string
}

export interface SimulationRequest {
  projectedAdditionalOffers: number
  projectedMedianSalaryLpa: number
  higherStudiesTarget: number
}

export interface SimulationResponse {
  currentGoScore: number
  projectedGoScore: number
  currentRankBand: string
  projectedRankBand: string
  gphDelta: number
  gmsDelta: number
  recommendationText: string
}

export interface NirfDcsExport {
  institutionCode: string
  institutionName: string
  academicYear: string
  sanctionedIntake: number
  totalActualGraduates: number
  studentsPlaced: number
  medianSalaryPlaced: number
  studentsHigherStudies: number
  graduationOutcomeScore: number
  naacGradePredicted: string
  departmentBreakdowns: DepartmentMetric[]
  exportedAt: string
}

export const accreditationApi = {
  getLatestReport: async (academicYear?: string): Promise<AccreditationReport> => {
    const res = await api.get('/accreditation/report/latest', { params: academicYear ? { academicYear } : {} })
    return res.data
  },

  getDepartmentMetrics: async (reportId?: string): Promise<DepartmentMetric[]> => {
    const res = await api.get('/accreditation/departments', { params: reportId ? { reportId } : {} })
    return res.data
  },

  getProgressionRecords: async (params?: { department?: string; progressionType?: string; status?: string }): Promise<ProgressionRecord[]> => {
    const res = await api.get('/accreditation/progression-records', { params: params || {} })
    return res.data
  },

  verifyRecord: async (id: string, status = 'VERIFIED_BY_TPO', remarks?: string): Promise<ProgressionRecord> => {
    const res = await api.patch(`/accreditation/progression-records/${id}/verify`, { status, remarks })
    return res.data
  },

  simulateNirf: async (req: SimulationRequest): Promise<SimulationResponse> => {
    const res = await api.post('/accreditation/simulate', req)
    return res.data
  },

  exportNirfDcs: async (academicYear?: string): Promise<NirfDcsExport> => {
    const res = await api.get('/accreditation/export/nirf-dcs', { params: academicYear ? { academicYear } : {} })
    return res.data
  }
}
