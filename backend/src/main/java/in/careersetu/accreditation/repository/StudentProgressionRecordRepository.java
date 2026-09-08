package in.careersetu.accreditation.repository;

import in.careersetu.accreditation.entity.StudentProgressionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentProgressionRecordRepository extends JpaRepository<StudentProgressionRecord, UUID> {
    List<StudentProgressionRecord> findByDepartment(String department);
    List<StudentProgressionRecord> findByProgressionType(String progressionType);
    List<StudentProgressionRecord> findByVerificationStatus(String verificationStatus);
    List<StudentProgressionRecord> findAllByOrderByCreatedAtDesc();
}
