package in.careersetu.opportunities.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.service.OpportunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/opportunities")
@Tag(name = "Opportunities", description = "Internship and job marketplace")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    @Operation(summary = "Search active opportunities with filters")
    public ResponseEntity<List<Opportunity>> searchOpportunities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String workMode) {
        return ResponseEntity.ok(opportunityService.searchOpportunities(search, type, workMode));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get opportunity details by ID")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable UUID id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get opportunities posted by specific company")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(opportunityService.getOpportunitiesByCompany(companyId));
    }

    @PostMapping
    @Operation(summary = "Create and publish a new opportunity (job or internship)")
    public ResponseEntity<Opportunity> createOpportunity(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody Opportunity opportunity) {
        UUID userId = principal != null ? principal.userId() : null;
        Opportunity created = opportunityService.createOpportunity(opportunity, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Close an opportunity")
    public ResponseEntity<Opportunity> closeOpportunity(@PathVariable UUID id) {
        return ResponseEntity.ok(opportunityService.closeOpportunity(id));
    }
}
