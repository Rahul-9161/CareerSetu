package in.careersetu.faculty.dto;

import java.time.Instant;
import java.util.UUID;

public class FacultyDtos {

    public record FacultyStatsResponse(
            long totalCourses,
            double avgCurriculumAlignment,
            long totalEndorsements,
            long activeCapstoneProjects,
            long totalMockEvaluations,
            long placementReadyCount
    ) {}

    public record CurriculumCourseRequest(
            String courseCode,
            String courseTitle,
            String department,
            Integer semester,
            Integer aicteCredits,
            String syllabusSummary,
            String industryRelevance,
            Double alignmentScore,
            String mappedSkillsJson,
            String nepCategory,
            String facultyLead
    ) {}

    public record StudentEndorsementRequest(
            UUID studentId,
            String studentName,
            String studentRollNo,
            String facultyName,
            String facultyDesignation,
            String facultyDepartment,
            String specializationArea,
            String endorsementText,
            String ratingTier
    ) {}

    public record CapstoneProjectRequest(
            String projectTitle,
            String industryPartner,
            String corporateMentorName,
            String facultyGuideName,
            String studentNames,
            String studentIdsJson,
            String stage,
            Integer progressPercentage,
            Double finalGrade,
            String milestoneNotes,
            String repoUrl,
            String domainArea
    ) {}

    public record CapstoneStageUpdateRequest(
            String stage,
            Integer progressPercentage,
            Double finalGrade,
            String milestoneNotes
    ) {}

    public record MockEvaluationRequest(
            UUID studentId,
            String studentName,
            String studentRollNo,
            String evaluatorName,
            String track,
            Integer technicalScore,
            Integer problemSolvingScore,
            Integer communicationScore,
            Integer nepReadinessScore,
            String rubricFeedback,
            String recommendedActions,
            String readinessStatus
    ) {}
}
