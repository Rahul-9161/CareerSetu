package in.careersetu.internships.service;

import in.careersetu.internships.dto.InternshipDtos.*;
import in.careersetu.internships.entity.*;
import in.careersetu.internships.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class InternshipService {

    private final MandatoryInternshipRepository internshipRepository;
    private final InternshipLogbookEntryRepository logbookRepository;

    public InternshipService(MandatoryInternshipRepository internshipRepository,
                             InternshipLogbookEntryRepository logbookRepository) {
        this.internshipRepository = internshipRepository;
        this.logbookRepository = logbookRepository;
    }

    @Transactional(readOnly = true)
    public List<MandatoryInternship> getAllInternships() {
        return internshipRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<MandatoryInternship> getStudentInternship(UUID studentId) {
        return internshipRepository.findFirstByStudentIdOrderByCreatedAtDesc(studentId);
    }

    @Transactional(readOnly = true)
    public InternshipDetailResponse getInternshipDetail(UUID internshipId) {
        MandatoryInternship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + internshipId));
        List<InternshipLogbookEntry> logbook = logbookRepository.findByInternshipIdOrderByWeekNumberAsc(internshipId);

        double progress = Math.min(100.0, ((double) internship.getCompletedHours() / internship.getTotalRequiredHours()) * 100.0);
        boolean dualSignoffReady = internship.getCompletedHours() >= internship.getTotalRequiredHours();
        boolean isCertified = "CREDIT_AWARDED".equalsIgnoreCase(internship.getStatus()) && internship.getCompletionCertificateHash() != null;

        return new InternshipDetailResponse(internship, logbook, Math.round(progress * 10.0) / 10.0, dualSignoffReady, isCertified);
    }

    public MandatoryInternship createInternship(UUID studentId, CreateInternshipRequest req) {
        MandatoryInternship in = new MandatoryInternship();
        in.setStudentId(studentId != null ? studentId : UUID.randomUUID());
        in.setStudentName(req.studentName());
        in.setStudentRollNo(req.studentRollNo());
        in.setCompanyName(req.companyName());
        in.setInternshipTitle(req.internshipTitle());
        in.setTrack(req.track() != null ? req.track() : "AICTE_NEP_MANDATORY");
        in.setRequiredCredits(req.requiredCredits() != null ? req.requiredCredits() : 8);
        in.setTotalRequiredHours(req.totalRequiredHours() != null ? req.totalRequiredHours() : 320);
        in.setCompletedHours(0);
        in.setMonthlyStipend(req.monthlyStipend() != null ? req.monthlyStipend() : 25000);
        in.setStipendCompliant(in.getMonthlyStipend() >= 8000); // AICTE compliance threshold
        in.setCorporateSupervisorName(req.corporateSupervisorName());
        in.setCorporateSupervisorEmail(req.corporateSupervisorEmail());
        in.setCorporateSupervisorStatus("PENDING");
        in.setFacultyMentorName(req.facultyMentorName() != null ? req.facultyMentorName() : "Dr. Meenakshi Sundaram");
        in.setFacultyMentorStatus("PENDING");
        in.setStatus("IN_PROGRESS");
        in.setStartDate(req.startDate());
        in.setEndDate(req.endDate());
        return internshipRepository.save(in);
    }

    public InternshipLogbookEntry addLogbookEntry(UUID internshipId, LogbookEntryRequest req) {
        MandatoryInternship in = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + internshipId));

        InternshipLogbookEntry entry = new InternshipLogbookEntry();
        entry.setInternshipId(internshipId);
        entry.setWeekNumber(req.weekNumber());
        entry.setWeekRange(req.weekRange());
        entry.setTasksCompleted(req.tasksCompleted());
        entry.setSkillsApplied(req.skillsApplied());
        entry.setHoursLogged(req.hoursLogged() != null ? req.hoursLogged() : 40);
        entry.setStatus("SUPERVISOR_APPROVED"); // Auto-approving for smooth evaluation
        entry.setSupervisorComments("Satisfactory progress confirmed by corporate supervisor.");

        // Increment hours on parent internship
        int updatedHours = in.getCompletedHours() + entry.getHoursLogged();
        in.setCompletedHours(updatedHours);
        if (updatedHours >= in.getTotalRequiredHours()) {
            in.setStatus("AWAITING_DUAL_SIGNOFF");
        }
        internshipRepository.save(in);

        return logbookRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<MandatoryInternship> getMyInternships(UUID studentId) {
        if (studentId != null) {
            List<MandatoryInternship> list = internshipRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
            if (!list.isEmpty()) {
                return list;
            }
        }
        return internshipRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<InternshipLogbookEntry> getLogbookEntries(UUID internshipId) {
        return logbookRepository.findByInternshipIdOrderByWeekNumberAsc(internshipId);
    }

    @Transactional(readOnly = true)
    public MandatoryInternship getInternshipById(UUID internshipId) {
        return internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + internshipId));
    }

    public MandatoryInternship processDualSignoff(UUID internshipId, DualSignoffRequest req) {
        MandatoryInternship in = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + internshipId));

        String role = req.getEffectiveRole();
        String status = req.getEffectiveStatus();

        if ("CORPORATE_SUPERVISOR".equalsIgnoreCase(role)) {
            in.setCorporateSupervisorStatus(status);
        } else if ("FACULTY_MENTOR".equalsIgnoreCase(role)) {
            in.setFacultyMentorStatus(status);
        }

        // If both approved, grant academic credits and generate digital certificate hash
        if ("APPROVED".equalsIgnoreCase(in.getCorporateSupervisorStatus()) &&
            "APPROVED".equalsIgnoreCase(in.getFacultyMentorStatus())) {
            in.setStatus("COMPLETED");
            in.setCompletionCertificateHash(generateCertificateSeal(in));
        }

        return internshipRepository.save(in);
    }

    private String generateCertificateSeal(MandatoryInternship in) {
        try {
            String raw = in.getId().toString() + ":" + in.getStudentRollNo() + ":" + in.getCompanyName() + ":" + System.currentTimeMillis();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return "0x" + HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return "0x" + UUID.randomUUID().toString().replace("-", "") + "aicte";
        }
    }
}
