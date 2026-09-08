# scripts/test_phase11_compliance_backend.ps1
# Automated verification test suite for Phase 11: Government Schemes, AICTE Mandatory Internships & DPDP Compliance

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Phase 11: Mandatory Internships & DPDP Compliance Automated Test Suite" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$BaseUrl = "http://localhost:8080/api/v1"

function Post-Json([string]$url, [hashtable]$bodyObj, [string]$token = "") {
    $json = $bodyObj | ConvertTo-Json -Depth 10 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $headers = @{ "Content-Type" = "application/json; charset=utf-8" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Post -Body $bytes -Headers $headers
}

function Put-Json([string]$url, [hashtable]$bodyObj, [string]$token = "") {
    $json = $bodyObj | ConvertTo-Json -Depth 10 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $headers = @{ "Content-Type" = "application/json; charset=utf-8" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Put -Body $bytes -Headers $headers
}

function Get-Json([string]$url, [string]$token = "") {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Get -Headers $headers
}

# 1. Login as Student
Write-Host "`n[1/12] Authenticating as Student (student@careersetu.in)..." -ForegroundColor Yellow
$studentLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "student@careersetu.in"
    password = "Demo@CareerSetu2024"
}
if (-not $studentLogin.accessToken) { throw "Student authentication failed!" }
$studentToken = $studentLogin.accessToken
Write-Host "Student authenticated successfully. Role: $($studentLogin.user.primaryRole)" -ForegroundColor Green

# 2. Login as Compliance Officer
Write-Host "`n[2/12] Authenticating as Compliance Officer (compliance@careersetu.in)..." -ForegroundColor Yellow
$compLogin = Post-Json "$BaseUrl/auth/login" @{
    email = "compliance@careersetu.in"
    password = "Demo@CareerSetu2024"
}
if (-not $compLogin.accessToken) { throw "Compliance Officer authentication failed!" }
$compToken = $compLogin.accessToken
Write-Host "Compliance Officer authenticated. Role: $($compLogin.user.primaryRole)" -ForegroundColor Green

# 3. Student fetches mandatory internships
Write-Host "`n[3/12] Student fetches mandatory academic internships..." -ForegroundColor Yellow
$myInternships = Get-Json "$BaseUrl/internships/my" $studentToken
Write-Host "Found $($myInternships.Count) internship(s) for student." -ForegroundColor Green
$activeIntern = $myInternships[0]
Write-Host "  Title: $($activeIntern.internshipTitle) at $($activeIntern.companyName)"
Write-Host "  Track: $($activeIntern.track), Credits: $($activeIntern.requiredCredits)"
Write-Host "  Hours: $($activeIntern.completedHours)/$($activeIntern.totalRequiredHours) hrs, Stipend: Rs $($activeIntern.monthlyStipend) (Compliant: $($activeIntern.stipendCompliant))"
Write-Host "  Supervisor: $($activeIntern.corporateSupervisorName) [$($activeIntern.corporateSupervisorStatus)], Faculty: $($activeIntern.facultyMentorName) [$($activeIntern.facultyMentorStatus)]"

if ($activeIntern.requiredCredits -ne 8) { throw "Expected 8 credits!" }
if ($activeIntern.stipendCompliant -ne $true) { throw "Expected stipend to be compliant!" }

# 4. Student fetches logbook entries
Write-Host "`n[4/12] Student fetches weekly logbook entries..." -ForegroundColor Yellow
$logEntries = Get-Json "$BaseUrl/internships/$($activeIntern.id)/logbook" $studentToken
Write-Host "Retrieved $($logEntries.Count) weekly logbook entries." -ForegroundColor Green
foreach ($entry in $logEntries) {
    Write-Host "  - Week $($entry.weekNumber) ($($entry.hoursLogged) hrs): $($entry.weekRange) [Status: $($entry.status)]"
}
if ($logEntries.Count -lt 4) { throw "Expected at least 4 seeded logbook entries!" }

# 5. Student submits Week 5 logbook entry
Write-Host "`n[5/12] Student submits Week 5 milestone logbook entry..." -ForegroundColor Yellow
$newLog = Post-Json "$BaseUrl/internships/$($activeIntern.id)/logbook" @{
    weekNumber = 5
    weekRange = "Week 5: Distributed Caching & Audit Event Streams"
    tasksCompleted = "Implemented SHA-256 digital certificate sealing and automated 30-day statutory SLA countdown validation."
    skillsApplied = "Spring Data JPA, PostgreSQL, DPDP Act Compliance"
    hoursLogged = 40
} $studentToken
Write-Host "Successfully submitted Week $($newLog.weekNumber) entry. Status: $($newLog.status)" -ForegroundColor Green

# Verify hours incremented
$updatedIntern = Get-Json "$BaseUrl/internships/$($activeIntern.id)" $studentToken
Write-Host "Updated completed hours: $($updatedIntern.completedHours) hrs (incremented by 40)" -ForegroundColor Green
if ($updatedIntern.completedHours -ne ($activeIntern.completedHours + 40)) {
    throw "Hours not incremented correctly!"
}

# 6. Faculty / Supervisor dual sign-off
Write-Host "`n[6/12] Corporate Supervisor submits dual sign-off approval..." -ForegroundColor Yellow
$signedIntern = Post-Json "$BaseUrl/internships/$($activeIntern.id)/sign-off" @{
    roleType = "SUPERVISOR"
    approved = $true
    remarks = "All milestone engineering deliverables verified and unit test coverage >= 90%."
} $studentToken
Write-Host "Corporate Supervisor status: $($signedIntern.corporateSupervisorStatus)" -ForegroundColor Green

# 7. Student checks statutory grievances
Write-Host "`n[7/12] Student views statutory grievance tickets..." -ForegroundColor Yellow
$myGrievances = Get-Json "$BaseUrl/grievances/my" $studentToken
Write-Host "Student has $($myGrievances.Count) grievance ticket(s)." -ForegroundColor Green
foreach ($grv in $myGrievances) {
    Write-Host "  - [$($grv.ticketNumber)] $($grv.category): $($grv.subject) [Status: $($grv.status)]"
}
if ($myGrievances.Count -lt 1) { throw "Expected at least 1 grievance ticket for student!" }

# 8. Student files new DPDP grievance ticket
Write-Host "`n[8/12] Student files new statutory grievance under DPDP Act 2023..." -ForegroundColor Yellow
$newGrv = Post-Json "$BaseUrl/grievances" @{
    category = "CONSENT_REVOCATION"
    priority = "HIGH"
    subject = "Revocation of telemetry sharing with third-party skill analytics vendor"
    description = "Under DPDP Act Section 13, I revoke explicit consent for sharing assessment telemetry with external evaluation partners."
} $studentToken
Write-Host "Filed new ticket: $($newGrv.ticketNumber)" -ForegroundColor Green
Write-Host "  Category: $($newGrv.category), Priority: $($newGrv.priority)"
Write-Host "  Statutory SLA Deadline: $($newGrv.slaDeadline)"
if (-not $newGrv.ticketNumber.StartsWith("GRV-")) { throw "Invalid ticket number format!" }

# 9. Compliance Officer views all grievances
Write-Host "`n[9/12] Compliance Officer views all grievance tickets across the platform..." -ForegroundColor Yellow
$allGrvs = Get-Json "$BaseUrl/grievances" $compToken
Write-Host "Total platform grievances: $($allGrvs.Count)" -ForegroundColor Green
if ($allGrvs.Count -lt 4) { throw "Expected at least 4 grievances in total!" }

# 10. Compliance Officer adjudicates a grievance
Write-Host "`n[10/12] Compliance Officer adjudicates and resolves ticket $($newGrv.ticketNumber)..." -ForegroundColor Yellow
$resolvedGrv = Put-Json "$BaseUrl/grievances/$($newGrv.id)/status" @{
    status = "RESOLVED"
    resolutionRemarks = "Consent ledger updated. Data Subject access tokens for third-party analytics revoked and purged."
} $compToken
Write-Host "Ticket $($resolvedGrv.ticketNumber) updated to: $($resolvedGrv.status)" -ForegroundColor Green
Write-Host "  Resolved by: $($resolvedGrv.resolvedByOfficer)"
Write-Host "  Resolution remarks: $($resolvedGrv.resolutionRemarks)"
if ($resolvedGrv.status -ne "RESOLVED") { throw "Grievance not resolved!" }

# 11. Compliance Officer fetches dashboard stats
Write-Host "`n[11/12] Compliance Officer fetches compliance dashboard overview..." -ForegroundColor Yellow
$stats = Get-Json "$BaseUrl/compliance/stats" $compToken
Write-Host "Compliance Dashboard Statistics:" -ForegroundColor Green
Write-Host "  - Total Mandatory Internships: $($stats.totalMandatoryInternships)"
Write-Host "  - Completed Dual Sign-Offs: $($stats.completedDualSignOffs)"
Write-Host "  - Stipend Compliance Rate: $($stats.stipendComplianceRatePct)%"
Write-Host "  - Total Grievances: $($stats.totalGrievances)"
Write-Host "  - Open Grievances: $($stats.openGrievances)"
Write-Host "  - Resolved Grievances: $($stats.resolvedGrievances)"
Write-Host "  - Total Audit Events: $($stats.totalAuditEvents)"
if ($stats.totalMandatoryInternships -lt 2) { throw "Expected at least 2 mandatory internships!" }

# 12. Compliance Officer fetches immutable audit trail
Write-Host "`n[12/12] Compliance Officer reviews immutable compliance audit log..." -ForegroundColor Yellow
$auditLog = Get-Json "$BaseUrl/compliance/audit" $compToken
Write-Host "Retrieved $($auditLog.Count) audit trail records." -ForegroundColor Green
foreach ($evt in $auditLog | Select-Object -First 5) {
    Write-Host "  - [$($evt.timestamp)] $($evt.eventType): $($evt.targetResource) by $($evt.actorEmail) ($($evt.actorRole))"
}
if ($auditLog.Count -lt 4) { throw "Expected at least 4 audit events!" }

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "ALL PHASE 11 COMPLIANCE & AICTE INTERNSHIP TESTS PASSED (12/12)! 100%" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
