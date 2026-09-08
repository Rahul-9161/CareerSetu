$baseUrl = "http://localhost:8080"
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )

    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ErrorAction = 'Stop'
            UseBasicParsing = $true
        }
        if ($Body) {
            $params["Body"] = [System.Text.Encoding]::UTF8.GetBytes($Body)
            $params["ContentType"] = "application/json; charset=utf-8"
        }
        if ($Headers.Count -gt 0) {
            $params["Headers"] = $Headers
        }

        $res = Invoke-WebRequest @params
        if ($res.StatusCode -eq $ExpectedStatus) {
            Write-Host "  [PASS] $Name (Status: $($res.StatusCode))" -ForegroundColor Green
            $global:passed++
            return ($res.Content | ConvertFrom-Json)
        } else {
            Write-Host "  [FAIL] $Name (Expected $ExpectedStatus, got $($res.StatusCode))" -ForegroundColor Red
            $global:failed++
            return $null
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  [PASS] $Name (Status: $statusCode)" -ForegroundColor Green
            $global:passed++
        } else {
            Write-Host "  [FAIL] $Name (Error: $($_.Exception.Message))" -ForegroundColor Red
            $global:failed++
        }
        return $null
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " PHASE 10: ALUMNI NETWORK & ALUM-CONNECT BACKEND TEST SUITE " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login as Student and Alumni to get Auth tokens
Write-Host "`n1. Authenticating Demo Users..." -ForegroundColor Yellow
$loginStudentBody = '{"email":"student@careersetu.in","password":"Demo@CareerSetu2024"}'
$studentAuth = Test-Endpoint -Name "Student Login" -Url "$baseUrl/api/v1/auth/login" -Method "POST" -Body $loginStudentBody -ExpectedStatus 200
$studentToken = if ($studentAuth) { $studentAuth.accessToken } else { $null }

$loginAlumniBody = '{"email":"alumni@careersetu.in","password":"Demo@CareerSetu2024"}'
$alumniAuth = Test-Endpoint -Name "Alumni Login" -Url "$baseUrl/api/v1/auth/login" -Method "POST" -Body $loginAlumniBody -ExpectedStatus 200
$alumniToken = if ($alumniAuth) { $alumniAuth.accessToken } else { $null }

$studentHeaders = @{ "Authorization" = "Bearer $studentToken" }
$alumniHeaders = @{ "Authorization" = "Bearer $alumniToken" }

# 2. Stats
Write-Host "`n2. Alumni Network Aggregate Statistics..." -ForegroundColor Yellow
$stats = Test-Endpoint -Name "GET /api/v1/alumni/stats" -Url "$baseUrl/api/v1/alumni/stats"
if ($stats) {
    Write-Host "     Total Alumni: $($stats.totalAlumni), Active Mentors: $($stats.activeMentors), Open Referrals: $($stats.openReferrals)" -ForegroundColor Gray
}

# 3. Directory
Write-Host "`n3. Alumni Network Directory & Search..." -ForegroundColor Yellow
$directory = Test-Endpoint -Name "GET /api/v1/alumni/directory" -Url "$baseUrl/api/v1/alumni/directory"
$searchGoogle = Test-Endpoint -Name "GET /api/v1/alumni/directory?search=Google" -Url "$baseUrl/api/v1/alumni/directory?search=Google"

$firstAlum = if ($directory -and $directory.Count -gt 0) { $directory[0] } else { $null }
if ($firstAlum) {
    $profile = Test-Endpoint -Name "GET /api/v1/alumni/profile/{id}" -Url "$baseUrl/api/v1/alumni/profile/$($firstAlum.id)"
}

# 4. Mentorship Slots
Write-Host "`n4. 1:1 Mentorship Availability Slots..." -ForegroundColor Yellow
$slots = Test-Endpoint -Name "GET /api/v1/alumni/slots" -Url "$baseUrl/api/v1/alumni/slots"
$availSlots = Test-Endpoint -Name "GET /api/v1/alumni/slots?status=AVAILABLE" -Url "$baseUrl/api/v1/alumni/slots?status=AVAILABLE"

$newSlotBody = '{"topic":"Mock Coding Interview on Graph Algorithms","slotTime":"Sunday - 6:00 PM IST","durationMinutes":45}'
$createdSlot = Test-Endpoint -Name "POST /api/v1/alumni/slots" -Url "$baseUrl/api/v1/alumni/slots" -Method "POST" -Body $newSlotBody -Headers $alumniHeaders -ExpectedStatus 201

