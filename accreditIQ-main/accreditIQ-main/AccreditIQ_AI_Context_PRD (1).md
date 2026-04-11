AccreditIQ — AI Context & PRD | Confidential

**ACCREDITIQ**

AI Intelligence Engine

Context Document & Product Requirements Specification

Version 1.0  |  April 2026  |  Framework: NBA GAPC V4.0


# **1. AI System Overview**

AccreditIQ's AI Intelligence Engine is the core differentiator of the platform. It is purpose-built to assist engineering institutions in navigating the complex NBA GAPC V4.0 accreditation process — specifically targeting SAR generation, audit simulation, scoring estimation, and knowledge retrieval.

## **1.1 AI Mission Statement**
*"Reduce SAR preparation from 6 months to 6 weeks by providing an AI co-pilot that understands NBA scoring logic as well as a seasoned accreditation consultant — and is available 24/7."*

## **1.2 AI Capabilities Summary**

|**AI Capability**|**What It Does**|**NBA Value**|
| :- | :- | :- |
|SAR Narrative Generator|Generates structured criterion narratives from user-provided data answers|Saves 40+ hours of writing per criterion|
|AI Chatbot (RAG)|Answers NBA/GAPC V4.0 questions with source citations from knowledge base|24/7 expert-level guidance|
|Mock Audit Simulator|Simulates NBA expert questioning, adapts to faculty responses|Prepares faculty for actual audit visits|
|Readiness Scoring Engine|Scores each sub-criterion (0-100%) based on doc completeness + content quality|Identifies gaps before submission|
|CO-PO Mapping Engine|Auto-generates CO-PO articulation matrices from uploaded course syllabi|Eliminates 2-4 weeks of manual Excel work|
|Gap Analysis Advisor|Identifies which sub-criteria are weak and recommends specific actions|Prevents last-minute surprises|


# **2. AI Architecture & Tech Stack**

## **2.1 Model & API**
The AI engine is powered by Anthropic's Claude API (claude-sonnet-4-6 recommended for production, claude-haiku-4-5 for lightweight tasks to save tokens). All AI calls are routed through the AI Orchestration Service (Python FastAPI + LangChain).

|**Component**|**Technology**|**Role**|**Token Strategy**|
| :- | :- | :- | :- |
|Primary LLM|Claude Sonnet 4.6 (Anthropic)|SAR generation, chatbot, audit simulation|Full context, max 4K output|
|Lightweight LLM|Claude Haiku 4.5|Quick Q&A, scoring, simple tasks|Compressed prompts, 1K output|
|Embedding Model|OpenAI text-embedding-3-small or sentence-transformers|Vector search for RAG|Batch processing, cached|
|RAG Pipeline|LangChain + Supabase pgvector|Knowledge retrieval from GAPC docs|Top-5 chunks, max 2K context|
|NLP Pipeline|spaCy + HuggingFace Transformers|CO extraction, Bloom's classification|No LLM tokens used|
|Orchestration|Python FastAPI + LangChain|Route requests, manage pipelines|Middleware only|

## **2.2 RAG (Retrieval-Augmented Generation) Architecture**
The RAG system uses Supabase with pgvector extension as the vector store. This avoids dependency on external vector databases (Pinecone/ChromaDB) and keeps all data in one managed Supabase project.

### **RAG Query Flow**
- User asks a question (chatbot or SAR generation trigger)
- Query is embedded using the embedding model → 1536-dim vector
- Vector similarity search run against knowledge\_chunks table in Supabase
- Top-5 most relevant chunks retrieved (cosine similarity threshold: 0.75)
- Retrieved chunks + user query + department context sent to LLM
- LLM generates response with source citations
- Response streamed back to frontend via Server-Sent Events (SSE)

### **Knowledge Base Sources**

