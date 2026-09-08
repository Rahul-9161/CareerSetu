package in.careersetu.alumni.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alumni_referral_applications")
public class AlumniReferralApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "referral_id", nullable = false)
    private UUID referralId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_email", nullable = false, length = 150)
    private String studentEmail;

    @Column(name = "student_branch", length = 100)
    private String studentBranch;

    @Column(name = "student_cgpa")
    private Double studentCgpa;

    @Column(name = "resume_url", length = 300)
    private String resumeUrl;

    @Column(name = "portfolio_url", length = 300)
    private String portfolioUrl;

    @Column(name = "note_to_alumni", columnDefinition = "TEXT")
    private String noteToAlumni;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, REFERRED, DECLINED, INTERVIEWING

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "applied_at", nullable = false)
    private Instant appliedAt = Instant.now();

    public AlumniReferralApplication() {}

    public AlumniReferralApplication(UUID id, UUID referralId, UUID studentId, String studentName,
                                     String studentEmail, String studentBranch, Double studentCgpa,
                                     String resumeUrl, String portfolioUrl, String noteToAlumni,
                                     String status, String feedback) {
        this.id = id;
        this.referralId = referralId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentBranch = studentBranch;
        this.studentCgpa = studentCgpa;
        this.resumeUrl = resumeUrl;
        this.portfolioUrl = portfolioUrl;
        this.noteToAlumni = noteToAlumni;
        this.status = status != null ? status : "PENDING";
        this.feedback = feedback;
        this.appliedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getReferralId() { return referralId; }
    public void setReferralId(UUID referralId) { this.referralId = referralId; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentBranch() { return studentBranch; }
    public void setStudentBranch(String studentBranch) { this.studentBranch = studentBranch; }

    public Double getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(Double studentCgpa) { this.studentCgpa = studentCgpa; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getNoteToAlumni() { return noteToAlumni; }
    public void setNoteToAlumni(String noteToAlumni) { this.noteToAlumni = noteToAlumni; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Instant getAppliedAt() { return appliedAt; }
    public void setAppliedAt(Instant appliedAt) { this.appliedAt = appliedAt; }
}
