# scripts/test_phase12_apprenticeships_backend.ps1
# Automated verification test suite for Phase 12: NATS 2.0, DBT Stipend Ledger & APAAR / ABC Digilocker

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  CAREERSETU PHASE 12 AUTOMATED BACKEND INTEGRATION SUITE             " -ForegroundColor Cyan
Write-Host "  NATS 2.0, DBT Stipend Ledger & APAAR / ABC Digilocker Synchronization" -ForegroundColor Cyan
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

# 1. Login Student Aarav Sharma
Write-Host "`n1. Authenticating Student (student@careersetu.in)..." -ForegroundColor Yellow
$studentLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "student@careersetu.in"
    password = "Demo@CareerSetu2024"
}
$studentToken = $studentLogin.accessToken
$studentId = $studentLogin.user.id
Assert-Condition ($studentToken -ne $null) "Student logged in successfully (ID: $studentId)"

# 2. Login Employer
Write-Host "`n2. Authenticating Employer (employer@careersetu.in)..." -ForegroundColor Yellow
$empLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "employer@careersetu.in"
    password = "Demo@CareerSetu2024"
}
$empToken = $empLogin.accessToken
$employerId = $empLogin.user.id
Assert-Condition ($empToken -ne $null) "Employer logged in successfully (ID: $employerId)"

# 3. Test APAAR ID Overview
Write-Host "`n3. Testing APAAR / ABC DigiLocker Overview..." -ForegroundColor Yellow
$apaarOverview = Get-Json "$BaseUrl/apprenticeships/apaar/student/$studentId" $studentToken
Assert-Condition ($apaarOverview.apaarId -eq "APAAR-9182-4412-8809") "APAAR ID verified: $($apaarOverview.apaarId)"
Assert-Condition ($apaarOverview.isDigilockerVerified -eq $true) "DigiLocker verification status: $($apaarOverview.isDigilockerVerified)"
Assert-Condition ($apaarOverview.totalCreditsEarned -ge 28) "ABC Credits Earned: $($apaarOverview.totalCreditsEarned)"
Assert-Condition ($apaarOverview.records.Count -ge 5) "Accredited course credit records: $($apaarOverview.records.Count)"

# 4. Test Sync ABC Credits
Write-Host "`n4. Testing ABC DigiLocker Credit Sync..." -ForegroundColor Yellow
$syncedOverview = Post-Json "$BaseUrl/apprenticeships/apaar/sync-abc/$studentId" @{} $studentToken
Assert-Condition ($syncedOverview.records.Count -ge 5) "ABC Credits successfully synced with DigiLocker National Academic Depository"

# 5. Test Student NATS Contracts
Write-Host "`n5. Testing NATS 2.0 Apprenticeship Contracts..." -ForegroundColor Yellow
$contracts = Get-Json "$BaseUrl/apprenticeships/contracts/student/$studentId" $studentToken
Assert-Condition ($contracts.Count -ge 1) "Found $($contracts.Count) active NATS contract(s)"
$contract = $contracts[0]
$contractId = $contract.id
Assert-Condition ($contract.contractNumber.StartsWith("NATS-")) "Contract Number: $($contract.contractNumber)"
Assert-Condition ($contract.stipendTotalMonthly -eq 30000) "Total Monthly Stipend: ₹$($contract.stipendTotalMonthly)"
Assert-Condition ($contract.govSubsidyDbtShare -eq 4500) "Govt MoE DBT Subsidy Share: ₹$($contract.govSubsidyDbtShare)"
Assert-Condition ($contract.employerContributionShare -eq 25500) "Industry Employer Share: ₹$($contract.employerContributionShare)"
Assert-Condition ($contract.boatRegion.Contains("BOAT Western Region")) "BOAT Region: $($contract.boatRegion)"

# 6. Test Aadhaar eSign Contract as Student
Write-Host "`n6. Testing Student Digital Signature on Contract..." -ForegroundColor Yellow
$signedStudentContract = Patch-Json "$BaseUrl/apprenticeships/contracts/$contractId/sign" @{
    party = "STUDENT"
    signerName = "Aarav Sharma"
    signerRole = "STUDENT_APPRENTICE"
} $studentToken
Assert-Condition ($signedStudentContract.studentSignedAt -ne $null) "Apprentice digital signature timestamp: $($signedStudentContract.studentSignedAt)"

# 7. Test Digital Signature on Contract as Employer
Write-Host "`n7. Testing Employer Digital Signature on Contract..." -ForegroundColor Yellow
$signedEmpContract = Patch-Json "$BaseUrl/apprenticeships/contracts/$contractId/sign" @{
    party = "EMPLOYER"
    signerName = "TechCorp Authorized Signatory"
    signerRole = "HEAD_OF_UNIVERSITY_RELATIONS"
} $empToken
Assert-Condition ($signedEmpContract.employerSignedAt -ne $null) "Employer digital signature timestamp: $($signedEmpContract.employerSignedAt)"

# 8. Test Contract Disbursements Ledger
Write-Host "`n8. Testing Monthly DBT Stipend Disbursement Ledger..." -ForegroundColor Yellow
$disbursements = Get-Json "$BaseUrl/apprenticeships/disbursements/contract/$contractId" $studentToken
Assert-Condition ($disbursements.Count -ge 3) "Found $($disbursements.Count) monthly stipend disbursement vouchers"
$disbursedVoucher = $disbursements | Where-Object { $_.dbtStatus -eq "DISBURSED_TO_ACCOUNT" } | Select-Object -First 1
Assert-Condition ($disbursedVoucher.govtSubsidyDbtAmount -eq 4500) "Voucher DBT share verified: ₹$($disbursedVoucher.govtSubsidyDbtAmount)"
Assert-Condition ($disbursedVoucher.employerPaidAmount -eq 25500) "Voucher Employer share verified: ₹$($disbursedVoucher.employerPaidAmount)"
Assert-Condition ($disbursedVoucher.dbtStatus -eq "DISBURSED_TO_ACCOUNT") "PFMS status: $($disbursedVoucher.dbtStatus)"

# 9. Test Generating New Monthly DBT Claim
Write-Host "`n9. Testing Monthly DBT Subsidy Claim Submission..." -ForegroundColor Yellow
$newClaim = Post-Json "$BaseUrl/apprenticeships/disbursements/generate-claim" @{
    contractId = $contractId
    monthYear = "April 2026"
    daysAttended = 26
    employerPaidAmount = 15500
} $empToken
Assert-Condition ($newClaim.monthYear -eq "April 2026") "New DBT claim generated for: $($newClaim.monthYear)"
Assert-Condition ($newClaim.govtSubsidyDbtAmount -eq 4500) "Govt DBT subsidy claimed: ₹$($newClaim.govtSubsidyDbtAmount)"
Assert-Condition ($newClaim.cpsmsPaymentId -ne $null) "Assigned CPSMS / PFMS reference: $($newClaim.cpsmsPaymentId)"
Assert-Condition ($newClaim.dbtStatus -eq "CLAIM_SUBMITTED") "Initial claim status: $($newClaim.dbtStatus)"

# 10. Test Student Cumulative Disbursements
Write-Host "`n10. Testing Student Cumulative Disbursements..." -ForegroundColor Yellow
$allStudentDisb = Get-Json "$BaseUrl/apprenticeships/disbursements/student/$studentId" $studentToken
Assert-Condition ($allStudentDisb.Count -ge 4) "Updated student cumulative disbursements count: $($allStudentDisb.Count)"

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "PHASE 12 SUITE RESULTS: $passCount PASSED, $failCount FAILED" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host "======================================================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    exit 1
}
