-- ============================================================
-- AccreditIQ — Complete Supabase Database Setup
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ▸ Step 1: Enable pgvector extension for RAG embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- CORE TABLES
-- ============================================================

-- ▸ Institutions
CREATE TABLE IF NOT EXISTS institutions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  aicte_code  text UNIQUE,
  tier        text DEFAULT 'II',
  contact_email text,
  subscription_plan text DEFAULT 'free',
  created_at  timestamptz DEFAULT now()
);

-- ▸ Departments
CREATE TABLE IF NOT EXISTS departments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            text NOT NULL,
  cluster_type    text, -- CSE | ECE | ME | EE | CE
  hod_user_id     uuid REFERENCES auth.users(id),
  created_at      timestamptz DEFAULT now()
);

-- ▸ User Profiles (links auth.users to institution/department)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id  uuid REFERENCES institutions(id),
  dept_id         uuid REFERENCES departments(id),
  role            text DEFAULT 'faculty', -- faculty | hod | nba_coordinator | super_admin
  full_name       text,
  created_at      timestamptz DEFAULT now()
);

-- ▸ Criteria Questions (150-question bank)
CREATE TABLE IF NOT EXISTS criteria_questions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_code        text NOT NULL,       -- C1 | C4 | C5 | C2...C9
  sub_criterion_code    text,                -- e.g., C1.1, C4.2
  group_title           text,                -- Display group for UI
  question_text         text NOT NULL,
  question_type         text DEFAULT 'text', -- text | number | select | multiline
  is_required           boolean DEFAULT false,
  sort_order            int,
  formula_hint          text,                -- e.g., 'ER = (N1+N4)/N'
  max_marks_contribution numeric
);

-- ▸ SAR Responses (faculty answers)
CREATE TABLE IF NOT EXISTS sar_responses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dept_id        uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  question_id    uuid NOT NULL REFERENCES criteria_questions(id),
  academic_year  text NOT NULL,
  answer_text    text,
  answer_numeric numeric,
  answered_by    uuid REFERENCES auth.users(id),
  updated_at     timestamptz DEFAULT now()
);

-- ▸ Generated SAR (AI output storage)
CREATE TABLE IF NOT EXISTS generated_sar (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dept_id           uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  criterion_code    text NOT NULL,
  academic_year     text NOT NULL,
  generated_text    text,
  ai_score_estimate numeric,
  model_used        text,
  generated_at      timestamptz DEFAULT now(),
  is_approved       boolean DEFAULT false
);


-- ============================================================
-- RAG / KNOWLEDGE BASE TABLES
-- ============================================================

-- ▸ Knowledge Chunks (pgvector powered — this is the RAG table)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type     text,     -- gapc_v4 | nba_circular | annexure | institution_doc
  source_name     text,     -- e.g., 'GAPC V4.0 Criterion 1'
  chunk_text      text NOT NULL,
  embedding       vector(1024),  -- pgvector column for embeddings
  institution_id  uuid REFERENCES institutions(id), -- NULL for global NBA docs
  dept_id         uuid REFERENCES departments(id),  -- NULL unless dept-specific
  metadata        jsonb,    -- page_number, section, criterion_code, etc.
  created_at      timestamptz DEFAULT now()
);

-- ▸ AI Instructions (prompt management)
CREATE TABLE IF NOT EXISTS ai_instructions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key          text UNIQUE NOT NULL, -- sar_generator | chatbot | audit_sim | scoring
  system_prompt        text NOT NULL,
  user_prompt_template text,
  model_preference     text DEFAULT 'claude-sonnet-4-6',
  max_tokens           int DEFAULT 2000,
  temperature          numeric DEFAULT 0.3,
  is_active            boolean DEFAULT true,
  updated_by           uuid REFERENCES auth.users(id),
  updated_at           timestamptz DEFAULT now()
);

-- ▸ Chat History (optional — for persistent chat logs)
CREATE TABLE IF NOT EXISTS chat_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id),
  dept_id       uuid REFERENCES departments(id),
  role          text NOT NULL, -- user | assistant
  content       text NOT NULL,
  model_used    text,
  created_at    timestamptz DEFAULT now()
);


-- ============================================================
-- INDEXES (for performance)
-- ============================================================

-- Vector similarity search index (IVFFlat for pgvector)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Text search index on knowledge chunks
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_text
  ON knowledge_chunks
  USING gin (to_tsvector('english', chunk_text));

