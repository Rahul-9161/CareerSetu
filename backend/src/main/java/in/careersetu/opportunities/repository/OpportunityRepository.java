package in.careersetu.opportunities.repository;

import in.careersetu.opportunities.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {

    @Query("SELECT o FROM Opportunity o WHERE o.status = 'PUBLISHED' ORDER BY o.createdAt DESC")
    List<Opportunity> findActiveOpportunities();

    @Query("SELECT o FROM Opportunity o WHERE o.status = 'PUBLISHED' AND " +
           "(:query IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:type IS NULL OR o.type = :type) AND " +
           "(:workMode IS NULL OR o.workMode = :workMode) " +
           "ORDER BY o.createdAt DESC")
    List<Opportunity> searchOpportunities(
            @Param("query") String query,
            @Param("type") String type,
            @Param("workMode") String workMode);

    List<Opportunity> findByCompanyId(UUID companyId);
}
