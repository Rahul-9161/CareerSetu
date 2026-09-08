package in.careersetu.grievances.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.grievances.dto.GrievanceDtos.*;
import in.careersetu.grievances.entity.GrievanceTicket;
import in.careersetu.grievances.service.GrievanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grievances")
@Tag(name = "DPDP Grievance Redressal", description = "Statutory grievance redressal mechanism and DPDP Act 2023 data subject rights under Section 13")
public class GrievanceController {

    private final GrievanceService grievanceService;

    public GrievanceController(GrievanceService grievanceService) {
        this.grievanceService = grievanceService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get grievance redressal and statutory DPDP compliance stats")
    public ResponseEntity<GrievanceStatsResponse> getStats() {
        return ResponseEntity.ok(grievanceService.getStats());
    }

    @GetMapping
    @Operation(summary = "List all statutory grievances with status or category filter")
    public ResponseEntity<List<GrievanceTicket>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(grievanceService.getAllGrievances(status, category));
    }

    @GetMapping(value = {"/my", "/my-tickets"})
    @Operation(summary = "Get grievances submitted by authenticated user")
    public ResponseEntity<List<GrievanceTicket>> getMyTickets(@AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal != null) {
            return ResponseEntity.ok(grievanceService.getUserGrievances(principal.userId()));
        }
        return ResponseEntity.ok(grievanceService.getAllGrievances(null, null));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific grievance ticket")
    public ResponseEntity<GrievanceTicket> getById(@PathVariable UUID id) {
        return grievanceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "File a new statutory grievance or exercise DPDP Act right to erasure")
    public ResponseEntity<GrievanceTicket> createGrievance(
            @RequestBody CreateGrievanceRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID userId = principal != null ? principal.userId() : UUID.randomUUID();
        String email = principal != null ? principal.email() : "student@careersetu.in";
        String role = principal != null ? principal.primaryRole() : "STUDENT";
        String name = principal != null && principal.email() != null ? principal.email().split("@")[0] : "Aarav Sharma";

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(grievanceService.createGrievance(userId, name, email, role, req));
    }

    @RequestMapping(value = {"/{id}/resolve", "/{id}/status"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    @Operation(summary = "Resolve or update grievance status (Compliance Officer / Ombudsman)")
    public ResponseEntity<GrievanceTicket> resolveGrievance(
            @PathVariable UUID id,
            @RequestBody ResolveGrievanceRequest req) {
        return ResponseEntity.ok(grievanceService.resolveGrievance(id, req));
    }
}