|**Source**|**Type**|**Storage**|**Update Frequency**|
| :- | :- | :- | :- |
|NBA GAPC V4.0 (Jan 2025)|Primary guidelines PDF|Supabase knowledge\_chunks|Once (static)|
|NBA Document Checklist|Part A–D checklists|Supabase knowledge\_chunks|Once (static)|
|NBA Annexures I, II, III|WK/PO definitions, allied depts|Supabase knowledge\_chunks|Once (static)|
|SAR Question Bank|150 structured questions (50/criterion)|Supabase criteria\_questions|Admin-managed|
|AI Prompts & Instructions|System prompts per feature|Supabase ai\_instructions|Admin-managed|
|Institution Documents|Uploaded syllabi, reports|Supabase documents + pgvector|Per upload|
|NBA Circulars/Updates|Admin-uploaded PDFs|Supabase knowledge\_chunks|As released|


# **3. SAR Generator — AI Feature Specification**

The SAR Generator is the flagship AI feature. It accepts structured answers from department faculty (via the question bank) and generates complete, NBA-compliant narrative text for each criterion. This document covers Phase 1: Criteria 1, 4, and 5.

## **3.1 Question Bank Design (Token Optimization Strategy)**
To minimize API token usage while maintaining output quality, the SAR Generator uses a pre-defined structured question bank of 50 questions per criterion (150 total for Phase 1). This approach:

- Eliminates free-form data entry (structured input = compact prompt)
- Allows skipping unanswered questions (only answered data sent to API)
- Enables deterministic prompt templates per sub-criterion
- Reduces average tokens per SAR generation by ~60% vs. conversational approach

|**Criterion**|**Max Marks**|**Question Groups**|**Questions**|**Key Formulas Covered**|
| :- | :- | :- | :- | :- |
|C1: Outcome-Based Curriculum|120|5 groups × 10 Qs|50|CO-PO correlation, PAM, Bloom's taxonomy|
|C4: Students' Performance|120|5 groups × 10 Qs|50|ER=(N1+N4)/N, SR=B/A, API=X\*(Y/Z), PI=(X+Y+Z)/FS|
|C5: Faculty Information|100|5 groups × 10 Qs|50|SFR=S/(RF/20), FQI=2.5\*(10X+4Y)/RF, FR formula|

## **3.2 AI Prompt Architecture**
### **System Prompt (stored in Supabase ai\_instructions table)**
You are an expert NBA accreditation consultant with deep knowledge of GAPC V4.0 for Tier II UG Engineering programs. Generate professional, factual SAR narrative text for the specified criterion. Use formal academic language, reference specific NBA sub-criteria codes (e.g., C1.1, C4.2), include all provided quantitative data in your response, calculate scores where formula data is available, and structure output to match the GAPC V4.0 SAR format. Be concise but comprehensive. Do not hallucinate data not provided.

### **User Prompt Template (auto-constructed from answers)**
Generate SAR narrative for {criterion\_name} ({max\_marks} marks) for {dept\_name}, {institution\_name}. Academic Year: {academic\_year}. Data: {formatted\_answers}. For each sub-criterion, generate: (1) narrative paragraph, (2) calculated score if formula data available, (3) gap analysis. Format with sub-criterion headings.

## **3.3 Output Format Specification**
The AI generates SAR text structured as:

- Sub-criterion heading (e.g., '1.1 Vision, Mission and Program Educational Objectives')
- Quantitative data table (if applicable)
- Narrative paragraph (150-300 words per sub-criterion)
- AI Estimated Score: X/Y marks with justification
- Gap Analysis: 2-3 specific improvement actions


# **4. Supabase Database Schema**

Supabase is used as the unified backend for AccreditIQ — handling authentication, relational data, document metadata, and vector embeddings (via pgvector). The following schema supports all Phase 1 features.

## **4.1 Core Tables**
### **Table: institutions**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)|Auto-generated by Supabase|
|name|text NOT NULL|Institution full name|
|aicte\_code|text UNIQUE|AICTE approval code|
|tier|text DEFAULT 'II'|NBA Tier (I or II)|
|contact\_email|text|Admin email|
|subscription\_plan|text|free | pro | enterprise|
|created\_at|timestamptz DEFAULT now()|Auto-managed|

