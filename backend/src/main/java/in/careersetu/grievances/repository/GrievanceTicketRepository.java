package in.careersetu.grievances.repository;

import in.careersetu.grievances.entity.GrievanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GrievanceTicketRepository extends JpaRepository<GrievanceTicket, UUID> {

    List<GrievanceTicket> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<GrievanceTicket> findByStatusOrderByCreatedAtDesc(String status);

    List<GrievanceTicket> findByCategoryOrderByCreatedAtDesc(String category);

    Optional<GrievanceTicket> findByTicketNumber(String ticketNumber);
}
