import { apiClient as api } from './apiClient'

export interface AlumniProfile {
  id: string
  userId?: string
  fullName: string
  email: string
  graduationYear: number
  degree: string
  institutionName: string
  currentCompany: string
  designation: string
  industry?: string
  location: string
  linkedinUrl?: string
  githubUrl?: string
  avatarInitials?: string
  bio?: string
  expertise?: string
  isMentorActive: boolean
  isReferralActive: boolean
  totalMenteesHelped: number
  totalReferralsGiven: number
  rating: number
  createdAt: string
}

export interface AlumniStats {
  totalAlumni: number
  activeMentors: number
  openReferrals: number
  completedSessions: number
  activeDiscussions: number
}

export interface AlumniMentorshipSlot {
  id: string
  alumniId: string
  alumniName: string
  company: string
  topic: string
  slotTime: string
  durationMinutes: number
  meetingPlatform: string
  status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED' | 'CANCELLED'
  bookedByStudentId?: string
  bookedByStudentName?: string
  bookingNotes?: string
  meetingLink?: string
  createdAt: string
}

export interface AlumniJobReferral {
  id: string
  alumniId: string
  alumniName: string
  company: string
  jobTitle: string
  jobCode?: string
  location: string
  experienceLevel: string
  minEligibility?: string
  openingsCount: number
  applicationsCount: number
  status: 'OPEN' | 'CLOSED'
  portalApplyLink?: string
  createdAt: string
}

export interface AlumniReferralApplication {
  id: string
  referralId: string
  studentId: string
  studentName: string
  studentEmail: string
  studentBranch?: string
  studentCgpa?: number
  resumeUrl?: string
  portfolioUrl?: string
  noteToAlumni?: string
  status: 'PENDING' | 'REFERRED' | 'DECLINED' | 'INTERVIEWING'
  feedback?: string
  appliedAt: string
}

export interface AlumniDiscussionPost {
  id: string
  authorName: string
  authorRole: 'ALUMNI' | 'STUDENT'
  companyOrBranch: string
  title: string
  content: string
  category: 'OFF_CAMPUS_REFERRALS' | 'HIGHER_STUDIES' | 'INTERVIEW_PREP' | 'CAREER_GROWTH'
  likesCount: number
  repliesCount: number
  pinnedAnswer?: string
  pinnedByAlumni?: string
  createdAt: string
}

export const alumniApi = {
  getStats: async (): Promise<AlumniStats> => {
    const res = await api.get('/alumni/stats')
    return res.data
  },

  getDirectory: async (search?: string): Promise<AlumniProfile[]> => {
    const res = await api.get('/alumni/directory', { params: search ? { search } : {} })
    return res.data
  },

  getProfile: async (id: string): Promise<AlumniProfile> => {
    const res = await api.get(`/alumni/profile/${id}`)
    return res.data
  },

  getMyProfile: async (): Promise<AlumniProfile> => {
    const res = await api.get('/alumni/my-profile')
    return res.data
  },

  saveProfile: async (profile: Partial<AlumniProfile>): Promise<AlumniProfile> => {
    const res = await api.post('/alumni/profile', profile)
    return res.data
  },

  getSlots: async (alumniId?: string, status?: string): Promise<AlumniMentorshipSlot[]> => {
    const res = await api.get('/alumni/slots', { params: { alumniId, status } })
    return res.data
  },

  createSlot: async (payload: {
    topic: string
    slotTime: string
    durationMinutes?: number
    meetingPlatform?: string
    meetingLink?: string
  }): Promise<AlumniMentorshipSlot> => {
    const res = await api.post('/alumni/slots', payload)
    return res.data
  },

  bookSlot: async (slotId: string, payload: {
    studentName?: string
    bookingNotes?: string
  }): Promise<AlumniMentorshipSlot> => {
    const res = await api.post(`/alumni/slots/${slotId}/book`, payload)
    return res.data
  },

  getReferrals: async (status?: string, company?: string): Promise<AlumniJobReferral[]> => {
    const res = await api.get('/alumni/referrals', { params: { status, company } })
    return res.data
  },

  createReferral: async (payload: {
    company: string
    jobTitle: string
    jobCode?: string
    location: string
    experienceLevel: string
    minEligibility?: string
    openingsCount?: number
    portalApplyLink?: string
  }): Promise<AlumniJobReferral> => {
    const res = await api.post('/alumni/referrals', payload)
    return res.data
  },

  applyForReferral: async (referralId: string, payload: {
    studentName: string
    studentEmail: string
    studentBranch?: string
    studentCgpa?: number
    resumeUrl?: string
    portfolioUrl?: string
    noteToAlumni?: string
  }): Promise<AlumniReferralApplication> => {
    const res = await api.post(`/alumni/referrals/${referralId}/apply`, payload)
    return res.data
  },

  getReferralApplications: async (referralId: string): Promise<AlumniReferralApplication[]> => {
    const res = await api.get(`/alumni/referrals/${referralId}/applications`)
    return res.data
  },

  updateApplicationStatus: async (appId: string, status: string, feedback?: string): Promise<AlumniReferralApplication> => {
    const res = await api.patch(`/alumni/referrals/applications/${appId}/status`, { status, feedback })
    return res.data
  },

  getDiscussions: async (category?: string): Promise<AlumniDiscussionPost[]> => {
    const res = await api.get('/alumni/discussions', { params: category ? { category } : {} })
    return res.data
  },

  createDiscussion: async (payload: {
    authorName: string
    authorRole?: string
    companyOrBranch: string
    title: string
    content: string
    category?: string
  }): Promise<AlumniDiscussionPost> => {
    const res = await api.post('/alumni/discussions', payload)
    return res.data
  },

  pinAnswer: async (postId: string, answer: string, alumniName?: string): Promise<AlumniDiscussionPost> => {
    const res = await api.post(`/alumni/discussions/${postId}/pin-answer`, { answer, alumniName })
    return res.data
  }
}
