package in.careersetu.common.config;

import in.careersetu.applications.entity.Application;
import in.careersetu.applications.repository.ApplicationRepository;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.events.entity.CampusEvent;
import in.careersetu.events.repository.CampusEventRepository;
import in.careersetu.interviews.entity.InterviewSchedule;
import in.careersetu.interviews.repository.InterviewRepository;
import in.careersetu.mentorship.entity.MentorProfile;
import in.careersetu.mentorship.repository.MentorProfileRepository;
import in.careersetu.messaging.entity.ChatMessage;
import in.careersetu.messaging.repository.ChatMessageRepository;
import in.careersetu.messaging.service.MessageService;
import in.careersetu.skills.entity.Skill;
import in.careersetu.skills.repository.SkillRepository;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.repository.StudentProfileRepository;
import in.careersetu.institutions.entity.InstitutionStudent;
import in.careersetu.institutions.entity.PlacementDrive;
import in.careersetu.institutions.repository.InstitutionStudentRepository;
import in.careersetu.institutions.repository.PlacementDriveRepository;
import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.repository.NotificationRepository;
import in.careersetu.assessment.entity.AssessmentSubmission;
import in.careersetu.assessment.repository.AssessmentSubmissionRepository;
import in.careersetu.faculty.entity.CapstoneProject;
import in.careersetu.faculty.entity.CurriculumCourse;
import in.careersetu.faculty.entity.MockEvaluation;
import in.careersetu.faculty.entity.StudentEndorsement;
import in.careersetu.faculty.repository.CapstoneProjectRepository;
import in.careersetu.faculty.repository.CurriculumCourseRepository;
import in.careersetu.faculty.repository.MockEvaluationRepository;
import in.careersetu.faculty.repository.StudentEndorsementRepository;
import in.careersetu.alumni.entity.*;
import in.careersetu.alumni.repository.*;
import in.careersetu.internships.entity.*;
import in.careersetu.internships.repository.*;
import in.careersetu.grievances.entity.*;
import in.careersetu.grievances.repository.*;
import in.careersetu.audit.entity.*;
import in.careersetu.audit.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Automatically seeds initial demo users, student profile, companies, skills,
 * opportunities, active applications, faculty portal, and alumni network for local dev.
 */
