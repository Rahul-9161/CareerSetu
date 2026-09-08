-- ============================================================
-- CareerSetu — V2: Institution & Student Tables
-- ============================================================

-- ── Institution Status ──────────────────────────────────────
CREATE TYPE institution_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED',
    'DEACTIVATED'
);

-- ── Institutions ─────────────────────────────────────────────
CREATE TABLE institutions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    short_name          VARCHAR(50),
    type                VARCHAR(50) NOT NULL, -- UNIVERSITY, COLLEGE, IIT, NIT, DEEMED, etc.
    affiliation         VARCHAR(255),
    naac_grade          VARCHAR(10),
    nirf_rank           INTEGER,
    state               VARCHAR(100),
    city                VARCHAR(100),
    address             TEXT,
    pin_code            VARCHAR(10),
    website             VARCHAR(255),
    official_email      VARCHAR(255),
    phone               VARCHAR(20),
    established_year    INTEGER,
    description         TEXT,
    logo_key            TEXT,             -- S3 object key
    aicte_approved      BOOLEAN DEFAULT FALSE,
    ugc_approved        BOOLEAN DEFAULT FALSE,
    status              institution_status NOT NULL DEFAULT 'PENDING',
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_institution_state ON institutions(state);
CREATE INDEX idx_institution_status ON institutions(status);
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Departments ───────────────────────────────────────────────
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50),
    head_faculty_id UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(institution_id, code)
);

CREATE INDEX idx_department_institution ON departments(institution_id);
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Programs ──────────────────────────────────────────────────
CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50),
    degree_type     VARCHAR(50) NOT NULL, -- B.TECH, M.TECH, MBA, BCA, MCA, etc.
    duration_years  INTEGER NOT NULL DEFAULT 4,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_program_department ON programs(department_id);

-- ── Academic Batches ──────────────────────────────────────────
CREATE TABLE batches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,  -- e.g., "2020-2024"
    start_year      INTEGER NOT NULL,
    end_year        INTEGER NOT NULL,
    is_current      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_batch_program ON batches(program_id);

-- ── Student Profiles ──────────────────────────────────────────
CREATE TYPE profile_visibility AS ENUM (
    'PRIVATE',
    'INSTITUTION_ONLY',
    'VERIFIED_EMPLOYERS',
    'PUBLIC_PORTFOLIO'
);

CREATE TABLE student_profiles (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    institution_id          UUID REFERENCES institutions(id),
    department_id           UUID REFERENCES departments(id),
    program_id              UUID REFERENCES programs(id),
    batch_id                UUID REFERENCES batches(id),
    enrollment_number       VARCHAR(50),
    roll_number             VARCHAR(50),
    current_year            INTEGER,
    current_semester        INTEGER,
    cgpa                    DECIMAL(4,2),
    graduation_year         INTEGER,
    date_of_birth           DATE,
    gender                  VARCHAR(20),
    category                VARCHAR(20),     -- GEN, OBC, SC, ST, EWS (for eligibility)
    home_state              VARCHAR(100),
    home_city               VARCHAR(100),
    bio                     TEXT,
    headline                VARCHAR(255),
    linkedin_url            VARCHAR(255),
    github_url              VARCHAR(255),
    portfolio_url           VARCHAR(255),
    resume_document_id      UUID,
    profile_visibility      profile_visibility NOT NULL DEFAULT 'INSTITUTION_ONLY',
    profile_completion_pct  INTEGER NOT NULL DEFAULT 0,
    is_actively_looking     BOOLEAN NOT NULL DEFAULT FALSE,
    available_from          DATE,
    preferred_work_modes    TEXT[],          -- REMOTE, HYBRID, ONSITE
    preferred_locations     TEXT[],
    preferred_roles         TEXT[],
    career_stage            VARCHAR(50) NOT NULL DEFAULT 'STUDENT', -- STUDENT, FRESHER, EXPERIENCED
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_profile_user ON student_profiles(user_id);
CREATE INDEX idx_student_profile_institution ON student_profiles(institution_id);
CREATE INDEX idx_student_profile_graduation ON student_profiles(graduation_year);
CREATE INDEX idx_student_profile_looking ON student_profiles(is_actively_looking) WHERE is_actively_looking = TRUE;
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Academic Records ──────────────────────────────────────────
CREATE TABLE academic_records (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id  UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    record_type         VARCHAR(50) NOT NULL, -- SEMESTER, YEAR, BACKLOGS, CERTIFICATE
    semester_or_year    INTEGER,
    sgpa                DECIMAL(4,2),
    cgpa                DECIMAL(4,2),
    backlogs            INTEGER DEFAULT 0,
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    document_id         UUID,
    academic_year       VARCHAR(20),
    institution         VARCHAR(255),
    board_university    VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_academic_records_student ON academic_records(student_profile_id);

-- ── Career Goals ──────────────────────────────────────────────
CREATE TABLE career_goals (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id  UUID NOT NULL UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
    target_roles        TEXT[],
    target_industries   TEXT[],
    short_term_goal     TEXT,
    long_term_goal      TEXT,
    target_salary_min   INTEGER,
    target_salary_max   INTEGER,
    preferred_company_sizes TEXT[],
    open_to_startup     BOOLEAN DEFAULT TRUE,
    open_to_relocation  BOOLEAN DEFAULT TRUE,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Faculty Profiles ──────────────────────────────────────────
CREATE TABLE faculty_profiles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    institution_id      UUID REFERENCES institutions(id),
    department_id       UUID REFERENCES departments(id),
    designation         VARCHAR(100),
    employee_id         VARCHAR(50),
    specialization      TEXT[],
    research_areas      TEXT[],
    publications_count  INTEGER DEFAULT 0,
    orcid               VARCHAR(50),
    google_scholar_url  VARCHAR(255),
    linkedin_url        VARCHAR(255),
    years_of_experience INTEGER,
    highest_degree      VARCHAR(100),
    is_industry_mentor  BOOLEAN DEFAULT FALSE,
    available_for_fdp   BOOLEAN DEFAULT FALSE,
    available_for_projects BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faculty_institution ON faculty_profiles(institution_id);
CREATE TRIGGER update_faculty_profiles_updated_at BEFORE UPDATE ON faculty_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
