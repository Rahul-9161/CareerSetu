package in.careersetu.apprenticeships.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class ApprenticeshipDtos {

    public record ApaarCreditCourseDto(
            String id,
            String courseCode,
            String courseTitle,
            String institutionName,
            int creditsAwarded,
            String academicYear,
            String semester,
            String gradeEarned,
            String digilockerDocId,
            String creditStatus,
            String syncedAt
    ) {}

    public record ApaarStudentOverview(
            String studentId,
            String studentName,
            String apaarId,
            boolean isDigilockerVerified,
            int totalCreditsEarned,
            int totalCreditsRequired,
            List<ApaarCreditCourseDto> records
    ) {}

    public record LinkApaarRequest(
            String studentId,
            String studentName,
            String apaarId,
            String digilockerToken
    ) {}

    public record NatsContractResponse(
            String id,
            String contractNumber,
            String studentId,
            String studentName,
            String studentEmail,
            String institutionId,
            String institutionName,
            String employerId,
            String employerName,
            String tradeDiscipline,
            String apprenticeshipType,
            int stipendTotalMonthly,
            int govSubsidyDbtShare,
            int employerContributionShare,
            LocalDate startDate,
            LocalDate endDate,
            int durationMonths,
            String boatRegion,
            String status,
            Instant studentSignedAt,
            Instant institutionSignedAt,
            Instant employerSignedAt,
            Instant approvedByBoatAt,
            String pfmsBeneficiaryCode,
            String bankAccountMasked,
            String bankIfscCode,
            Instant createdAt
    ) {}

    public record CreateNatsContractRequest(
            String studentId,
            String studentName,
            String studentEmail,
            String institutionId,
            String institutionName,
            String employerId,
            String employerName,
            String tradeDiscipline,
            String apprenticeshipType,
            Integer stipendTotalMonthly,
            Integer govSubsidyDbtShare,
            LocalDate startDate,
            LocalDate endDate,
            Integer durationMonths,
            String boatRegion,
            String bankAccountMasked,
            String bankIfscCode
    ) {}

    public record SignContractRequest(
            String party,
            String signerName,
            String signerRole
    ) {}

    public record DbtDisbursementResponse(
            String id,
            String contractId,
            String contractNumber,
            String studentId,
            String studentName,
            String employerId,
            String employerName,
            String monthYear,
            int totalStipendAmount,
            int govtSubsidyDbtAmount,
            int employerPaidAmount,
            int daysAttended,
            String paymentReferenceNumber,
            String cpsmsPaymentId,
            String dbtStatus,
            LocalDate scheduledDisbursementDate,
            Instant disbursedDate,
            String notes
    ) {}

    public record GenerateDbtClaimRequest(
            String contractId,
            String monthYear,
            Integer daysAttended,
            Integer employerPaidAmount
    ) {}

    public record SyncApaarCreditsRequest(
            Integer additionalCredits
    ) {}

    public record ApprenticeshipStatsResponse(
            long totalActiveContracts,
            long totalApaarRegistered,
            long totalDbtDisbursedAmount,
            long totalCreditsDeposited
    ) {}
}