@Component
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final CampusEventRepository campusEventRepository;
    private final InterviewRepository interviewRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final InstitutionStudentRepository institutionStudentRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final NotificationRepository notificationRepository;
    private final AssessmentSubmissionRepository assessmentSubmissionRepository;
    private final CurriculumCourseRepository curriculumCourseRepository;
    private final StudentEndorsementRepository studentEndorsementRepository;
    private final CapstoneProjectRepository capstoneProjectRepository;
    private final MockEvaluationRepository mockEvaluationRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final AlumniMentorshipSlotRepository alumniMentorshipSlotRepository;
    private final AlumniJobReferralRepository alumniJobReferralRepository;
    private final AlumniReferralApplicationRepository alumniReferralApplicationRepository;
    private final AlumniDiscussionPostRepository alumniDiscussionPostRepository;
    private final MandatoryInternshipRepository mandatoryInternshipRepository;
    private final InternshipLogbookEntryRepository internshipLogbookEntryRepository;
    private final GrievanceTicketRepository grievanceTicketRepository;
    private final ComplianceAuditEventRepository complianceAuditEventRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataSeeder(UserRepository userRepository,
                         StudentProfileRepository studentProfileRepository,
                         CompanyRepository companyRepository,
                         SkillRepository skillRepository,
                         OpportunityRepository opportunityRepository,
                         ApplicationRepository applicationRepository,
                         MentorProfileRepository mentorProfileRepository,
                         CampusEventRepository campusEventRepository,
                         InterviewRepository interviewRepository,
                         ChatMessageRepository chatMessageRepository,
                         InstitutionStudentRepository institutionStudentRepository,
                         PlacementDriveRepository placementDriveRepository,
                         NotificationRepository notificationRepository,
                         AssessmentSubmissionRepository assessmentSubmissionRepository,
                         CurriculumCourseRepository curriculumCourseRepository,
                         StudentEndorsementRepository studentEndorsementRepository,
                         CapstoneProjectRepository capstoneProjectRepository,
                         MockEvaluationRepository mockEvaluationRepository,
                         AlumniProfileRepository alumniProfileRepository,
                         AlumniMentorshipSlotRepository alumniMentorshipSlotRepository,
                         AlumniJobReferralRepository alumniJobReferralRepository,
                         AlumniReferralApplicationRepository alumniReferralApplicationRepository,
                         AlumniDiscussionPostRepository alumniDiscussionPostRepository,
                         MandatoryInternshipRepository mandatoryInternshipRepository,
                         InternshipLogbookEntryRepository internshipLogbookEntryRepository,
                         GrievanceTicketRepository grievanceTicketRepository,
                         ComplianceAuditEventRepository complianceAuditEventRepository,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.opportunityRepository = opportunityRepository;
        this.applicationRepository = applicationRepository;
        this.mentorProfileRepository = mentorProfileRepository;
        this.campusEventRepository = campusEventRepository;
        this.interviewRepository = interviewRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.institutionStudentRepository = institutionStudentRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.notificationRepository = notificationRepository;
        this.assessmentSubmissionRepository = assessmentSubmissionRepository;
        this.curriculumCourseRepository = curriculumCourseRepository;
        this.studentEndorsementRepository = studentEndorsementRepository;
        this.capstoneProjectRepository = capstoneProjectRepository;
        this.mockEvaluationRepository = mockEvaluationRepository;
        this.alumniProfileRepository = alumniProfileRepository;
        this.alumniMentorshipSlotRepository = alumniMentorshipSlotRepository;
        this.alumniJobReferralRepository = alumniJobReferralRepository;
        this.alumniReferralApplicationRepository = alumniReferralApplicationRepository;
        this.alumniDiscussionPostRepository = alumniDiscussionPostRepository;
        this.mandatoryInternshipRepository = mandatoryInternshipRepository;
        this.internshipLogbookEntryRepository = internshipLogbookEntryRepository;
        this.grievanceTicketRepository = grievanceTicketRepository;
        this.complianceAuditEventRepository = complianceAuditEventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String defaultPasswordHash = passwordEncoder.encode("Demo@CareerSetu2024");

        if (userRepository.count() > 0) {
            seedAlumniIfEmpty(defaultPasswordHash);
            seedComplianceIfEmpty(defaultPasswordHash);
            log.info("Database already seeded with {} users. Verified Alumni & Compliance networks.", userRepository.count());
            return;
        }

        log.info("Seeding demo data for CareerSetu development environment...");

        // 1. Seed Demo Users
        User student = User.builder()
                .email("student@careersetu.in")
                .fullName("Aarav Sharma")
                .displayName("Aarav")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        student = userRepository.save(student);

        User employer = User.builder()
                .email("employer@careersetu.in")
                .fullName("Priya Patel")
                .displayName("Priya (TechCorp)")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.EMPLOYER)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        employer = userRepository.save(employer);

        User admin = User.builder()
                .email("admin@careersetu.in")
                .fullName("System Administrator")
                .displayName("Admin")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.PLATFORM_ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        admin = userRepository.save(admin);

        User faculty = User.builder()
                .email("faculty@careersetu.in")
                .fullName("Dr. Meenakshi Sundaram")
                .displayName("Prof. Meenakshi")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.FACULTY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        faculty = userRepository.save(faculty);

        // 2. Seed Student Profile
        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setUserId(student.getId());
        studentProfile.setHeadline("Aspiring Full Stack & AI Systems Engineer");
        studentProfile.setBio("Computer Science undergraduate passionate about distributed systems, React, and generative AI platforms.");
        studentProfile.setCurrentYear(4);
        studentProfile.setCurrentSemester(7);
        studentProfile.setCgpa(BigDecimal.valueOf(8.75));
        studentProfile.setGraduationYear(2026);
        studentProfile.setEnrollmentNumber("CS2022-7891");
        studentProfile.setRollNumber("22CSE041");
        studentProfile.setLinkedinUrl("https://linkedin.com/in/aarav-sharma-demo");
        studentProfile.setGithubUrl("https://github.com/aaravsharma-dev");
        studentProfile.setPortfolioUrl("https://aaravsharma.dev");
        studentProfile.setProfileCompletionPct(92);
        studentProfile.setIsActivelyLooking(true);
        studentProfile = studentProfileRepository.save(studentProfile);

        // 3. Seed Demo Companies
        Company techCorp = new Company();
        techCorp.setLegalName("TechCorp India Private Limited");
        techCorp.setBrandName("TechCorp India");
        techCorp.setCompanyType("STARTUP");
        techCorp.setIndustry("Information Technology");
        techCorp.setHeadquartersCity("Bengaluru");
        techCorp.setHeadquartersState("Karnataka");
        techCorp.setVerificationStatus("APPROVED");
        techCorp.setIsActive(true);
        techCorp.setIsStartup(true);
        techCorp = companyRepository.save(techCorp);

        Company innovateSoft = new Company();
        innovateSoft.setLegalName("InnovateSoft Solutions Pvt Ltd");
        innovateSoft.setBrandName("InnovateSoft");
        innovateSoft.setCompanyType("SME");
        innovateSoft.setIndustry("Software Engineering");
        innovateSoft.setHeadquartersCity("Hyderabad");
        innovateSoft.setHeadquartersState("Telangana");
        innovateSoft.setVerificationStatus("APPROVED");
        innovateSoft.setIsActive(true);
        innovateSoft = companyRepository.save(innovateSoft);

        // 4. Seed Demo Skills
        List<Skill> skills = List.of(
                new Skill(null, "Java", "java", "Modern enterprise Java & Spring Boot", "HIGH", true, false, true),
                new Skill(null, "Python", "python", "Python for AI/ML & Data Engineering", "HIGH", true, false, true),
                new Skill(null, "React", "react", "React 19, TypeScript & Modern Frontend", "HIGH", true, false, true),
                new Skill(null, "Spring Boot", "spring-boot", "Microservices & Distributed Systems", "HIGH", true, false, true),
                new Skill(null, "FastAPI", "fastapi", "High-performance Python asynchronous APIs", "MEDIUM", true, false, true),
                new Skill(null, "PostgreSQL", "postgresql", "Relational database design and optimization", "HIGH", true, false, true),
                new Skill(null, "Machine Learning", "machine-learning", "Scikit-Learn, PyTorch and LLMs", "HIGH", true, false, true),
                new Skill(null, "Problem Solving", "problem-solving", "Algorithmic thinking and data structures", "HIGH", false, true, true)
        );
        skillRepository.saveAll(skills);

        // 5. Seed Opportunities
        Opportunity opp1 = new Opportunity();
        opp1.setCompanyId(techCorp.getId());
        opp1.setPostedBy(employer.getId());
        opp1.setTitle("Full Stack AI Software Engineer Intern");
        opp1.setSlug("full-stack-ai-engineer-intern");
        opp1.setType("INTERNSHIP");
        opp1.setDescription("Build next-generation talent discovery tools with React, FastAPI, and Spring Boot.");
        opp1.setLocationCity("Bengaluru");
        opp1.setLocationState("Karnataka");
        opp1.setWorkMode("HYBRID");
        opp1.setIsPaid(true);
        opp1.setStipendMin(35000);
        opp1.setStipendMax(50000);
        opp1.setDurationWeeks(24);
        opp1.setStatus("PUBLISHED");
        opp1.setApplicationsCount(9);
        opp1.setApplicationDeadline(LocalDate.now().plusMonths(2));
        opp1 = opportunityRepository.save(opp1);

        Opportunity opp2 = new Opportunity();
        opp2.setCompanyId(innovateSoft.getId());
        opp2.setPostedBy(employer.getId());
        opp2.setTitle("Junior Cloud & Backend Engineer");
        opp2.setSlug("junior-cloud-backend-engineer");
        opp2.setType("FULL_TIME");
        opp2.setDescription("Design resilient microservices, distributed cache architectures, and REST APIs.");
        opp2.setLocationCity("Hyderabad");
        opp2.setLocationState("Telangana");
        opp2.setWorkMode("REMOTE");
        opp2.setIsPaid(true);
        opp2.setSalaryMin(800000);
        opp2.setSalaryMax(1200000);
        opp2.setStatus("PUBLISHED");
        opp2.setApplicationsCount(14);
        opp2.setApplicationDeadline(LocalDate.now().plusMonths(1));
        opp2 = opportunityRepository.save(opp2);

        // 6. Seed Initial Demo Applications for Recruiter ATS
        Application demoApp1 = new Application();
        demoApp1.setOpportunityId(opp1.getId());
        demoApp1.setStudentProfileId(studentProfile.getId());
        demoApp1.setCoverNote("Passionate about building scalable AI workflows with modern web technologies.");
        demoApp1.setStatus("INTERVIEW");
        demoApp1.setMatchScore(BigDecimal.valueOf(92.0));
        demoApp1.setAiExplanation("92% compatibility: Candidate demonstrates verified skills in Java, React, and Python.");
        demoApp1.setAppliedAt(Instant.now().minusSeconds(86400 * 2));
        demoApp1.setLastActivityAt(Instant.now().minusSeconds(3600 * 4));
        applicationRepository.save(demoApp1);

        // Candidate 2: Priya Sharma
        User priya = User.builder()
                .email("priya.sharma@careersetu.in")
                .fullName("Priya Sharma")
                .displayName("Priya")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        priya = userRepository.save(priya);
        StudentProfile priyaProfile = new StudentProfile();
        priyaProfile.setUserId(priya.getId());
        priyaProfile.setHeadline("Backend Engineer & Distributed Systems Enthusiast");
        priyaProfile.setCurrentYear(4);
        priyaProfile.setCgpa(BigDecimal.valueOf(8.90));
        priyaProfile.setProfileCompletionPct(95);
        priyaProfile = studentProfileRepository.save(priyaProfile);

        Application demoApp2 = new Application();
        demoApp2.setOpportunityId(opp1.getId());
        demoApp2.setStudentProfileId(priyaProfile.getId());
        demoApp2.setCoverNote("Excited to apply my experience in Spring Boot and enterprise systems to AI tooling.");
        demoApp2.setStatus("SHORTLISTED");
        demoApp2.setMatchScore(BigDecimal.valueOf(88.0));
        demoApp2.setAiExplanation("88% compatibility: Verified expertise in Java, REST APIs, and database indexing.");
        demoApp2.setAppliedAt(Instant.now().minusSeconds(86400 * 3));
        demoApp2.setLastActivityAt(Instant.now().minusSeconds(3600 * 12));
        applicationRepository.save(demoApp2);

        // Candidate 3: Rahul Kumar
        User rahul = User.builder()
                .email("rahul.kumar@careersetu.in")
                .fullName("Rahul Kumar")
                .displayName("Rahul")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        rahul = userRepository.save(rahul);
        StudentProfile rahulProfile = new StudentProfile();
        rahulProfile.setUserId(rahul.getId());
        rahulProfile.setHeadline("Cloud DevOps & Microservices Architect");
        rahulProfile.setCurrentYear(4);
        rahulProfile.setCgpa(BigDecimal.valueOf(9.10));
        rahulProfile.setProfileCompletionPct(98);
        rahulProfile = studentProfileRepository.save(rahulProfile);

        Application demoApp3 = new Application();
        demoApp3.setOpportunityId(opp2.getId());
        demoApp3.setStudentProfileId(rahulProfile.getId());
        demoApp3.setCoverNote("Built high throughput resilient event pipelines and looking forward to scaling microservices.");
        demoApp3.setStatus("OFFERED");
        demoApp3.setMatchScore(BigDecimal.valueOf(96.0));
        demoApp3.setAiExplanation("96% compatibility: Outstanding performance in system architecture and cloud fundamentals.");
        demoApp3.setAppliedAt(Instant.now().minusSeconds(86400 * 5));
        demoApp3.setLastActivityAt(Instant.now().minusSeconds(3600 * 1));
        applicationRepository.save(demoApp3);

        // Candidate 4: Anita Singh
        User anita = User.builder()
                .email("anita.singh@careersetu.in")
                .fullName("Anita Singh")
                .displayName("Anita")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        anita = userRepository.save(anita);
        StudentProfile anitaProfile = new StudentProfile();
        anitaProfile.setUserId(anita.getId());
        anitaProfile.setHeadline("Data Scientist & Full Stack ML Developer");
        anitaProfile.setCurrentYear(3);
        anitaProfile.setCgpa(BigDecimal.valueOf(8.45));
        anitaProfile.setProfileCompletionPct(88);
        anitaProfile = studentProfileRepository.save(anitaProfile);

        Application demoApp4 = new Application();
        demoApp4.setOpportunityId(opp1.getId());
        demoApp4.setStudentProfileId(anitaProfile.getId());
        demoApp4.setCoverNote("Enthusiastic about integrating machine learning pipelines with production APIs.");
        demoApp4.setStatus("UNDER_REVIEW");
        demoApp4.setMatchScore(BigDecimal.valueOf(81.0));
        demoApp4.setAiExplanation("81% compatibility: Solid foundation in Python, data modeling, and REST integrations.");
        demoApp4.setAppliedAt(Instant.now().minusSeconds(86400 * 1));
        demoApp4.setLastActivityAt(Instant.now().minusSeconds(3600 * 6));
        applicationRepository.save(demoApp4);

        // ─────────────────────────────────────────────────────────────
        // Seed Mentors
        // ─────────────────────────────────────────────────────────────
        MentorProfile mentor1 = new MentorProfile(
                null, "Dr. Rohan Mehra", "Staff Software Architect", "Google Cloud", 12,
                4.98, 310, "RM", "from-blue-600 to-indigo-600",
                "Distributed Systems, Java, Cloud Native, System Design",
                "Leading distributed storage architectures at Google Cloud. Passionate about helping university students master large-scale distributed systems and interview algorithms.",
                "Tomorrow, 4:00 PM IST", "English, Hindi", 0, true
        );
        MentorProfile mentor2 = new MentorProfile(
                null, "Ananya Deshmukh", "Principal GenAI Researcher", "Microsoft AI", 9,
                4.95, 245, "AD", "from-purple-600 to-pink-600",
                "GenAI, LLM Fine-tuning, Python, FastAPI, RAG",
                "Specializing in fine-tuning open weights models and building low-latency RAG pipelines. Former IIT Bombay alumni mentor for graduate engineers.",
                "Wednesday, 6:30 PM IST", "English, Marathi, Hindi", 0, true
        );
        MentorProfile mentor3 = new MentorProfile(
                null, "Karthik Subramanian", "Director of Engineering", "Razorpay", 14,
                4.99, 420, "KS", "from-emerald-600 to-teal-600",
                "FinTech, Scalability, Spring Boot, Microservices",
                "Architecting resilient multi-bank payment switching infrastructure with 99.999% uptime. Mentoring students on clean architecture and high-throughput systems.",
                "Thursday, 5:00 PM IST", "English, Tamil, Hindi", 0, true
        );
        mentorProfileRepository.saveAll(List.of(mentor1, mentor2, mentor3));

        // ─────────────────────────────────────────────────────────────
        // Seed Campus Events & Hackathons
        // ─────────────────────────────────────────────────────────────
        CampusEvent event1 = new CampusEvent(
                null, "National GenAI & Agentic Systems Hackathon 2026", "CareerSetu & Google Cloud",
                "HACKATHON", "HYBRID", "Pune & Virtual Stream",
                "March 28, 2026", "March 30, 2026", "March 22, 2026", "₹5,00,000 + Fast-Track PPIs",
                420, 4, "Generative AI, RAG, FastAPI, Cloud",
                "36-hour flagship hackathon building India-scale public infrastructure and autonomous agents solving agriculture, healthcare, and education bottlenecks.",
                "₹5,00,000 Prize Pool;Direct Interview Shortlists for Finalists;Google Cloud Credits ($500/team);Verifiable National Hackathon Badge",
                true
        );
        CampusEvent event2 = new CampusEvent(
                null, "Razorpay FinTech 48-Hour Hiring Sprint", "Razorpay Engineering",
                "HIRING_SPRINT", "ONLINE", "Virtual Proctored Platform",
                "April 5, 2026", "April 7, 2026", "April 2, 2026", "₹3,00,000 + 15 Internship Offers",
                680, 2, "FinTech, Distributed Systems, Java, Go",
                "Rapid hiring contest solving real-time payment reconciliation and idempotent transactions with direct internship job offers for top 15 performers.",
                "15 Direct Summer Internship Offers;₹3,00,000 Cash Pool;Interview Fast-Track for Top 100",
                true
        );
        CampusEvent event3 = new CampusEvent(
                null, "Cloud Native Microservices Masterclass", "AWS User Group India",
                "WORKSHOP", "ONLINE", "Live Streaming",
                "April 18, 2026", "April 19, 2026", "April 15, 2026", "Free Certificate + Cloud Badges",
                950, 1, "DevOps, Kubernetes, Docker, Spring Boot",
                "Hands-on architectural workshop on container orchestration, service meshes, and resilient event-driven architectures with Spring Boot 3 & Docker.",
                "Hands-on AWS Cloud Sandbox Access;Verifiable Workshop Completion Certificate;Free Architecture E-Book",
                true
        );
        campusEventRepository.saveAll(List.of(event1, event2, event3));

        // ─────────────────────────────────────────────────────────────
        // Seed Interviews
        // ─────────────────────────────────────────────────────────────
        InterviewSchedule int1 = new InterviewSchedule(
                null, student.getId(), "Aarav Sharma", "student@careersetu.in",
                employer.getId(), "Deepak Patel (Lead Cloud Architect)", "TechCorp India",
                "Cloud Native Engineer Intern", "TECHNICAL_1", "Thursday, Mar 12, 2026",
                "03:00 PM - 03:45 PM", Instant.now().plusSeconds(86400 * 3), 45,
                "https://meet.google.com/xyz-cs-aarav", "SCHEDULED",
                "Focus on Spring Boot 3 virtual threads and PostgreSQL query execution plans.", null
        );
        InterviewSchedule int2 = new InterviewSchedule(
                null, priya.getId(), "Priya Sharma", "priya.sharma@careersetu.in",
                employer.getId(), "Dr. Neha Rao (Director of AI)", "TechCorp India",
                "AI/ML Researcher Intern", "SYSTEM_DESIGN", "Today",
                "04:30 PM - 05:15 PM", Instant.now().plusSeconds(3600), 45,
                "https://meet.google.com/xyz-cs-priya", "IN_PROGRESS",
                "Discuss vector database indexing and RAG chunking trade-offs.", null
        );
        InterviewSchedule int3 = new InterviewSchedule(
                null, rahul.getId(), "Rahul Kumar", "rahul.k@careersetu.in",
                employer.getId(), "Sarah Jenkins (Talent Acquisition)", "TechCorp India",
                "Full Stack Developer", "BEHAVIORAL", "Yesterday",
                "11:00 AM - 11:30 AM", Instant.now().minusSeconds(86400), 30,
                "https://meet.google.com/xyz-cs-rahul", "COMPLETED",
                "Candidate demonstrated strong collaborative mindset, technical clarity, and agile team practices.", 92
        );
        interviewRepository.saveAll(List.of(int1, int2, int3));

        // ─────────────────────────────────────────────────────────────
        // Seed Chat Messages
        // ─────────────────────────────────────────────────────────────
        String recruiterConvId = MessageService.generateConversationId(employer.getId(), student.getId());
        ChatMessage msg1 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Hi Aarav! We reviewed your Career Passport application for the Cloud Native Engineer Intern role.",
                Instant.now().minusSeconds(3600 * 4), true
        );
        ChatMessage msg2 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Your 96/100 code assessment score in Java & Spring Boot caught our hiring team's attention.",
                Instant.now().minusSeconds(3600 * 3), true
        );
        ChatMessage msg3 = new ChatMessage(
                null, recruiterConvId, student.getId(), "Aarav Sharma", "STUDENT",
                employer.getId(), "Sarah Jenkins",
                "Hello Sarah! Thank you for the update. I would love to discuss the opportunity and how my skills align with the team.",
                Instant.now().minusSeconds(3600 * 2), true
        );
        ChatMessage msg4 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Would you be available for a 45-minute technical conversation this Thursday at 3:00 PM?",
                Instant.now().minusSeconds(1800), false
        );
        chatMessageRepository.saveAll(List.of(msg1, msg2, msg3, msg4));

        // ─────────────────────────────────────────────────────────────
        // Seed Institution Students (TPO Directory)
        // ─────────────────────────────────────────────────────────────
        InstitutionStudent is1 = new InstitutionStudent(
                "Aarav Sharma", "student@careersetu.in", "22CSE041",
                "Computer Science & Engineering", 4, 8.92, 14, "COMPLIANT", 4,
                "SHORTLISTED", "TechCorp India", 18.5
        );
        InstitutionStudent is2 = new InstitutionStudent(
                "Priya Sharma", "priya.sharma@careersetu.in", "22CSE018",
                "Computer Science & Engineering", 4, 9.15, 14, "COMPLIANT", 5,
                "INTERVIEW_SCHEDULED", "Microsoft AI", 24.0
        );
        InstitutionStudent is3 = new InstitutionStudent(
                "Rahul Kumar", "rahul.k@careersetu.in", "22IT052",
                "Information Technology", 4, 7.85, 10, "IN_PROGRESS", 2,
                "APPLIED", null, null
        );
        InstitutionStudent is4 = new InstitutionStudent(
                "Ananya Patel", "ananya.p@careersetu.in", "22AI009",
                "Artificial Intelligence & Data Science", 4, 9.42, 14, "COMPLIANT", 6,
                "PLACED", "Google DeepMind", 32.0
        );
        InstitutionStudent is5 = new InstitutionStudent(
                "Rohan Verma", "rohan.v@careersetu.in", "22ECE033",
                "Electronics & Communication", 4, 7.20, 6, "IN_PROGRESS", 1,
                "NOT_APPLIED", null, null
        );
        institutionStudentRepository.saveAll(List.of(is1, is2, is3, is4, is5));

        // ─────────────────────────────────────────────────────────────
        // Seed Campus Placement Drives
        // ─────────────────────────────────────────────────────────────
        PlacementDrive d1 = new PlacementDrive(
                "TechCorp India", "Cloud Native & Distributed Systems Engineer",
                "₹18.5 - ₹24.0 LPA", "₹65,000/month", 8.0, "CSE, IT, AI & DS",
                "March 18, 2026", "Online Coding Sandbox, System Architecture, Technical Panel, HR Discussion",
                "IN_PROGRESS", 148, 12
        );
        PlacementDrive d2 = new PlacementDrive(
                "Razorpay", "Software Development Engineer - Payments",
                "₹22.0 - ₹28.0 LPA", "₹85,000/month", 8.25, "CSE, IT",
                "March 25, 2026", "Algorithmic Assessment, System Design Round, Culture Fit",
                "UPCOMING", 210, 0
        );
        PlacementDrive d3 = new PlacementDrive(
                "Infosys AI Systems", "Specialist Programmer (GenAI & Cloud)",
                "₹9.5 - ₹12.0 LPA", "₹40,000/month", 7.0, "All Engineering Branches",
                "April 02, 2026", "Aptitude & Coding Round, Technical Panel Interview",
                "UPCOMING", 380, 0
        );
        PlacementDrive d4 = new PlacementDrive(
                "Microsoft India", "Support & Cloud Solution Architect",
                "₹26.0 - ₹34.0 LPA", "₹1,00,000/month", 8.5, "CSE, IT",
                "February 20, 2026", "Coding Sandbox, Cloud Design Panel, Senior Leadership Round",
                "OFFERS_RELEASED", 285, 18
        );
        placementDriveRepository.saveAll(List.of(d1, d2, d3, d4));

        // ─────────────────────────────────────────────────────────────
        // Seed Notifications
        // ─────────────────────────────────────────────────────────────
        AppNotification notif1 = new AppNotification(
                "student@careersetu.in",
                "Application Shortlisted!",
                "TechCorp India reviewed your profile and moved your application for Cloud Native Engineer Intern to Shortlisted.",
                "APPLICATION", "HIGH", "/student/applications"
        );
        AppNotification notif2 = new AppNotification(
                "student@careersetu.in",
                "AI ATS Resume Studio Score",
                "Your ATS compatibility score achieved 91/100 for Backend Systems Engineer. 1 high-demand keyword recommended.",
                "AI_INSIGHT", "NORMAL", "/student/copilot"
        );
        AppNotification notif3 = new AppNotification(
                "student@careersetu.in",
                "New Opportunity Matching Your Profile",
                "Razorpay posted 'Software Engineer Intern - Payments' matching 94% of your verified skills.",
                "OPPORTUNITY", "NORMAL", "/student/opportunities"
        );
        AppNotification notif4 = new AppNotification(
                "student@careersetu.in",
                "Campus Placement Drive Announced",
                "TPO scheduled a 2026 Batch Campus Recruitment Drive with Infosys AI Systems. 14 NEP credits eligible.",
                "SYSTEM", "LOW", "/institution/drives"
        );
        notificationRepository.saveAll(List.of(notif1, notif2, notif3, notif4));

        // ─────────────────────────────────────────────────────────────
        // Seed Initial Verifiable Assessment Badges
        // ─────────────────────────────────────────────────────────────
        AssessmentSubmission sub1 = new AssessmentSubmission(
                "student@careersetu.in", "Aarav Sharma", "dsa",
                "Algorithmic Problem Solving", "java", 96,
                "class Solution { public int[] twoSum(int[] nums, int target) { ... } }",
                3, 3, "0x8f4d92a1c6e409b3e1f5789a2b8e3914a5c6d7e8f90123456789abcdef012345",
                "Algorithmic Problem Solving Verified Specialist", "PASSED"
        );
        assessmentSubmissionRepository.save(sub1);

        // ─────────────────────────────────────────────────────────────
        // Seed Phase 9: Faculty & Academic Portal Demo Data
        // ─────────────────────────────────────────────────────────────
        // 1. Curriculum Courses
        CurriculumCourse cc1 = new CurriculumCourse();
        cc1.setCourseCode("CS401");
        cc1.setCourseTitle("Distributed Systems & Cloud Architecture");
        cc1.setDepartment("Computer Science & Engineering");
        cc1.setSemester(7);
        cc1.setAicteCredits(4);
        cc1.setSyllabusSummary("Core principles of decentralized architectures, consensus (Raft/Paxos), distributed caches, event-driven messaging, and Kubernetes container orchestration.");
        cc1.setIndustryRelevance("VERY_HIGH");
        cc1.setAlignmentScore(94.5);
        cc1.setMappedSkillsJson("[\"Kubernetes\", \"gRPC\", \"Apache Kafka\", \"Consensus Algorithms\", \"Docker\", \"Distributed Tracing\"]");
        cc1.setNepCategory("Advanced Technical Specialization (NEP 14-Credit)");
        cc1.setFacultyLead("Dr. Meenakshi Sundaram");

        CurriculumCourse cc2 = new CurriculumCourse();
        cc2.setCourseCode("AI302");
        cc2.setCourseTitle("Deep Learning & Generative AI Systems");
        cc2.setDepartment("Artificial Intelligence & Data Science");
        cc2.setSemester(6);
        cc2.setAicteCredits(4);
        cc2.setSyllabusSummary("Transformer architectures, fine-tuning foundation models, retrieval-augmented generation (RAG), vector databases (pgvector/Pinecone), and LLM guardrails.");
        cc2.setIndustryRelevance("VERY_HIGH");
        cc2.setAlignmentScore(91.0);
        cc2.setMappedSkillsJson("[\"PyTorch\", \"Hugging Face\", \"LLM Fine-Tuning\", \"Vector DBs\", \"RAG Architectures\", \"Prompt Engineering\"]");
        cc2.setNepCategory("Multidisciplinary AI Minor (NEP 2020)");
        cc2.setFacultyLead("Dr. Rajesh Kulkarni");

        CurriculumCourse cc3 = new CurriculumCourse();
        cc3.setCourseCode("CS305");
        cc3.setCourseTitle("Advanced Database Systems & High-Throughput Engines");
        cc3.setDepartment("Computer Science & Engineering");
        cc3.setSemester(5);
        cc3.setAicteCredits(3);
        cc3.setSyllabusSummary("Storage engine internals (LSM Trees vs B+ Trees), distributed transactions (2PC, Sagas), indexing heuristics, and real-time analytical processing.");
        cc3.setIndustryRelevance("HIGH");
        cc3.setAlignmentScore(88.5);
        cc3.setMappedSkillsJson("[\"PostgreSQL\", \"Redis\", \"Query Optimization\", \"ACID Internals\", \"Database Sharding\"]");
        cc3.setNepCategory("Core Engineering Discipline");
        cc3.setFacultyLead("Dr. Ananya Sen");

        CurriculumCourse cc4 = new CurriculumCourse();
        cc4.setCourseCode("SE402");
        cc4.setCourseTitle("DevOps, SRE & Cloud Native Infrastructure");
        cc4.setDepartment("Information Technology");
        cc4.setSemester(7);
        cc4.setAicteCredits(3);
        cc4.setSyllabusSummary("Infrastructure as Code (Terraform), continuous integration/deployment automation, zero-downtime rollouts, observability with Prometheus & OpenTelemetry.");
        cc4.setIndustryRelevance("VERY_HIGH");
        cc4.setAlignmentScore(96.0);
        cc4.setMappedSkillsJson("[\"Terraform\", \"GitHub Actions CI/CD\", \"Prometheus\", \"Grafana\", \"Linux System Internals\"]");
        cc4.setNepCategory("Industry Practice & SRE Track");
        cc4.setFacultyLead("Prof. Vikram Deshmukh");

        curriculumCourseRepository.saveAll(List.of(cc1, cc2, cc3, cc4));

        // 2. Student Endorsements
        StudentEndorsement end1 = new StudentEndorsement();
        end1.setFacultyId(faculty.getId());
        end1.setFacultyName("Dr. Meenakshi Sundaram");
        end1.setFacultyDesignation("Professor & Dean of Academic Alliances");
        end1.setFacultyDepartment("Computer Science & Engineering");
        end1.setStudentId(student.getId());
        end1.setStudentName("Aarav Sharma");
        end1.setStudentRollNo("22CSE041");
        end1.setSpecializationArea("High-Throughput Distributed Systems & Cloud Platforms");
        end1.setEndorsementText("Aarav demonstrates extraordinary technical acumen in high-concurrency systems and low-latency architectural designs. Ranked in the top 5% of his cohort with exemplary practical contributions to the Department Systems Lab. Highly endorsed for Tier-1 Super-Dream Engineering roles.");
        end1.setRatingTier("TOP_5_PERCENT");
        end1.setVerificationHash("0x7a3e91b4c2d589f012345678abcdef9012345678abcdef9012345678abcdef90");
        end1.setStatus("VERIFIED");

        StudentEndorsement end2 = new StudentEndorsement();
        end2.setFacultyId(faculty.getId());
        end2.setFacultyName("Dr. Meenakshi Sundaram");
        end2.setFacultyDesignation("Professor & Dean of Academic Alliances");
        end2.setFacultyDepartment("Computer Science & Engineering");
        end2.setStudentId(student.getId());
        end2.setStudentName("Divya Nair");
        end2.setStudentRollNo("22AI055");
        end2.setSpecializationArea("Generative AI Engineering & Multi-Modal Models");
        end2.setEndorsementText("Divya has spearheaded university research initiatives on localized Indian language models. Demonstrates top-tier proficiency in PyTorch model quantization and vector search pipelines. Strong leadership and cross-disciplinary agility.");
        end2.setRatingTier("TOP_5_PERCENT");
        end2.setVerificationHash("0x6b2d81a3c1e478e012345678abcdef9012345678abcdef9012345678abcdef91");
        end2.setStatus("VERIFIED");

        StudentEndorsement end3 = new StudentEndorsement();
        end3.setFacultyId(faculty.getId());
        end3.setFacultyName("Dr. Rajesh Kulkarni");
        end3.setFacultyDesignation("Associate Professor & Head of AI Lab");
        end3.setFacultyDepartment("Artificial Intelligence & Data Science");
        end3.setStudentId(student.getId());
        end3.setStudentName("Siddharth Rao");
        end3.setStudentRollNo("22IT088");
        end3.setSpecializationArea("Cloud Microservices & Enterprise Spring Boot");
        end3.setEndorsementText("Siddharth exhibits clean coding disciplines, robust unit testing coverage, and solid domain driven design implementations in Java microservices. Ready for enterprise backend engineering responsibilities.");
        end3.setRatingTier("TOP_10_PERCENT");
        end3.setVerificationHash("0x5c1b7092b0d367d012345678abcdef9012345678abcdef9012345678abcdef92");
        end3.setStatus("VERIFIED");

        studentEndorsementRepository.saveAll(List.of(end1, end2, end3));

        // 3. Capstone Projects
        CapstoneProject proj1 = new CapstoneProject();
        proj1.setProjectTitle("Autonomous UAV Dispatch System for Emergency Medical Delivery");
        proj1.setIndustryPartner("TechCorp India & DroneVentures");
        proj1.setCorporateMentorName("Priya Patel");
        proj1.setFacultyGuideName("Dr. Meenakshi Sundaram");
        proj1.setStudentNames("Aarav Sharma, Divya Nair");
        proj1.setStudentIdsJson("[\"" + student.getId() + "\"]");
        proj1.setStage("INDUSTRY_REVIEW");
        proj1.setProgressPercentage(85);
        proj1.setFinalGrade(9.6);
        proj1.setMilestoneNotes("Completed hardware telemetry telemetry streaming via gRPC. Corporate mentor reviewed end-to-end integration and approved final flight safety test suite.");
        proj1.setRepoUrl("https://github.com/careersetu-labs/uav-medical-dispatch");
        proj1.setDomainArea("Edge AI & Distributed Systems");

        CapstoneProject proj2 = new CapstoneProject();
        proj2.setProjectTitle("Decentralized Micro-Crediting & Fraud Defense Engine");
        proj2.setIndustryPartner("Bharat FinTech Alliances");
        proj2.setCorporateMentorName("Amit Verma");
        proj2.setFacultyGuideName("Dr. Ananya Sen");
        proj2.setStudentNames("Siddharth Rao, Vikram Seth");
        proj2.setStudentIdsJson("[]");
        proj2.setStage("MID_TERM");
        proj2.setProgressPercentage(60);
        proj2.setFinalGrade(8.8);
        proj2.setMilestoneNotes("Mid-term evaluation completed. Sub-second fraud anomaly detection pipelines running against simulated transaction streams.");
        proj2.setRepoUrl("https://github.com/careersetu-labs/fintech-fraud-defense");
        proj2.setDomainArea("FinTech & Fraud Detection");

        CapstoneProject proj3 = new CapstoneProject();
        proj3.setProjectTitle("Low-Latency Indian Vernacular Voice Assistant for Rural Healthcare");
        proj3.setIndustryPartner("AICTE Innovation Grant");
        proj3.setCorporateMentorName("Dr. Sanjay Gupta");
        proj3.setFacultyGuideName("Dr. Rajesh Kulkarni");
        proj3.setStudentNames("Rohan Varma, Neha Gupta");
        proj3.setStudentIdsJson("[]");
        proj3.setStage("FINAL_VIVA");
        proj3.setProgressPercentage(95);
        proj3.setFinalGrade(9.8);
        proj3.setMilestoneNotes("Final viva defended successfully before external examiners. Prototype deployed in 3 primary health centers with 94% Hindi/Marathi speech recognition accuracy.");
        proj3.setRepoUrl("https://github.com/careersetu-labs/vernacular-health-voice");
        proj3.setDomainArea("Generative AI & Audio Processing");

        capstoneProjectRepository.saveAll(List.of(proj1, proj2, proj3));

        // 4. Mock Evaluations
        MockEvaluation eval1 = new MockEvaluation();
        eval1.setStudentId(student.getId());
        eval1.setStudentName("Aarav Sharma");
        eval1.setStudentRollNo("22CSE041");
        eval1.setEvaluatorName("Dr. Meenakshi Sundaram");
        eval1.setTrack("Full Stack & Cloud Architecture");
        eval1.setTechnicalScore(95);
        eval1.setProblemSolvingScore(92);
        eval1.setCommunicationScore(90);
        eval1.setNepReadinessScore(96);
        eval1.setOverallScore(93);
        eval1.setRubricFeedback("Outstanding command over thread concurrency, distributed consensus, and event-driven architectures. Confidently tackled live coding edge cases and system failure recovery.");
        eval1.setRecommendedActions("Cleared for Tier-1 Super-Dream placement drives. Advised to lead the team at upcoming national hackathons.");
        eval1.setReadinessStatus("PLACEMENT_READY");

        MockEvaluation eval2 = new MockEvaluation();
        eval2.setStudentId(student.getId());
        eval2.setStudentName("Siddharth Rao");
        eval2.setStudentRollNo("22IT088");
        eval2.setEvaluatorName("Dr. Rajesh Kulkarni");
        eval2.setTrack("Cloud Microservices & Spring Boot");
        eval2.setTechnicalScore(85);
        eval2.setProblemSolvingScore(82);
        eval2.setCommunicationScore(88);
        eval2.setNepReadinessScore(86);
        eval2.setOverallScore(85);
        eval2.setRubricFeedback("Good architectural reasoning with API design, validation schemas, and caching layers. Handled REST error scenarios cleanly.");
        eval2.setRecommendedActions("Recommend reviewing B-tree indexing in relational DBs and connection pool tuning before upcoming GCC interviews.");
        eval2.setReadinessStatus("PLACEMENT_READY");

        MockEvaluation eval3 = new MockEvaluation();
        eval3.setStudentId(student.getId());
        eval3.setStudentName("Vikram Seth");
        eval3.setStudentRollNo("22CSE099");
        eval3.setEvaluatorName("Prof. Vikram Deshmukh");
        eval3.setTrack("Distributed Systems Intern");
        eval3.setTechnicalScore(80);
        eval3.setProblemSolvingScore(75);
        eval3.setCommunicationScore(82);
        eval3.setNepReadinessScore(80);
        eval3.setOverallScore(79);
        eval3.setRubricFeedback("Solid foundational coding in Java and data structures. Needs a more structured mental framework for NP-hard dynamic programming problems.");
        eval3.setRecommendedActions("Targeted practice on graph traversal and DP memoization through CareerSetu Assessment sandbox.");
        eval3.setReadinessStatus("NEEDS_PRACTICE");

        mockEvaluationRepository.saveAll(List.of(eval1, eval2, eval3));

        seedAlumniIfEmpty(defaultPasswordHash);
        seedComplianceIfEmpty(defaultPasswordHash);

        log.info("CareerSetu demo data seeding completed successfully! Mentors, Events, Interviews, TPO Cohort, Placement Drives, Notifications, Assessment Badges, Phase 9 Faculty Portal, Phase 10 Alumni Network, and Phase 11 Compliance initialized.");
    }

    private void seedAlumniIfEmpty(String defaultPasswordHash) {
        if (alumniProfileRepository.count() > 0) {
            return;
        }

        log.info("Seeding Phase 10 Alumni Network & Alum-Connect data...");

        // Ensure alumni demo account exists
        User alumniUser = userRepository.findByEmail("alumni@careersetu.in").orElseGet(() -> {
            User u = User.builder()
                    .email("alumni@careersetu.in")
                    .fullName("Neha Singhal")
                    .displayName("Neha (Google)")
                    .passwordHash(defaultPasswordHash)
                    .primaryRole(User.UserRole.ALUMNI)
                    .accountStatus(User.AccountStatus.ACTIVE)
                    .emailVerified(true)
                    .mobileVerified(true)
                    .build();
            return userRepository.save(u);
        });

        User studentUser = userRepository.findByEmail("student@careersetu.in").orElse(null);
        UUID studentId = studentUser != null ? studentUser.getId() : UUID.randomUUID();

        // 1. Alumni Profiles
        AlumniProfile alum1 = new AlumniProfile(
                null,
                alumniUser.getId(),
                "Neha Singhal",
                "alumni@careersetu.in",
                2020,
                "B.Tech Computer Science & Engineering",
                "National Institute of Technology",
                "Google",
                "Senior Software Engineer",
                "Cloud Infrastructure & Distributed Storage",
                "Bengaluru, Karnataka",
                "https://linkedin.com/in/neha-singhal-cloud",
                "https://github.com/nehasinghal-dist",
                "NS",
                "Leading high-scale Bigtable storage infrastructure at Google Cloud. Alumna from 2020 batch. Passionate about helping students crack Tier-1 distributed systems interviews and building open-source projects.",
                "Distributed Systems, Bigtable, Go, Kubernetes, System Design",
                true,
                true,
                42,
                18,
                4.96
        );

        AlumniProfile alum2 = new AlumniProfile(
                null,
                null,
                "Rishabh Agarwal",
                "rishabh.agarwal@microsoft.alumni.local",
                2019,
                "B.Tech Information Technology",
                "National Institute of Technology",
                "Microsoft",
                "Principal Product Manager",
                "Azure AI & Generative Copilot",
                "Hyderabad, Telangana",
                "https://linkedin.com/in/rishabh-agarwal-pm",
                "https://github.com/rishabh-ai-pm",
                "RA",
                "Principal PM leading enterprise Copilot integration across Azure AI Studio. Former APM mentor who has helped over 35 students transition into Product Management and Tech Strategy roles.",
                "Product Management, Generative AI, Tech Strategy, System Architecture",
                true,
                true,
                35,
                14,
                4.94
        );

        AlumniProfile alum3 = new AlumniProfile(
                null,
                null,
                "Tanvi Kulkarni",
                "tanvi.kulkarni@amazon.alumni.local",
                2021,
                "B.Tech Computer Science & Engineering",
                "National Institute of Technology",
                "Amazon AWS",
                "Senior Cloud Solutions Architect",
                "Cloud Native & Serverless Infrastructure",
                "Pune, Maharashtra",
                "https://linkedin.com/in/tanvi-kulkarni-aws",
                "https://github.com/tanvikulkarni-cloud",
                "TK",
                "Architecting resilient multi-region serverless architectures on AWS for global fintech clients. Batch 2021 topper. Mentoring women in tech and conducting AWS architecture mock reviews.",
                "AWS, Microservices, Event-Driven Architecture, DynamoDB, Terraform",
                true,
                true,
                28,
                12,
                4.92
        );

        AlumniProfile alum4 = new AlumniProfile(
                null,
                null,
                "Prateek Saxena",
                "prateek.saxena@zomato.alumni.local",
                2018,
                "B.Tech Computer Science & Engineering",
                "National Institute of Technology",
                "Zomato",
                "Principal Engineer",
                "High-Throughput Logistics & Real-time Matching",
                "Gurugram, Haryana",
                "https://linkedin.com/in/prateek-saxena-scale",
                "https://github.com/prateeksaxena-systems",
                "PS",
                "Core architect behind Zomato order routing engine processing 15,000+ orders per minute during peak flashes. Conducts deep-dive backend performance tuning and mock viva sessions.",
                "High QPS Systems, Golang, Kafka, Redis, Distributed Locks",
                true,
                true,
                55,
                25,
                4.98
        );

        AlumniProfile alum5 = new AlumniProfile(
                null,
                null,
                "Aditi Menon",
                "aditi.menon@atlassian.alumni.local",
                2022,
                "B.Tech Computer Science & Engineering",
                "National Institute of Technology",
                "Atlassian",
                "Senior Frontend Engineer",
                "Web Architecture & Real-Time Collaboration",
                "Bengaluru, Karnataka",
                "https://linkedin.com/in/aditi-menon-web",
                "https://github.com/aditi-menon-frontend",
                "AM",
                "Building collaborative editing canvases and ultra-fast UI rendering for Jira Platform. Focuses on React internals, AST compilation, and web performance optimization.",
                "React 19, TypeScript, Webpack/Vite, WebSockets, Frontend Architecture",
                true,
                true,
                20,
                9,
                4.91
        );

        List<AlumniProfile> savedAlums = alumniProfileRepository.saveAll(List.of(alum1, alum2, alum3, alum4, alum5));
        AlumniProfile neha = savedAlums.get(0);
        AlumniProfile rishabh = savedAlums.get(1);
        AlumniProfile tanvi = savedAlums.get(2);
        AlumniProfile prateek = savedAlums.get(3);
        AlumniProfile aditi = savedAlums.get(4);

        // 2. Mentorship Slots
        AlumniMentorshipSlot slot1 = new AlumniMentorshipSlot(
                null,
                neha.getId(),
                "Neha Singhal",
                "Google",
                "Google SDE-2 System Design & Scalability Mock",
                "Tomorrow • 5:00 PM IST",
                45,
                "Google Meet",
                "AVAILABLE",
                null,
                null,
                null,
                "https://meet.google.com/setu-alum-g00g1"
        );

        AlumniMentorshipSlot slot2 = new AlumniMentorshipSlot(
                null,
                rishabh.getId(),
                "Rishabh Agarwal",
                "Microsoft",
                "Transitioning to Big Tech Product Management (APM/PM)",
                "Thursday • 6:30 PM IST",
                45,
                "Google Meet",
                "AVAILABLE",
                null,
                null,
                null,
                "https://meet.google.com/setu-alum-msft2"
        );

        AlumniMentorshipSlot slot3 = new AlumniMentorshipSlot(
                null,
                tanvi.getId(),
                "Tanvi Kulkarni",
                "Amazon AWS",
                "AWS Architecture & Cloud-Native Portfolio Review",
                "Friday • 7:00 PM IST",
                45,
                "Google Meet",
                "AVAILABLE",
                null,
                null,
                null,
                "https://meet.google.com/setu-alum-awsk3"
        );

        AlumniMentorshipSlot slot4 = new AlumniMentorshipSlot(
                null,
                prateek.getId(),
                "Prateek Saxena",
                "Zomato",
                "Zomato Backend Scale & High QPS Interview Prep",
                "Saturday • 4:00 PM IST",
                45,
                "Google Meet",
                "BOOKED",
                studentId,
                "Aarav Sharma",
                "Seeking guidance on distributed rate-limiting and Kafka consumer rebalance nuances.",
                "https://meet.google.com/setu-alum-zomt4"
        );

        alumniMentorshipSlotRepository.saveAll(List.of(slot1, slot2, slot3, slot4));

        // 3. Job Referrals
        AlumniJobReferral ref1 = new AlumniJobReferral(
                null,
                neha.getId(),
                "Neha Singhal",
                "Google",
                "Software Engineer II (Cloud Data Platforms)",
                "GOOG-SWE2-2024",
                "Bengaluru, India (Hybrid)",
                "0-2 Years",
                "CGPA > 7.5, strong proficiency in Java, Go or C++, DSA mastery and clean code principles.",
                3,
                1,
                "OPEN",
                "https://careers.google.com/jobs/results/GOOG-SWE2-2024"
        );

        AlumniJobReferral ref2 = new AlumniJobReferral(
                null,
                rishabh.getId(),
                "Rishabh Agarwal",
                "Microsoft",
                "Software Engineer (Azure Core Infrastructure)",
                "MS-AZ-8921",
                "Hyderabad, India",
                "New Grad 2025",
                "B.Tech/M.Tech CSE/IT, strong algorithms, operating systems, and computer network fundamentals.",
                5,
                0,
                "OPEN",
                "https://careers.microsoft.com/us/en/job/MS-AZ-8921"
        );

        AlumniJobReferral ref3 = new AlumniJobReferral(
                null,
                prateek.getId(),
                "Prateek Saxena",
                "Zomato",
                "Senior SDE (Backend Systems - Golang)",
                "ZOM-SDE2-09",
                "Gurugram, India",
                "1-3 Years",
                "Solid production experience in Golang, Redis clustering, and MySQL query optimization.",
                2,
                0,
                "OPEN",
                "https://zomato.com/careers/backend-golang-sde"
        );

        AlumniJobReferral ref4 = new AlumniJobReferral(
                null,
                aditi.getId(),
                "Aditi Menon",
                "Atlassian",
                "Frontend Engineer (Jira Platform)",
                "ATL-UI-4412",
                "Bengaluru, India",
                "0-2 Years",
                "Deep expertise in React, TypeScript, state management, and modern browser rendering performance.",
                2,
                0,
                "OPEN",
                "https://atlassian.com/careers/jira-frontend-eng"
        );

        List<AlumniJobReferral> savedRefs = alumniJobReferralRepository.saveAll(List.of(ref1, ref2, ref3, ref4));

        // 4. Referral Application (Aarav applied for Google)
        AlumniReferralApplication app1 = new AlumniReferralApplication(
                null,
                savedRefs.get(0).getId(),
                studentId,
                "Aarav Sharma",
                "student@careersetu.in",
                "B.Tech Computer Science & Engineering",
                8.75,
                "https://careersetu.in/resumes/aarav-sharma-passport.pdf",
                "https://aaravsharma.dev",
                "Hi Neha Di, I have been building high-concurrency distributed caching systems and hold a top 5% faculty endorsement on CareerSetu. I would be immensely grateful for a referral to the Google Cloud Data team!",
                "REFERRED",
                "Exceptional open-source portfolio and solid systems reasoning. Directly submitted into Google internal Employee Referral portal!"
        );
        alumniReferralApplicationRepository.save(app1);

        // 5. Ask-An-Alum Discussion Posts
        AlumniDiscussionPost post1 = new AlumniDiscussionPost(
                null,
                "Kavya Iyer",
                "STUDENT",
                "3rd Year • CSE",
                "How to prepare for off-campus Google & Microsoft hiring in final year?",
                "Should I focus exclusively on LeetCode contest ratings or also build full-stack deployed systems? How do recruiters screen resumes without on-campus visits?",
                "OFF_CAMPUS_REFERRALS",
                28,
                4,
                "Focus 60% on LeetCode mediums (Graphs, DP, Trees) and 40% on one high-impact deployed system. Having an active open-source contribution or verifiable CareerSetu passport with faculty endorsement will get you past the initial recruiter filter instantly.",
                "Neha Singhal • Google"
        );

        AlumniDiscussionPost post2 = new AlumniDiscussionPost(
                null,
                "Aryan Mehta",
                "STUDENT",
                "4th Year • IT",
                "MS in US/Europe vs. 2 years Indian Big Tech SDE experience?",
                "Debating between applying for Fall 2026 MS programs vs. taking up a return offer at an Indian tech GCC. What offers better long-term career velocity?",
                "HIGHER_STUDIES",
                34,
                6,
                "If your goal is cutting-edge AI/Systems research, an MS thesis is unmatched. However, if your goal is industry engineering velocity and wealth accumulation, 2 years at an Indian top-tier unicorn or GCC with rapid promotions currently offers equivalent or better global mobility.",
                "Rishabh Agarwal • Microsoft"
        );

        AlumniDiscussionPost post3 = new AlumniDiscussionPost(
                null,
                "Rohan Varma",
                "STUDENT",
                "4th Year • CSE",
                "Negotiating your first compensation package as a Tier-2/3 college graduate",
                "When you receive your first offer from a product company, how can students negotiate without the fear of the offer being revoked?",
                "CAREER_GROWTH",
                42,
                8,
                "Politely benchmark using competitive offers or verified platform skills. Emphasize your production readiness, internship contributions, and state clearly what base adjustment would make you sign immediately. Offers are never rescinded for respectful, data-backed negotiation.",
                "Prateek Saxena • Zomato"
        );

        alumniDiscussionPostRepository.saveAll(List.of(post1, post2, post3));

        log.info("Phase 10 Alumni Network data seeded: 5 Alumni, 4 Slots, 4 Referrals, 1 Active Application, 3 AMA Threads.");
    }

    private void seedComplianceIfEmpty(String defaultPasswordHash) {
        if (mandatoryInternshipRepository.count() > 0) {
            return;
        }

        log.info("Seeding Phase 11 AICTE Mandatory Internships & DPDP Compliance Ecosystem data...");

        // 1. Ensure Compliance Officer account exists
        User complianceUser = userRepository.findByEmail("compliance@careersetu.in").orElseGet(() -> {
            User u = User.builder()
                    .email("compliance@careersetu.in")
                    .fullName("Adv. Rajeshwar Rao")
                    .displayName("Adv. Rajeshwar Rao")
                    .passwordHash(defaultPasswordHash)
                    .primaryRole(User.UserRole.COMPLIANCE_OFFICER)
                    .accountStatus(User.AccountStatus.ACTIVE)
                    .emailVerified(true)
                    .mobileVerified(true)
                    .build();
            return userRepository.save(u);
        });

        User studentUser = userRepository.findByEmail("student@careersetu.in").orElse(null);
        UUID studentId = studentUser != null ? studentUser.getId() : UUID.randomUUID();
        Company techCorp = companyRepository.findAll().stream().findFirst().orElse(null);
        UUID companyId = techCorp != null ? techCorp.getId() : UUID.randomUUID();

        // 2. Mandatory Internships
        MandatoryInternship intern1 = new MandatoryInternship(
                null,
                studentId,
                "Aarav Sharma",
                "22CSE041",
                companyId,
                "TechCorp India",
                "Full Stack AI Software Engineer Intern",
                "AICTE_NEP_MANDATORY",
                8,
                160,
                320,
                35000,
                true,
                "Deepak Patel",
                "deepak.patel@techcorp.in",
                "APPROVED",
                "Dr. Meenakshi Sundaram",
                "APPROVED",
                "IN_PROGRESS",
                null,
                LocalDate.now().minusWeeks(4),
                LocalDate.now().plusWeeks(12)
        );
        intern1 = mandatoryInternshipRepository.save(intern1);

        // 3. Weekly Logbook entries for Aarav
        InternshipLogbookEntry log1 = new InternshipLogbookEntry(
                null,
                intern1.getId(),
                1,
                "Week 1: Core Architecture & Setup",
                "Completed enterprise architecture onboarding, local microservice environment setup with Docker, and Git branching guidelines.",
                "Docker, Git, Spring Boot 3",
                40,
                "SUPERVISOR_APPROVED",
                "Exceptional ramp-up speed and proactive setup questions."
        );
        InternshipLogbookEntry log2 = new InternshipLogbookEntry(
                null,
                intern1.getId(),
                2,
                "Week 2: Idempotent REST APIs",
                "Designed and implemented idempotent REST APIs for student verification using Spring Data JPA and Hibernate.",
                "Java, Spring Data JPA, PostgreSQL",
                40,
                "SUPERVISOR_APPROVED",
                "High quality unit tests and clean code conventions maintained."
        );
        InternshipLogbookEntry log3 = new InternshipLogbookEntry(
                null,
                intern1.getId(),
                3,
                "Week 3: Redis Distributed Caching",
                "Integrated Redis distributed caching for session management and optimized database query execution plans.",
                "Redis, PostgreSQL Query Optimization",
                40,
                "SUPERVISOR_APPROVED",
                "Significant p99 latency improvements observed in benchmark testing."
        );
        InternshipLogbookEntry log4 = new InternshipLogbookEntry(
                null,
                intern1.getId(),
                4,
                "Week 4: Kafka Event Streams",
                "Constructed asynchronous event pipeline using Spring Events and Kafka consumer groups for audit logging.",
                "Apache Kafka, Event Driven Architecture",
                40,
                "SUBMITTED",
                null
        );
        internshipLogbookEntryRepository.saveAll(List.of(log1, log2, log3, log4));

        // 4. Completed Internship with Dual Sign-Off & SHA-256 seal
        MandatoryInternship intern2 = new MandatoryInternship(
                null,
                UUID.randomUUID(),
                "Divya Nair",
                "22AI055",
                companyId,
                "TechCorp India",
                "AI & LLM Systems Engineer Intern",
                "AICTE_NEP_MANDATORY",
                8,
                320,
                320,
                40000,
                true,
                "Dr. Neha Rao",
                "neha.rao@techcorp.in",
                "APPROVED",
                "Dr. Meenakshi Sundaram",
                "APPROVED",
                "COMPLETED",
                "0x8e4c7b2a9d1f30e65c9284fa07b1d39e5684a2f1c8e79b03d528f149bca7e891",
                LocalDate.now().minusWeeks(16),
                LocalDate.now().minusWeeks(1)
        );
        mandatoryInternshipRepository.save(intern2);

        // 5. Statutory Grievance Redressal Tickets (DPDP Act & UGC)
        GrievanceTicket grv1 = new GrievanceTicket(
                null,
                "GRV-2026-0104",
                studentId,
                "Aarav Sharma",
                "student@careersetu.in",
                "STUDENT",
                "DPDP_DATA_ERASURE",
                "HIGH",
                "Request for deletion of obsolete assessment audio transcripts",
                "In accordance with DPDP Act 2023 Section 13, I request complete erasure of third-party interview practice audio records stored during 2024 demo evaluation.",
                "RESOLVED",
                "Data Subject request verified. Transcripts irreversibly purged from cloud bucket and database hash invalidated.",
                "Adv. Rajeshwar Rao",
                Instant.now().plusSeconds(30L * 24 * 3600),
                Instant.now().minusSeconds(86400 * 2)
        );

        GrievanceTicket grv2 = new GrievanceTicket(
                null,
                "GRV-2026-0218",
                UUID.randomUUID(),
                "Priya Sharma",
                "priya.sharma@careersetu.in",
                "STUDENT",
                "STIPEND_DEFAULT",
                "HIGH",
                "Delay in disbursement of February 2026 AICTE minimum internship stipend",
                "Stipend of Rs 28,000 for Feb 2026 has been delayed by 14 days beyond the mandated 7th-day statutory window under AICTE Internship Policy.",
                "UNDER_INVESTIGATION",
                "Notified Employer Finance Desk. Expedited NEFT batch processing scheduled for end of week.",
                "Adv. Rajeshwar Rao",
                Instant.now().plusSeconds(18L * 24 * 3600),
                null
        );

        GrievanceTicket grv3 = new GrievanceTicket(
                null,
                "GRV-2026-0331",
                UUID.randomUUID(),
                "Rahul Kumar",
                "rahul.kumar@careersetu.in",
                "STUDENT",
                "CONSENT_REVOCATION",
                "MEDIUM",
                "Revocation of telemetry sharing consent for partner research consortium",
                "Invoking right to revoke consent for secondary research telemetry sharing while preserving core placement and internship portal functionality.",
                "RESOLVED",
                "Consent ledger updated to OPT_OUT. Third-party research access tokens revoked.",
                "Adv. Rajeshwar Rao",
                Instant.now().plusSeconds(28L * 24 * 3600),
                Instant.now().minusSeconds(86400)
        );
        grievanceTicketRepository.saveAll(List.of(grv1, grv2, grv3));

        // 6. Immutable Compliance Audit Events
        ComplianceAuditEvent evt1 = new ComplianceAuditEvent(
                null,
                "CONSENT_OPT_IN",
                "student@careersetu.in",
                "STUDENT",
                "USER_DATA_VAULT",
                "Student granted informed consent for automated ATS profile matching and AI skill verification.",
                "192.168.1.10"
        );
        ComplianceAuditEvent evt2 = new ComplianceAuditEvent(
                null,
                "STIPEND_VERIFIED",
                "compliance@careersetu.in",
                "COMPLIANCE_OFFICER",
                "INTERNSHIP_STIPEND_REGISTRY",
                "Verified monthly stipend of Rs 35,000 for Aarav Sharma meets AICTE minimum wage/stipend threshold (>= Rs 8,000/mo).",
                "127.0.0.1"
        );
        ComplianceAuditEvent evt3 = new ComplianceAuditEvent(
                null,
                "DUAL_SIGNOFF",
                "faculty@careersetu.in",
                "FACULTY",
                "MANDATORY_INTERNSHIP_CREDIT",
                "Faculty mentor Dr. Meenakshi Sundaram endorsed 8 AICTE credits upon corporate supervisor verification.",
                "192.168.1.45"
        );
        ComplianceAuditEvent evt4 = new ComplianceAuditEvent(
                null,
                "PII_MASKED",
                "system@careersetu.in",
                "PLATFORM_ADMIN",
                "STUDENT_RESUME_BLOB",
                "Redacted Aadhaar number and personal mobile from publicly discoverable candidate preview.",
                "127.0.0.1"
        );
        complianceAuditEventRepository.saveAll(List.of(evt1, evt2, evt3, evt4));

        log.info("Phase 11 Compliance data seeded: 2 Mandatory Internships, 4 Logbook entries, 3 Grievance tickets, 4 Audit events, and Compliance Officer account initialized.");
    }
}
