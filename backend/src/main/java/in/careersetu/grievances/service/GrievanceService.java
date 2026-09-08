package in.careersetu.grievances.service;

import in.careersetu.grievances.dto.GrievanceDtos.*;
import in.careersetu.grievances.entity.GrievanceTicket;
import in.careersetu.grievances.repository.GrievanceTicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
public class GrievanceService {

    private final GrievanceTicketRepository grievanceRepository;

    public GrievanceService(GrievanceTicketRepository grievanceRepository) {
        this.grievanceRepository = grievanceRepository;
    }

    @Transactional(readOnly = true)
    public GrievanceStatsResponse getStats() {
        long total = grievanceRepository.count();
        long open = grievanceRepository.findByStatusOrderByCreatedAtDesc("OPEN").size() +
                    grievanceRepository.findByStatusOrderByCreatedAtDesc("UNDER_INVESTIGATION").size();
        long resolved = grievanceRepository.findByStatusOrderByCreatedAtDesc("RESOLVED").size();
        long dpdp = grievanceRepository.findAll().stream()
                .filter(g -> g.getCategory().startsWith("DPDP_") || "CONSENT_REVOCATION".equals(g.getCategory()))
                .count();

        return new GrievanceStatsResponse(total, open, resolved, dpdp, 3.4);
    }

    @Transactional(readOnly = true)
    public List<GrievanceTicket> getAllGrievances(String status, String category) {
        if (status != null && !status.isBlank()) {
            return grievanceRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        if (category != null && !category.isBlank()) {
            return grievanceRepository.findByCategoryOrderByCreatedAtDesc(category.toUpperCase());
        }
        return grievanceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<GrievanceTicket> getUserGrievances(UUID userId) {
        return grievanceRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Optional<GrievanceTicket> getById(UUID id) {
        return grievanceRepository.findById(id);
    }

    public GrievanceTicket createGrievance(UUID userId, String name, String email, String role, CreateGrievanceRequest req) {
        GrievanceTicket ticket = new GrievanceTicket();
        ticket.setTicketNumber("GRV-2026-" + String.format("%04d", new Random().nextInt(9000) + 1000));
        ticket.setUserId(userId != null ? userId : UUID.randomUUID());
        ticket.setComplainantName(name != null ? name : "Registered Student");
        ticket.setComplainantEmail(email != null ? email : "student@careersetu.in");
        ticket.setComplainantRole(role != null ? role : "STUDENT");
        ticket.setCategory(req.category() != null ? req.category().toUpperCase() : "DPDP_DATA_ERASURE");
        ticket.setPriority(req.priority() != null ? req.priority().toUpperCase() : "MEDIUM");
        ticket.setSubject(req.subject());
        ticket.setDescription(req.description());
        ticket.setStatus("OPEN");
        ticket.setSlaDeadline(Instant.now().plusSeconds(30L * 24 * 3600)); // Statutory 30-day mandate
        return grievanceRepository.save(ticket);
    }

    public GrievanceTicket resolveGrievance(UUID ticketId, ResolveGrievanceRequest req) {
        GrievanceTicket ticket = grievanceRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance ticket not found with id: " + ticketId));

        ticket.setStatus(req.status().toUpperCase());
        ticket.setResolutionRemarks(req.getEffectiveRemarks());
        ticket.setResolvedByOfficer(req.officerName() != null ? req.officerName() : "Adv. Rajeshwar Rao");
        if ("RESOLVED".equalsIgnoreCase(req.status())) {
            ticket.setResolvedAt(Instant.now());
        }
        return grievanceRepository.save(ticket);
    }
}