### **Table: departments**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|institution\_id|uuid FK → institutions.id|CASCADE DELETE|
|name|text NOT NULL|e.g., Computer Science & Engineering|
|cluster\_type|text|CSE | ECE | ME | EE | CE — for allied dept grouping|
|hod\_user\_id|uuid FK → auth.users|Supabase Auth user|
|created\_at|timestamptz||

### **Table: criteria\_questions (The 150-question bank)**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|criterion\_code|text NOT NULL|C1 | C4 | C5 | C2 ... C9|
|sub\_criterion\_code|text|e.g., C1.1, C4.2|
|group\_title|text|Display group for UI (e.g., 'Vision & PEOs')|
|question\_text|text NOT NULL|The actual question shown to faculty|
|question\_type|text|text | number | select | multiline|
|is\_required|bool DEFAULT false|Mark as mandatory|
|sort\_order|int|Display order within group|
|formula\_hint|text|e.g., 'ER = (N1+N4)/N' shown as helper text|
|max\_marks\_contribution|numeric|Marks this question's answer affects|

### **Table: sar\_responses**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|dept\_id|uuid FK → departments.id||
|question\_id|uuid FK → criteria\_questions.id||
|academic\_year|text NOT NULL|e.g., 2024-25|
|answer\_text|text|User's text answer|
|answer\_numeric|numeric|For number-type questions|
|answered\_by|uuid FK → auth.users|Faculty who filled it|
|updated\_at|timestamptz|Last edit timestamp|

### **Table: generated\_sar (AI output storage)**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|dept\_id|uuid FK → departments.id||
|criterion\_code|text NOT NULL|C1 | C4 | C5|
|academic\_year|text NOT NULL||
|generated\_text|text|Full AI-generated SAR narrative|
|ai\_score\_estimate|numeric|AI estimated marks (e.g., 87.5)|
|model\_used|text|claude-sonnet-4-6 etc.|
|generated\_at|timestamptz||
|is\_approved|bool DEFAULT false|HOD approval flag|

## **4.2 RAG / Knowledge Base Tables**
### **Table: knowledge\_chunks (pgvector powered)**
Requires: Enable pgvector extension in Supabase Dashboard → Extensions → pgvector

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|source\_type|text|gapc\_v4 | nba\_circular | annexure | institution\_doc|
|source\_name|text|e.g., 'GAPC V4.0 Criterion 1'|
|chunk\_text|text NOT NULL|Chunked content (500-800 tokens per chunk)|
|embedding|vector(1536)|pgvector column — requires extension enabled|
|institution\_id|uuid nullable|NULL for global NBA docs, set for institution docs|
|dept\_id|uuid nullable|NULL unless dept-specific doc|
|metadata|jsonb|page\_number, section, criterion\_code etc.|
|created\_at|timestamptz||

### **SQL: Create vector similarity search function**
CREATE OR REPLACE FUNCTION match\_chunks(query\_embedding vector(1536), match\_threshold float, match\_count int, p\_institution\_id uuid DEFAULT NULL) RETURNS TABLE(id uuid, chunk\_text text, source\_name text, similarity float) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY SELECT kc.id, kc.chunk\_text, kc.source\_name, 1 - (kc.embedding <=> query\_embedding) AS similarity FROM knowledge\_chunks kc WHERE (kc.institution\_id IS NULL OR kc.institution\_id = p\_institution\_id) AND 1 - (kc.embedding <=> query\_embedding) > match\_threshold ORDER BY similarity DESC LIMIT match\_count; END; $$;

### **Table: ai\_instructions (Prompt management)**

|**Column**|**Type**|**Notes**|
| :- | :- | :- |
|id|uuid (PK)||
|feature\_key|text UNIQUE NOT NULL|sar\_generator | chatbot | audit\_sim | scoring|
|system\_prompt|text NOT NULL|System prompt for this feature|
|user\_prompt\_template|text|Template with {placeholders}|
|model\_preference|text|claude-sonnet-4-6 | claude-haiku-4-5|
|max\_tokens|int DEFAULT 2000|Output token limit|
|temperature|numeric DEFAULT 0.3|Lower = more factual|
|is\_active|bool DEFAULT true|Toggle prompts without deletion|
|updated\_by|uuid FK → auth.users|Admin who last edited|
|updated\_at|timestamptz||


