package in.careersetu.faculty.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Digitally signed faculty recommendation and academic endorsement for a student.
 * Features a verifiable SHA-256 cryptographic stamp visible on the Career Passport.
 */
@Entity
@Table(name = "student_endorsements")
public class StudentEndorsement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "faculty_id")
    private UUID facultyId;

    @Column(name = "faculty_name", nullable = false, length = 150)
    private String facultyName;

    @Column(name = "faculty_designation", length = 150)
    private String facultyDesignation;

    @Column(name = "faculty_department", length = 100)
    private String facultyDepartment;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_roll_no", length = 50)
    private String studentRollNo;

    @Column(name = "specialization_area", nullable = false, length = 200)
    private String specializationArea; // e.g. "Distributed Systems & Cloud Architecture"

    @Column(name = "endorsement_text", nullable = false, columnDefinition = "TEXT")
    private String endorsementText;

    @Column(name = "rating_tier", nullable = false, length = 50)
    private String ratingTier; // "TOP_5_PERCENT", "TOP_10_PERCENT", "HONORS", "RECOMMENDED"

    @Column(name = "verification_hash", nullable = false, unique = true, length = 100)
    private String verificationHash; // SHA-256 signature

    @Column(length = 30)
    private String status; // "VERIFIED", "ACTIVE"

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public StudentEndorsement() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getFacultyId() { return facultyId; }
    public void setFacultyId(UUID facultyId) { this.facultyId = facultyId; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getFacultyDesignation() { return facultyDesignation; }
    public void setFacultyDesignation(String facultyDesignation) { this.facultyDesignation = facultyDesignation; }

    public String getFacultyDepartment() { return facultyDepartment; }
    public void setFacultyDepartment(String facultyDepartment) { this.facultyDepartment = facultyDepartment; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }

    public String getSpecializationArea() { return specializationArea; }
    public void setSpecializationArea(String specializationArea) { this.specializationArea = specializationArea; }

    public String getEndorsementText() { return endorsementText; }
    public void setEndorsementText(String endorsementText) { this.endorsementText = endorsementText; }

    public String getRatingTier() { return ratingTier; }
    public void setRatingTier(String ratingTier) { this.ratingTier = ratingTier; }

    public String getVerificationHash() { return verificationHash; }
    public void setVerificationHash(String verificationHash) { this.verificationHash = verificationHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
