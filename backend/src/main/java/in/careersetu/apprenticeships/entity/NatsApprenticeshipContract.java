package in.careersetu.apprenticeships.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nats_apprenticeship_contracts")
public class NatsApprenticeshipContract {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "contract_number", nullable = false, unique = true, length = 50)
    private String contractNumber; // e.g. "NATS-APP-2026-0812"

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_apaar_id", length = 50)
    private String studentApaarId;

    @Column(name = "company_id")
    private UUID companyId;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "trade_discipline", nullable = false, length = 150)
    private String tradeDiscipline; // e.g. "Computer Systems & Cloud Engineering"

    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths = 12;

    @Column(name = "total_monthly_stipend", nullable = false)
    private Integer totalMonthlyStipend = 30000;

    @Column(name = "corporate_share_stipend", nullable = false)
    private Integer corporateShareStipend = 25500;

    @Column(name = "government_dbt_share_stipend", nullable = false)
    private Integer governmentDbtShareStipend = 4500; // Under NATS 2.0 DBT norms

    @Column(name = "boat_regional_council", nullable = false, length = 150)
    private String boatRegionalCouncil = "BOAT Western Region"; // Regional Board of Apprenticeship Training

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, TERMINATED

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public NatsApprenticeshipContract() {}

    public NatsApprenticeshipContract(UUID id, String contractNumber, UUID studentId, String studentName,
                                      String studentApaarId, UUID companyId, String companyName,
                                      String tradeDiscipline, Integer durationMonths, Integer totalMonthlyStipend,
                                      Integer corporateShareStipend, Integer governmentDbtShareStipend,
                                      String boatRegionalCouncil, String status, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.contractNumber = contractNumber;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentApaarId = studentApaarId;
        this.companyId = companyId;
        this.companyName = companyName;
        this.tradeDiscipline = tradeDiscipline;
        this.durationMonths = durationMonths != null ? durationMonths : 12;
        this.totalMonthlyStipend = totalMonthlyStipend != null ? totalMonthlyStipend : 30000;
        this.corporateShareStipend = corporateShareStipend != null ? corporateShareStipend : 25500;
        this.governmentDbtShareStipend = governmentDbtShareStipend != null ? governmentDbtShareStipend : 4500;
        this.boatRegionalCouncil = boatRegionalCouncil != null ? boatRegionalCouncil : "BOAT Western Region";
        this.status = status != null ? status : "ACTIVE";
        this.startDate = startDate != null ? startDate : LocalDate.now().minusMonths(3);
        this.endDate = endDate != null ? endDate : LocalDate.now().plusMonths(9);
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentApaarId() { return studentApaarId; }
    public void setStudentApaarId(String studentApaarId) { this.studentApaarId = studentApaarId; }

    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getTradeDiscipline() { return tradeDiscipline; }
    public void setTradeDiscipline(String tradeDiscipline) { this.tradeDiscipline = tradeDiscipline; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public Integer getTotalMonthlyStipend() { return totalMonthlyStipend; }
    public void setTotalMonthlyStipend(Integer totalMonthlyStipend) { this.totalMonthlyStipend = totalMonthlyStipend; }

    public Integer getCorporateShareStipend() { return corporateShareStipend; }
    public void setCorporateShareStipend(Integer corporateShareStipend) { this.corporateShareStipend = corporateShareStipend; }

    public Integer getGovernmentDbtShareStipend() { return governmentDbtShareStipend; }
    public void setGovernmentDbtShareStipend(Integer governmentDbtShareStipend) { this.governmentDbtShareStipend = governmentDbtShareStipend; }

    public String getBoatRegionalCouncil() { return boatRegionalCouncil; }
    public void setBoatRegionalCouncil(String boatRegionalCouncil) { this.boatRegionalCouncil = boatRegionalCouncil; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
