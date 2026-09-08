package in.careersetu.faculty.repository;

import in.careersetu.faculty.entity.CurriculumCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CurriculumCourseRepository extends JpaRepository<CurriculumCourse, UUID> {
    List<CurriculumCourse> findByDepartment(String department);
    List<CurriculumCourse> findBySemester(Integer semester);
}
