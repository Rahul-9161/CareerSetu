package in.careersetu.faculty.repository;

import in.careersetu.faculty.entity.StudentEndorsement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentEndorsementRepository extends JpaRepository<StudentEndorsement, UUID> {
    List<StudentEndorsement> findByStudentId(UUID studentId);
    List<StudentEndorsement> findByFacultyId(UUID facultyId);
    Optional<StudentEndorsement> findByVerificationHash(String verificationHash);
}
