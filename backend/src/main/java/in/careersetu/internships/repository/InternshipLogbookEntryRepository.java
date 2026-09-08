package in.careersetu.internships.repository;

import in.careersetu.internships.entity.InternshipLogbookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InternshipLogbookEntryRepository extends JpaRepository<InternshipLogbookEntry, UUID> {

    List<InternshipLogbookEntry> findByInternshipIdOrderByWeekNumberAsc(UUID internshipId);
}
