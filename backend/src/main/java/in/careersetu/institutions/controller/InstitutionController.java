package in.careersetu.institutions.controller;

import in.careersetu.institutions.entity.InstitutionStudent;
import in.careersetu.institutions.service.InstitutionStudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/institutions")
@Tag(name = "Institutions", description = "University TPO student cohort management and NEP 2020 compliance")
public class InstitutionController {

    private final InstitutionStudentService studentService;

    public InstitutionController(InstitutionStudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    @Operation(summary = "Get institution student directory with filters")
    public ResponseEntity<List<InstitutionStudent>> getStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String nepStatus,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(studentService.getStudents(department, nepStatus, search));
    }

    @PostMapping(value = "/students/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Bulk upload student batch roster via CSV")
    public ResponseEntity<Map<String, Object>> bulkUploadCsv(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = studentService.bulkUploadCsv(file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get aggregate institution placement and NEP metrics")
    public ResponseEntity<Map<String, Object>> getInstitutionStats() {
        return ResponseEntity.ok(studentService.getInstitutionStats());
    }
}
