package in.careersetu.events.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.events.dto.EventDtos;
import in.careersetu.events.service.CampusEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@Tag(name = "Events", description = "National hackathons, hiring sprints, and campus coding competitions")
public class CampusEventController {

    private final CampusEventService campusEventService;

    public CampusEventController(CampusEventService campusEventService) {
        this.campusEventService = campusEventService;
    }

    @GetMapping
    @Operation(summary = "Get all active campus events and hackathons")
    public ResponseEntity<List<EventDtos.EventResponse>> getEvents(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        UUID userId = principal != null ? principal.userId() : null;
        return ResponseEntity.ok(campusEventService.getEvents(userId));
    }

    @PostMapping("/{id}/register")
    @Operation(summary = "Register for an event or hackathon")
    public ResponseEntity<EventDtos.EventRegistrationResponse> register(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @PathVariable UUID id,
            @RequestBody(required = false) EventDtos.RegisterEventRequest req) {
        EventDtos.EventRegistrationResponse response = campusEventService.registerForEvent(principal.userId(), id, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-registrations")
    @Operation(summary = "Get current student's registered events")
    public ResponseEntity<List<EventDtos.EventRegistrationResponse>> getMyRegistrations(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(campusEventService.getMyRegistrations(principal.userId()));
    }
}
