package in.careersetu.alumni.repository;

import in.careersetu.alumni.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, UUID> {

    Optional<AlumniProfile> findByUserId(UUID userId);

    Optional<AlumniProfile> findByEmail(String email);

    List<AlumniProfile> findByCurrentCompanyIgnoreCase(String currentCompany);

    List<AlumniProfile> findByGraduationYear(Integer graduationYear);

    @Query("SELECT a FROM AlumniProfile a WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.currentCompany) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.designation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.degree) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.expertise) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY a.rating DESC, a.totalMenteesHelped DESC")
    List<AlumniProfile> searchAlumni(@Param("query") String query);
}
