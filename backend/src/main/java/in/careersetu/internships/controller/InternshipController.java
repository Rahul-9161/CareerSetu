package in.careersetu.internships.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.internships.dto.InternshipDtos.*;
import in.careersetu.internships.entity.InternshipLogbookEntry;
import in.careersetu.internships.entity.MandatoryInternship;
import in.careersetu.internships.service.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internships")
@Tag(name = "AICTE Mandatory Internships", description = "AICTE & NEP 2020 mandatory credit tracking, weekly logbooks, dual sign-offs, and stipend compliance verification")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping
    @Operation(summary = "Get all mandatory academic internships")
    public ResponseEntity<List<MandatoryInternship>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get active mandatory internship for a specific student")
    public ResponseEntity<MandatoryInternship> getStudentInternship(@PathVariable UUID studentId) {
        return internshipService.getStudentInternship(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = {"/my", "/my-internship"})
    @Operation(summary = "Get mandatory internships for authenticated student")
    public ResponseEntity<List<MandatoryInternship>> getMyInternships(@AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID studentId = principal != null ? principal.userId() : null;
        return ResponseEntity.ok(internshipService.getMyInternships(studentId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get mandatory internship by ID")
    public ResponseEntity<MandatoryInternship> getInternshipById(@PathVariable UUID id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @GetMapping("/{id}/detail")
    @Operation(summary = "Get detailed internship record with weekly logbooks and dual signoff progress")
    public ResponseEntity<InternshipDetailResponse> getInternshipDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(internshipService.getInternshipDetail(id));
    }

    @GetMapping("/{id}/logbook")
    @Operation(summary = "Get all weekly logbook entries for an internship")
    public ResponseEntity<List<InternshipLogbookEntry>> getLogbookEntries(@PathVariable UUID id) {
        return ResponseEntity.ok(internshipService.getLogbookEntries(id));
    }

    @PostMapping
    @Operation(summary = "Register a new AICTE / NEP mandatory internship")
    public ResponseEntity<MandatoryInternship> createInternship(
            @RequestBody CreateInternshipRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID studentId = principal != null ? principal.userId() : UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(internshipService.createInternship(studentId, req));
    }

    @PostMapping("/{id}/logbook")
    @Operation(summary = "Submit a weekly milestone logbook entry")
    public ResponseEntity<InternshipLogbookEntry> addLogbookEntry(
            @PathVariable UUID id,
            @RequestBody LogbookEntryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(internshipService.addLogbookEntry(id, req));
    }

    @PostMapping(value = {"/{id}/sign-off", "/{id}/dual-signoff"})
    @Operation(summary = "Submit corporate supervisor or faculty academic mentor signoff")
    public ResponseEntity<MandatoryInternship> submitDualSignoff(
            @PathVariable UUID id,
            @RequestBody DualSignoffRequest req) {
        return ResponseEntity.ok(internshipService.processDualSignoff(id, req));
    }
}
