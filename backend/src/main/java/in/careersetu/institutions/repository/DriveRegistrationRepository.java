package in.careersetu.institutions.repository;

import in.careersetu.institutions.entity.DriveRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriveRegistrationRepository extends JpaRepository<DriveRegistration, UUID> {
    List<DriveRegistration> findByDriveId(UUID driveId);
    List<DriveRegistration> findByStudentEmail(String studentEmail);
    Optional<DriveRegistration> findByDriveIdAndStudentEmail(UUID driveId, String studentEmail);
}
