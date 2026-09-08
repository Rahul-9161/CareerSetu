package in.careersetu.accreditation.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "accreditation_reports")
public class AccreditationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g. "2025-26"

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName; // e.g. "National Institute of Technology Surathkal"

    @Column(name = "nirf_go_score", nullable = false)
    private Double nirfGoScore = 84.6; // Graduation Outcome Score out of 100

    @Column(name = "nirf_rank_band_estimate", nullable = false, length = 50)
    private String nirfRankBandEstimate = "Rank 12 - 18 National";

    @Column(name = "total_graduating_batch", nullable = false)
    private Integer totalGraduatingBatch = 850;

    @Column(name = "total_placed", nullable = false)
    private Integer totalPlaced = 742;

    @Column(name = "total_higher_studies", nullable = false)
    private Integer totalHigherStudies = 68;

    @Column(name = "median_salary_lpa", nullable = false)
    private Double medianSalaryLpa = 14.5;

    @Column(name = "average_salary_lpa", nullable = false)
    private Double averageSalaryLpa = 16.8;

    @Column(name = "highest_salary_lpa", nullable = false)
    private Double highestSalaryLpa = 54.0;

    @Column(name = "naac_placement_ratio", nullable = false)
    private Double naacPlacementRatio = 87.29; // Metric 5.2.1

    @Column(name = "naac_progression_ratio", nullable = false)
    private Double naacProgressionRatio = 8.0; // Metric 5.2.2

    @Column(name = "nba_placement_index", nullable = false)
    private Double nbaPlacementIndex = 0.95; // Criterion 4 Outcome

    @Column(name = "audit_status", nullable = false, length = 50)
    private String auditStatus = "IQAC_VERIFIED"; // DRAFT, IQAC_VERIFIED, NIRF_DCS_PUBLISHED

    @Column(name = "iqac_coordinator_name", length = 150)
    private String iqacCoordinatorName = "Prof. K. R. Venkatraman, Dean (Academic Quality)";

    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt = Instant.now();

    public AccreditationReport() {}

    public AccreditationReport(UUID id, String academicYear, String institutionName, Double nirfGoScore,
                               String nirfRankBandEstimate, Integer totalGraduatingBatch, Integer totalPlaced,
                               Integer totalHigherStudies, Double medianSalaryLpa, Double averageSalaryLpa,
                               Double highestSalaryLpa, Double naacPlacementRatio, Double naacProgressionRatio,
                               Double nbaPlacementIndex, String auditStatus, String iqacCoordinatorName) {
        this.id = id;
        this.academicYear = academicYear;
        this.institutionName = institutionName;
        this.nirfGoScore = nirfGoScore;
        this.nirfRankBandEstimate = nirfRankBandEstimate;
        this.totalGraduatingBatch = totalGraduatingBatch;
        this.totalPlaced = totalPlaced;
        this.totalHigherStudies = totalHigherStudies;
        this.medianSalaryLpa = medianSalaryLpa;
        this.averageSalaryLpa = averageSalaryLpa;
        this.highestSalaryLpa = highestSalaryLpa;
        this.naacPlacementRatio = naacPlacementRatio;
        this.naacProgressionRatio = naacProgressionRatio;
        this.nbaPlacementIndex = nbaPlacementIndex;
        this.auditStatus = auditStatus != null ? auditStatus : "IQAC_VERIFIED";
        this.iqacCoordinatorName = iqacCoordinatorName;
        this.generatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }
    public Double getNirfGoScore() { return nirfGoScore; }
    public void setNirfGoScore(Double nirfGoScore) { this.nirfGoScore = nirfGoScore; }
    public String getNirfRankBandEstimate() { return nirfRankBandEstimate; }
    public void setNirfRankBandEstimate(String nirfRankBandEstimate) { this.nirfRankBandEstimate = nirfRankBandEstimate; }
    public Integer getTotalGraduatingBatch() { return totalGraduatingBatch; }
    public void setTotalGraduatingBatch(Integer totalGraduatingBatch) { this.totalGraduatingBatch = totalGraduatingBatch; }
    public Integer getTotalPlaced() { return totalPlaced; }
    public void setTotalPlaced(Integer totalPlaced) { this.totalPlaced = totalPlaced; }
    public Integer getTotalHigherStudies() { return totalHigherStudies; }
    public void setTotalHigherStudies(Integer totalHigherStudies) { this.totalHigherStudies = totalHigherStudies; }
    public Double getMedianSalaryLpa() { return medianSalaryLpa; }
    public void setMedianSalaryLpa(Double medianSalaryLpa) { this.medianSalaryLpa = medianSalaryLpa; }
    public Double getAverageSalaryLpa() { return averageSalaryLpa; }
    public void setAverageSalaryLpa(Double averageSalaryLpa) { this.averageSalaryLpa = averageSalaryLpa; }
    public Double getHighestSalaryLpa() { return highestSalaryLpa; }
    public void setHighestSalaryLpa(Double highestSalaryLpa) { this.highestSalaryLpa = highestSalaryLpa; }
    public Double getNaacPlacementRatio() { return naacPlacementRatio; }
    public void setNaacPlacementRatio(Double naacPlacementRatio) { this.naacPlacementRatio = naacPlacementRatio; }
    public Double getNaacProgressionRatio() { return naacProgressionRatio; }
    public void setNaacProgressionRatio(Double naacProgressionRatio) { this.naacProgressionRatio = naacProgressionRatio; }
    public Double getNbaPlacementIndex() { return nbaPlacementIndex; }
    public void setNbaPlacementIndex(Double nbaPlacementIndex) { this.nbaPlacementIndex = nbaPlacementIndex; }
    public String getAuditStatus() { return auditStatus; }
    public void setAuditStatus(String auditStatus) { this.auditStatus = auditStatus; }
    public String getIqacCoordinatorName() { return iqacCoordinatorName; }
    public void setIqacCoordinatorName(String iqacCoordinatorName) { this.iqacCoordinatorName = iqacCoordinatorName; }
    public Instant getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Instant generatedAt) { this.generatedAt = generatedAt; }
}
