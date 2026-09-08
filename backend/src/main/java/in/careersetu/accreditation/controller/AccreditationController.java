package in.careersetu.accreditation.controller;

import in.careersetu.accreditation.dto.AccreditationDtos.*;
import in.careersetu.accreditation.service.AccreditationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accreditation")
@Tag(name = "Institutional Accreditation & Ranking Audit Engine", description = "NIRF Graduation Outcome (GO) metric, NAAC Criterion 5.2 progression vault, and NBA Criterion 4 program outcomes")
public class AccreditationController {

    private final AccreditationService accreditationService;

    public AccreditationController(AccreditationService accreditationService) {
        this.accreditationService = accreditationService;
    }

    @GetMapping("/report/latest")
    @Operation(summary = "Get official statutory accreditation report and NIRF GO score")
    public ResponseEntity<AccreditationReportDto> getLatestReport(
            @RequestParam(required = false) String academicYear) {
        return ResponseEntity.ok(accreditationService.getLatestReport(academicYear));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get department-level metrics for NBA program accreditation")
    public ResponseEntity<List<DepartmentMetricDto>> getDepartmentMetrics(
            @RequestParam(required = false) String reportId) {
        return ResponseEntity.ok(accreditationService.getDepartmentMetrics(reportId));
    }

    @GetMapping("/progression-records")
    @Operation(summary = "Get verifiable outgoing student placement and progression records for NAAC Criterion 5.2")
    public ResponseEntity<List<ProgressionRecordDto>> getProgressionRecords(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String progressionType,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(accreditationService.getProgressionRecords(department, progressionType, status));
    }

    @PatchMapping("/progression-records/{id}/verify")
    @Operation(summary = "TPO or IQAC coordinator digitally verifies student appointment or admission proof")
    public ResponseEntity<ProgressionRecordDto> verifyRecord(
            @PathVariable UUID id,
            @RequestBody(required = false) VerifyRecordRequest req) {
        return ResponseEntity.ok(accreditationService.verifyRecord(id, req));
    }

    @PostMapping("/simulate")
    @Operation(summary = "Interactive what-if ranking simulator for NIRF Graduation Outcome (GO) points")
    public ResponseEntity<SimulationResponse> simulateNirf(
            @RequestBody(required = false) SimulationRequest req) {
        return ResponseEntity.ok(accreditationService.simulateNirf(req));
    }

    @GetMapping("/export/nirf-dcs")
    @Operation(summary = "Export data structure strictly aligned with official NIRF Data Capturing System")
    public ResponseEntity<NirfDcsExportDto> exportNirfDcs(
            @RequestParam(required = false) String academicYear) {
        return ResponseEntity.ok(accreditationService.exportNirfDcs(academicYear));
    }
}
