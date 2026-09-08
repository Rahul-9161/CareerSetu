import { apiClient } from './apiClient'

export interface CopilotMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StudentContext {
  name?: string
  target_role?: string
  skills?: string[]
  education_level?: string
  preferred_location?: string
}

export interface CopilotRequest {
  messages: CopilotMessage[]
  student_context?: StudentContext
  stream?: boolean
}

export interface CopilotResponse {
  response: string
  suggested_actions: string[]
  recommended_skills: string[]
  disclaimer: string
}

export interface ResumeAnalyzeRequest {
  resume_text: string
  target_role?: string
  target_industry?: string
}

export interface ResumeAnalyzeResponse {
  overall_score: number
  ats_compatibility_score: number
  strengths: string[]
  weaknesses: string[]
  missing_keywords: string[]
  actionable_improvements: string[]
  summary: string
}

export interface SkillGapRequest {
  student_skills: string[]
  target_role: string
  required_skills?: string[]
}

export interface SkillRecommendation {
  skill: string
  importance: string
  learning_resources: string[]
  estimated_hours: number
}

export interface SkillGapResponse {
  target_role: string
  match_percentage: number
  matching_skills: string[]
  missing_skills: string[]
  recommendations: SkillRecommendation[]
  action_plan_summary: string
}

export interface ResumeUploadResponse {
  extracted_text: string
  file_name: string
  char_count: number
  analysis: ResumeAnalyzeResponse
}

export const aiApi = {
  async chatCopilot(payload: CopilotRequest): Promise<CopilotResponse> {
    const { data } = await apiClient.post<CopilotResponse>('/ai/copilot', payload)
    return data
  },

  async analyzeResume(payload: ResumeAnalyzeRequest): Promise<ResumeAnalyzeResponse> {
    const { data } = await apiClient.post<ResumeAnalyzeResponse>('/ai/resume-analyzer', payload)
    return data
  },

  async uploadResume(file: File, targetRole = 'Software Engineer Intern', targetIndustry = 'Technology'): Promise<ResumeUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_role', targetRole)
    formData.append('target_industry', targetIndustry)

    const { data } = await apiClient.post<ResumeUploadResponse>('/ai/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  async analyzeSkillGap(payload: SkillGapRequest): Promise<SkillGapResponse> {
    const { data } = await apiClient.post<SkillGapResponse>('/ai/skill-gap', payload)
    return data
  },
}
