package in.careersetu.mentorship.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.mentorship.dto.MentorshipDtos;
import in.careersetu.mentorship.service.MentorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mentors")
@Tag(name = "Mentorship", description = "1:1 industry mentorship and technical session booking")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping
    @Operation(summary = "Browse all verified industry mentors")
    public ResponseEntity<List<MentorshipDtos.MentorResponse>> getMentors(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(mentorService.getMentors(search));
    }

    @PostMapping("/book")
    @Operation(summary = "Book a 1:1 mentorship session")
    public ResponseEntity<MentorshipDtos.MentorshipSessionResponse> bookSession(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody MentorshipDtos.BookSessionRequest req) {
        MentorshipDtos.MentorshipSessionResponse session = mentorService.bookSession(principal.userId(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/my-sessions")
    @Operation(summary = "Get booked mentorship sessions for current student")
    public ResponseEntity<List<MentorshipDtos.MentorshipSessionResponse>> getMySessions(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(mentorService.getStudentSessions(principal.userId()));
    }
}
