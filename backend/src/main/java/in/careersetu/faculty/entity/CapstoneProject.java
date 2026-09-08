package in.careersetu.faculty.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Joint industry-academia capstone and internship projects.
 * Tracked by university faculty and corporate mentors with milestone gating and viva grading.
 */
@Entity
@Table(name = "capstone_projects")
public class CapstoneProject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String projectTitle;

    @Column(nullable = false, length = 150)
    private String industryPartner; // e.g. "TechCorp India & DroneVentures"

    @Column(length = 150)
    private String corporateMentorName; // e.g. "Priya Patel"

    @Column(nullable = false, length = 150)
    private String facultyGuideName; // e.g. "Dr. Meenakshi Sundaram"

    @Column(nullable = false, length = 255)
    private String studentNames; // e.g. "Aarav Sharma, Divya Nair"

    @Column(name = "student_ids_json", columnDefinition = "TEXT")
    private String studentIdsJson;

    @Column(nullable = false, length = 50)
    private String stage; // "PROPOSAL", "MID_TERM", "INDUSTRY_REVIEW", "FINAL_VIVA", "COMPLETED"

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage; // 0 to 100

    @Column(name = "final_grade")
    private Double finalGrade; // e.g. 9.5 (out of 10)

    @Column(name = "milestone_notes", columnDefinition = "TEXT")
    private String milestoneNotes;

    @Column(name = "repo_url", length = 255)
    private String repoUrl;

    @Column(length = 100)
    private String domainArea; // e.g. "Autonomous Systems & Edge AI"

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public CapstoneProject() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getIndustryPartner() { return industryPartner; }
    public void setIndustryPartner(String industryPartner) { this.industryPartner = industryPartner; }

    public String getCorporateMentorName() { return corporateMentorName; }
    public void setCorporateMentorName(String corporateMentorName) { this.corporateMentorName = corporateMentorName; }

    public String getFacultyGuideName() { return facultyGuideName; }
    public void setFacultyGuideName(String facultyGuideName) { this.facultyGuideName = facultyGuideName; }

    public String getStudentNames() { return studentNames; }
    public void setStudentNames(String studentNames) { this.studentNames = studentNames; }

    public String getStudentIdsJson() { return studentIdsJson; }
    public void setStudentIdsJson(String studentIdsJson) { this.studentIdsJson = studentIdsJson; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public Double getFinalGrade() { return finalGrade; }
    public void setFinalGrade(Double finalGrade) { this.finalGrade = finalGrade; }

    public String getMilestoneNotes() { return milestoneNotes; }
    public void setMilestoneNotes(String milestoneNotes) { this.milestoneNotes = milestoneNotes; }

    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }

    public String getDomainArea() { return domainArea; }
    public void setDomainArea(String domainArea) { this.domainArea = domainArea; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
