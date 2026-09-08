package in.careersetu.alumni.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alumni_mentorship_slots")
public class AlumniMentorshipSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "alumni_id", nullable = false)
    private UUID alumniId;

    @Column(name = "alumni_name", nullable = false, length = 150)
    private String alumniName;

    @Column(name = "company", nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 200)
    private String topic;

    @Column(name = "slot_time", nullable = false, length = 100)
    private String slotTime; // e.g. "Tomorrow • 5:00 PM IST"

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    @Column(name = "meeting_platform", length = 100)
    private String meetingPlatform = "Google Meet";

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, BOOKED, COMPLETED, CANCELLED

    @Column(name = "booked_by_student_id")
    private UUID bookedByStudentId;

    @Column(name = "booked_by_student_name", length = 150)
    private String bookedByStudentName;

    @Column(name = "booking_notes", columnDefinition = "TEXT")
    private String bookingNotes;

    @Column(name = "meeting_link", length = 300)
    private String meetingLink;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public AlumniMentorshipSlot() {}

    public AlumniMentorshipSlot(UUID id, UUID alumniId, String alumniName, String company, String topic,
                                String slotTime, Integer durationMinutes, String meetingPlatform,
                                String status, UUID bookedByStudentId, String bookedByStudentName,
                                String bookingNotes, String meetingLink) {
        this.id = id;
        this.alumniId = alumniId;
        this.alumniName = alumniName;
        this.company = company;
        this.topic = topic;
        this.slotTime = slotTime;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 45;
        this.meetingPlatform = meetingPlatform != null ? meetingPlatform : "Google Meet";
        this.status = status != null ? status : "AVAILABLE";
        this.bookedByStudentId = bookedByStudentId;
        this.bookedByStudentName = bookedByStudentName;
        this.bookingNotes = bookingNotes;
        this.meetingLink = meetingLink != null ? meetingLink : "https://meet.google.com/setu-alum-" + UUID.randomUUID().toString().substring(0, 8);
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAlumniId() { return alumniId; }
    public void setAlumniId(UUID alumniId) { this.alumniId = alumniId; }

    public String getAlumniName() { return alumniName; }
    public void setAlumniName(String alumniName) { this.alumniName = alumniName; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getSlotTime() { return slotTime; }
    public void setSlotTime(String slotTime) { this.slotTime = slotTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getMeetingPlatform() { return meetingPlatform; }
    public void setMeetingPlatform(String meetingPlatform) { this.meetingPlatform = meetingPlatform; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public UUID getBookedByStudentId() { return bookedByStudentId; }
    public void setBookedByStudentId(UUID bookedByStudentId) { this.bookedByStudentId = bookedByStudentId; }

    public String getBookedByStudentName() { return bookedByStudentName; }
    public void setBookedByStudentName(String bookedByStudentName) { this.bookedByStudentName = bookedByStudentName; }

    public String getBookingNotes() { return bookingNotes; }
    public void setBookingNotes(String bookingNotes) { this.bookingNotes = bookingNotes; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
