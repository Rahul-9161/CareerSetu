-- ============================================================
-- CareerSetu — V3: Company, Skills & Opportunities
-- ============================================================

-- ── Company Verification Status ──────────────────────────────
CREATE TYPE company_verification_status AS ENUM (
    'PENDING',
    'DOCUMENT_REVIEW',
    'DOMAIN_VERIFIED',
    'IDENTITY_VERIFIED',
    'BUSINESS_VERIFIED',
    'APPROVED',
    'SUSPENDED',
    'REJECTED'
);

-- ── Companies ─────────────────────────────────────────────────
CREATE TABLE companies (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id               UUID REFERENCES tenants(id),
    legal_name              VARCHAR(255) NOT NULL,
    brand_name              VARCHAR(255),
    company_type            VARCHAR(50),    -- STARTUP, SME, LARGE, MNC, PSU, NGO
    cin                     VARCHAR(21),    -- Corporate ID Number
    gstin                   VARCHAR(15),
    official_domain         VARCHAR(255),
    website                 VARCHAR(255),
    linkedin_url            VARCHAR(255),
    industry                VARCHAR(100),
    sub_industry            VARCHAR(100),
    description             TEXT,
    logo_key                TEXT,
    founded_year            INTEGER,
    employee_count_range    VARCHAR(50),   -- 1-10, 11-50, 51-200, 201-1000, 1001+
    headquarters_city       VARCHAR(100),
    headquarters_state      VARCHAR(100),
    headquarters_country    VARCHAR(100) DEFAULT 'India',
    is_startup              BOOLEAN DEFAULT FALSE,
    dpiit_recognized        BOOLEAN DEFAULT FALSE,
    verification_status     company_verification_status NOT NULL DEFAULT 'PENDING',
    verification_notes      TEXT,
    verified_by             UUID REFERENCES users(id),
    verified_at             TIMESTAMPTZ,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_company_industry ON companies(industry);
CREATE INDEX idx_company_verification ON companies(verification_status);
CREATE INDEX idx_company_domain ON companies(official_domain);
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Recruiters ────────────────────────────────────────────────
CREATE TABLE recruiters (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id      UUID NOT NULL REFERENCES companies(id),
    designation     VARCHAR(100),
    department      VARCHAR(100),
    official_email  VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    can_post_jobs   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recruiters_company ON recruiters(company_id);
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Skill Categories ──────────────────────────────────────────
CREATE TABLE skill_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    parent_id   UUID REFERENCES skill_categories(id),
    icon        VARCHAR(50),
    sort_order  INTEGER DEFAULT 0
);

-- ── Skills (Master) ───────────────────────────────────────────
CREATE TABLE skills (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) NOT NULL UNIQUE,
    category_id         UUID REFERENCES skill_categories(id),
    description         TEXT,
    aliases             TEXT[],             -- alternate names
    industry_demand     VARCHAR(20),        -- HIGH, MEDIUM, LOW, EMERGING
    is_technical        BOOLEAN DEFAULT TRUE,
    is_soft_skill       BOOLEAN DEFAULT FALSE,
    is_active           BOOLEAN DEFAULT TRUE,
    embedding           vector(768),        -- pgvector embedding
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_embedding ON skills USING hnsw(embedding vector_cosine_ops);

-- ── Skill Relationships (Graph) ───────────────────────────────
CREATE TABLE skill_relationships (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id        UUID NOT NULL REFERENCES skills(id),
    related_skill_id UUID NOT NULL REFERENCES skills(id),
    relationship    VARCHAR(50) NOT NULL, -- PREREQUISITE, RELATED, LEADS_TO, PART_OF
    strength        DECIMAL(3,2),         -- 0.0 to 1.0
    UNIQUE(skill_id, related_skill_id, relationship)
);

CREATE INDEX idx_skill_rel_skill ON skill_relationships(skill_id);
CREATE INDEX idx_skill_rel_related ON skill_relationships(related_skill_id);

-- ── Student Skills ────────────────────────────────────────────
CREATE TYPE skill_verification_status AS ENUM (
    'SELF_DECLARED',
    'ASSESSED',
    'INSTITUTION_VERIFIED',
    'EMPLOYER_VERIFIED',
    'CERTIFIED',
    'PROJECT_VERIFIED'
);

CREATE TABLE student_skills (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id  UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_id            UUID NOT NULL REFERENCES skills(id),
    proficiency_level   INTEGER NOT NULL DEFAULT 1, -- 1-10 scale
    proficiency_label   VARCHAR(20),                -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    evidence            JSONB,                      -- array of evidence objects
    source              VARCHAR(100),               -- SELF, ASSESSMENT, COURSE, PROJECT
    verification_status skill_verification_status NOT NULL DEFAULT 'SELF_DECLARED',
    confidence          DECIMAL(3,2),               -- ML confidence score
    last_assessed_at    TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_profile_id, skill_id)
);

