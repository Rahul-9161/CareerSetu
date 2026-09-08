package in.careersetu.audit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "compliance_audit_events")
public class ComplianceAuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType; // CONSENT_OPT_IN, DATA_ACCESS, DUAL_SIGNOFF, STIPEND_VERIFIED, GRIEVANCE_RESOLVED, PII_MASKED

    @Column(name = "actor_email", nullable = false, length = 150)
    private String actorEmail;

    @Column(name = "actor_role", nullable = false, length = 50)
    private String actorRole;

    @Column(name = "target_resource", nullable = false, length = 200)
    private String targetResource;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;

    @Column(name = "ip_address", length = 60)
    private String ipAddress = "127.0.0.1";

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public ComplianceAuditEvent() {}

    public ComplianceAuditEvent(UUID id, String eventType, String actorEmail, String actorRole,
                                String targetResource, String details, String ipAddress) {
        this.id = id;
        this.eventType = eventType;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.targetResource = targetResource;
        this.details = details;
        this.ipAddress = ipAddress != null ? ipAddress : "127.0.0.1";
        this.timestamp = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getTargetResource() { return targetResource; }
    public void setTargetResource(String targetResource) { this.targetResource = targetResource; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
