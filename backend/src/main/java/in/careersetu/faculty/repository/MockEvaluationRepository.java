package in.careersetu.faculty.repository;

import in.careersetu.faculty.entity.MockEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MockEvaluationRepository extends JpaRepository<MockEvaluation, UUID> {
    List<MockEvaluation> findByStudentId(UUID studentId);
    List<MockEvaluation> findByReadinessStatus(String readinessStatus);
}