CREATE INDEX idx_student_skills_student ON student_skills(student_profile_id);
CREATE INDEX idx_student_skills_skill ON student_skills(skill_id);
CREATE TRIGGER update_student_skills_updated_at BEFORE UPDATE ON student_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Opportunities (unified: JOB, INTERNSHIP, APPRENTICESHIP, etc.) ─
CREATE TYPE opportunity_type AS ENUM (
    'JOB',
    'INTERNSHIP',
    'APPRENTICESHIP',
    'FELLOWSHIP',
    'RESEARCH',
    'LIVE_PROJECT',
    'INDUSTRIAL_TRAINING',
    'FDP',
    'WORKSHOP',
    'MENTORSHIP',
    'CONSULTANCY',
    'HACKATHON',
    'COMPETITION',
    'SCHOLARSHIP',
    'GUEST_LECTURE',
    'INNOVATION_CHALLENGE'
);

CREATE TYPE work_mode AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

CREATE TYPE opportunity_status AS ENUM (
    'DRAFT',
    'PENDING_REVIEW',
    'ACTIVE',
    'PAUSED',
    'CLOSED',
    'CANCELLED',
    'FLAGGED',
    'REJECTED'
);

CREATE TABLE opportunities (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id              UUID NOT NULL REFERENCES companies(id),
    posted_by               UUID NOT NULL REFERENCES users(id),
    type                    opportunity_type NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    slug                    VARCHAR(300),
    description             TEXT NOT NULL,
    responsibilities        TEXT,
    location_city           VARCHAR(100),
    location_state          VARCHAR(100),
    work_mode               work_mode NOT NULL DEFAULT 'HYBRID',
    -- Compensation
    stipend_min             INTEGER,
    stipend_max             INTEGER,
    salary_min              INTEGER,
    salary_max              INTEGER,
    currency                VARCHAR(10) DEFAULT 'INR',
    is_paid                 BOOLEAN DEFAULT TRUE,
    -- Duration
    duration_weeks          INTEGER,
    start_date              DATE,
    application_deadline    DATE NOT NULL,
    -- Eligibility
    min_cgpa                DECIMAL(4,2),
    graduation_year_min     INTEGER,
    graduation_year_max     INTEGER,
    eligible_branches       TEXT[],
    eligible_degrees        TEXT[],
    min_experience_months   INTEGER DEFAULT 0,
    max_experience_months   INTEGER,
    -- Other details
    openings                INTEGER DEFAULT 1,
    selection_process       JSONB,           -- array of stages
    perks_benefits          TEXT[],
    learning_outcomes       TEXT[],
    ppo_possible            BOOLEAN DEFAULT FALSE,  -- Pre-Placement Offer
    certificate_provided    BOOLEAN DEFAULT FALSE,
    -- Status
    status                  opportunity_status NOT NULL DEFAULT 'DRAFT',
    is_featured             BOOLEAN DEFAULT FALSE,
    views_count             INTEGER DEFAULT 0,
    applications_count      INTEGER DEFAULT 0,
    -- Timestamps
    published_at            TIMESTAMPTZ,
    closed_at               TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunity_company ON opportunities(company_id);
CREATE INDEX idx_opportunity_type ON opportunities(type);
CREATE INDEX idx_opportunity_status ON opportunities(status);
CREATE INDEX idx_opportunity_deadline ON opportunities(application_deadline);
CREATE INDEX idx_opportunity_work_mode ON opportunities(work_mode);
CREATE INDEX idx_opportunity_graduation ON opportunities(graduation_year_min, graduation_year_max);
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Opportunity Skills Required ───────────────────────────────
CREATE TABLE opportunity_skills (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id  UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_id        UUID NOT NULL REFERENCES skills(id),
    is_required     BOOLEAN NOT NULL DEFAULT TRUE,
    proficiency_min INTEGER DEFAULT 1,
    UNIQUE(opportunity_id, skill_id)
);

CREATE INDEX idx_opp_skills_opportunity ON opportunity_skills(opportunity_id);
CREATE INDEX idx_opp_skills_skill ON opportunity_skills(skill_id);

-- ── Applications ──────────────────────────────────────────────
CREATE TYPE application_status AS ENUM (
    'APPLIED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'ASSESSMENT',
    'INTERVIEW',
    'FINAL_REVIEW',
    'SELECTED',
    'OFFERED',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN',
    'ON_HOLD'
);

CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id      UUID NOT NULL REFERENCES opportunities(id),
    student_profile_id  UUID NOT NULL REFERENCES student_profiles(id),
    status              application_status NOT NULL DEFAULT 'APPLIED',
    cover_note          TEXT,
    resume_document_id  UUID,
    match_score         DECIMAL(5,2),           -- AI-computed match score
    match_breakdown     JSONB,                  -- breakdown by category
    ai_explanation      TEXT,                   -- why this match
    applied_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    shortlisted_at      TIMESTAMPTZ,
    rejected_at         TIMESTAMPTZ,
    rejection_stage     VARCHAR(50),
    offer_at            TIMESTAMPTZ,
    UNIQUE(opportunity_id, student_profile_id)
);

