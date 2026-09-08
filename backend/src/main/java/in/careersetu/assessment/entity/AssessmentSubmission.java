package in.careersetu.assessment.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assessment_submissions")
public class AssessmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "challenge_id", nullable = false)
    private String challengeId;

    @Column(name = "challenge_title", nullable = false)
    private String challengeTitle;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private Integer score = 90;

    @Column(name = "code_snippet", columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(name = "passed_test_cases", nullable = false)
    private Integer passedTestCases = 3;

    @Column(name = "total_test_cases", nullable = false)
    private Integer totalTestCases = 3;

    @Column(name = "verification_hash", nullable = false, unique = true)
    private String verificationHash;

    @Column(name = "badge_title")
    private String badgeTitle;

    @Column(nullable = false)
    private String status = "PASSED";

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt = Instant.now();

    public AssessmentSubmission() {}

    public AssessmentSubmission(String studentEmail, String studentName, String challengeId,
                                String challengeTitle, String language, Integer score,
                                String codeSnippet, Integer passedTestCases, Integer totalTestCases,
                                String verificationHash, String badgeTitle, String status) {
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.challengeId = challengeId;
        this.challengeTitle = challengeTitle;
        this.language = language;
        this.score = score != null ? score : 95;
        this.codeSnippet = codeSnippet;
        this.passedTestCases = passedTestCases != null ? passedTestCases : 3;
        this.totalTestCases = totalTestCases != null ? totalTestCases : 3;
        this.verificationHash = verificationHash;
        this.badgeTitle = badgeTitle;
        this.status = status != null ? status : "PASSED";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }

    public String getChallengeTitle() { return challengeTitle; }
    public void setChallengeTitle(String challengeTitle) { this.challengeTitle = challengeTitle; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public Integer getPassedTestCases() { return passedTestCases; }
    public void setPassedTestCases(Integer passedTestCases) { this.passedTestCases = passedTestCases; }

    public Integer getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(Integer totalTestCases) { this.totalTestCases = totalTestCases; }

    public String getVerificationHash() { return verificationHash; }
    public void setVerificationHash(String verificationHash) { this.verificationHash = verificationHash; }

    public String getBadgeTitle() { return badgeTitle; }
    public void setBadgeTitle(String badgeTitle) { this.badgeTitle = badgeTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
