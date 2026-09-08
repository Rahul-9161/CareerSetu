package in.careersetu.internships.dto;

import in.careersetu.internships.entity.InternshipLogbookEntry;
import in.careersetu.internships.entity.MandatoryInternship;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class InternshipDtos {

    public record CreateInternshipRequest(
            String studentName,
            String studentRollNo,
            String companyName,
            String internshipTitle,
            String track,
            Integer requiredCredits,
            Integer totalRequiredHours,
            Integer monthlyStipend,
            String corporateSupervisorName,
            String corporateSupervisorEmail,
            String facultyMentorName,
            LocalDate startDate,
            LocalDate endDate
    ) {}

    public record LogbookEntryRequest(
            Integer weekNumber,
            String weekRange,
            String tasksCompleted,
            String skillsApplied,
            Integer hoursLogged
    ) {}

    public record DualSignoffRequest(
            String signerRole, // CORPORATE_SUPERVISOR or FACULTY_MENTOR
            String roleType,   // SUPERVISOR or FACULTY
            String status,     // APPROVED or REJECTED
            Boolean approved,
            String comments,
            String remarks
    ) {
        public String getEffectiveRole() {
            if (signerRole != null && !signerRole.isBlank()) return signerRole;
            if ("SUPERVISOR".equalsIgnoreCase(roleType)) return "CORPORATE_SUPERVISOR";
            if ("FACULTY".equalsIgnoreCase(roleType)) return "FACULTY_MENTOR";
            return "CORPORATE_SUPERVISOR";
        }

        public String getEffectiveStatus() {
            if (status != null && !status.isBlank()) return status.toUpperCase();
            if (Boolean.TRUE.equals(approved)) return "APPROVED";
            if (Boolean.FALSE.equals(approved)) return "REJECTED";
            return "APPROVED";
        }
    }

    public record InternshipDetailResponse(
            MandatoryInternship internship,
            List<InternshipLogbookEntry> logbook,
            Double progressPercentage,
            Boolean isDualSignoffReady,
            Boolean isCertified
    ) {}
}
