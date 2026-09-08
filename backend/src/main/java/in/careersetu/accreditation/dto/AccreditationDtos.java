package in.careersetu.accreditation.dto;

import java.time.Instant;
import java.util.List;

public class AccreditationDtos {

    public record AccreditationReportDto(
            String id,
            String academicYear,
            String institutionName,
            double nirfGoScore,
            String nirfRankBandEstimate,
            int totalGraduatingBatch,
            int totalPlaced,
            int totalHigherStudies,
            double medianSalaryLpa,
            double averageSalaryLpa,
            double highestSalaryLpa,
            double naacPlacementRatio,
            double naacProgressionRatio,
            double nbaPlacementIndex,
            String auditStatus,
            String iqacCoordinatorName,
            Instant generatedAt
    ) {}

    public record DepartmentMetricDto(
            String id,
            String department,
            int intakeCapacity,
            int graduatedStudents,
            int placedStudents,
            int higherStudiesStudents,
            double medianPackageLpa,
            double nbaPlacementScore,
            double coreSectorPlacedPercentage
    ) {}

    public record ProgressionRecordDto(
            String id,
            String studentId,
            String studentName,
            String rollNumber,
            String department,
            String progressionType,
            String organizationOrUniversity,
            String designationOrProgram,
            Double annualPackageLpa,
            String appointmentOrAdmissionRef,
            String proofDocumentUrl,
            String verificationStatus,
            Instant verifiedAt,
            Instant createdAt
    ) {}

    public record SimulationRequest(
            Integer projectedAdditionalOffers,
            Double projectedMedianSalaryLpa,
            Integer higherStudiesTarget
    ) {}

    public record SimulationResponse(
            double currentGoScore,
            double projectedGoScore,
            String currentRankBand,
            String projectedRankBand,
            double gphDelta,
            double gmsDelta,
            String recommendationText
    ) {}

    public record VerifyRecordRequest(
            String status,
            String remarks
    ) {}

    public record NirfDcsExportDto(
            String institutionCode,
            String institutionName,
            String academicYear,
            int sanctionedIntake,
            int totalActualGraduates,
            int studentsPlaced,
            double medianSalaryPlaced,
            int studentsHigherStudies,
            double graduationOutcomeScore,
            String naacGradePredicted,
            List<DepartmentMetricDto> departmentBreakdowns,
            Instant exportedAt
    ) {}
}
