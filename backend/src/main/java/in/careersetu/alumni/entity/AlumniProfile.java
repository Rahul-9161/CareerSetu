package in.careersetu.alumni.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alumni_profiles")
public class AlumniProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(nullable = false, length = 150)
    private String degree;

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Column(name = "current_company", nullable = false, length = 150)
    private String currentCompany;

    @Column(nullable = false, length = 150)
    private String designation;

    @Column(length = 150)
    private String industry;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "avatar_initials", length = 10)
    private String avatarInitials;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String expertise; // Comma separated: Distributed Systems, System Design, Go, Kubernetes

    @Column(name = "is_mentor_active", nullable = false)
    private Boolean isMentorActive = true;

    @Column(name = "is_referral_active", nullable = false)
    private Boolean isReferralActive = true;

    @Column(name = "total_mentees_helped", nullable = false)
    private Integer totalMenteesHelped = 0;

    @Column(name = "total_referrals_given", nullable = false)
    private Integer totalReferralsGiven = 0;

    @Column(nullable = false)
    private Double rating = 4.9;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public AlumniProfile() {}

    public AlumniProfile(UUID id, UUID userId, String fullName, String email, Integer graduationYear,
                         String degree, String institutionName, String currentCompany, String designation,
                         String industry, String location, String linkedinUrl, String githubUrl,
                         String avatarInitials, String bio, String expertise, Boolean isMentorActive,
                         Boolean isReferralActive, Integer totalMenteesHelped, Integer totalReferralsGiven,
                         Double rating) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.graduationYear = graduationYear;
        this.degree = degree;
        this.institutionName = institutionName;
        this.currentCompany = currentCompany;
        this.designation = designation;
        this.industry = industry;
        this.location = location;
        this.linkedinUrl = linkedinUrl;
        this.githubUrl = githubUrl;
        this.avatarInitials = avatarInitials;
        this.bio = bio;
        this.expertise = expertise;
        this.isMentorActive = isMentorActive != null ? isMentorActive : true;
        this.isReferralActive = isReferralActive != null ? isReferralActive : true;
        this.totalMenteesHelped = totalMenteesHelped != null ? totalMenteesHelped : 0;
        this.totalReferralsGiven = totalReferralsGiven != null ? totalReferralsGiven : 0;
        this.rating = rating != null ? rating : 4.9;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }

    public Boolean getIsMentorActive() { return isMentorActive; }
    public void setIsMentorActive(Boolean isMentorActive) { this.isMentorActive = isMentorActive; }

    public Boolean getIsReferralActive() { return isReferralActive; }
    public void setIsReferralActive(Boolean isReferralActive) { this.isReferralActive = isReferralActive; }

    public Integer getTotalMenteesHelped() { return totalMenteesHelped; }
    public void setTotalMenteesHelped(Integer totalMenteesHelped) { this.totalMenteesHelped = totalMenteesHelped; }

    public Integer getTotalReferralsGiven() { return totalReferralsGiven; }
    public void setTotalReferralsGiven(Integer totalReferralsGiven) { this.totalReferralsGiven = totalReferralsGiven; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
