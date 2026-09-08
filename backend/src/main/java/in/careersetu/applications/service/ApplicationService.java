package in.careersetu.applications.service;

import in.careersetu.applications.dto.ApplicationDtos;
import in.careersetu.applications.entity.Application;
import in.careersetu.applications.repository.ApplicationRepository;
import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              OpportunityRepository opportunityRepository,
                              StudentProfileRepository studentProfileRepository,
                              CompanyRepository companyRepository,
                              UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    private StudentProfile getOrCreateProfile(UUID userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUserId(userId);
                    p.setHeadline("Engineering Student");
                    p.setProfileCompletionPct(60);
                    p.setIsActivelyLooking(true);
                    return studentProfileRepository.save(p);
                });
    }

    public Application apply(UUID userId, UUID opportunityId, String coverNote) {
        StudentProfile profile = getOrCreateProfile(userId);

        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> CareerSetuException.notFound("OPPORTUNITY", opportunityId.toString()));

        if (applicationRepository.existsByOpportunityIdAndStudentProfileId(opportunityId, profile.getId())) {
            throw CareerSetuException.conflict("ALREADY_APPLIED", "You have already applied for this opportunity.");
        }

        Application app = new Application();
        app.setOpportunityId(opportunityId);
        app.setStudentProfileId(profile.getId());
        app.setCoverNote(coverNote);
        app.setStatus("APPLIED");
        app.setMatchScore(BigDecimal.valueOf(88.0));
        app.setAiExplanation("Demonstrated strong technical background with relevant project work.");

        opp.setApplicationsCount((opp.getApplicationsCount() != null ? opp.getApplicationsCount() : 0) + 1);
        opportunityRepository.save(opp);

        return applicationRepository.save(app);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.StudentApplicationResponse> getStudentApplications(UUID userId) {
        StudentProfile profile = getOrCreateProfile(userId);
        List<Application> apps = applicationRepository.findByStudentProfileIdOrderByAppliedAtDesc(profile.getId());

        return apps.stream().map(app -> {
            Opportunity opp = opportunityRepository.findById(app.getOpportunityId()).orElse(null);
            Company comp = (opp != null && opp.getCompanyId() != null) 
                    ? companyRepository.findById(opp.getCompanyId()).orElse(null) 
                    : null;

            return new ApplicationDtos.StudentApplicationResponse(
                    app.getId(),
                    app.getOpportunityId(),
                    opp != null ? opp.getTitle() : "Opportunity",
                    comp != null ? comp.getLegalName() : "Partner Company",
                    comp != null ? (comp.getBrandName() != null ? comp.getBrandName() : comp.getLegalName()) : "Partner Company",
                    opp != null ? opp.getType() : "INTERNSHIP",
                    opp != null ? opp.getWorkMode() : "HYBRID",
                    opp != null ? opp.getLocationCity() : "India",
                    opp != null ? opp.getLocationState() : "",
                    opp != null ? opp.getStipendMin() : null,
                    opp != null ? opp.getStipendMax() : null,
                    opp != null ? opp.getSalaryMin() : null,
                    opp != null ? opp.getSalaryMax() : null,
                    app.getStatus(),
                    app.getCoverNote(),
                    app.getMatchScore(),
                    app.getAiExplanation(),
                    app.getAppliedAt(),
                    app.getLastActivityAt()
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.OpportunityApplicantResponse> getOpportunityApplications(UUID opportunityId) {
        Opportunity opp = opportunityRepository.findById(opportunityId).orElse(null);
        String oppTitle = opp != null ? opp.getTitle() : "Opportunity";
        List<Application> apps = applicationRepository.findByOpportunityIdOrderByAppliedAtDesc(opportunityId);

        return apps.stream().map(app -> mapToOpportunityApplicantResponse(app, opportunityId, oppTitle)).toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.OpportunityApplicantResponse> getAllApplications() {
        List<Application> apps = applicationRepository.findAllByOrderByAppliedAtDesc();

        return apps.stream().map(app -> {
            Opportunity opp = opportunityRepository.findById(app.getOpportunityId()).orElse(null);
            String oppTitle = opp != null ? opp.getTitle() : "Opportunity";
            return mapToOpportunityApplicantResponse(app, app.getOpportunityId(), oppTitle);
        }).toList();
    }

    private ApplicationDtos.OpportunityApplicantResponse mapToOpportunityApplicantResponse(
            Application app, UUID opportunityId, String oppTitle) {
        StudentProfile profile = studentProfileRepository.findById(app.getStudentProfileId()).orElse(null);
        User user = (profile != null && profile.getUserId() != null)
                ? userRepository.findById(profile.getUserId()).orElse(null)
                : null;

        return new ApplicationDtos.OpportunityApplicantResponse(
                app.getId(),
                opportunityId,
                oppTitle,
                app.getStudentProfileId(),
                user != null ? user.getFullName() : "Applicant",
                user != null ? user.getEmail() : "",
                profile != null ? profile.getHeadline() : "",
                profile != null ? profile.getCurrentYear() : null,
                profile != null ? profile.getCgpa() : null,
                app.getStatus(),
                app.getCoverNote(),
                app.getMatchScore(),
                app.getAiExplanation(),
                app.getAppliedAt(),
                app.getLastActivityAt()
        );
    }

    public Application updateStatus(UUID applicationId, String newStatus) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> CareerSetuException.notFound("APPLICATION", applicationId.toString()));
        app.setStatus(newStatus.toUpperCase());
        app.setLastActivityAt(Instant.now());
        return applicationRepository.save(app);
    }
}
