# scripts/test_phase13_accreditation_backend.ps1
# Automated verification test suite for Phase 13: NIRF, NAAC & NBA Institutional Accreditation & Placement Audit Engine

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  CAREERSETU PHASE 13 AUTOMATED BACKEND INTEGRATION SUITE             " -ForegroundColor Cyan
Write-Host "  NIRF, NAAC & NBA Institutional Accreditation & Audit Engine         " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$BaseUrl = "http://localhost:8080/api/v1"
$passCount = 0
$failCount = 0

function Assert-Condition($condition, $message) {
    if ($condition) {
        Write-Host "[PASS] $message" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host "[FAIL] $message" -ForegroundColor Red
        $script:failCount++
    }
}

function Post-Json([string]$url, [hashtable]$bodyObj, [string]$token = "") {
    $json = $bodyObj | ConvertTo-Json -Depth 10 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $headers = @{ "Content-Type" = "application/json; charset=utf-8" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Post -Body $bytes -Headers $headers
}

function Patch-Json([string]$url, [hashtable]$bodyObj, [string]$token = "") {
    $json = $bodyObj | ConvertTo-Json -Depth 10 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $headers = @{ "Content-Type" = "application/json; charset=utf-8" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Patch -Body $bytes -Headers $headers
}

function Get-Json([string]$url, [string]$token = "") {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Get -Headers $headers
}

# 1. Login Institution Admin
Write-Host "`n1. Authenticating Institution Admin (admin@careersetu.in)..." -ForegroundColor Yellow
$adminLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "admin@careersetu.in"
    password = "Demo@CareerSetu2024"
}
$adminToken = $adminLogin.accessToken
Assert-Condition ($adminToken -ne $null) "Admin authenticated successfully (Role: $($adminLogin.user.primaryRole))"

# 2. Login Student
Write-Host "`n2. Authenticating Student (student@careersetu.in)..." -ForegroundColor Yellow
$studentLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "student@careersetu.in"
    password = "Demo@CareerSetu2024"
}
$studentToken = $studentLogin.accessToken
Assert-Condition ($studentToken -ne $null) "Student authenticated successfully"

# 3. Test Latest Accreditation Report & NIRF Score
Write-Host "`n3. Testing Latest Accreditation Report & NIRF GO Score..." -ForegroundColor Yellow
$report = Get-Json "$BaseUrl/accreditation/report/latest" $adminToken
Assert-Condition ($report.institutionName.Contains("National Institute of Technology")) "Institution: $($report.institutionName)"
Assert-Condition ($report.academicYear -eq "2025-26") "Academic Year: $($report.academicYear)"
Assert-Condition ($report.nirfGoScore -eq 84.6) "NIRF Graduation Outcome (GO) Score: $($report.nirfGoScore)"
Assert-Condition ($report.totalGraduatingBatch -eq 850) "Total Graduating Batch: $($report.totalGraduatingBatch)"
Assert-Condition ($report.totalPlaced -eq 742) "Total Placed Students: $($report.totalPlaced)"
Assert-Condition ($report.medianSalaryLpa -eq 14.5) "Median Salary: ₹$($report.medianSalaryLpa) LPA"
Assert-Condition ($report.naacPlacementRatio -ge 87.0) "NAAC Metric 5.2.1 Ratio: $($report.naacPlacementRatio)%"
Assert-Condition ($report.auditStatus -eq "IQAC_VERIFIED") "Audit Status: $($report.auditStatus)"

# 4. Test Department-wise NBA Criterion 4 Metrics
Write-Host "`n4. Testing Department-wise NBA Criterion 4 Program Metrics..." -ForegroundColor Yellow
$departments = Get-Json "$BaseUrl/accreditation/departments" $adminToken
Assert-Condition ($departments.Count -ge 4) "Found $($departments.Count) engineering department breakdowns"
$cse = $departments | Where-Object { $_.department -eq "Computer Science & Engineering" } | Select-Object -First 1
Assert-Condition ($cse -ne $null) "CSE Department metrics present"
Assert-Condition ($cse.nbaPlacementScore -ge 38.0) "CSE NBA Placement Score: $($cse.nbaPlacementScore) / 40.0"
Assert-Condition ($cse.medianPackageLpa -ge 18.0) "CSE Median CTC: ₹$($cse.medianPackageLpa) LPA"
Assert-Condition ($cse.coreSectorPlacedPercentage -ge 80.0) "CSE Core Sector Placement: $($cse.coreSectorPlacedPercentage)%"

