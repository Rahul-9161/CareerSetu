import { apiClient as api } from './apiClient'

export interface FacultyStats {
  totalCourses: number
  avgCurriculumAlignment: number
  totalEndorsements: number
  activeCapstoneProjects: number
  totalMockEvaluations: number
  placementReadyCount: number
}

export interface CurriculumCourse {
  id: string
  courseCode: string
  courseTitle: string
  department: string
  semester: number
  aicteCredits: number
  syllabusSummary: string
  industryRelevance: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | string
  alignmentScore: number
  mappedSkillsJson: string
  nepCategory: string
  facultyLead: string
}

export interface StudentEndorsement {
  id: string
  facultyId?: string
  facultyName: string
  facultyDesignation: string
  facultyDepartment: string
  studentId?: string
  studentName: string
  studentRollNo: string
  specializationArea: string
  endorsementText: string
  ratingTier: 'TOP_5_PERCENT' | 'TOP_10_PERCENT' | 'HONORS' | 'RECOMMENDED' | string
  verificationHash: string
  status: string
  createdAt: string
}

export interface CapstoneProject {
  id: string
  projectTitle: string
  industryPartner: string
  corporateMentorName?: string
  facultyGuideName: string
  studentNames: string
  studentIdsJson?: string
  stage: 'PROPOSAL' | 'MID_TERM' | 'INDUSTRY_REVIEW' | 'FINAL_VIVA' | 'COMPLETED' | string
  progressPercentage: number
  finalGrade?: number
  milestoneNotes?: string
  repoUrl?: string
  domainArea?: string
}

export interface MockEvaluation {
  id: string
  studentId?: string
  studentName: string
  studentRollNo: string
  evaluatorName: string
  track: string
  technicalScore: number
  problemSolvingScore: number
  communicationScore: number
  nepReadinessScore: number
  overallScore: number
  rubricFeedback: string
  recommendedActions: string
  readinessStatus: 'PLACEMENT_READY' | 'NEEDS_PRACTICE' | 'INTERVENTION_REQUIRED' | string
  evaluatedAt: string
}

export const facultyApi = {
  getStats: async (): Promise<FacultyStats> => {
    const res = await api.get<FacultyStats>('/faculty/stats')
    return res.data
  },

  getCurriculumCourses: async (): Promise<CurriculumCourse[]> => {
    const res = await api.get<CurriculumCourse[]>('/faculty/curriculum')
    return res.data
  },

  createCurriculumCourse: async (data: Partial<CurriculumCourse>): Promise<CurriculumCourse> => {
    const res = await api.post<CurriculumCourse>('/faculty/curriculum', data)
    return res.data
  },

  getEndorsements: async (): Promise<StudentEndorsement[]> => {
    const res = await api.get<StudentEndorsement[]>('/faculty/endorsements')
    return res.data
  },

  getStudentEndorsements: async (studentId: string): Promise<StudentEndorsement[]> => {
    const res = await api.get<StudentEndorsement[]>(`/faculty/endorsements/student/${studentId}`)
    return res.data
  },

  createEndorsement: async (data: Partial<StudentEndorsement>): Promise<StudentEndorsement> => {
    const res = await api.post<StudentEndorsement>('/faculty/endorsements', data)
    return res.data
  },

  getProjects: async (): Promise<CapstoneProject[]> => {
    const res = await api.get<CapstoneProject[]>('/faculty/projects')
    return res.data
  },

  createProject: async (data: Partial<CapstoneProject>): Promise<CapstoneProject> => {
    const res = await api.post<CapstoneProject>('/faculty/projects', data)
    return res.data
  },

  updateProjectStage: async (
    id: string,
    data: { stage?: string; progressPercentage?: number; finalGrade?: number; milestoneNotes?: string }
  ): Promise<CapstoneProject> => {
    const res = await api.patch<CapstoneProject>(`/faculty/projects/${id}/stage`, data)
    return res.data
  },

  getEvaluations: async (): Promise<MockEvaluation[]> => {
    const res = await api.get<MockEvaluation[]>('/faculty/evaluations')
    return res.data
  },

  getStudentEvaluations: async (studentId: string): Promise<MockEvaluation[]> => {
    const res = await api.get<MockEvaluation[]>(`/faculty/evaluations/student/${studentId}`)
    return res.data
  },

  createEvaluation: async (data: Partial<MockEvaluation>): Promise<MockEvaluation> => {
    const res = await api.post<MockEvaluation>('/faculty/evaluations', data)
    return res.data
  }
}
