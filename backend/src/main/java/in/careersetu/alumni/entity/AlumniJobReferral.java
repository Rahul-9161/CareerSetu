package in.careersetu.alumni.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alumni_job_referrals")
public class AlumniJobReferral {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "alumni_id", nullable = false)
    private UUID alumniId;

    @Column(name = "alumni_name", nullable = false, length = 150)
    private String alumniName;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    @Column(name = "job_code", length = 100)
    private String jobCode;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "experience_level", nullable = false, length = 50)
    private String experienceLevel; // e.g. "New Grad 2025", "0-2 Years", "1-3 Years"

    @Column(name = "min_eligibility", columnDefinition = "TEXT")
    private String minEligibility;

    @Column(name = "openings_count", nullable = false)
    private Integer openingsCount = 1;

    @Column(name = "applications_count", nullable = false)
    private Integer applicationsCount = 0;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, CLOSED

    @Column(name = "portal_apply_link", length = 300)
    private String portalApplyLink;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public AlumniJobReferral() {}

    public AlumniJobReferral(UUID id, UUID alumniId, String alumniName, String company, String jobTitle,
                             String jobCode, String location, String experienceLevel, String minEligibility,
                             Integer openingsCount, Integer applicationsCount, String status, String portalApplyLink) {
        this.id = id;
        this.alumniId = alumniId;
        this.alumniName = alumniName;
        this.company = company;
        this.jobTitle = jobTitle;
        this.jobCode = jobCode;
        this.location = location;
        this.experienceLevel = experienceLevel;
        this.minEligibility = minEligibility;
        this.openingsCount = openingsCount != null ? openingsCount : 1;
        this.applicationsCount = applicationsCount != null ? applicationsCount : 0;
        this.status = status != null ? status : "OPEN";
        this.portalApplyLink = portalApplyLink;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAlumniId() { return alumniId; }
    public void setAlumniId(UUID alumniId) { this.alumniId = alumniId; }

    public String getAlumniName() { return alumniName; }
    public void setAlumniName(String alumniName) { this.alumniName = alumniName; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getMinEligibility() { return minEligibility; }
    public void setMinEligibility(String minEligibility) { this.minEligibility = minEligibility; }

    public Integer getOpeningsCount() { return openingsCount; }
    public void setOpeningsCount(Integer openingsCount) { this.openingsCount = openingsCount; }

    public Integer getApplicationsCount() { return applicationsCount; }
    public void setApplicationsCount(Integer applicationsCount) { this.applicationsCount = applicationsCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPortalApplyLink() { return portalApplyLink; }
    public void setPortalApplyLink(String portalApplyLink) { this.portalApplyLink = portalApplyLink; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
