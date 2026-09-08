package in.careersetu.companies.controller;

import in.careersetu.companies.entity.Company;
import in.careersetu.companies.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@Tag(name = "Companies", description = "Verified employer registry, GSTIN verification, and industry profiles")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/public")
    @Operation(summary = "List verified hiring companies")
    public ResponseEntity<List<Company>> getVerifiedCompanies() {
        return ResponseEntity.ok(companyService.getVerifiedCompanies());
    }

    @GetMapping("/primary")
    @Operation(summary = "Get primary employer company profile")
    public ResponseEntity<Company> getPrimaryCompany() {
        return ResponseEntity.ok(companyService.getPrimaryCompany());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<Company> getCompanyById(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping("/{id}/verify-gstin")
    @Operation(summary = "Verify Indian GSTIN / MCA CIN corporate identity")
    public ResponseEntity<Map<String, Object>> verifyGstin(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String gstin = body.get("gstin");
        String cin = body.get("cin");
        return ResponseEntity.ok(companyService.verifyGstin(id, gstin, cin));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update corporate profile details")
    public ResponseEntity<Company> updateCompany(
            @PathVariable UUID id,
            @RequestBody Company update) {
        return ResponseEntity.ok(companyService.updateCompany(id, update));
    }
}
