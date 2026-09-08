package in.careersetu.internships.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "internship_logbook_entries")
public class InternshipLogbookEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "internship_id", nullable = false)
    private UUID internshipId;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "week_range", nullable = false, length = 100)
    private String weekRange; // e.g. "Week 4: Oct 01 - Oct 07"

    @Column(name = "tasks_completed", columnDefinition = "TEXT", nullable = false)
    private String tasksCompleted;

    @Column(name = "skills_applied", length = 250)
    private String skillsApplied;

    @Column(name = "hours_logged", nullable = false)
    private Integer hoursLogged = 40;

    @Column(nullable = false, length = 40)
    private String status = "SUBMITTED"; // SUBMITTED, SUPERVISOR_APPROVED, REVISION_REQUESTED

    @Column(name = "supervisor_comments", columnDefinition = "TEXT")
    private String supervisorComments;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt = Instant.now();

    public InternshipLogbookEntry() {}

    public InternshipLogbookEntry(UUID id, UUID internshipId, Integer weekNumber, String weekRange,
                                  String tasksCompleted, String skillsApplied, Integer hoursLogged,
                                  String status, String supervisorComments) {
        this.id = id;
        this.internshipId = internshipId;
        this.weekNumber = weekNumber;
        this.weekRange = weekRange;
        this.tasksCompleted = tasksCompleted;
        this.skillsApplied = skillsApplied;
        this.hoursLogged = hoursLogged != null ? hoursLogged : 40;
        this.status = status != null ? status : "SUBMITTED";
        this.supervisorComments = supervisorComments;
        this.submittedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getInternshipId() { return internshipId; }
    public void setInternshipId(UUID internshipId) { this.internshipId = internshipId; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public String getWeekRange() { return weekRange; }
    public void setWeekRange(String weekRange) { this.weekRange = weekRange; }

    public String getTasksCompleted() { return tasksCompleted; }
    public void setTasksCompleted(String tasksCompleted) { this.tasksCompleted = tasksCompleted; }

    public String getSkillsApplied() { return skillsApplied; }
    public void setSkillsApplied(String skillsApplied) { this.skillsApplied = skillsApplied; }

    public Integer getHoursLogged() { return hoursLogged; }
    public void setHoursLogged(Integer hoursLogged) { this.hoursLogged = hoursLogged; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSupervisorComments() { return supervisorComments; }
    public void setSupervisorComments(String supervisorComments) { this.supervisorComments = supervisorComments; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
