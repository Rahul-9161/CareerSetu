package in.careersetu.accreditation.repository;

import in.careersetu.accreditation.entity.DepartmentAccreditationMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DepartmentAccreditationMetricRepository extends JpaRepository<DepartmentAccreditationMetric, UUID> {
    List<DepartmentAccreditationMetric> findByReportId(UUID reportId);
}
