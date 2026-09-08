package in.careersetu.apprenticeships.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "apaar_credit_records")
public class ApaarCreditRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "apaar_id", nullable = false, unique = true, length = 50)
    private String apaarId; // e.g. "APAAR-9182-4412-8809"

    @Column(name = "digilocker_id", nullable = false, length = 50)
    private String digilockerId; // e.g. "DL-ARV-99210"

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Column(name = "cumulative_credits_deposited", nullable = false)
    private Integer cumulativeCreditsDeposited = 0;

    @Column(name = "degree_specialization", nullable = false, length = 150)
    private String degreeSpecialization;

    @Column(name = "digilocker_status", nullable = false, length = 30)
    private String digilockerStatus = "VERIFIED"; // VERIFIED, SYNC_PENDING

    @Column(name = "digilocker_xml_hash", length = 100)
    private String digilockerXmlHash;

    @Column(name = "last_synced_at")
    private Instant lastSyncedAt = Instant.now();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public ApaarCreditRecord() {}

    public ApaarCreditRecord(UUID id, UUID studentId, String apaarId, String digilockerId,
                             String studentName, String institutionName, Integer cumulativeCreditsDeposited,
                             String degreeSpecialization, String digilockerStatus, String digilockerXmlHash) {
        this.id = id;
        this.studentId = studentId;
        this.apaarId = apaarId;
        this.digilockerId = digilockerId;
        this.studentName = studentName;
        this.institutionName = institutionName;
        this.cumulativeCreditsDeposited = cumulativeCreditsDeposited != null ? cumulativeCreditsDeposited : 0;
        this.degreeSpecialization = degreeSpecialization;
        this.digilockerStatus = digilockerStatus != null ? digilockerStatus : "VERIFIED";
        this.digilockerXmlHash = digilockerXmlHash;
        this.lastSyncedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getApaarId() { return apaarId; }
    public void setApaarId(String apaarId) { this.apaarId = apaarId; }

    public String getDigilockerId() { return digilockerId; }
    public void setDigilockerId(String digilockerId) { this.digilockerId = digilockerId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public Integer getCumulativeCreditsDeposited() { return cumulativeCreditsDeposited; }
    public void setCumulativeCreditsDeposited(Integer cumulativeCreditsDeposited) { this.cumulativeCreditsDeposited = cumulativeCreditsDeposited; }

    public String getDegreeSpecialization() { return degreeSpecialization; }
    public void setDegreeSpecialization(String degreeSpecialization) { this.degreeSpecialization = degreeSpecialization; }

    public String getDigilockerStatus() { return digilockerStatus; }
    public void setDigilockerStatus(String digilockerStatus) { this.digilockerStatus = digilockerStatus; }

    public String getDigilockerXmlHash() { return digilockerXmlHash; }
    public void setDigilockerXmlHash(String digilockerXmlHash) { this.digilockerXmlHash = digilockerXmlHash; }

    public Instant getLastSyncedAt() { return lastSyncedAt; }
    public void setLastSyncedAt(Instant lastSyncedAt) { this.lastSyncedAt = lastSyncedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
