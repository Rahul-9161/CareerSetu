package in.careersetu.accreditation.repository;

import in.careersetu.accreditation.entity.AccreditationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccreditationReportRepository extends JpaRepository<AccreditationReport, UUID> {
    Optional<AccreditationReport> findFirstByOrderByGeneratedAtDesc();
    Optional<AccreditationReport> findByAcademicYear(String academicYear);
}
