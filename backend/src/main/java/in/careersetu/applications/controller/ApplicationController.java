package in.careersetu.applications.controller;

import in.careersetu.applications.dto.ApplicationDtos;
import in.careersetu.applications.entity.Application;
import in.careersetu.applications.service.ApplicationService;
import in.careersetu.common.security.CareerSetuPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications", description = "Student job and internship applications pipeline")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @Operation(summary = "Submit application for an opportunity")
    public ResponseEntity<Application> apply(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody ApplicationDtos.ApplyRequest request) {
        Application app = applicationService.apply(principal.userId(), request.opportunityId(), request.coverNote());
        return ResponseEntity.status(HttpStatus.CREATED).body(app);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student's submitted applications with full opportunity details")
    public ResponseEntity<List<ApplicationDtos.StudentApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(applicationService.getStudentApplications(principal.userId()));
    }

    @GetMapping
    @Operation(summary = "Get all applications across opportunities (recruiter/employer)")
    public ResponseEntity<List<ApplicationDtos.OpportunityApplicantResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/opportunity/{opportunityId}")
    @Operation(summary = "Get applicants for a specific opportunity (recruiter/employer)")
    public ResponseEntity<List<ApplicationDtos.OpportunityApplicantResponse>> getOpportunityApplications(
            @PathVariable UUID opportunityId) {
        return ResponseEntity.ok(applicationService.getOpportunityApplications(opportunityId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of an application")
    public ResponseEntity<Application> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return ResponseEntity.ok(applicationService.updateStatus(id, newStatus));
    }
}
