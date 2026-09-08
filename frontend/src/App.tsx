import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import StudentDashboard from '@/pages/student/StudentDashboard'
import CareerPassport from '@/pages/student/CareerPassport'
import SkillIntelligence from '@/pages/student/SkillIntelligence'
import OpportunityMarketplace from '@/pages/student/OpportunityMarketplace'
import ApplicationTracker from '@/pages/student/ApplicationTracker'
import EmployerDashboard from '@/pages/employer/EmployerDashboard'
import EmployerJobs from '@/pages/employer/EmployerJobs'
import ApplicantATS from '@/pages/employer/ApplicantATS'
import InstitutionDashboard from '@/pages/institution/InstitutionDashboard'
import AICopilot from '@/pages/ai/AICopilot'
import AssessmentPage from '@/pages/student/AssessmentPage'
import StudentOnboarding from '@/pages/student/StudentOnboarding'
import StudentLearning from '@/pages/student/StudentLearning'
import MentorshipHub from '@/pages/student/MentorshipHub'
import CampusEvents from '@/pages/student/CampusEvents'
import MessageCenter from '@/pages/student/MessageCenter'
import InterviewScheduler from '@/pages/employer/InterviewScheduler'
import EmployerAnalytics from '@/pages/employer/EmployerAnalytics'
import CompanyProfilePage from '@/pages/employer/CompanyProfilePage'
import StudentDirectory from '@/pages/institution/StudentDirectory'
import PlacementDrives from '@/pages/institution/PlacementDrives'
import FacultyDashboard from '@/pages/faculty/FacultyDashboard'
import CurriculumMappingPage from '@/pages/faculty/CurriculumMappingPage'
import StudentEndorsementPage from '@/pages/faculty/StudentEndorsementPage'
import CapstoneProjectsPage from '@/pages/faculty/CapstoneProjectsPage'
import MockEvaluationsPage from '@/pages/faculty/MockEvaluationsPage'
import AlumniDashboard from '@/pages/alumni/AlumniDashboard'
import AlumniSlotsPage from '@/pages/alumni/AlumniSlotsPage'
import AlumniReferralDesk from '@/pages/alumni/AlumniReferralDesk'
import AlumniDirectoryPage from '@/pages/alumni/AlumniDirectoryPage'
import AlumniCommunityPage from '@/pages/alumni/AlumniCommunityPage'
import StudentAlumniConnect from '@/pages/student/StudentAlumniConnect'
import MandatoryInternshipPage from '@/pages/student/MandatoryInternshipPage'
import GrievanceRedressalPage from '@/pages/student/GrievanceRedressalPage'
import StudentApprenticeshipsPage from '@/pages/student/StudentApprenticeshipsPage'
import EmployerApprenticeshipsPage from '@/pages/employer/EmployerApprenticeshipsPage'
import AccreditationDashboardPage from '@/pages/institution/AccreditationDashboardPage'
import CompliancePortal from '@/pages/compliance/CompliancePortal'
import NotFound from '@/pages/NotFound'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/' ? `?redirect=${encodeURIComponent(location.pathname + location.search)}` : ''
    return <Navigate to={`/auth/login${redirectParam}`} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.primaryRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function DashboardRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/auth/login" replace />

  switch (user.primaryRole) {
    case 'STUDENT':
      return <Navigate to="/student/overview" replace />
    case 'ALUMNI':
      return <Navigate to="/alumni/overview" replace />
    case 'EMPLOYER':
    case 'RECRUITER':
      return <Navigate to="/employer/overview" replace />
    case 'TPO':
    case 'INSTITUTION_ADMIN':
    case 'DEPARTMENT_ADMIN':
      return <Navigate to="/institution/overview" replace />
    case 'FACULTY':
      return <Navigate to="/faculty/overview" replace />
    case 'COMPLIANCE_OFFICER':
      return <Navigate to="/compliance/overview" replace />
    default:
      return <Navigate to="/student/overview" replace />
  }
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/opportunities" element={<Navigate to="/student/opportunities" replace />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardRedirect /></ProtectedRoute>
      } />

      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ALUMNI']}><DashboardLayout role="student" /></ProtectedRoute>}>
        <Route path="/student/overview" element={<StudentDashboard />} />
        <Route path="/student/passport" element={<CareerPassport />} />
        <Route path="/student/skills" element={<SkillIntelligence />} />
        <Route path="/student/opportunities" element={<OpportunityMarketplace />} />
        <Route path="/student/applications" element={<ApplicationTracker />} />
        <Route path="/student/assessment" element={<AssessmentPage />} />
        <Route path="/student/copilot" element={<AICopilot />} />
        <Route path="/student/internships" element={<MandatoryInternshipPage />} />
        <Route path="/student/apprenticeships" element={<StudentApprenticeshipsPage />} />
        <Route path="/student/grievances" element={<GrievanceRedressalPage />} />
        <Route path="/student/onboarding" element={<StudentOnboarding />} />
        <Route path="/student/learning" element={<StudentLearning />} />
        <Route path="/student/mentors" element={<MentorshipHub />} />
        <Route path="/student/alumni" element={<StudentAlumniConnect />} />
        <Route path="/student/events" element={<CampusEvents />} />
        <Route path="/student/messages" element={<MessageCenter />} />
      </Route>

      {/* Employer routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYER', 'RECRUITER']}><DashboardLayout role="employer" /></ProtectedRoute>}>
        <Route path="/employer/overview" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/applicants" element={<ApplicantATS />} />
        <Route path="/employer/apprenticeships" element={<EmployerApprenticeshipsPage />} />
        <Route path="/employer/interviews" element={<InterviewScheduler />} />
        <Route path="/employer/analytics" element={<EmployerAnalytics />} />
        <Route path="/employer/profile" element={<CompanyProfilePage />} />
        <Route path="/employer/messages" element={<MessageCenter />} />
      </Route>

      {/* Institution routes */}
      <Route element={<ProtectedRoute allowedRoles={['TPO', 'INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN']}><DashboardLayout role="institution" /></ProtectedRoute>}>
        <Route path="/institution/overview" element={<InstitutionDashboard />} />
        <Route path="/institution/students" element={<StudentDirectory />} />
        <Route path="/institution/drives" element={<PlacementDrives />} />
        <Route path="/institution/accreditation" element={<AccreditationDashboardPage />} />
      </Route>

      {/* Faculty & Academic Mentor routes */}
      <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'MENTOR']}><DashboardLayout role="faculty" /></ProtectedRoute>}>
        <Route path="/faculty/overview" element={<FacultyDashboard />} />
        <Route path="/faculty/curriculum" element={<CurriculumMappingPage />} />
        <Route path="/faculty/endorsements" element={<StudentEndorsementPage />} />
        <Route path="/faculty/projects" element={<CapstoneProjectsPage />} />
        <Route path="/faculty/evaluations" element={<MockEvaluationsPage />} />
      </Route>

      {/* Alumni Network & Mentorship Portal routes */}
      <Route element={<ProtectedRoute allowedRoles={['ALUMNI']}><DashboardLayout role="alumni" /></ProtectedRoute>}>
        <Route path="/alumni/overview" element={<AlumniDashboard />} />
        <Route path="/alumni/mentorship" element={<AlumniSlotsPage />} />
        <Route path="/alumni/referrals" element={<AlumniReferralDesk />} />
        <Route path="/alumni/directory" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/community" element={<AlumniCommunityPage />} />
      </Route>

      {/* Chief Compliance Officer & DPDP Oversight routes */}
      <Route element={<ProtectedRoute allowedRoles={['COMPLIANCE_OFFICER', 'PLATFORM_ADMIN', 'SUPER_ADMIN']}><DashboardLayout role="compliance" /></ProtectedRoute>}>
        <Route path="/compliance/overview" element={<CompliancePortal />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
