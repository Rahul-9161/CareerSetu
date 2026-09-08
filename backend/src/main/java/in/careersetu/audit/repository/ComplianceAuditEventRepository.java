package in.careersetu.audit.repository;

import in.careersetu.audit.entity.ComplianceAuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplianceAuditEventRepository extends JpaRepository<ComplianceAuditEvent, UUID> {

    List<ComplianceAuditEvent> findAllByOrderByTimestampDesc();

    List<ComplianceAuditEvent> findByEventTypeOrderByTimestampDesc(String eventType);
}
