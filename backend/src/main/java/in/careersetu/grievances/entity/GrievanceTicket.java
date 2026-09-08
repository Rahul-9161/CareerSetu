package in.careersetu.grievances.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "grievance_tickets")
public class GrievanceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 50)
    private String ticketNumber; // e.g. "GRV-2026-0891"

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "complainant_name", nullable = false, length = 150)
    private String complainantName;

    @Column(name = "complainant_email", nullable = false, length = 150)
    private String complainantEmail;

    @Column(name = "complainant_role", nullable = false, length = 50)
    private String complainantRole; // STUDENT, FACULTY, EMPLOYER

    @Column(nullable = false, length = 60)
    private String category; // DPDP_DATA_ERASURE, CONSENT_REVOCATION, STIPEND_DEFAULT, UNFAIR_EVALUATION, WORKPLACE_SAFETY

    @Column(nullable = false, length = 30)
    private String priority = "MEDIUM"; // HIGH, MEDIUM, LOW

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, UNDER_INVESTIGATION, RESOLVED, ESCALATED

    @Column(name = "resolution_remarks", columnDefinition = "TEXT")
    private String resolutionRemarks;

    @Column(name = "resolved_by_officer", length = 150)
    private String resolvedByOfficer;

    @Column(name = "sla_deadline", nullable = false)
    private Instant slaDeadline; // Statutory 30-day resolution under DPDP Act / UGC Regulations

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public GrievanceTicket() {}

    public GrievanceTicket(UUID id, String ticketNumber, UUID userId, String complainantName,
                           String complainantEmail, String complainantRole, String category,
                           String priority, String subject, String description, String status,
                           String resolutionRemarks, String resolvedByOfficer, Instant slaDeadline,
                           Instant resolvedAt) {
        this.id = id;
        this.ticketNumber = ticketNumber;
        this.userId = userId;
        this.complainantName = complainantName;
        this.complainantEmail = complainantEmail;
        this.complainantRole = complainantRole;
        this.category = category;
        this.priority = priority != null ? priority : "MEDIUM";
        this.subject = subject;
        this.description = description;
        this.status = status != null ? status : "OPEN";
        this.resolutionRemarks = resolutionRemarks;
        this.resolvedByOfficer = resolvedByOfficer;
        this.slaDeadline = slaDeadline != null ? slaDeadline : Instant.now().plusSeconds(30L * 24 * 3600);
        this.resolvedAt = resolvedAt;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }

    public String getComplainantEmail() { return complainantEmail; }
    public void setComplainantEmail(String complainantEmail) { this.complainantEmail = complainantEmail; }

    public String getComplainantRole() { return complainantRole; }
    public void setComplainantRole(String complainantRole) { this.complainantRole = complainantRole; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionRemarks() { return resolutionRemarks; }
    public void setResolutionRemarks(String resolutionRemarks) { this.resolutionRemarks = resolutionRemarks; }

    public String getResolvedByOfficer() { return resolvedByOfficer; }
    public void setResolvedByOfficer(String resolvedByOfficer) { this.resolvedByOfficer = resolvedByOfficer; }

    public Instant getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(Instant slaDeadline) { this.slaDeadline = slaDeadline; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