# 5. Test NAAC Criterion 5.2 Student Progression Records
Write-Host "`n5. Testing NAAC Criterion 5.2 Student Progression Evidence Vault..." -ForegroundColor Yellow
$records = Get-Json "$BaseUrl/accreditation/progression-records" $adminToken
Assert-Condition ($records.Count -ge 8) "Found $($records.Count) verifiable student progression records"
$firstRecord = $records[0]
$recordId = $firstRecord.id
Assert-Condition ($firstRecord.studentName -ne $null) "Student Name: $($firstRecord.studentName) (Roll: $($firstRecord.rollNumber))"
Assert-Condition ($firstRecord.organizationOrUniversity -ne $null) "Organization: $($firstRecord.organizationOrUniversity)"
Assert-Condition ($firstRecord.proofDocumentUrl -ne $null) "Proof Document: $($firstRecord.proofDocumentUrl)"

# 6. Test TPO Offer Letter Verification
Write-Host "`n6. Testing Digital Offer Letter Verification by TPO..." -ForegroundColor Yellow
$verifiedRecord = Patch-Json "$BaseUrl/accreditation/progression-records/$recordId/verify" @{
    status = "VERIFIED_BY_TPO"
    remarks = "Offer letter and appointment letter verified against corporate HR registry."
} $adminToken
Assert-Condition ($verifiedRecord.verificationStatus -eq "VERIFIED_BY_TPO") "Updated Verification Status: $($verifiedRecord.verificationStatus)"
Assert-Condition ($verifiedRecord.verifiedAt -ne $null) "Verification Timestamp: $($verifiedRecord.verifiedAt)"

# 7. Test Interactive What-If NIRF Simulation
Write-Host "`n7. Testing Real-time What-If NIRF Ranking Simulator..." -ForegroundColor Yellow
$simPayload = @{
    projectedAdditionalOffers = 30
    projectedMedianSalaryLpa = 17.5
    higherStudiesTarget = 90
}
$simulation = Post-Json "$BaseUrl/accreditation/simulate" $simPayload $adminToken
Assert-Condition ($simulation.currentGoScore -gt 0) "Current NIRF GO Score: $($simulation.currentGoScore)"
Assert-Condition ($simulation.projectedGoScore -gt $simulation.currentGoScore) "Projected NIRF GO Score: $($simulation.projectedGoScore)"
Assert-Condition ($simulation.projectedRankBand -ne $null) "Projected Rank Band: $($simulation.projectedRankBand)"
Assert-Condition ($simulation.gphDelta -gt 0) "GPH Placement Delta: +$($simulation.gphDelta) pts"
Assert-Condition ($simulation.gmsDelta -gt 0) "GMS Salary Delta: +$($simulation.gmsDelta) pts"
Assert-Condition ($simulation.recommendationText.Contains("Graduation Outcome")) "Strategic Recommendation: $($simulation.recommendationText.Substring(0, 70))..."

# 8. Test NIRF Data Capturing System (DCS) Export
Write-Host "`n8. Testing NIRF Data Capturing System (DCS) Official Export..." -ForegroundColor Yellow
$dcsExport = Get-Json "$BaseUrl/accreditation/export/nirf-dcs?academicYear=2025-26" $adminToken
Assert-Condition ($dcsExport.institutionCode -eq "NIRF-ENGG-KA-0012") "NIRF Institution Code: $($dcsExport.institutionCode)"
Assert-Condition ($dcsExport.naacGradePredicted.Contains("A++")) "Predicted NAAC Grade: $($dcsExport.naacGradePredicted)"
Assert-Condition ($dcsExport.departmentBreakdowns.Count -ge 4) "Department Breakdown Records: $($dcsExport.departmentBreakdowns.Count)"

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "PHASE 13 SUITE RESULTS: $passCount PASSED, $failCount FAILED" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host "======================================================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    exit 1
}
