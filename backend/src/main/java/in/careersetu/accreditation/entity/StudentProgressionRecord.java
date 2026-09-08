package in.careersetu.accreditation.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "student_progression_records")
public class StudentProgressionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "roll_number", nullable = false, length = 50)
    private String rollNumber; // e.g. "21CS104"

    @Column(nullable = false, length = 100)
    private String department; // "Computer Science & Engineering", "Electronics & Communication", etc.

    @Column(name = "progression_type", nullable = false, length = 50)
    private String progressionType; // CAMPUS_PLACEMENT, OFF_CAMPUS_PLACEMENT, HIGHER_STUDIES_INDIA, HIGHER_STUDIES_ABROAD, COMPETITIVE_EXAM_QUALIFIED, ENTREPRENEURSHIP

    @Column(name = "organization_or_university", nullable = false, length = 200)
    private String organizationOrUniversity; // e.g. "TechCorp India Technologies", "Stanford University", "IIM Ahmedabad"

    @Column(name = "designation_or_program", nullable = false, length = 150)
    private String designationOrProgram; // e.g. "Software Development Engineer", "M.S. in Computer Science", "MBA PGP"

    @Column(name = "annual_package_lpa")
    private Double annualPackageLpa; // e.g. 24.5

    @Column(name = "appointment_or_admission_ref", length = 100)
    private String appointmentOrAdmissionRef; // e.g. "TC-OFFER-2026-9912"

    @Column(name = "proof_document_url", length = 300)
    private String proofDocumentUrl; // e.g. "/vault/proofs/21CS104_offer_letter.pdf"

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "VERIFIED_BY_TPO"; // VERIFIED_BY_TPO, PENDING_PROOF, REJECTED

    @Column(name = "verified_at")
    private Instant verifiedAt = Instant.now();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public StudentProgressionRecord() {}

    public StudentProgressionRecord(UUID id, UUID studentId, String studentName, String rollNumber,
                                    String department, String progressionType, String organizationOrUniversity,
                                    String designationOrProgram, Double annualPackageLpa,
                                    String appointmentOrAdmissionRef, String proofDocumentUrl,
                                    String verificationStatus) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.department = department;
        this.progressionType = progressionType;
        this.organizationOrUniversity = organizationOrUniversity;
        this.designationOrProgram = designationOrProgram;
        this.annualPackageLpa = annualPackageLpa;
        this.appointmentOrAdmissionRef = appointmentOrAdmissionRef;
        this.proofDocumentUrl = proofDocumentUrl;
        this.verificationStatus = verificationStatus != null ? verificationStatus : "VERIFIED_BY_TPO";
        this.verifiedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getProgressionType() { return progressionType; }
    public void setProgressionType(String progressionType) { this.progressionType = progressionType; }
    public String getOrganizationOrUniversity() { return organizationOrUniversity; }
    public void setOrganizationOrUniversity(String organizationOrUniversity) { this.organizationOrUniversity = organizationOrUniversity; }
    public String getDesignationOrProgram() { return designationOrProgram; }
    public void setDesignationOrProgram(String designationOrProgram) { this.designationOrProgram = designationOrProgram; }
    public Double getAnnualPackageLpa() { return annualPackageLpa; }
    public void setAnnualPackageLpa(Double annualPackageLpa) { this.annualPackageLpa = annualPackageLpa; }
    public String getAppointmentOrAdmissionRef() { return appointmentOrAdmissionRef; }
    public void setAppointmentOrAdmissionRef(String appointmentOrAdmissionRef) { this.appointmentOrAdmissionRef = appointmentOrAdmissionRef; }
    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
