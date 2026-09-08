package in.careersetu.alumni.repository;

import in.careersetu.alumni.entity.AlumniJobReferral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlumniJobReferralRepository extends JpaRepository<AlumniJobReferral, UUID> {

    List<AlumniJobReferral> findByAlumniIdOrderByCreatedAtDesc(UUID alumniId);

    List<AlumniJobReferral> findByStatusOrderByCreatedAtDesc(String status);

    List<AlumniJobReferral> findByCompanyIgnoreCaseOrderByCreatedAtDesc(String company);
}
