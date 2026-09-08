package in.careersetu.institutions.repository;

import in.careersetu.institutions.entity.InstitutionStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstitutionStudentRepository extends JpaRepository<InstitutionStudent, UUID> {

    Optional<InstitutionStudent> findByRollNo(String rollNo);

    Optional<InstitutionStudent> findByEmail(String email);

    List<InstitutionStudent> findByDepartment(String department);

    List<InstitutionStudent> findByNepStatus(String nepStatus);

    @Query("SELECT s FROM InstitutionStudent s WHERE " +
           "(:department IS NULL OR LOWER(s.department) = LOWER(:department)) AND " +
           "(:nepStatus IS NULL OR s.nepStatus = :nepStatus) AND " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.rollNo) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<InstitutionStudent> findWithFilters(@Param("department") String department,
                                             @Param("nepStatus") String nepStatus,
                                             @Param("search") String search);

    long countByNepStatus(String nepStatus);

    long countByPlacementStatus(String placementStatus);
}
