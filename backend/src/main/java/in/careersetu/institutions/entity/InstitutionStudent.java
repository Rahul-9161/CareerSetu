package in.careersetu.institutions.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "institution_students")
public class InstitutionStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(name = "roll_no", nullable = false)
    private String rollNo;

    @Column(nullable = false)
    private String department;

    @Column(name = "study_year", nullable = false)
    private Integer year = 4;

    @Column(nullable = false)
    private Double cgpa = 7.5;

    @Column(name = "nep_credits", nullable = false)
    private Integer nepCredits = 0;

    @Column(name = "nep_status", nullable = false)
    private String nepStatus = "PENDING"; // COMPLIANT, IN_PROGRESS, PENDING

    @Column(name = "verified_badges_count", nullable = false)
    private Integer verifiedBadgesCount = 0;

    @Column(name = "placement_status", nullable = false)
    private String placementStatus = "NOT_APPLIED"; // NOT_APPLIED, APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, PLACED

    @Column(name = "placed_company")
    private String placedCompany;

    @Column(name = "placed_package_lpa")
    private Double placedPackageLpa;

    @Column(name = "institution_name")
    private String institutionName = "Indian Institute of Technology (IIT) Delhi";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public InstitutionStudent() {}

    public InstitutionStudent(String name, String email, String rollNo, String department, Integer year,
                              Double cgpa, Integer nepCredits, String nepStatus, Integer verifiedBadgesCount,
                              String placementStatus, String placedCompany, Double placedPackageLpa) {
        this.name = name;
        this.email = email;
        this.rollNo = rollNo;
        this.department = department;
        this.year = year != null ? year : 4;
        this.cgpa = cgpa != null ? cgpa : 7.5;
        this.nepCredits = nepCredits != null ? nepCredits : 0;
        this.nepStatus = nepStatus != null ? nepStatus : (this.nepCredits >= 14 ? "COMPLIANT" : (this.nepCredits > 0 ? "IN_PROGRESS" : "PENDING"));
        this.verifiedBadgesCount = verifiedBadgesCount != null ? verifiedBadgesCount : 0;
        this.placementStatus = placementStatus != null ? placementStatus : "NOT_APPLIED";
        this.placedCompany = placedCompany;
        this.placedPackageLpa = placedPackageLpa;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Integer getNepCredits() { return nepCredits; }
    public void setNepCredits(Integer nepCredits) {
        this.nepCredits = nepCredits;
        if (nepCredits != null) {
            if (nepCredits >= 14) this.nepStatus = "COMPLIANT";
            else if (nepCredits > 0) this.nepStatus = "IN_PROGRESS";
            else this.nepStatus = "PENDING";
        }
    }

    public String getNepStatus() { return nepStatus; }
    public void setNepStatus(String nepStatus) { this.nepStatus = nepStatus; }

    public Integer getVerifiedBadgesCount() { return verifiedBadgesCount; }
    public void setVerifiedBadgesCount(Integer verifiedBadgesCount) { this.verifiedBadgesCount = verifiedBadgesCount; }

    public String getPlacementStatus() { return placementStatus; }
    public void setPlacementStatus(String placementStatus) { this.placementStatus = placementStatus; }

    public String getPlacedCompany() { return placedCompany; }
    public void setPlacedCompany(String placedCompany) { this.placedCompany = placedCompany; }

    public Double getPlacedPackageLpa() { return placedPackageLpa; }
    public void setPlacedPackageLpa(Double placedPackageLpa) { this.placedPackageLpa = placedPackageLpa; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
