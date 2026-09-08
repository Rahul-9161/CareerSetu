package in.careersetu.alumni.controller;

import in.careersetu.alumni.dto.AlumniDtos.*;
import in.careersetu.alumni.entity.*;
import in.careersetu.alumni.service.AlumniService;
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
@RequestMapping("/api/v1/alumni")
@Tag(name = "Alumni Network & Alum-Connect", description = "Endpoints for alumni directory, 1:1 mentorship slots, internal employee referrals, and AMA discussions")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get alumni network aggregate impact statistics")
    public ResponseEntity<AlumniStatsResponse> getStats() {
        return ResponseEntity.ok(alumniService.getStats());
    }

    // ── Directory ──────────────────────────────────────────────
    @GetMapping("/directory")
    @Operation(summary = "Search alumni network directory with keyword filters")
    public ResponseEntity<List<AlumniProfile>> getDirectory(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(alumniService.getDirectory(search));
    }

    @GetMapping("/profile/{id}")
    @Operation(summary = "Get detailed profile of a specific alumnus")
    public ResponseEntity<AlumniProfile> getProfile(@PathVariable UUID id) {
        return alumniService.getProfile(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-profile")
    @Operation(summary = "Get profile for currently authenticated alumnus")
    public ResponseEntity<AlumniProfile> getMyProfile(@AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal != null) {
            OptionalProfile:
            return alumniService.getProfileByUserId(principal.userId())
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        // Fallback to first profile for dev experience
                        List<AlumniProfile> list = alumniService.getDirectory(null);
                        return list.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(list.get(0));
                    });
        }
        List<AlumniProfile> list = alumniService.getDirectory(null);
        return list.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(list.get(0));
    }

    @PostMapping("/profile")
    @Operation(summary = "Create or update alumni profile")
    public ResponseEntity<AlumniProfile> saveProfile(@RequestBody AlumniProfile profile,
                                                     @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal != null && profile.getUserId() == null) {
            profile.setUserId(principal.userId());
        }
        return ResponseEntity.ok(alumniService.saveProfile(profile));
    }

    // ── Mentorship Slots ───────────────────────────────────────
    @GetMapping("/slots")
    @Operation(summary = "List mentorship slots with optional alumniId or status filter")
    public ResponseEntity<List<AlumniMentorshipSlot>> getSlots(
            @RequestParam(required = false) UUID alumniId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(alumniService.getSlots(alumniId, status));
    }

    @PostMapping("/slots")
    @Operation(summary = "Create a new 1:1 mentorship availability slot (Alumni)")
    public ResponseEntity<AlumniMentorshipSlot> createSlot(
            @RequestBody CreateSlotRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID alumniId = principal != null ? principal.userId() : UUID.randomUUID();
        String alumniName = principal != null
                ? alumniService.getProfileByUserId(principal.userId()).map(AlumniProfile::getFullName).orElse("Neha Singhal")
                : "Neha Singhal";
        String company = principal != null
                ? alumniService.getProfileByUserId(principal.userId()).map(AlumniProfile::getCurrentCompany).orElse("Google")
                : "Google";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumniService.createSlot(alumniId, alumniName, company, req));
    }

    @PostMapping("/slots/{id}/book")
    @Operation(summary = "Book an available alumni mentorship slot (Student)")
    public ResponseEntity<AlumniMentorshipSlot> bookSlot(
            @PathVariable UUID id,
            @RequestBody BookSlotRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID studentId = principal != null ? principal.userId() : UUID.randomUUID();
        return ResponseEntity.ok(alumniService.bookSlot(id, studentId, req));
    }

    // ── Job Referrals ──────────────────────────────────────────
    @GetMapping("/referrals")
    @Operation(summary = "Browse employee job referrals posted by alumni")
    public ResponseEntity<List<AlumniJobReferral>> getReferrals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String company) {
        return ResponseEntity.ok(alumniService.getReferrals(status, company));
    }

    @PostMapping("/referrals")
    @Operation(summary = "Post a new employee referral opening (Alumni)")
    public ResponseEntity<AlumniJobReferral> createReferral(
            @RequestBody CreateReferralRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID alumniId = principal != null ? principal.userId() : UUID.randomUUID();
        String alumniName = principal != null
                ? alumniService.getProfileByUserId(principal.userId()).map(AlumniProfile::getFullName).orElse("Neha Singhal")
                : "Neha Singhal";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumniService.createReferral(alumniId, alumniName, req));
    }

    @PostMapping("/referrals/{id}/apply")
    @Operation(summary = "Submit student referral application to alumni")
    public ResponseEntity<AlumniReferralApplication> applyForReferral(
            @PathVariable UUID id,
            @RequestBody ApplyReferralRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID studentId = principal != null ? principal.userId() : UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumniService.applyForReferral(id, studentId, req));
    }

    @GetMapping("/referrals/{id}/applications")
    @Operation(summary = "Get student applications for a referral opening (Alumni)")
    public ResponseEntity<List<AlumniReferralApplication>> getApplications(@PathVariable UUID id) {
        return ResponseEntity.ok(alumniService.getApplicationsForReferral(id));
    }

    @PatchMapping("/referrals/applications/{appId}/status")
    @Operation(summary = "Update referral application status (e.g. REFERRED, DECLINED)")
    public ResponseEntity<AlumniReferralApplication> updateApplicationStatus(
            @PathVariable UUID appId,
            @RequestBody UpdateReferralStatusRequest req) {
        return ResponseEntity.ok(alumniService.updateApplicationStatus(appId, req));
    }

    // ── Discussions (Ask-An-Alum AMA) ──────────────────────────
    @GetMapping("/discussions")
    @Operation(summary = "Get alumni community AMA questions and discussions")
    public ResponseEntity<List<AlumniDiscussionPost>> getDiscussions(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(alumniService.getDiscussions(category));
    }

    @PostMapping("/discussions")
    @Operation(summary = "Post a new question to the alumni community")
    public ResponseEntity<AlumniDiscussionPost> createDiscussion(
            @RequestBody CreateDiscussionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumniService.createDiscussion(req));
    }

    @PostMapping("/discussions/{id}/pin-answer")
    @Operation(summary = "Post and pin an official alumnus answer on a discussion thread")
    public ResponseEntity<AlumniDiscussionPost> pinAnswer(
            @PathVariable UUID id,
            @RequestBody PinDiscussionAnswerRequest req) {
        return ResponseEntity.ok(alumniService.pinAnswer(id, req));
    }
}
