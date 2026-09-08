# ============================================================
# CareerSetu Phase 9 Faculty & Academic Portal Backend Tests
# ============================================================
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  CareerSetu Phase 9 Faculty Portal Integration Tests     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$passed = 0
$total = 0

function Assert-Test($name, $condition) {
    $global:total++
    if ($condition) {
        $global:passed++
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# 1. Test Faculty Stats Overview
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/stats" -Method Get
    Assert-Test "GET /api/v1/faculty/stats returns aggregate metrics" ($stats.totalCourses -ge 4 -and $stats.avgCurriculumAlignment -gt 0)
    Write-Host "         Total Courses: $($stats.totalCourses), Avg Alignment: $($stats.avgCurriculumAlignment)%, Active Capstones: $($stats.activeCapstoneProjects)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/faculty/stats failed: $_" $false
}

# 2. Test Curriculum Courses Listing
try {
    $courses = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/curriculum" -Method Get
    Assert-Test "GET /api/v1/faculty/curriculum returns mapped courses" ($courses.Count -ge 4)
    Write-Host "         First Course: $($courses[0].courseCode) - $($courses[0].courseTitle) ($($courses[0].alignmentScore)%)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/faculty/curriculum failed: $_" $false
}

# 3. Test Student Endorsements Listing
try {
    $endorsements = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/endorsements" -Method Get
    Assert-Test "GET /api/v1/faculty/endorsements returns endorsements" ($endorsements.Count -ge 3)
    Write-Host "         First Endorsement: $($endorsements[0].studentName) by $($endorsements[0].facultyName) [Tier: $($endorsements[0].ratingTier)]" -ForegroundColor Gray
    Write-Host "         Verification Hash: $($endorsements[0].verificationHash)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/faculty/endorsements failed: $_" $false
}

# 4. Test Capstone Projects Listing
$firstProjectId = $null
try {
    $projects = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/projects" -Method Get
    Assert-Test "GET /api/v1/faculty/projects returns joint capstone projects" ($projects.Count -ge 3)
    $firstProjectId = $projects[0].id
    Write-Host "         First Capstone: $($projects[0].projectTitle) with $($projects[0].industryPartner)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/faculty/projects failed: $_" $false
}

# 5. Authenticate as Faculty
$facultyToken = $null
try {
    $loginBody = @{
        email = "faculty@careersetu.in"
        password = "Demo@CareerSetu2024"
    } | ConvertTo-Json

    $loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $facultyToken = $loginRes.accessToken
    Assert-Test "POST /api/v1/auth/login authenticates Faculty user" ($facultyToken -ne $null -and $loginRes.user.primaryRole -eq "FACULTY")
    Write-Host "         Faculty Logged In: $($loginRes.user.fullName) ($($loginRes.user.email))" -ForegroundColor Gray
} catch {
    Assert-Test "Faculty authentication failed: $_" $false
}

$facultyHeaders = @{
    Authorization = "Bearer $facultyToken"
    "Content-Type" = "application/json"
}

# 6. Post New Curriculum Course
try {
    $newCourseBody = @{
        courseCode = "AI405"
        courseTitle = "Autonomous Robotics & Edge Vision"
        department = "Artificial Intelligence & Data Science"
        semester = 8
        aicteCredits = 4
        syllabusSummary = "ROS2, SLAM algorithms, OpenCV edge acceleration, and TensorRT inference."
        industryRelevance = "VERY_HIGH"
        alignmentScore = 95.0
        mappedSkillsJson = '["ROS2", "SLAM", "TensorRT", "Edge AI"]'
        nepCategory = "Advanced Technical Specialization (NEP 14-Credit)"
        facultyLead = "Dr. Meenakshi Sundaram"
    } | ConvertTo-Json

    $createdCourse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/curriculum" -Method Post -Headers $facultyHeaders -Body $newCourseBody
    Assert-Test "POST /api/v1/faculty/curriculum creates course mapping" ($createdCourse.courseCode -eq "AI405")
    Write-Host "         Created Course: $($createdCourse.courseCode) - $($createdCourse.courseTitle)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/faculty/curriculum failed: $_" $false
}

# 7. Post New Student Endorsement with SHA-256 Hash
try {
    $newEndorsementBody = @{
        studentName = "Rohan Varma"
        studentRollNo = "22CSE078"
        facultyName = "Dr. Meenakshi Sundaram"
        facultyDesignation = "Professor & Dean of Academic Alliances"
        facultyDepartment = "Computer Science & Engineering"
        specializationArea = "Edge Computing & Embedded Systems"
        endorsementText = "Rohan showed remarkable mastery over real-time RTOS scheduling and hardware driver development."
        ratingTier = "TOP_5_PERCENT"
    } | ConvertTo-Json

    $createdEndorsement = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/endorsements" -Method Post -Headers $facultyHeaders -Body $newEndorsementBody
    Assert-Test "POST /api/v1/faculty/endorsements generates cryptographic hash" ($createdEndorsement.verificationHash -like "0x*" -and $createdEndorsement.status -eq "VERIFIED")
    Write-Host "         Generated SHA-256 Seal: $($createdEndorsement.verificationHash)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/faculty/endorsements failed: $_" $false
}

# 8. Post New Industry Capstone Project
try {
    $newProjectBody = @{
        projectTitle = "Self-Healing Smart Grid Microservices"
        industryPartner = "Tata Power & GridDynamics"
        corporateMentorName = "Rajesh Nambiar"
        facultyGuideName = "Dr. Meenakshi Sundaram"
        studentNames = "Divya Nair, Siddharth Rao"
        stage = "PROPOSAL"
        progressPercentage = 20
        milestoneNotes = "Architecture proposal submitted for smart meter streaming pipeline."
        domainArea = "IoT & Distributed Microservices"
    } | ConvertTo-Json

    $createdProject = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/projects" -Method Post -Headers $facultyHeaders -Body $newProjectBody
    Assert-Test "POST /api/v1/faculty/projects registers joint capstone" ($createdProject.projectTitle -eq "Self-Healing Smart Grid Microservices")
    Write-Host "         Registered Capstone: $($createdProject.projectTitle)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/faculty/projects failed: $_" $false
}

# 9. Update Capstone Project Stage & Viva Grade
if ($firstProjectId) {
    try {
        $updateStageBody = @{
            stage = "COMPLETED"
            progressPercentage = 100
            finalGrade = 9.8
            milestoneNotes = "External viva examination passed with highest distinction."
        } | ConvertTo-Json

        $updatedProject = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/projects/$firstProjectId/stage" -Method Patch -Headers $facultyHeaders -Body $updateStageBody
        Assert-Test "PATCH /api/v1/faculty/projects/{id}/stage updates stage and grade" ($updatedProject.stage -eq "COMPLETED" -and $updatedProject.finalGrade -eq 9.8)
        Write-Host "         Updated Project Stage: $($updatedProject.stage) with Grade $($updatedProject.finalGrade)/10" -ForegroundColor Gray
    } catch {
        Assert-Test "PATCH /api/v1/faculty/projects/{id}/stage failed: $_" $false
    }
}

# 10. Test Mock Evaluations Listing
try {
    $evaluations = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/evaluations" -Method Get
    Assert-Test "GET /api/v1/faculty/evaluations returns student viva evaluations" ($evaluations.Count -ge 3)
    Write-Host "         First Evaluation: $($evaluations[0].studentName) - Score $($evaluations[0].overallScore)/100 [$($evaluations[0].readinessStatus)]" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/faculty/evaluations failed: $_" $false
}

# 11. Post New Mock Evaluation
try {
    $newEvalBody = @{
        studentName = "Pooja Hegde"
        studentRollNo = "22IT044"
        evaluatorName = "Dr. Meenakshi Sundaram"
        track = "Data Engineering & Spark"
        technicalScore = 92
        problemSolvingScore = 88
        communicationScore = 90
        nepReadinessScore = 94
        rubricFeedback = "Solid understanding of distributed DAG execution, partitions, and shuffle tuning."
        recommendedActions = "Cleared for super dream data engineering roles."
        readinessStatus = "PLACEMENT_READY"
    } | ConvertTo-Json

    $createdEval = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/faculty/evaluations" -Method Post -Headers $facultyHeaders -Body $newEvalBody
    Assert-Test "POST /api/v1/faculty/evaluations records technical viva assessment" ($createdEval.overallScore -gt 85 -and $createdEval.readinessStatus -eq "PLACEMENT_READY")
    Write-Host "         Computed Overall Score: $($createdEval.overallScore)/100 ($($createdEval.readinessStatus))" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/faculty/evaluations failed: $_" $false
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  Phase 9 Backend Test Summary: $passed / $total Passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($passed -ne $total) {
    exit 1
}
