package in.careersetu.assessment.controller;

import in.careersetu.assessment.entity.AssessmentSubmission;
import in.careersetu.assessment.service.AssessmentService;
import in.careersetu.common.security.CareerSetuPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessment")
@Tag(name = "Skill Assessment", description = "Proctored assessment submissions and SHA-256 verifiable badge verification")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit solved coding challenge and mint verifiable badge")
    public ResponseEntity<AssessmentSubmission> submitAssessment(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody Map<String, Object> body) {
        String email = principal != null ? principal.email() : (String) body.getOrDefault("email", "student@careersetu.in");
        String name = (String) body.getOrDefault("name", "Aarav Sharma");
        String challengeId = (String) body.getOrDefault("challengeId", "dsa");
        String challengeTitle = (String) body.getOrDefault("challengeTitle", "Algorithmic Problem Solving");
        String language = (String) body.getOrDefault("language", "java");
        Integer score = body.get("score") instanceof Number ? ((Number) body.get("score")).intValue() : 95;
        String code = (String) body.getOrDefault("code", "");
        Integer passedTests = body.get("passedTestCases") instanceof Number ? ((Number) body.get("passedTestCases")).intValue() : 3;
        Integer totalTests = body.get("totalTestCases") instanceof Number ? ((Number) body.get("totalTestCases")).intValue() : 3;

        AssessmentSubmission submission = assessmentService.submitAssessment(
                email, name, challengeId, challengeTitle, language, score, code, passedTests, totalTests
        );
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/verify/{verificationHash}")
    @Operation(summary = "Publicly verify a cryptographic badge credential")
    public ResponseEntity<AssessmentSubmission> verifyCredential(@PathVariable String verificationHash) {
        return assessmentService.verifyCredential(verificationHash)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-submissions")
    @Operation(summary = "Get all verified submissions and badges for student")
    public ResponseEntity<List<AssessmentSubmission>> getMySubmissions(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        String email = principal != null ? principal.email() : "student@careersetu.in";
        return ResponseEntity.ok(assessmentService.getStudentSubmissions(email));
    }
}
