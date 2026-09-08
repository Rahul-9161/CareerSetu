package in.careersetu.alumni.repository;

import in.careersetu.alumni.entity.AlumniDiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlumniDiscussionPostRepository extends JpaRepository<AlumniDiscussionPost, UUID> {

    List<AlumniDiscussionPost> findAllByOrderByCreatedAtDesc();

    List<AlumniDiscussionPost> findByCategoryOrderByCreatedAtDesc(String category);
}
