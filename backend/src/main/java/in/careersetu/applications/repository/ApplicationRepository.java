package in.careersetu.applications.repository;

import in.careersetu.applications.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByStudentProfileIdOrderByAppliedAtDesc(UUID studentProfileId);
    List<Application> findByOpportunityIdOrderByAppliedAtDesc(UUID opportunityId);
    List<Application> findAllByOrderByAppliedAtDesc();
    Optional<Application> findByOpportunityIdAndStudentProfileId(UUID opportunityId, UUID studentProfileId);
    boolean existsByOpportunityIdAndStudentProfileId(UUID opportunityId, UUID studentProfileId);
}
