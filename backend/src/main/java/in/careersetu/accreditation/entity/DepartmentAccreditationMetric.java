package in.careersetu.accreditation.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "department_accreditation_metrics")
public class DepartmentAccreditationMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "report_id")
    private UUID reportId;

    @Column(nullable = false, length = 100)
    private String department; // "Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"

    @Column(name = "intake_capacity", nullable = false)
    private Integer intakeCapacity = 180;

    @Column(name = "graduated_students", nullable = false)
    private Integer graduatedStudents = 175;

    @Column(name = "placed_students", nullable = false)
    private Integer placedStudents = 168;

    @Column(name = "higher_studies_students", nullable = false)
    private Integer higherStudiesStudents = 6;

    @Column(name = "median_package_lpa", nullable = false)
    private Double medianPackageLpa = 18.2;

    @Column(name = "nba_placement_score", nullable = false)
    private Double nbaPlacementScore = 38.6; // Max 40 marks under Criterion 4

    @Column(name = "core_sector_placed_percentage", nullable = false)
    private Double coreSectorPlacedPercentage = 78.4;

    public DepartmentAccreditationMetric() {}

    public DepartmentAccreditationMetric(UUID id, UUID reportId, String department, Integer intakeCapacity,
                                         Integer graduatedStudents, Integer placedStudents,
                                         Integer higherStudiesStudents, Double medianPackageLpa,
                                         Double nbaPlacementScore, Double coreSectorPlacedPercentage) {
        this.id = id;
        this.reportId = reportId;
        this.department = department;
        this.intakeCapacity = intakeCapacity;
        this.graduatedStudents = graduatedStudents;
        this.placedStudents = placedStudents;
        this.higherStudiesStudents = higherStudiesStudents;
        this.medianPackageLpa = medianPackageLpa;
        this.nbaPlacementScore = nbaPlacementScore;
        this.coreSectorPlacedPercentage = coreSectorPlacedPercentage != null ? coreSectorPlacedPercentage : 75.0;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getReportId() { return reportId; }
    public void setReportId(UUID reportId) { this.reportId = reportId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getIntakeCapacity() { return intakeCapacity; }
    public void setIntakeCapacity(Integer intakeCapacity) { this.intakeCapacity = intakeCapacity; }
    public Integer getGraduatedStudents() { return graduatedStudents; }
    public void setGraduatedStudents(Integer graduatedStudents) { this.graduatedStudents = graduatedStudents; }
    public Integer getPlacedStudents() { return placedStudents; }
    public void setPlacedStudents(Integer placedStudents) { this.placedStudents = placedStudents; }
    public Integer getHigherStudiesStudents() { return higherStudiesStudents; }
    public void setHigherStudiesStudents(Integer higherStudiesStudents) { this.higherStudiesStudents = higherStudiesStudents; }
    public Double getMedianPackageLpa() { return medianPackageLpa; }
    public void setMedianPackageLpa(Double medianPackageLpa) { this.medianPackageLpa = medianPackageLpa; }
    public Double getNbaPlacementScore() { return nbaPlacementScore; }
    public void setNbaPlacementScore(Double nbaPlacementScore) { this.nbaPlacementScore = nbaPlacementScore; }
    public Double getCoreSectorPlacedPercentage() { return coreSectorPlacedPercentage; }
    public void setCoreSectorPlacedPercentage(Double coreSectorPlacedPercentage) { this.coreSectorPlacedPercentage = coreSectorPlacedPercentage; }
}
