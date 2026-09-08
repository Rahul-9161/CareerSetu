package in.careersetu.alumni.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alumni_discussion_posts")
public class AlumniDiscussionPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "author_name", nullable = false, length = 150)
    private String authorName;

    @Column(name = "author_role", nullable = false, length = 50)
    private String authorRole; // ALUMNI, STUDENT

    @Column(name = "company_or_branch", nullable = false, length = 150)
    private String companyOrBranch; // e.g. "Google • Batch 2020" or "CSE • 3rd Year"

    @Column(nullable = false, length = 250)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false, length = 50)
    private String category; // OFF_CAMPUS_REFERRALS, HIGHER_STUDIES, INTERVIEW_PREP, CAREER_GROWTH

    @Column(name = "likes_count", nullable = false)
    private Integer likesCount = 0;

    @Column(name = "replies_count", nullable = false)
    private Integer repliesCount = 0;

    @Column(name = "pinned_answer", columnDefinition = "TEXT")
    private String pinnedAnswer;

    @Column(name = "pinned_by_alumni", length = 150)
    private String pinnedByAlumni;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public AlumniDiscussionPost() {}

    public AlumniDiscussionPost(UUID id, String authorName, String authorRole, String companyOrBranch,
                                String title, String content, String category, Integer likesCount,
                                Integer repliesCount, String pinnedAnswer, String pinnedByAlumni) {
        this.id = id;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.companyOrBranch = companyOrBranch;
        this.title = title;
        this.content = content;
        this.category = category != null ? category : "CAREER_GROWTH";
        this.likesCount = likesCount != null ? likesCount : 0;
        this.repliesCount = repliesCount != null ? repliesCount : 0;
        this.pinnedAnswer = pinnedAnswer;
        this.pinnedByAlumni = pinnedByAlumni;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getCompanyOrBranch() { return companyOrBranch; }
    public void setCompanyOrBranch(String companyOrBranch) { this.companyOrBranch = companyOrBranch; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public Integer getRepliesCount() { return repliesCount; }
    public void setRepliesCount(Integer repliesCount) { this.repliesCount = repliesCount; }

    public String getPinnedAnswer() { return pinnedAnswer; }
    public void setPinnedAnswer(String pinnedAnswer) { this.pinnedAnswer = pinnedAnswer; }

    public String getPinnedByAlumni() { return pinnedByAlumni; }
    public void setPinnedByAlumni(String pinnedByAlumni) { this.pinnedByAlumni = pinnedByAlumni; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
