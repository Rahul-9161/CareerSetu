package in.careersetu.interviews.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.interviews.dto.InterviewDtos;
import in.careersetu.interviews.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@Tag(name = "Interviews", description = "Interview scheduling, round evaluations, and candidate management")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/employer")
    @Operation(summary = "Get all scheduled interviews for employer")
    public ResponseEntity<List<InterviewDtos.InterviewResponse>> getEmployerInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/student")
    @Operation(summary = "Get interviews for the logged in student")
    public ResponseEntity<List<InterviewDtos.InterviewResponse>> getStudentInterviews(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(interviewService.getInterviewsForCandidate(principal.userId()));
    }

    @PostMapping("/schedule")
    @Operation(summary = "Schedule a new interview round")
    public ResponseEntity<InterviewDtos.InterviewResponse> scheduleInterview(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody InterviewDtos.ScheduleInterviewRequest req) {
        InterviewDtos.InterviewResponse created = interviewService.scheduleInterview(principal.userId(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update interview status and submit evaluation score / notes")
    public ResponseEntity<InterviewDtos.InterviewResponse> updateStatus(
            @PathVariable UUID id,
            @RequestBody InterviewDtos.UpdateInterviewStatusRequest req) {
        return ResponseEntity.ok(interviewService.updateInterviewStatus(id, req));
    }
}
