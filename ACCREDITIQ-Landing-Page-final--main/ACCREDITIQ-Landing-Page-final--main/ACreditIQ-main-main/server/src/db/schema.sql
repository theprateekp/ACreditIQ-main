-- AccreditIQ PostgreSQL Schema — GAPC V4.0
-- Run: psql -U postgres -d accreditiq -f schema.sql

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('Admin','NBA_Coordinator','HOD','Faculty','Viewer')),
  department_id UUID,
  avatar_initials VARCHAR(4),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- ─── Departments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  code          VARCHAR(50) UNIQUE NOT NULL,
  hod_user_id   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT fk_user_dept FOREIGN KEY (department_id) REFERENCES departments(id);

-- ─── Criteria (GAPC V4.0 — locked schema) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS criteria (
  id            VARCHAR(3) PRIMARY KEY,  -- C1–C9
  title         VARCHAR(255) NOT NULL,
  max_marks     INTEGER NOT NULL,
  gapc_version  VARCHAR(10) DEFAULT 'V4.0',
  cluster       VARCHAR(100),
  part          VARCHAR(10) DEFAULT 'A',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAR Cycles ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sar_cycles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id     UUID NOT NULL REFERENCES departments(id),
  academic_year     VARCHAR(10) NOT NULL,
  status            VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','in_review','submitted','approved')),
  submission_deadline TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  submitted_at      TIMESTAMPTZ
);

-- ─── Criterion Responses ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS criterion_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sar_cycle_id    UUID NOT NULL REFERENCES sar_cycles(id),
  criterion_id    VARCHAR(3) NOT NULL REFERENCES criteria(id),
  owner_user_id   UUID REFERENCES users(id),
  response_text   TEXT,
  word_count      INTEGER DEFAULT 0,
  scored_marks    INTEGER DEFAULT 0,
  completion_pct  NUMERIC(5,2) DEFAULT 0,
  status          VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','ready_for_review','approved','returned')),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by     UUID REFERENCES users(id),
  approved_at     TIMESTAMPTZ,
  UNIQUE(sar_cycle_id, criterion_id)
);

-- ─── Documents / Evidence ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_response_id UUID REFERENCES criterion_responses(id),
  file_name             VARCHAR(500) NOT NULL,
  file_type             VARCHAR(50),
  file_size_bytes       BIGINT,
  storage_url           TEXT,
  uploaded_by           UUID REFERENCES users(id),
  uploaded_at           TIMESTAMPTZ DEFAULT NOW(),
  validation_status     VARCHAR(50) DEFAULT 'pending' CHECK (validation_status IN ('pending','valid','invalid','flagged')),
  validation_message    TEXT
);

-- ─── Tasks ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sar_cycle_id          UUID NOT NULL REFERENCES sar_cycles(id),
  criterion_id          VARCHAR(3) REFERENCES criteria(id),
  title                 VARCHAR(500) NOT NULL,
  assigned_to           UUID REFERENCES users(id),
  due_date              DATE,
  priority              VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High','Medium','Low')),
  status                VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Complete','Overdue')),
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  completed_at          TIMESTAMPTZ
);

-- ─── Activities / Audit Log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   UUID REFERENCES users(id),
  action_type     VARCHAR(100) NOT NULL,
  entity_type     VARCHAR(100),
  entity_id       VARCHAR(255),
  description     TEXT,
  before_state    JSONB,
  after_state     JSONB,
  ip_address      INET,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AI Scores ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_scores (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_response_id UUID NOT NULL REFERENCES criterion_responses(id),
  readiness_score       NUMERIC(5,2),
  risk_score            NUMERIC(5,2),
  confidence_score      NUMERIC(5,2),
  insight_text          TEXT,
  insight_type          VARCHAR(50) CHECK (insight_type IN ('readiness','risk','suggestion')),
  source_refs           JSONB DEFAULT '[]',
  model_version         VARCHAR(50),
  generated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_criterion_responses_cycle ON criterion_responses(sar_cycle_id);
CREATE INDEX IF NOT EXISTS idx_documents_response ON documents(criterion_response_id);
CREATE INDEX IF NOT EXISTS idx_tasks_cycle ON tasks(sar_cycle_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activities_actor ON activities(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_scores_response ON ai_scores(criterion_response_id);
