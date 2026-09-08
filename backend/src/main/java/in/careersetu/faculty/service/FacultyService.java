package in.careersetu.faculty.service;

import in.careersetu.faculty.dto.FacultyDtos.*;
import in.careersetu.faculty.entity.CapstoneProject;
import in.careersetu.faculty.entity.CurriculumCourse;
import in.careersetu.faculty.entity.MockEvaluation;
import in.careersetu.faculty.entity.StudentEndorsement;
import in.careersetu.faculty.repository.CapstoneProjectRepository;
import in.careersetu.faculty.repository.CurriculumCourseRepository;
import in.careersetu.faculty.repository.MockEvaluationRepository;
import in.careersetu.faculty.repository.StudentEndorsementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class FacultyService {

    private static final Logger log = LoggerFactory.getLogger(FacultyService.class);

    private final CurriculumCourseRepository curriculumCourseRepository;
    private final StudentEndorsementRepository studentEndorsementRepository;
    private final CapstoneProjectRepository capstoneProjectRepository;
    private final MockEvaluationRepository mockEvaluationRepository;

    public FacultyService(CurriculumCourseRepository curriculumCourseRepository,
                          StudentEndorsementRepository studentEndorsementRepository,
                          CapstoneProjectRepository capstoneProjectRepository,
                          MockEvaluationRepository mockEvaluationRepository) {
        this.curriculumCourseRepository = curriculumCourseRepository;
        this.studentEndorsementRepository = studentEndorsementRepository;
        this.capstoneProjectRepository = capstoneProjectRepository;
        this.mockEvaluationRepository = mockEvaluationRepository;
    }

    @Transactional(readOnly = true)
    public FacultyStatsResponse getStats() {
        long totalCourses = curriculumCourseRepository.count();
        List<CurriculumCourse> courses = curriculumCourseRepository.findAll();
        double avgAlignment = courses.isEmpty() ? 0.0 :
                courses.stream()
                        .mapToDouble(c -> c.getAlignmentScore() != null ? c.getAlignmentScore() : 0.0)
                        .average()
                        .orElse(0.0);
        avgAlignment = Math.round(avgAlignment * 10.0) / 10.0;

        long totalEndorsements = studentEndorsementRepository.count();

        List<CapstoneProject> projects = capstoneProjectRepository.findAll();
        long activeCapstones = projects.stream()
                .filter(p -> !"COMPLETED".equalsIgnoreCase(p.getStage()))
                .count();

        long totalEvals = mockEvaluationRepository.count();
        long readyCount = mockEvaluationRepository.findAll().stream()
                .filter(e -> "PLACEMENT_READY".equalsIgnoreCase(e.getReadinessStatus()))
                .count();

        return new FacultyStatsResponse(
                totalCourses,
                avgAlignment,
                totalEndorsements,
                activeCapstones,
                totalEvals,
                readyCount
        );
    }

    // ── Curriculum ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<CurriculumCourse> getAllCourses() {
        return curriculumCourseRepository.findAll();
    }

    @Transactional
    public CurriculumCourse createCourse(CurriculumCourseRequest req) {
        CurriculumCourse course = new CurriculumCourse();
        course.setCourseCode(req.courseCode());
        course.setCourseTitle(req.courseTitle());
        course.setDepartment(req.department());
        course.setSemester(req.semester());
        course.setAicteCredits(req.aicteCredits() != null ? req.aicteCredits() : 4);
        course.setSyllabusSummary(req.syllabusSummary());
        course.setIndustryRelevance(req.industryRelevance() != null ? req.industryRelevance() : "HIGH");
        course.setAlignmentScore(req.alignmentScore() != null ? req.alignmentScore() : 85.0);
        course.setMappedSkillsJson(req.mappedSkillsJson());
        course.setNepCategory(req.nepCategory() != null ? req.nepCategory() : "Advanced Technical Specialization");
        course.setFacultyLead(req.facultyLead() != null ? req.facultyLead() : "Faculty Member");
        return curriculumCourseRepository.save(course);
    }

    // ── Endorsements ───────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<StudentEndorsement> getAllEndorsements() {
        return studentEndorsementRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<StudentEndorsement> getStudentEndorsements(UUID studentId) {
        return studentEndorsementRepository.findByStudentId(studentId);
    }

    @Transactional
    public StudentEndorsement createEndorsement(StudentEndorsementRequest req, UUID facultyId) {
        StudentEndorsement endorsement = new StudentEndorsement();
        endorsement.setFacultyId(facultyId);
        endorsement.setFacultyName(req.facultyName() != null ? req.facultyName() : "Faculty Professor");
        endorsement.setFacultyDesignation(req.facultyDesignation() != null ? req.facultyDesignation() : "Professor & Head of Department");
        endorsement.setFacultyDepartment(req.facultyDepartment() != null ? req.facultyDepartment() : "Computer Science & Engineering");
        endorsement.setStudentId(req.studentId());
        endorsement.setStudentName(req.studentName());
        endorsement.setStudentRollNo(req.studentRollNo());
        endorsement.setSpecializationArea(req.specializationArea());
        endorsement.setEndorsementText(req.endorsementText());
        endorsement.setRatingTier(req.ratingTier() != null ? req.ratingTier() : "TOP_10_PERCENT");
        endorsement.setStatus("VERIFIED");

        // Generate SHA-256 verification hash
        String raw = req.studentName() + ":" + req.specializationArea() + ":" + req.ratingTier() + ":" + Instant.now().toEpochMilli();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            endorsement.setVerificationHash("0x" + HexFormat.of().formatHex(hashBytes));
        } catch (Exception ex) {
            log.error("Failed to hash endorsement: {}", ex.getMessage());
            endorsement.setVerificationHash("0x" + UUID.randomUUID().toString().replace("-", ""));
        }

        return studentEndorsementRepository.save(endorsement);
    }

    // ── Capstone Projects ──────────────────────────────────────
    @Transactional(readOnly = true)
    public List<CapstoneProject> getAllProjects() {
        return capstoneProjectRepository.findAll();
    }

    @Transactional
    public CapstoneProject createProject(CapstoneProjectRequest req) {
        CapstoneProject project = new CapstoneProject();
        project.setProjectTitle(req.projectTitle());
        project.setIndustryPartner(req.industryPartner());
        project.setCorporateMentorName(req.corporateMentorName());
        project.setFacultyGuideName(req.facultyGuideName() != null ? req.facultyGuideName() : "Faculty Guide");
        project.setStudentNames(req.studentNames());
        project.setStudentIdsJson(req.studentIdsJson());
        project.setStage(req.stage() != null ? req.stage() : "PROPOSAL");
        project.setProgressPercentage(req.progressPercentage() != null ? req.progressPercentage() : 15);
        project.setFinalGrade(req.finalGrade());
        project.setMilestoneNotes(req.milestoneNotes());
        project.setRepoUrl(req.repoUrl());
        project.setDomainArea(req.domainArea() != null ? req.domainArea() : "Software & Applied AI");
        return capstoneProjectRepository.save(project);
    }

    @Transactional
    public CapstoneProject updateProjectStage(UUID id, CapstoneStageUpdateRequest req) {
        CapstoneProject project = capstoneProjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Capstone project not found with id: " + id));

        if (req.stage() != null) {
            project.setStage(req.stage());
        }
        if (req.progressPercentage() != null) {
            project.setProgressPercentage(req.progressPercentage());
        }
        if (req.finalGrade() != null) {
            project.setFinalGrade(req.finalGrade());
        }
        if (req.milestoneNotes() != null) {
            project.setMilestoneNotes(req.milestoneNotes());
        }
        return capstoneProjectRepository.save(project);
    }

    // ── Mock Evaluations ───────────────────────────────────────
    @Transactional(readOnly = true)
    public List<MockEvaluation> getAllEvaluations() {
        return mockEvaluationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MockEvaluation> getStudentEvaluations(UUID studentId) {
        return mockEvaluationRepository.findByStudentId(studentId);
    }

    @Transactional
    public MockEvaluation createEvaluation(MockEvaluationRequest req) {
        MockEvaluation eval = new MockEvaluation();
        eval.setStudentId(req.studentId());
        eval.setStudentName(req.studentName());
        eval.setStudentRollNo(req.studentRollNo());
        eval.setEvaluatorName(req.evaluatorName() != null ? req.evaluatorName() : "Faculty Evaluator");
        eval.setTrack(req.track() != null ? req.track() : "Systems & Full Stack");
        eval.setTechnicalScore(req.technicalScore() != null ? req.technicalScore() : 80);
        eval.setProblemSolvingScore(req.problemSolvingScore() != null ? req.problemSolvingScore() : 80);
        eval.setCommunicationScore(req.communicationScore() != null ? req.communicationScore() : 80);
        eval.setNepReadinessScore(req.nepReadinessScore() != null ? req.nepReadinessScore() : 80);

        // Weighted calculation: Tech 30%, Problem Solving 30%, Comm 20%, NEP 20%
        int overall = (int) Math.round(
                (eval.getTechnicalScore() * 0.3) +
                (eval.getProblemSolvingScore() * 0.3) +
                (eval.getCommunicationScore() * 0.2) +
                (eval.getNepReadinessScore() * 0.2)
        );
        eval.setOverallScore(overall);
        eval.setRubricFeedback(req.rubricFeedback());
        eval.setRecommendedActions(req.recommendedActions());

        String status = req.readinessStatus();
        if (status == null || status.isBlank()) {
            status = overall >= 85 ? "PLACEMENT_READY" : (overall >= 70 ? "NEEDS_PRACTICE" : "INTERVENTION_REQUIRED");
        }
        eval.setReadinessStatus(status);

        return mockEvaluationRepository.save(eval);
    }
}
