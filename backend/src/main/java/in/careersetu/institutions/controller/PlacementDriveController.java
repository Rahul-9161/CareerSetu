package in.careersetu.institutions.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.institutions.entity.DriveRegistration;
import in.careersetu.institutions.entity.PlacementDrive;
import in.careersetu.institutions.service.PlacementDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drives")
@Tag(name = "Placement Drives", description = "Campus placement drive coordination and student registration")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    public PlacementDriveController(PlacementDriveService driveService) {
        this.driveService = driveService;
    }

    @GetMapping
    @Operation(summary = "Get all scheduled campus placement drives")
    public ResponseEntity<List<PlacementDrive>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get drive by ID")
    public ResponseEntity<PlacementDrive> getDriveById(@PathVariable UUID id) {
        return driveService.getDriveById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Schedule a new campus placement drive")
    public ResponseEntity<PlacementDrive> createDrive(@RequestBody PlacementDrive drive) {
        return ResponseEntity.ok(driveService.createDrive(drive));
    }

    @PostMapping("/{id}/register")
    @Operation(summary = "Student registration for a placement drive")
    public ResponseEntity<DriveRegistration> registerForDrive(
            @PathVariable UUID id,
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody(required = false) Map<String, String> body) {
        String email = principal != null ? principal.email() : (body != null ? body.getOrDefault("email", "student@careersetu.in") : "student@careersetu.in");
        String name = body != null ? body.getOrDefault("name", "Aarav Sharma") : "Aarav Sharma";
        String rollNo = body != null ? body.getOrDefault("rollNo", "22CSE041") : "22CSE041";

        return ResponseEntity.ok(driveService.registerStudent(id, email, name, rollNo));
    }

    @PostMapping("/{id}/broadcast")
    @Operation(summary = "Broadcast drive announcement to eligible students")
    public ResponseEntity<Map<String, Object>> broadcastDrive(@PathVariable UUID id) {
        return ResponseEntity.ok(driveService.broadcastDrive(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update drive progression status")
    public ResponseEntity<PlacementDrive> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "IN_PROGRESS");
        return ResponseEntity.ok(driveService.updateStatus(id, status));
    }
}
