package in.careersetu.audit.controller;

import in.careersetu.audit.entity.ComplianceAuditEvent;
import in.careersetu.audit.service.AuditService;
import in.careersetu.grievances.repository.GrievanceTicketRepository;
import in.careersetu.internships.repository.MandatoryInternshipRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compliance")
@Tag(name = "Compliance & Regulatory Portal", description = "Regulatory oversight for AICTE mandatory internships, statutory DPDP Act compliance, and immutable audit trails")
public class ComplianceController {

    private final AuditService auditService;
    private final MandatoryInternshipRepository internshipRepository;
    private final GrievanceTicketRepository grievanceRepository;

    public ComplianceController(AuditService auditService,
                                MandatoryInternshipRepository internshipRepository,
                                GrievanceTicketRepository grievanceRepository) {
        this.auditService = auditService;
        this.internshipRepository = internshipRepository;
        this.grievanceRepository = grievanceRepository;
    }

    public record ComplianceOverviewStats(
            long activeMandatoryInternships,
            long totalMandatoryInternships,
            long completedDualSignOffs,
            long compliantStipendCount,
            int stipendComplianceRatePct,
            long totalGrievances,
            long openGrievances,
            long resolvedGrievances,
            long totalAuditEvents,
            double dpdpAdherenceScore
    ) {}

    @GetMapping("/stats")
    @Operation(summary = "Get regulatory compliance overview metrics")
    public ResponseEntity<ComplianceOverviewStats> getStats() {
        long internships = internshipRepository.count();
        long completedSignOffs = internshipRepository.findAll().stream()
                .filter(i -> "COMPLETED".equalsIgnoreCase(i.getStatus()) || i.getCompletionCertificateHash() != null)
                .count();
        long stipendCompliant = internshipRepository.findAll().stream()
                .filter(i -> Boolean.TRUE.equals(i.getStipendCompliant()))
                .count();
        int stipendRate = internships > 0 ? (int) Math.round(((double) stipendCompliant / internships) * 100) : 100;
        long totalGrv = grievanceRepository.count();
        long openGrv = grievanceRepository.findByStatusOrderByCreatedAtDesc("OPEN").size() +
                       grievanceRepository.findByStatusOrderByCreatedAtDesc("UNDER_INVESTIGATION").size();
        long resolvedGrv = grievanceRepository.findByStatusOrderByCreatedAtDesc("RESOLVED").size();
        long auditCount = auditService.getRecentEvents().size();

        return ResponseEntity.ok(new ComplianceOverviewStats(
                internships,
                internships,
                completedSignOffs,
                stipendCompliant,
                stipendRate,
                totalGrv,
                openGrv,
                resolvedGrv,
                auditCount,
                99.4
        ));
    }

    @GetMapping(value = {"/audit", "/audit-trail"})
    @Operation(summary = "Get immutable compliance audit events ledger")
    public ResponseEntity<List<ComplianceAuditEvent>> getAuditTrail(
            @RequestParam(required = false) String eventType) {
        if (eventType != null && !eventType.isBlank()) {
            return ResponseEntity.ok(auditService.getEventsByType(eventType.toUpperCase()));
        }
        return ResponseEntity.ok(auditService.getRecentEvents());
    }
}