-- Frequently queried columns
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source_type ON knowledge_chunks(source_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_institution ON knowledge_chunks(institution_id);
CREATE INDEX IF NOT EXISTS idx_sar_responses_dept ON sar_responses(dept_id);
CREATE INDEX IF NOT EXISTS idx_sar_responses_question ON sar_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_generated_sar_dept ON generated_sar(dept_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);


-- ============================================================
-- VECTOR SIMILARITY SEARCH FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5,
  p_institution_id uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  chunk_text text,
  source_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.chunk_text,
    kc.source_name,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE
    (kc.institution_id IS NULL OR kc.institution_id = p_institution_id)
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;


-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE institutions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sar_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_sar    ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_instructions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history     ENABLE ROW LEVEL SECURITY;

-- ▸ criteria_questions: all authenticated users can read
CREATE POLICY "Questions are globally readable"
  ON criteria_questions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ▸ knowledge_chunks: global docs visible to all; institution docs scoped
CREATE POLICY "Knowledge chunks readable by auth users"
  ON knowledge_chunks FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      institution_id IS NULL
      OR institution_id = (SELECT institution_id FROM user_profiles WHERE user_id = auth.uid())
    )
  );

-- ▸ ai_instructions: all can read, only super_admin can update
CREATE POLICY "AI instructions readable by all"
  ON ai_instructions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "AI instructions writable by super_admin"
  ON ai_instructions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- ▸ sar_responses: department isolation
CREATE POLICY "SAR responses dept isolation"
  ON sar_responses FOR ALL
  USING (
    dept_id IN (
      SELECT id FROM departments
      WHERE institution_id = (SELECT institution_id FROM user_profiles WHERE user_id = auth.uid())
    )
  );

-- ▸ generated_sar: faculty sees own dept; coordinator sees all
CREATE POLICY "Generated SAR dept scoped"
  ON generated_sar FOR SELECT
  USING (
    dept_id IN (
      SELECT id FROM departments
      WHERE institution_id = (SELECT institution_id FROM user_profiles WHERE user_id = auth.uid())
    )
  );

-- ▸ user_profiles: users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (user_id = auth.uid());

-- ▸ chat_history: users can read/write their own chat
CREATE POLICY "Users can manage own chat"
  ON chat_history FOR ALL
  USING (user_id = auth.uid());

-- ▸ departments: users see their institution's departments
CREATE POLICY "Departments scoped to institution"
  ON departments FOR SELECT
  USING (
    institution_id = (SELECT institution_id FROM user_profiles WHERE user_id = auth.uid())
  );


-- ============================================================
-- SEED: Default AI Instructions
-- ============================================================

INSERT INTO ai_instructions (feature_key, system_prompt, user_prompt_template, model_preference, max_tokens, temperature)
VALUES
  (
    'chatbot',
    'You are AccreditIQ — an expert NBA accreditation consultant AI assistant with deep knowledge of GAPC V4.0 for Tier II UG Engineering programs. Answer questions about NBA accreditation, GAPC V4.0 criteria, SAR preparation, and related processes. Use formal academic language and reference specific NBA sub-criteria codes when applicable. Be concise but comprehensive. Never hallucinate data. If you don''t know something, say so honestly. When knowledge base context is provided, always cite the source document.',
    'User question: {question}\n\nRelevant context from knowledge base:\n{context}',
    'mistral-large-latest',
    2000,
    0.3
  ),
  (
    'sar_generator',
    'You are an expert NBA accreditation consultant with deep knowledge of GAPC V4.0 for Tier II UG Engineering programs. Generate professional, factual SAR narrative text for the specified criterion. Use formal academic language, reference specific NBA sub-criteria codes (e.g., C1.1, C4.2), include all provided quantitative data in your response, calculate scores where formula data is available, and structure output to match the GAPC V4.0 SAR format. Be concise but comprehensive. Do not hallucinate data not provided.',
    'Generate SAR narrative for {criterion_name} ({max_marks} marks) for {dept_name}, {institution_name}. Academic Year: {academic_year}. Data: {formatted_answers}. For each sub-criterion, generate: (1) narrative paragraph, (2) calculated score if formula data available, (3) gap analysis. Format with sub-criterion headings.',
    'mistral-large-latest',
    4000,
    0.2
  ),
  (
    'audit_sim',
    'You are an experienced NBA expert auditor conducting a mock audit visit for a Tier II UG Engineering program under GAPC V4.0. Ask probing questions about the department''s documentation, processes, and outcomes. Evaluate responses critically but constructively. Adapt your questioning based on faculty responses — go deeper into weak areas.',
    'You are auditing {dept_name} at {institution_name} for criterion {criterion_code}. Begin the mock audit with an opening question. Previous conversation: {history}',
    'mistral-large-latest',
    2000,
    0.5
  ),
  (
    'scoring',
    'You are an NBA scoring expert. Given the provided SAR data, estimate the score for each sub-criterion based on GAPC V4.0 marking scheme. Use rule-based scoring where formulas are applicable. Provide justification for each score.',
    'Score the following SAR data for {criterion_code} ({max_marks} total marks):\n{sar_data}\nProvide: sub-criterion scores, total estimated score, and gap analysis.',
    'mistral-large-latest',
    1000,
    0.1
  )
ON CONFLICT (feature_key) DO NOTHING;


-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
