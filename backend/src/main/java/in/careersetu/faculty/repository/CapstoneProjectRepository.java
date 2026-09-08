package in.careersetu.faculty.repository;

import in.careersetu.faculty.entity.CapstoneProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CapstoneProjectRepository extends JpaRepository<CapstoneProject, UUID> {
    List<CapstoneProject> findByStage(String stage);
}
