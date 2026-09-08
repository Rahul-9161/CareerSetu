package in.careersetu.alumni.repository;

import in.careersetu.alumni.entity.AlumniReferralApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlumniReferralApplicationRepository extends JpaRepository<AlumniReferralApplication, UUID> {

    List<AlumniReferralApplication> findByReferralIdOrderByAppliedAtDesc(UUID referralId);

    List<AlumniReferralApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
}
