package in.careersetu.apprenticeships.repository;

import in.careersetu.apprenticeships.entity.DbtStipendDisbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DbtStipendDisbursementRepository extends JpaRepository<DbtStipendDisbursement, UUID> {

    List<DbtStipendDisbursement> findByContractIdOrderByCreatedAtDesc(UUID contractId);

    List<DbtStipendDisbursement> findByStatusOrderByCreatedAtDesc(String status);
}
