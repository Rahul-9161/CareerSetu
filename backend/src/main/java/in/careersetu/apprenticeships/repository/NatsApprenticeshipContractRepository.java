package in.careersetu.apprenticeships.repository;

import in.careersetu.apprenticeships.entity.NatsApprenticeshipContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NatsApprenticeshipContractRepository extends JpaRepository<NatsApprenticeshipContract, UUID> {

    List<NatsApprenticeshipContract> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

    Optional<NatsApprenticeshipContract> findFirstByStudentIdOrderByCreatedAtDesc(UUID studentId);

    List<NatsApprenticeshipContract> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);

    List<NatsApprenticeshipContract> findByStatusOrderByCreatedAtDesc(String status);
}
