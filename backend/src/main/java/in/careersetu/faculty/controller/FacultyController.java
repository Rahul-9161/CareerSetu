package in.careersetu.faculty.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.faculty.dto.FacultyDtos.*;
import in.careersetu.faculty.entity.CapstoneProject;
import in.careersetu.faculty.entity.CurriculumCourse;
import in.careersetu.faculty.entity.MockEvaluation;
import in.careersetu.faculty.entity.StudentEndorsement;
import in.careersetu.faculty.service.FacultyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/faculty")
@Tag(name = "Faculty & Mentor Academic Portal", description = "Endpoints for curriculum skill mapping, student endorsements, capstone projects, and mock evaluations")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get faculty intelligence and academic summary statistics")
    public ResponseEntity<FacultyStatsResponse> getStats() {
        return ResponseEntity.ok(facultyService.getStats());
    }

    // ── Curriculum ─────────────────────────────────────────────
    @GetMapping("/curriculum")
    @Operation(summary = "Get list of all academic curriculum course mappings")
    public ResponseEntity<List<CurriculumCourse>> getCurriculumCourses() {
        return ResponseEntity.ok(facultyService.getAllCourses());
    }

    @PostMapping("/curriculum")
    @Operation(summary = "Create or map an academic course to industry skills and AICTE credits")
    public ResponseEntity<CurriculumCourse> createCurriculumCourse(@RequestBody CurriculumCourseRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facultyService.createCourse(req));
    }

    // ── Endorsements ───────────────────────────────────────────
    @GetMapping("/endorsements")
    @Operation(summary = "Get all student recommendations and academic endorsements")
    public ResponseEntity<List<StudentEndorsement>> getAllEndorsements() {
        return ResponseEntity.ok(facultyService.getAllEndorsements());
    }

    @GetMapping("/endorsements/student/{studentId}")
    @Operation(summary = "Get verified faculty endorsements for a specific student Career Passport")
    public ResponseEntity<List<StudentEndorsement>> getStudentEndorsements(@PathVariable UUID studentId) {
        return ResponseEntity.ok(facultyService.getStudentEndorsements(studentId));
    }

    @PostMapping("/endorsements")
    @Operation(summary = "Issue a digitally signed faculty recommendation with SHA-256 stamp")
    public ResponseEntity<StudentEndorsement> createEndorsement(
            @RequestBody StudentEndorsementRequest req,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID facultyId = principal != null ? principal.userId() : UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED).body(facultyService.createEndorsement(req, facultyId));
    }

    // ── Capstone Projects ──────────────────────────────────────
    @GetMapping("/projects")
    @Operation(summary = "Get all joint academia-industry capstone projects")
    public ResponseEntity<List<CapstoneProject>> getProjects() {
        return ResponseEntity.ok(facultyService.getAllProjects());
    }

    @PostMapping("/projects")
    @Operation(summary = "Register a new industry capstone or collaborative research project")
    public ResponseEntity<CapstoneProject> createProject(@RequestBody CapstoneProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facultyService.createProject(req));
    }

    @PatchMapping("/projects/{id}/stage")
    @Operation(summary = "Update capstone project milestone, stage, or final viva grade")
    public ResponseEntity<CapstoneProject> updateProjectStage(
            @PathVariable UUID id,
            @RequestBody CapstoneStageUpdateRequest req) {
        return ResponseEntity.ok(facultyService.updateProjectStage(id, req));
    }

    // ── Mock Evaluations ───────────────────────────────────────
    @GetMapping("/evaluations")
    @Operation(summary = "Get all recorded student mock evaluations and placement readiness assessments")
    public ResponseEntity<List<MockEvaluation>> getEvaluations() {
        return ResponseEntity.ok(facultyService.getAllEvaluations());
    }

    @GetMapping("/evaluations/student/{studentId}")
    @Operation(summary = "Get mock evaluations for a specific student")
    public ResponseEntity<List<MockEvaluation>> getStudentEvaluations(@PathVariable UUID studentId) {
        return ResponseEntity.ok(facultyService.getStudentEvaluations(studentId));
    }

    @PostMapping("/evaluations")
    @Operation(summary = "Submit a student technical viva mock evaluation with rubric grading")
    public ResponseEntity<MockEvaluation> createEvaluation(@RequestBody MockEvaluationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facultyService.createEvaluation(req));
    }
}
