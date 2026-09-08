package in.careersetu.apprenticeships.repository;

import in.careersetu.apprenticeships.entity.ApaarCreditRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApaarCreditRecordRepository extends JpaRepository<ApaarCreditRecord, UUID> {

    Optional<ApaarCreditRecord> findByStudentId(UUID studentId);

    Optional<ApaarCreditRecord> findByApaarId(String apaarId);
}
