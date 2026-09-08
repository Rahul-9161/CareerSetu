package in.careersetu.faculty.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Maps academic course syllabus to industry skills, AICTE NEP 2020 credit frameworks,
 * and industry alignment percentages.
 */
@Entity
@Table(name = "curriculum_courses")
public class CurriculumCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String courseCode; // e.g. "CS401"

    @Column(nullable = false, length = 255)
    private String courseTitle; // e.g. "Distributed Systems & Cloud Architecture"

    @Column(nullable = false, length = 100)
    private String department; // e.g. "Computer Science & Engineering"

    @Column(nullable = false)
    private Integer semester; // e.g. 7

    @Column(name = "aicte_credits", nullable = false)
    private Integer aicteCredits; // e.g. 4

    @Column(columnDefinition = "TEXT")
    private String syllabusSummary;

    @Column(length = 50)
    private String industryRelevance; // "VERY_HIGH", "HIGH", "MODERATE"

    @Column(name = "alignment_score")
    private Double alignmentScore; // e.g. 92.5 (%)

    @Column(name = "mapped_skills", columnDefinition = "TEXT")
    private String mappedSkillsJson; // e.g. "[\"Kubernetes\", \"gRPC\", \"Kafka\", \"Distributed Consensus\"]"

    @Column(name = "nep_category", length = 100)
    private String nepCategory; // e.g. "Advanced Technical Specialization (NEP 14-Credit)"

    @Column(name = "faculty_lead", length = 150)
    private String facultyLead; // e.g. "Dr. Meenakshi Sundaram"

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public CurriculumCourse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getAicteCredits() { return aicteCredits; }
    public void setAicteCredits(Integer aicteCredits) { this.aicteCredits = aicteCredits; }

    public String getSyllabusSummary() { return syllabusSummary; }
    public void setSyllabusSummary(String syllabusSummary) { this.syllabusSummary = syllabusSummary; }

    public String getIndustryRelevance() { return industryRelevance; }
    public void setIndustryRelevance(String industryRelevance) { this.industryRelevance = industryRelevance; }

    public Double getAlignmentScore() { return alignmentScore; }
    public void setAlignmentScore(Double alignmentScore) { this.alignmentScore = alignmentScore; }

    public String getMappedSkillsJson() { return mappedSkillsJson; }
    public void setMappedSkillsJson(String mappedSkillsJson) { this.mappedSkillsJson = mappedSkillsJson; }

    public String getNepCategory() { return nepCategory; }
    public void setNepCategory(String nepCategory) { this.nepCategory = nepCategory; }

    public String getFacultyLead() { return facultyLead; }
    public void setFacultyLead(String facultyLead) { this.facultyLead = facultyLead; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
