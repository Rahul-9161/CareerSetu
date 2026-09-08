package in.careersetu.internships.repository;

import in.careersetu.internships.entity.MandatoryInternship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MandatoryInternshipRepository extends JpaRepository<MandatoryInternship, UUID> {

    List<MandatoryInternship> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

    Optional<MandatoryInternship> findFirstByStudentIdOrderByCreatedAtDesc(UUID studentId);

    List<MandatoryInternship> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);

    List<MandatoryInternship> findByStatusOrderByCreatedAtDesc(String status);
}
