package in.careersetu.internships.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mandatory_internships")
public class MandatoryInternship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_roll_no", nullable = false, length = 50)
    private String studentRollNo;

    @Column(name = "company_id")
    private UUID companyId;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "internship_title", nullable = false, length = 200)
    private String internshipTitle;

    @Column(nullable = false, length = 50)
    private String track = "AICTE_NEP_MANDATORY"; // AICTE_NEP_MANDATORY, PMKVY_SKILLING, NEAT_3_0

    @Column(name = "required_credits", nullable = false)
    private Integer requiredCredits = 8; // AICTE recommended 6-8 credits

    @Column(name = "completed_hours", nullable = false)
    private Integer completedHours = 0; // Target e.g. 320 hours

    @Column(name = "total_required_hours", nullable = false)
    private Integer totalRequiredHours = 320;

    @Column(name = "monthly_stipend", nullable = false)
    private Integer monthlyStipend = 25000;

    @Column(name = "stipend_compliant", nullable = false)
    private Boolean stipendCompliant = true; // Minimum threshold verification

    @Column(name = "corporate_supervisor_name", nullable = false, length = 150)
    private String corporateSupervisorName;

    @Column(name = "corporate_supervisor_email", nullable = false, length = 150)
    private String corporateSupervisorEmail;

    @Column(name = "corporate_supervisor_status", nullable = false, length = 30)
    private String corporateSupervisorStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "faculty_mentor_name", nullable = false, length = 150)
    private String facultyMentorName;

    @Column(name = "faculty_mentor_status", nullable = false, length = 30)
    private String facultyMentorStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(nullable = false, length = 40)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, AWAITING_DUAL_SIGNOFF, COMPLETED, CREDIT_AWARDED

    @Column(name = "completion_certificate_hash", length = 120)
    private String completionCertificateHash; // SHA-256 seal

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public MandatoryInternship() {}

    public MandatoryInternship(UUID id, UUID studentId, String studentName, String studentRollNo,
                               UUID companyId, String companyName, String internshipTitle, String track,
                               Integer requiredCredits, Integer completedHours, Integer totalRequiredHours,
                               Integer monthlyStipend, Boolean stipendCompliant, String corporateSupervisorName,
                               String corporateSupervisorEmail, String corporateSupervisorStatus,
                               String facultyMentorName, String facultyMentorStatus, String status,
                               String completionCertificateHash, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRollNo = studentRollNo;
        this.companyId = companyId;
        this.companyName = companyName;
        this.internshipTitle = internshipTitle;
        this.track = track != null ? track : "AICTE_NEP_MANDATORY";
        this.requiredCredits = requiredCredits != null ? requiredCredits : 8;
        this.completedHours = completedHours != null ? completedHours : 0;
        this.totalRequiredHours = totalRequiredHours != null ? totalRequiredHours : 320;
        this.monthlyStipend = monthlyStipend != null ? monthlyStipend : 25000;
        this.stipendCompliant = stipendCompliant != null ? stipendCompliant : true;
        this.corporateSupervisorName = corporateSupervisorName;
        this.corporateSupervisorEmail = corporateSupervisorEmail;
        this.corporateSupervisorStatus = corporateSupervisorStatus != null ? corporateSupervisorStatus : "PENDING";
        this.facultyMentorName = facultyMentorName;
        this.facultyMentorStatus = facultyMentorStatus != null ? facultyMentorStatus : "PENDING";
        this.status = status != null ? status : "IN_PROGRESS";
        this.completionCertificateHash = completionCertificateHash;
        this.startDate = startDate != null ? startDate : LocalDate.now().minusWeeks(8);
        this.endDate = endDate != null ? endDate : LocalDate.now().plusWeeks(8);
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }

    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getInternshipTitle() { return internshipTitle; }
    public void setInternshipTitle(String internshipTitle) { this.internshipTitle = internshipTitle; }

    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }

    public Integer getRequiredCredits() { return requiredCredits; }
    public void setRequiredCredits(Integer requiredCredits) { this.requiredCredits = requiredCredits; }

    public Integer getCompletedHours() { return completedHours; }
    public void setCompletedHours(Integer completedHours) { this.completedHours = completedHours; }

    public Integer getTotalRequiredHours() { return totalRequiredHours; }
    public void setTotalRequiredHours(Integer totalRequiredHours) { this.totalRequiredHours = totalRequiredHours; }

    public Integer getMonthlyStipend() { return monthlyStipend; }
    public void setMonthlyStipend(Integer monthlyStipend) { this.monthlyStipend = monthlyStipend; }

    public Boolean getStipendCompliant() { return stipendCompliant; }
    public void setStipendCompliant(Boolean stipendCompliant) { this.stipendCompliant = stipendCompliant; }

    public String getCorporateSupervisorName() { return corporateSupervisorName; }
    public void setCorporateSupervisorName(String corporateSupervisorName) { this.corporateSupervisorName = corporateSupervisorName; }

    public String getCorporateSupervisorEmail() { return corporateSupervisorEmail; }
    public void setCorporateSupervisorEmail(String corporateSupervisorEmail) { this.corporateSupervisorEmail = corporateSupervisorEmail; }

    public String getCorporateSupervisorStatus() { return corporateSupervisorStatus; }
    public void setCorporateSupervisorStatus(String corporateSupervisorStatus) { this.corporateSupervisorStatus = corporateSupervisorStatus; }

    public String getFacultyMentorName() { return facultyMentorName; }
    public void setFacultyMentorName(String facultyMentorName) { this.facultyMentorName = facultyMentorName; }

    public String getFacultyMentorStatus() { return facultyMentorStatus; }
    public void setFacultyMentorStatus(String facultyMentorStatus) { this.facultyMentorStatus = facultyMentorStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCompletionCertificateHash() { return completionCertificateHash; }
    public void setCompletionCertificateHash(String completionCertificateHash) { this.completionCertificateHash = completionCertificateHash; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