CREATE INDEX idx_application_opportunity ON applications(opportunity_id);
CREATE INDEX idx_application_student ON applications(student_profile_id);
CREATE INDEX idx_application_status ON applications(status);
CREATE TRIGGER update_applications_last_activity
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rename the trigger's target column
CREATE OR REPLACE FUNCTION update_last_activity_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Application Stage History ─────────────────────────────────
CREATE TABLE application_stage_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    from_status     application_status,
    to_status       application_status NOT NULL,
    notes           TEXT,
    actor_id        UUID REFERENCES users(id),
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_stage_history ON application_stage_history(application_id);

-- ── Internships ───────────────────────────────────────────────
CREATE TYPE internship_status AS ENUM (
    'OFFERED',
    'ACCEPTED',
    'AGREEMENT_SIGNED',
    'IN_PROGRESS',
    'ON_HOLD',
    'COMPLETED',
    'WITHDRAWN',
    'TERMINATED'
);

CREATE TABLE internships (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id      UUID NOT NULL REFERENCES applications(id),
    student_profile_id  UUID NOT NULL REFERENCES student_profiles(id),
    opportunity_id      UUID NOT NULL REFERENCES opportunities(id),
    company_id          UUID NOT NULL REFERENCES companies(id),
    mentor_user_id      UUID REFERENCES users(id),
    status              internship_status NOT NULL DEFAULT 'OFFERED',
    offer_letter_doc_id UUID,
    start_date          DATE,
    end_date            DATE,
    actual_end_date     DATE,
    stipend             INTEGER,
    currency            VARCHAR(10) DEFAULT 'INR',
    work_mode           work_mode,
    goals               TEXT,
    learning_objectives TEXT[],
    certificate_doc_id  UUID,
    completion_verified BOOLEAN DEFAULT FALSE,
    ppo_offered         BOOLEAN DEFAULT FALSE,
    final_evaluation    JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_internships_student ON internships(student_profile_id);
CREATE INDEX idx_internships_company ON internships(company_id);
CREATE INDEX idx_internships_status ON internships(status);
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Mentors ───────────────────────────────────────────────────
CREATE TABLE mentor_profiles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id          UUID REFERENCES companies(id),    -- if industry mentor
    institution_id      UUID REFERENCES institutions(id), -- if faculty mentor
    current_designation VARCHAR(200),
    current_company     VARCHAR(200),
    years_of_experience INTEGER,
    expertise_areas     TEXT[],
    industries          TEXT[],
    mentorship_topics   TEXT[],
    session_duration_mins INTEGER DEFAULT 60,
    max_mentees         INTEGER DEFAULT 5,
    current_mentees     INTEGER DEFAULT 0,
    languages           TEXT[] DEFAULT ARRAY['English'],
    is_accepting_requests BOOLEAN DEFAULT TRUE,
    total_sessions      INTEGER DEFAULT 0,
    rating              DECIMAL(3,2),
    linkedin_url        VARCHAR(255),
    bio                 TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mentor_expertise ON mentor_profiles USING gin(expertise_areas);
CREATE TRIGGER update_mentor_updated_at BEFORE UPDATE ON mentor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Documents ─────────────────────────────────────────────────
CREATE TYPE document_type AS ENUM (
    'RESUME',
    'COVER_LETTER',
    'TRANSCRIPT',
    'CERTIFICATE',
    'IDENTITY',
    'OFFER_LETTER',
    'AGREEMENT',
    'INTERNSHIP_CERTIFICATE',
    'PORTFOLIO',
    'PUBLICATION',
    'OTHER'
);

CREATE TYPE document_status AS ENUM (
    'UPLOADING',
    'PROCESSING',
    'AVAILABLE',
    'FAILED',
    'DELETED',
    'QUARANTINED'
);

CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id            UUID NOT NULL REFERENCES users(id),
    tenant_id           UUID REFERENCES tenants(id),
    type                document_type NOT NULL,
    original_filename   VARCHAR(255),
    storage_key         TEXT NOT NULL,         -- S3 object key (private)
    mime_type           VARCHAR(100),
    size_bytes          BIGINT,
    content_hash        TEXT,                  -- SHA-256 for integrity
    status              document_status NOT NULL DEFAULT 'UPLOADING',
    is_verified         BOOLEAN DEFAULT FALSE,
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMPTZ,
    scan_status         VARCHAR(20),            -- CLEAN, INFECTED, PENDING
    scanned_at          TIMESTAMPTZ,
    extracted_text      TEXT,                   -- for search/AI
    metadata            JSONB,
    retention_until     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Document Access Log ────────────────────────────────────────
CREATE TABLE document_access_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id),
    accessed_by     UUID NOT NULL REFERENCES users(id),
    access_type     VARCHAR(20) NOT NULL, -- VIEW, DOWNLOAD, SHARE
    ip_address      INET,
    accessed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doc_access_document ON document_access_log(document_id, accessed_at DESC);

