package in.careersetu.opportunities.service;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final CompanyRepository companyRepository;

    public OpportunityService(OpportunityRepository opportunityRepository, CompanyRepository companyRepository) {
        this.opportunityRepository = opportunityRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<Opportunity> searchOpportunities(String query, String type, String workMode) {
        return opportunityRepository.searchOpportunities(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (type != null && !type.isBlank()) ? type.trim() : null,
                (workMode != null && !workMode.isBlank()) ? workMode.trim() : null
        );
    }

    @Transactional(readOnly = true)
    public Opportunity getOpportunityById(UUID id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> CareerSetuException.notFound("OPPORTUNITY", id.toString()));
        opp.setViewsCount(opp.getViewsCount() + 1);
        opportunityRepository.save(opp);
        return opp;
    }

    public Opportunity createOpportunity(Opportunity opportunity, UUID userId) {
        if (opportunity.getPostedBy() == null && userId != null) {
            opportunity.setPostedBy(userId);
        }
        if (opportunity.getCompanyId() == null) {
            List<Company> companies = companyRepository.findAll();
            if (!companies.isEmpty()) {
                opportunity.setCompanyId(companies.get(0).getId());
            }
        }
        if (opportunity.getSlug() == null && opportunity.getTitle() != null) {
            opportunity.setSlug(opportunity.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + (System.currentTimeMillis() % 10000));
        }
        if (opportunity.getApplicationDeadline() == null) {
            opportunity.setApplicationDeadline(LocalDate.now().plusMonths(2));
        }
        if (opportunity.getStatus() == null) {
            opportunity.setStatus("PUBLISHED");
        }
        if (opportunity.getCurrency() == null) {
            opportunity.setCurrency("INR");
        }
        if (opportunity.getWorkMode() == null) {
            opportunity.setWorkMode("HYBRID");
        }
        if (opportunity.getType() == null) {
            opportunity.setType("INTERNSHIP");
        }
        return opportunityRepository.save(opportunity);
    }

    public Opportunity closeOpportunity(UUID id) {
        Opportunity opp = getOpportunityById(id);
        opp.setStatus("CLOSED");
        return opportunityRepository.save(opp);
    }

    @Transactional(readOnly = true)
    public List<Opportunity> getOpportunitiesByCompany(UUID companyId) {
        return opportunityRepository.findByCompanyId(companyId);
    }
}
