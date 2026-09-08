package in.careersetu.alumni.repository;

import in.careersetu.alumni.entity.AlumniMentorshipSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlumniMentorshipSlotRepository extends JpaRepository<AlumniMentorshipSlot, UUID> {

    List<AlumniMentorshipSlot> findByAlumniIdOrderByCreatedAtDesc(UUID alumniId);

    List<AlumniMentorshipSlot> findByStatusOrderByCreatedAtDesc(String status);

    List<AlumniMentorshipSlot> findByBookedByStudentIdOrderByCreatedAtDesc(UUID studentId);
}
