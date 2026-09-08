package in.careersetu.audit.service;

import in.careersetu.audit.entity.ComplianceAuditEvent;
import in.careersetu.audit.repository.ComplianceAuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AuditService {

    private final ComplianceAuditEventRepository auditRepository;

    public AuditService(ComplianceAuditEventRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public ComplianceAuditEvent logEvent(String eventType, String actorEmail, String actorRole,
                                         String targetResource, String details, String ipAddress) {
        ComplianceAuditEvent ev = new ComplianceAuditEvent(null, eventType, actorEmail, actorRole, targetResource, details, ipAddress);
        return auditRepository.save(ev);
    }

    @Transactional(readOnly = true)
    public List<ComplianceAuditEvent> getRecentEvents() {
        return auditRepository.findAllByOrderByTimestampDesc();
    }

    @Transactional(readOnly = true)
    public List<ComplianceAuditEvent> getEventsByType(String eventType) {
        return auditRepository.findByEventTypeOrderByTimestampDesc(eventType);
    }
}