if ($createdSlot) {
    $bookBody = '{"studentName":"Aarav Sharma","bookingNotes":"Preparing for upcoming super-dream off-campus rounds."}'
    $booked = Test-Endpoint -Name "POST /api/v1/alumni/slots/{id}/book" -Url "$baseUrl/api/v1/alumni/slots/$($createdSlot.id)/book" -Method "POST" -Body $bookBody -Headers $studentHeaders -ExpectedStatus 200
}

# 5. Job Referrals
Write-Host "`n5. Internal Employee Job Referrals..." -ForegroundColor Yellow
$referrals = Test-Endpoint -Name "GET /api/v1/alumni/referrals" -Url "$baseUrl/api/v1/alumni/referrals"
$googleRefs = Test-Endpoint -Name "GET /api/v1/alumni/referrals?company=Google" -Url "$baseUrl/api/v1/alumni/referrals?company=Google"

$newRefBody = '{"company":"Google","jobTitle":"Software Engineer III (Core Search Infrastructure)","jobCode":"GOOG-SRCH-991","location":"Bengaluru, India","experienceLevel":"2-4 Years","minEligibility":"CGPA > 8.0, deep systems coding experience"}'
$createdRef = Test-Endpoint -Name "POST /api/v1/alumni/referrals" -Url "$baseUrl/api/v1/alumni/referrals" -Method "POST" -Body $newRefBody -Headers $alumniHeaders -ExpectedStatus 201

if ($createdRef) {
    $applyBody = '{"studentName":"Aarav Sharma","studentEmail":"student@careersetu.in","studentBranch":"B.Tech CSE","studentCgpa":8.75,"noteToAlumni":"I have built high concurrency caches and would love an opportunity on Core Search."}'
    $applied = Test-Endpoint -Name "POST /api/v1/alumni/referrals/{id}/apply" -Url "$baseUrl/api/v1/alumni/referrals/$($createdRef.id)/apply" -Method "POST" -Body $applyBody -Headers $studentHeaders -ExpectedStatus 201

    $apps = Test-Endpoint -Name "GET /api/v1/alumni/referrals/{id}/applications" -Url "$baseUrl/api/v1/alumni/referrals/$($createdRef.id)/applications" -Headers $alumniHeaders

    if ($apps -and $apps.Count -gt 0) {
        $statusUpdateBody = '{"status":"REFERRED","feedback":"Strong portfolio verified via Career Passport. Submitted to internal ATS!"}'
        $updated = Test-Endpoint -Name "PATCH /api/v1/alumni/referrals/applications/{id}/status" -Url "$baseUrl/api/v1/alumni/referrals/applications/$($apps[0].id)/status" -Method "PATCH" -Body $statusUpdateBody -Headers $alumniHeaders -ExpectedStatus 200
    }
}

# 6. Ask-An-Alum AMA Discussions
Write-Host "`n6. Ask-An-Alum Community Discussions..." -ForegroundColor Yellow
$discussions = Test-Endpoint -Name "GET /api/v1/alumni/discussions" -Url "$baseUrl/api/v1/alumni/discussions"

$newDiscBody = '{"title":"How to optimize resumes for automated ATS keywords?","content":"Do recruiters actually parse PDF formats or is plain text preferred?","category":"INTERVIEW_PREP","authorName":"Aarav Sharma","authorRole":"STUDENT","companyOrBranch":"4th Year CSE"}'
$createdDisc = Test-Endpoint -Name "POST /api/v1/alumni/discussions" -Url "$baseUrl/api/v1/alumni/discussions" -Method "POST" -Body $newDiscBody -Headers $studentHeaders -ExpectedStatus 201

if ($createdDisc) {
    $pinAnswerBody = '{"answer":"Modern ATS systems (Workday, Greenhouse) easily parse single-column cleanly formatted PDFs. Ensure your skills match the exact JD terms.","alumniName":"Neha Singhal - Google"}'
    $pinned = Test-Endpoint -Name "POST /api/v1/alumni/discussions/{id}/pin-answer" -Url "$baseUrl/api/v1/alumni/discussions/$($createdDisc.id)/pin-answer" -Method "POST" -Body $pinAnswerBody -Headers $alumniHeaders -ExpectedStatus 200
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " RESULTS: $passed PASSED | $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan
