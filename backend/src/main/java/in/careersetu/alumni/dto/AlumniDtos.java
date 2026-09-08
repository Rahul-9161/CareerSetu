package in.careersetu.alumni.dto;

import java.util.UUID;

public class AlumniDtos {

    public record AlumniStatsResponse(
            long totalAlumni,
            long activeMentors,
            long openReferrals,
            long completedSessions,
            long activeDiscussions
    ) {}

    public record CreateSlotRequest(
            String topic,
            String slotTime,
            Integer durationMinutes,
            String meetingPlatform,
            String meetingLink
    ) {}

    public record BookSlotRequest(
            String studentName,
            String bookingNotes
    ) {}

    public record CreateReferralRequest(
            String company,
            String jobTitle,
            String jobCode,
            String location,
            String experienceLevel,
            String minEligibility,
            Integer openingsCount,
            String portalApplyLink
    ) {}

    public record ApplyReferralRequest(
            String studentName,
            String studentEmail,
            String studentBranch,
            Double studentCgpa,
            String resumeUrl,
            String portfolioUrl,
            String noteToAlumni
    ) {}

    public record UpdateReferralStatusRequest(
            String status,
            String feedback
    ) {}

    public record CreateDiscussionRequest(
            String authorName,
            String authorRole,
            String companyOrBranch,
            String title,
            String content,
            String category
    ) {}

    public record PinDiscussionAnswerRequest(
            String answer,
            String alumniName
    ) {}
}
