package in.careersetu.apprenticeships.controller;

import in.careersetu.apprenticeships.dto.ApprenticeshipDtos.*;
import in.careersetu.apprenticeships.service.ApprenticeshipService;
import in.careersetu.common.security.CareerSetuPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/apprenticeships")
@Tag(name = "National Apprenticeships & APAAR Ecosystem", description = "NATS 2.0 tripartite apprenticeship contracts, Direct Benefit Transfer (DBT) stipend ledger, and Academic Bank of Credits (ABC / APAAR ID) DigiLocker sync")
public class ApprenticeshipController {

    private final ApprenticeshipService apprenticeshipService;

    public ApprenticeshipController(ApprenticeshipService apprenticeshipService) {
        this.apprenticeshipService = apprenticeshipService;
    }

    @GetMapping({"/apaar/me", "/apaar/student/{studentId}"})
    @Operation(summary = "Get student APAAR ID and Academic Bank of Credits overview")
    public ResponseEntity<ApaarStudentOverview> getApaarOverview(
            @PathVariable(required = false) UUID studentId,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID effectiveId = studentId != null ? studentId : (principal != null ? principal.userId() : null);
        return ResponseEntity.ok(apprenticeshipService.getApaarOverview(effectiveId));
    }

    @PostMapping("/apaar/link")
    @Operation(summary = "Link APAAR One Nation One Student ID with DigiLocker verification")
    public ResponseEntity<ApaarStudentOverview> linkApaar(@RequestBody LinkApaarRequest req) {
        return ResponseEntity.ok(apprenticeshipService.linkApaar(req));
    }

    @PostMapping({"/apaar/sync", "/apaar/sync-abc/{studentId}"})
    @Operation(summary = "Deposit and synchronize academic credits with DigiLocker ABC repository")
    public ResponseEntity<ApaarStudentOverview> syncApaarCredits(
            @PathVariable(required = false) UUID studentId,
            @RequestBody(required = false) SyncApaarCreditsRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID effectiveId = studentId != null ? studentId : (principal != null ? principal.userId() : null);
        Integer credits = (req != null && req.additionalCredits() != null) ? req.additionalCredits() : 4;
        return ResponseEntity.ok(apprenticeshipService.syncApaarCredits(effectiveId, credits));
    }

    @GetMapping({"/contracts/my", "/contracts/student/{studentId}"})
    @Operation(summary = "Get active NATS tripartite apprenticeship contracts for student")
    public ResponseEntity<List<NatsContractResponse>> getStudentContracts(
            @PathVariable(required = false) UUID studentId,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID effectiveId = studentId != null ? studentId : (principal != null ? principal.userId() : null);
        return ResponseEntity.ok(apprenticeshipService.getStudentContracts(effectiveId));
    }

    @GetMapping({"/contracts", "/contracts/employer/{employerId}"})
    @Operation(summary = "List all NATS 2.0 apprenticeship contracts for employer")
    public ResponseEntity<List<NatsContractResponse>> getEmployerContracts(@PathVariable(required = false) UUID employerId) {
        return ResponseEntity.ok(apprenticeshipService.getEmployerContracts(employerId));
    }

    @GetMapping("/contracts/{id}")
    @Operation(summary = "Get specific NATS apprenticeship contract details")
    public ResponseEntity<NatsContractResponse> getContractById(@PathVariable UUID id) {
        return ResponseEntity.ok(apprenticeshipService.getContractResponseById(id));
    }

    @PostMapping("/contracts")
    @Operation(summary = "Register a new tripartite NATS 2.0 apprenticeship contract")
    public ResponseEntity<NatsContractResponse> createContract(@RequestBody CreateNatsContractRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(apprenticeshipService.createContract(req));
    }

    @PatchMapping("/contracts/{id}/sign")
    @Operation(summary = "Apply digital signature or Aadhaar eSign to NATS contract")
    public ResponseEntity<NatsContractResponse> signContract(
            @PathVariable UUID id,
            @RequestBody SignContractRequest req) {
        return ResponseEntity.ok(apprenticeshipService.signContract(id, req));
    }

    @GetMapping({"/contracts/{id}/dbt", "/disbursements/contract/{id}"})
    @Operation(summary = "Get monthly Direct Benefit Transfer (DBT) stipend vouchers for contract")
    public ResponseEntity<List<DbtDisbursementResponse>> getContractDisbursements(@PathVariable UUID id) {
        return ResponseEntity.ok(apprenticeshipService.getContractDisbursements(id));
    }

    @GetMapping("/disbursements/student/{studentId}")
    @Operation(summary = "Get all monthly Direct Benefit Transfer (DBT) stipend vouchers for student")
    public ResponseEntity<List<DbtDisbursementResponse>> getStudentDisbursements(@PathVariable UUID studentId) {
        return ResponseEntity.ok(apprenticeshipService.getStudentDisbursements(studentId));
    }

    @PostMapping({"/contracts/{id}/dbt/claim", "/disbursements/generate-claim"})
    @Operation(summary = "Employer submits monthly government DBT subsidy claim voucher")
    public ResponseEntity<DbtDisbursementResponse> generateDbtClaim(
            @PathVariable(required = false) UUID id,
            @RequestBody GenerateDbtClaimRequest req) {
        GenerateDbtClaimRequest effectiveReq = req.contractId() != null ? req :
                new GenerateDbtClaimRequest(id != null ? id.toString() : null, req.monthYear(), req.daysAttended(), req.employerPaidAmount());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(apprenticeshipService.generateDbtClaim(effectiveReq));
    }

    @RequestMapping(value = "/dbt/{voucherId}/disburse", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "PFMS / APBS releases Government Direct Benefit Transfer stipend subsidy")
    public ResponseEntity<DbtDisbursementResponse> disburseDbtVoucher(@PathVariable UUID voucherId) {
        return ResponseEntity.ok(apprenticeshipService.disburseDbtVoucher(voucherId));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get national aggregate statistics for NATS 2.0 and APAAR ABC sync")
    public ResponseEntity<ApprenticeshipStatsResponse> getStats() {
        return ResponseEntity.ok(apprenticeshipService.getStats());
    }
}
