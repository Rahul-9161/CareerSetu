package in.careersetu.alumni.service;

import in.careersetu.alumni.dto.AlumniDtos.*;
import in.careersetu.alumni.entity.*;
import in.careersetu.alumni.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AlumniService {

    private final AlumniProfileRepository alumniProfileRepository;
    private final AlumniMentorshipSlotRepository slotRepository;
    private final AlumniJobReferralRepository referralRepository;
    private final AlumniReferralApplicationRepository applicationRepository;
    private final AlumniDiscussionPostRepository discussionRepository;

    public AlumniService(AlumniProfileRepository alumniProfileRepository,
                         AlumniMentorshipSlotRepository slotRepository,
                         AlumniJobReferralRepository referralRepository,
                         AlumniReferralApplicationRepository applicationRepository,
                         AlumniDiscussionPostRepository discussionRepository) {
        this.alumniProfileRepository = alumniProfileRepository;
        this.slotRepository = slotRepository;
        this.referralRepository = referralRepository;
        this.applicationRepository = applicationRepository;
        this.discussionRepository = discussionRepository;
    }

    @Transactional(readOnly = true)
    public AlumniStatsResponse getStats() {
        long totalAlumni = alumniProfileRepository.count();
        long activeMentors = alumniProfileRepository.findAll().stream()
                .filter(AlumniProfile::getIsMentorActive).count();
        long openReferrals = referralRepository.findByStatusOrderByCreatedAtDesc("OPEN").size();
        long completedSessions = slotRepository.findAll().stream()
                .filter(s -> "BOOKED".equalsIgnoreCase(s.getStatus()) || "COMPLETED".equalsIgnoreCase(s.getStatus()))
                .count();
        long activeDiscussions = discussionRepository.count();

        return new AlumniStatsResponse(
                totalAlumni,
                activeMentors,
                openReferrals,
                completedSessions,
                activeDiscussions
        );
    }

    // ── Directory ──────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<AlumniProfile> getDirectory(String query) {
        if (query == null || query.isBlank()) {
            return alumniProfileRepository.findAll();
        }
        return alumniProfileRepository.searchAlumni(query.trim());
    }

    @Transactional(readOnly = true)
    public Optional<AlumniProfile> getProfile(UUID id) {
        return alumniProfileRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<AlumniProfile> getProfileByUserId(UUID userId) {
        return alumniProfileRepository.findByUserId(userId);
    }

    public AlumniProfile saveProfile(AlumniProfile profile) {
        return alumniProfileRepository.save(profile);
    }

    // ── Mentorship Slots ───────────────────────────────────────
    @Transactional(readOnly = true)
    public List<AlumniMentorshipSlot> getSlots(UUID alumniId, String status) {
        if (alumniId != null) {
            return slotRepository.findByAlumniIdOrderByCreatedAtDesc(alumniId);
        }
        if (status != null && !status.isBlank()) {
            return slotRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return slotRepository.findAll();
    }

    public AlumniMentorshipSlot createSlot(UUID alumniId, String alumniName, String company, CreateSlotRequest req) {
        AlumniMentorshipSlot slot = new AlumniMentorshipSlot();
        slot.setAlumniId(alumniId != null ? alumniId : UUID.randomUUID());
        slot.setAlumniName(alumniName != null ? alumniName : "Verified Alumnus");
        slot.setCompany(company != null ? company : "Tech Industry");
        slot.setTopic(req.topic());
        slot.setSlotTime(req.slotTime());
        slot.setDurationMinutes(req.durationMinutes() != null ? req.durationMinutes() : 45);
        slot.setMeetingPlatform(req.meetingPlatform() != null ? req.meetingPlatform() : "Google Meet");
        slot.setStatus("AVAILABLE");
        slot.setMeetingLink(req.meetingLink() != null && !req.meetingLink().isBlank()
                ? req.meetingLink()
                : "https://meet.google.com/setu-alum-" + UUID.randomUUID().toString().substring(0, 8));
        return slotRepository.save(slot);
    }

    public AlumniMentorshipSlot bookSlot(UUID slotId, UUID studentId, BookSlotRequest req) {
        AlumniMentorshipSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Mentorship slot not found with id: " + slotId));

        slot.setStatus("BOOKED");
        slot.setBookedByStudentId(studentId != null ? studentId : UUID.randomUUID());
        slot.setBookedByStudentName(req.studentName() != null ? req.studentName() : "Enrolled Student");
        slot.setBookingNotes(req.bookingNotes());

        // Increment alumni total mentees helped
        alumniProfileRepository.findById(slot.getAlumniId()).ifPresent(alum -> {
            alum.setTotalMenteesHelped(alum.getTotalMenteesHelped() + 1);
            alumniProfileRepository.save(alum);
        });

        return slotRepository.save(slot);
    }

    // ── Referrals ──────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<AlumniJobReferral> getReferrals(String status, String company) {
        if (company != null && !company.isBlank()) {
            return referralRepository.findByCompanyIgnoreCaseOrderByCreatedAtDesc(company.trim());
        }
        if (status != null && !status.isBlank()) {
            return referralRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return referralRepository.findAll();
    }

    public AlumniJobReferral createReferral(UUID alumniId, String alumniName, CreateReferralRequest req) {
        AlumniJobReferral ref = new AlumniJobReferral();
        ref.setAlumniId(alumniId != null ? alumniId : UUID.randomUUID());
        ref.setAlumniName(alumniName != null ? alumniName : "Verified Alumnus");
        ref.setCompany(req.company());
        ref.setJobTitle(req.jobTitle());
        ref.setJobCode(req.jobCode());
        ref.setLocation(req.location());
        ref.setExperienceLevel(req.experienceLevel());
        ref.setMinEligibility(req.minEligibility());
        ref.setOpeningsCount(req.openingsCount() != null ? req.openingsCount() : 1);
        ref.setApplicationsCount(0);
        ref.setStatus("OPEN");
        ref.setPortalApplyLink(req.portalApplyLink());
        return referralRepository.save(ref);
    }

    public AlumniReferralApplication applyForReferral(UUID referralId, UUID studentId, ApplyReferralRequest req) {
        AlumniJobReferral ref = referralRepository.findById(referralId)
                .orElseThrow(() -> new IllegalArgumentException("Referral not found with id: " + referralId));

        AlumniReferralApplication app = new AlumniReferralApplication();
        app.setReferralId(referralId);
        app.setStudentId(studentId != null ? studentId : UUID.randomUUID());
        app.setStudentName(req.studentName());
        app.setStudentEmail(req.studentEmail());
        app.setStudentBranch(req.studentBranch());
        app.setStudentCgpa(req.studentCgpa() != null ? req.studentCgpa() : 8.5);
        app.setResumeUrl(req.resumeUrl() != null ? req.resumeUrl() : "https://careersetu.in/resumes/passport-" + UUID.randomUUID().toString().substring(0, 8) + ".pdf");
        app.setPortfolioUrl(req.portfolioUrl());
        app.setNoteToAlumni(req.noteToAlumni());
        app.setStatus("PENDING");

        ref.setApplicationsCount(ref.getApplicationsCount() + 1);
        referralRepository.save(ref);

        return applicationRepository.save(app);
    }

    @Transactional(readOnly = true)
    public List<AlumniReferralApplication> getApplicationsForReferral(UUID referralId) {
        return applicationRepository.findByReferralIdOrderByAppliedAtDesc(referralId);
    }

    public AlumniReferralApplication updateApplicationStatus(UUID applicationId, UpdateReferralStatusRequest req) {
        AlumniReferralApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Referral application not found with id: " + applicationId));

        app.setStatus(req.status().toUpperCase());
        if (req.feedback() != null) {
            app.setFeedback(req.feedback());
        }

        // If marked REFERRED, increment the referring alumnus total referrals given count
        if ("REFERRED".equalsIgnoreCase(req.status())) {
            referralRepository.findById(app.getReferralId()).ifPresent(ref -> {
                alumniProfileRepository.findById(ref.getAlumniId()).ifPresent(alum -> {
                    alum.setTotalReferralsGiven(alum.getTotalReferralsGiven() + 1);
                    alumniProfileRepository.save(alum);
                });
            });
        }

        return applicationRepository.save(app);
    }

    // ── Discussions ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<AlumniDiscussionPost> getDiscussions(String category) {
        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            return discussionRepository.findByCategoryOrderByCreatedAtDesc(category.toUpperCase());
        }
        return discussionRepository.findAllByOrderByCreatedAtDesc();
    }

    public AlumniDiscussionPost createDiscussion(CreateDiscussionRequest req) {
        AlumniDiscussionPost post = new AlumniDiscussionPost();
        post.setAuthorName(req.authorName());
        post.setAuthorRole(req.authorRole() != null ? req.authorRole() : "STUDENT");
        post.setCompanyOrBranch(req.companyOrBranch());
        post.setTitle(req.title());
        post.setContent(req.content());
        post.setCategory(req.category() != null ? req.category().toUpperCase() : "CAREER_GROWTH");
        post.setLikesCount(1);
        post.setRepliesCount(0);
        return discussionRepository.save(post);
    }

    public AlumniDiscussionPost pinAnswer(UUID postId, PinDiscussionAnswerRequest req) {
        AlumniDiscussionPost post = discussionRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion post not found with id: " + postId));

        post.setPinnedAnswer(req.answer());
        post.setPinnedByAlumni(req.alumniName() != null ? req.alumniName() : "Senior Alumnus");
        post.setRepliesCount(post.getRepliesCount() + 1);
        post.setLikesCount(post.getLikesCount() + 3);
        return discussionRepository.save(post);
    }
}