-- ── Notifications ─────────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(100) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    message         TEXT NOT NULL,
    action_url      VARCHAR(500),
    entity_type     VARCHAR(100),
    entity_id       UUID,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    sent_email      BOOLEAN DEFAULT FALSE,
    sent_sms        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ── AI Interactions ───────────────────────────────────────────
CREATE TABLE ai_interactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    session_id      UUID,
    agent_type      VARCHAR(100) NOT NULL,      -- CAREER_COPILOT, RESUME_ANALYZER, etc.
    provider        VARCHAR(50),                -- gemini, openai, local
    model           VARCHAR(100),
    input_tokens    INTEGER,
    output_tokens   INTEGER,
    latency_ms      INTEGER,
    tools_called    JSONB,
    guardrail_events JSONB,
    status          VARCHAR(20),                -- SUCCESS, FAILED, BLOCKED, FALLBACK
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id, created_at DESC);
CREATE INDEX idx_ai_interactions_agent ON ai_interactions(agent_type, created_at DESC);

-- ── Consent Records ───────────────────────────────────────────
CREATE TABLE consent_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose         VARCHAR(100) NOT NULL,
    purpose_label   VARCHAR(255) NOT NULL,
    version         VARCHAR(20) NOT NULL,
    consented       BOOLEAN NOT NULL,
    consented_at    TIMESTAMPTZ,
    withdrawn_at    TIMESTAMPTZ,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_user ON consent_records(user_id);
CREATE INDEX idx_consent_purpose ON consent_records(purpose);

-- ── Grievances ────────────────────────────────────────────────
CREATE TYPE grievance_status AS ENUM (
    'SUBMITTED',
    'ACKNOWLEDGED',
    'UNDER_REVIEW',
    'ESCALATED',
    'ACTION_REQUIRED',
    'RESOLVED',
    'CLOSED',
    'APPEAL'
);

CREATE TABLE grievances (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id         VARCHAR(20) NOT NULL UNIQUE,  -- human-readable case ID
    complainant_id  UUID NOT NULL REFERENCES users(id),
    respondent_id   UUID REFERENCES users(id),
    category        VARCHAR(100) NOT NULL,
    subject         VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    evidence_doc_ids UUID[],
    status          grievance_status NOT NULL DEFAULT 'SUBMITTED',
    assigned_to     UUID REFERENCES users(id),
    sla_deadline    TIMESTAMPTZ,
    resolved_at     TIMESTAMPTZ,
    resolution_notes TEXT,
    is_sensitive    BOOLEAN DEFAULT FALSE,        -- restricts access
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_grievance_complainant ON grievances(complainant_id);
CREATE INDEX idx_grievance_status ON grievances(status);
CREATE INDEX idx_grievance_case_id ON grievances(case_id);
CREATE TRIGGER update_grievances_updated_at BEFORE UPDATE ON grievances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
