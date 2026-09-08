package in.careersetu.faculty.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Technical viva and mock interview evaluation recorded by faculty for student placement readiness.
 * Includes multi-dimensional rubric scores and actionable academic interventions.
 */
@Entity
@Table(name = "mock_evaluations")
public class MockEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_roll_no", length = 50)
    private String studentRollNo;

    @Column(name = "evaluator_name", nullable = false, length = 150)
    private String evaluatorName;

    @Column(nullable = false, length = 100)
    private String track; // e.g. "Full Stack & Cloud Architecture", "Data Science & AI"

    @Column(name = "technical_score", nullable = false)
    private Integer technicalScore; // 0 to 100

    @Column(name = "problem_solving_score", nullable = false)
    private Integer problemSolvingScore; // 0 to 100

    @Column(name = "communication_score", nullable = false)
    private Integer communicationScore; // 0 to 100

    @Column(name = "nep_readiness_score", nullable = false)
    private Integer nepReadinessScore; // 0 to 100

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore; // Average or weighted

    @Column(name = "rubric_feedback", columnDefinition = "TEXT")
    private String rubricFeedback;

    @Column(name = "recommended_actions", columnDefinition = "TEXT")
    private String recommendedActions;

    @Column(name = "readiness_status", nullable = false, length = 50)
    private String readinessStatus; // "PLACEMENT_READY", "NEEDS_PRACTICE", "INTERVENTION_REQUIRED"

    @CreationTimestamp
    @Column(name = "evaluated_at", nullable = false, updatable = false)
    private Instant evaluatedAt;

    public MockEvaluation() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }

    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }

    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }

    public Integer getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Integer technicalScore) { this.technicalScore = technicalScore; }

    public Integer getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(Integer problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }

    public Integer getNepReadinessScore() { return nepReadinessScore; }
    public void setNepReadinessScore(Integer nepReadinessScore) { this.nepReadinessScore = nepReadinessScore; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getRubricFeedback() { return rubricFeedback; }
    public void setRubricFeedback(String rubricFeedback) { this.rubricFeedback = rubricFeedback; }

    public String getRecommendedActions() { return recommendedActions; }
    public void setRecommendedActions(String recommendedActions) { this.recommendedActions = recommendedActions; }

    public String getReadinessStatus() { return readinessStatus; }
    public void setReadinessStatus(String readinessStatus) { this.readinessStatus = readinessStatus; }

    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