# **5. Row Level Security (RLS) Policies**

Supabase's built-in RLS is critical for department isolation — a faculty from CSE must never read or write ECE data. Enable RLS on all tables and apply these policies.

|**Table**|**Policy Type**|**Rule Description**|
| :- | :- | :- |
|departments|SELECT|Users can only see departments in their institution\_id|
|sar\_responses|ALL|Users can only read/write responses where dept\_id matches their department|
|generated\_sar|SELECT|Faculty see own dept; NBA Coordinator sees all in institution|
|knowledge\_chunks|SELECT|Global chunks (institution\_id IS NULL) visible to all; dept chunks scoped by dept\_id|
|ai\_instructions|SELECT|All authenticated users can read; only super\_admin can update|
|criteria\_questions|SELECT|All authenticated users — questions are global|

### **Sample RLS policy for sar\_responses:**
ALTER TABLE sar\_responses ENABLE ROW LEVEL SECURITY; CREATE POLICY dept\_isolation ON sar\_responses FOR ALL USING (dept\_id IN (SELECT id FROM departments WHERE institution\_id = (SELECT institution\_id FROM user\_profiles WHERE user\_id = auth.uid())));


# **6. AI Non-Functional Requirements**

|**Requirement**|**Target**|**Strategy**|
| :- | :- | :- |
|Response Latency (Chatbot)|< 3 seconds first token|Use SSE streaming; show response token-by-token|
|SAR Generation Time|< 45 seconds per criterion|Background job; notify on completion|
|Token Cost (SAR Gen)|< $0.05 per criterion generation|Use Haiku for drafts, Sonnet only for final|
|AI Accuracy (Scoring)|> 85% alignment with NBA scores|Rule-based scoring layer on top of LLM|
|RAG Retrieval Precision|> 80% relevant chunks in top-5|Chunk size: 600 tokens, 50-token overlap|
|Concurrent AI Requests|50+ simultaneous users|Request queue with priority for SAR generation|
|Availability|99\.5% uptime|Supabase Edge Functions + retry logic|
|Data Privacy|Zero data leakage|Institution data never in shared RAG index|

## **6.1 Token Optimization Rules**
- Never send full 50 questions to API — only answered questions (avg 20-30 per criterion)
- Compress table data into single-line format before inserting into prompt
- Use Haiku for: quick scoring, simple Q&A, format validation
- Use Sonnet for: SAR narrative generation, audit simulation, complex reasoning
- Cache RAG embeddings — never re-embed the same document twice
- Use streaming for chatbot — reduces perceived latency without reducing accuracy


# **7. Phase 1 Build Scope**

|**Feature**|**Status**|**Priority**|**Est. Effort**|
| :- | :- | :- | :- |
|SAR Generator — C1, C4, C5 (3 criteria)|IN SCOPE|P0|3 weeks|
|AI Chatbot with GAPC V4.0 RAG|IN SCOPE|P0|2 weeks|
|Supabase Auth + RLS + Schema|IN SCOPE|P0|1 week|
|Question Bank (150 questions)|IN SCOPE|P0|0\.5 weeks|
|Downloadable SAR (HTML/PDF)|IN SCOPE|P0|1 week|
|AI Readiness Scoring Engine|IN SCOPE|P1|2 weeks|
|Mock Audit Simulator|PHASE 2|P1|3 weeks|
|CO-PO Mapping Engine|PHASE 2|P1|4 weeks|
|Remaining 6 Criteria (C2,C3,C6,C7,C8,C9)|PHASE 2|P1|4 weeks|
|Multi-tenant Auth (Institution login)|PHASE 2|P2|2 weeks|
|Document Vault|PHASE 2|P2|2 weeks|

*Document prepared by AccreditIQ Development Team | April 2026 | For internal use only.*
