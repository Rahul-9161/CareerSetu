package in.careersetu.apprenticeships.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "dbt_stipend_disbursements")
public class DbtStipendDisbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "contract_id", nullable = false)
    private UUID contractId;

    @Column(name = "voucher_month", nullable = false, length = 50)
    private String voucherMonth; // e.g. "January 2026"

    @Column(name = "corporate_stipend_amount", nullable = false)
    private Integer corporateStipendAmount = 25500;

    @Column(name = "government_dbt_amount", nullable = false)
    private Integer governmentDbtAmount = 4500;

    @Column(name = "employer_neft_reference", length = 100)
    private String employerNeftReference; // Employer share bank transaction ref

    @Column(name = "dbt_apbs_reference", length = 100)
    private String dbtApbsReference; // Aadhaar Payment Bridge System / PFMS ID

    @Column(nullable = false, length = 30)
    private String status = "CLAIM_SUBMITTED"; // CLAIM_SUBMITTED, PFMS_VERIFIED, DBT_CREDITED

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "disbursed_at")
    private Instant disbursedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public DbtStipendDisbursement() {}

    public DbtStipendDisbursement(UUID id, UUID contractId, String voucherMonth,
                                  Integer corporateStipendAmount, Integer governmentDbtAmount,
                                  String employerNeftReference, String dbtApbsReference,
                                  String status, String remarks, Instant disbursedAt) {
        this.id = id;
        this.contractId = contractId;
        this.voucherMonth = voucherMonth;
        this.corporateStipendAmount = corporateStipendAmount != null ? corporateStipendAmount : 25500;
        this.governmentDbtAmount = governmentDbtAmount != null ? governmentDbtAmount : 4500;
        this.employerNeftReference = employerNeftReference;
        this.dbtApbsReference = dbtApbsReference;
        this.status = status != null ? status : "CLAIM_SUBMITTED";
        this.remarks = remarks;
        this.disbursedAt = disbursedAt;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getContractId() { return contractId; }
    public void setContractId(UUID contractId) { this.contractId = contractId; }

    public String getVoucherMonth() { return voucherMonth; }
    public void setVoucherMonth(String voucherMonth) { this.voucherMonth = voucherMonth; }

    public Integer getCorporateStipendAmount() { return corporateStipendAmount; }
    public void setCorporateStipendAmount(Integer corporateStipendAmount) { this.corporateStipendAmount = corporateStipendAmount; }

    public Integer getGovernmentDbtAmount() { return governmentDbtAmount; }
    public void setGovernmentDbtAmount(Integer governmentDbtAmount) { this.governmentDbtAmount = governmentDbtAmount; }

    public String getEmployerNeftReference() { return employerNeftReference; }
    public void setEmployerNeftReference(String employerNeftReference) { this.employerNeftReference = employerNeftReference; }

    public String getDbtApbsReference() { return dbtApbsReference; }
    public void setDbtApbsReference(String dbtApbsReference) { this.dbtApbsReference = dbtApbsReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Instant getDisbursedAt() { return disbursedAt; }
    public void setDisbursedAt(Instant disbursedAt) { this.disbursedAt = disbursedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
