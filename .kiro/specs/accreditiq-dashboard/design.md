# Design Document — AccreditIQ Dashboard

## Overview

AccreditIQ is an NBA SAR automation platform for GAPC V4.0 accreditation. The dashboard is the primary interface for three user roles (AC, CO, IR) to monitor institutional readiness, manage evidence, track compliance gaps, assign tasks, and consume AI-assisted insights across all nine GAPC criteria (C1–C9).

---

## User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| AC (Accreditation Coordinator) | Owns the SAR process end-to-end | Full read/write across all panels and criteria |
| CO (Compliance Officer) | Manages evidence and tasks for assigned criteria | Read/write scoped to assigned criteria |
| IR (Internal Reviewer) | Reviews progress and exports reports | Read-only across all panels |

---

## Information Architecture

### Top Navigation (Topbar)
- Institution name and logo
- SAR cycle selector (dropdown)
- Notification bell with unread count badge
- User profile menu (name, role, logout)

### Left Sidebar (Collapsible)
- Readiness Ring (home)
- C1–C9 Criterion Cards
- Gaps Panel
- Tasks Panel
- AI Insights Panel
- Evidence Panel
- Activity Feed / Audit Trail

### Main Content Area
Seven dashboard panels rendered in the main content area based on sidebar selection.

---

## Dashboard Panels

### Panel 1: Readiness Ring
- Circular progress indicator showing overall SAR readiness score (0–100)
- Numeric percentage label at center
- Color-coded arc (red < 50, amber 50–79, green ≥ 80)

### Panel 2: C1–C9 Criterion Cards
- Nine cards, one per GAPC V4.0 criterion
- Each card: criterion ID, title, completion %, status badge
- Click navigates to criterion detail view

### Panel 3: Gaps Panel
- List of active compliance gaps
- Each gap: description, affected criterion, severity (Critical / Major / Minor), assigned owner
- Filter by severity, criterion, owner
- Resolved gaps moved to history

### Panel 4: Tasks Panel
- List of tasks with title, assignee, due date, priority, status
- Create / edit / complete / delete actions
- Filter by assignee, status, priority
- Overdue tasks highlighted

### Panel 5: AI Insights Panel
- NL explanations for readiness score and recent changes
- Risk scores per criterion (0–1 scale)
- Audit suggestions for criteria below 80% completion
- Natural language query interface with source-grounded responses
- Degraded mode when AI_Service is unavailable

### Panel 6: Evidence Panel
- Document list with name, type, upload date, uploader, criterion mapping
- Upload, view, delete actions
- AI-assisted criterion auto-detection on upload
- Filter by criterion

### Panel 7: Activity Feed / Audit Trail
- Chronological log of all user actions
- Each entry: timestamp, actor, action type, affected entity
- Reverse chronological order
- Immutable — no entries can be edited or deleted

---

## Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (global state) + React Query (server state / caching)
- **Routing**: React Router v6
- **Charts**: Recharts (readiness ring, marks chart)
- **Real-time**: WebSocket / SSE for live updates

### Component Hierarchy

```
App
├── AuthGuard
├── DashboardShell
│   ├── Topbar
│   ├── Sidebar (collapsible)
│   └── MainContent
│       ├── ReadinessRingPanel
│       ├── CriterionCardsPanel (C1–C9)
│       ├── GapsPanel
│       ├── TasksPanel
│       ├── AIInsightsPanel
│       ├── EvidencePanel
│       └── ActivityFeedPanel
```

---

## Backend Service Architecture

| Service | Responsibility |
|---------|---------------|
| Auth_Service | Authentication, JWT issuance/refresh, RBAC enforcement |
| SAR_Data_Service | SAR data fetch, caching, 60s refresh cycle |
| Document_Service | Document storage, criterion association, AI evidence detection trigger |
| Calculation_Service | Readiness score computation, criterion completion percentages |
| AI_Service | NL explanations, gap analysis, risk scoring, source-grounded responses |
| Notification_Service | In-app and email notifications for task reminders and alerts |
| Audit_Trail_Service | Immutable audit log recording and querying |
| Export_Service | PDF and XLSX generation scoped to user RBAC |

---

## Data Model (Key Entities)

1. User (id, name, email, role, assigned_criteria[])
2. SARCycle (id, institution_id, year, status)
3. Criterion (id, code, title, description)
4. CriterionState (id, criterion_id, cycle_id, completion_pct, status)
5. Evidence (id, document_id, criterion_id, uploaded_by, upload_date)
6. Document (id, name, type, storage_url, uploaded_by, upload_date)
7. Gap (id, criterion_id, description, severity, owner_id, status, resolved_at)
8. Task (id, title, assignee_id, due_date, priority, status, completed_at)
9. AIInsight (id, criterion_id, explanation, risk_score, generated_at, evidence_refs[])
10. AuditEntry (id, timestamp, actor_id, action_type, entity_type, entity_id)
11. Notification (id, user_id, message, read, created_at)
12. Export (id, requested_by, format, status, file_url, created_at)

---

## API Endpoints (Key)

- `GET /api/sar/{cycle_id}/readiness` — overall readiness score
- `GET /api/sar/{cycle_id}/criteria` — all criterion states
- `GET /api/sar/{cycle_id}/gaps` — active gaps
- `POST /api/sar/{cycle_id}/gaps/{gap_id}/resolve` — resolve a gap
- `GET /api/sar/{cycle_id}/tasks` — task list
- `POST /api/sar/{cycle_id}/tasks` — create task
- `PATCH /api/sar/{cycle_id}/tasks/{task_id}` — update task
- `GET /api/sar/{cycle_id}/evidence` — evidence list
- `POST /api/sar/{cycle_id}/evidence` — upload document
- `DELETE /api/sar/{cycle_id}/evidence/{doc_id}` — delete document
- `GET /api/sar/{cycle_id}/insights` — AI insights
- `POST /api/sar/{cycle_id}/insights/query` — NL query
- `GET /api/audit` — audit trail
- `POST /api/export` — request export
- `GET /api/export/{export_id}` — download export

---

## AI Intelligence Layer

- **Readiness Scoring**: Weighted aggregation of criterion completion percentages; score ∈ [0, 100]
- **Evidence Detection**: NLP-based mapping of uploaded documents to relevant criteria
- **Gap Analysis**: Rule-based + ML classification of gaps into Critical / Major / Minor
- **Risk Scoring**: Per-criterion risk score ∈ [0, 1] based on gap severity and evidence coverage
- **NL Explanations**: GPT-based generation grounded in specific evidence items and criterion data
- **Audit Suggestions**: Automated recommendations for criteria below 80% completion
- **Source-Grounded Responses**: All AI responses cite specific evidence item IDs

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Readiness Score Bounded Range

*For any* combination of criterion completion states and evidence items, the readiness score produced by the Calculation_Service SHALL be a numeric value in the closed interval [0, 100].

**Validates: Requirements 2.2**

---

### Property 2: Evidence Addition Monotonicity

*For any* SAR state, adding a valid evidence item to a criterion SHALL result in a readiness score that is greater than or equal to the score before the addition.

**Validates: Requirements 2.3**

---

### Property 3: Evidence Removal Anti-Monotonicity

*For any* SAR state, removing an evidence item from a criterion SHALL result in a readiness score that is less than or equal to the score before the removal.

**Validates: Requirements 2.4**

---

### Property 4: Gap Severity Completeness

*For any* gap produced by the Gap_Analyzer, the gap's severity field SHALL be exactly one of the values: "Critical", "Major", or "Minor" — no other values are valid.

**Validates: Requirements 4.2**

---

### Property 5: AI Risk Score Bounded Range

*For any* criterion state and evidence set provided to the AI_Service, the risk score produced SHALL be a numeric value in the closed interval [0, 1].

**Validates: Requirements 6.4**

---

### Property 6: AI Insight Source Grounding

*For any* insight generated by the AI_Service, the insight object SHALL reference at least one evidence item identifier or criterion data point from the current SAR state.

**Validates: Requirements 6.2**

---

### Property 7: RBAC Write Rejection for IR Role

*For any* write operation (POST, PUT, PATCH, DELETE) submitted by a user with the IR role, the Auth_Service SHALL return a 403 Forbidden response regardless of the target resource.

**Validates: Requirements 8.3**

---

### Property 8: RBAC Write Rejection for Unassigned CO Criteria

*For any* write operation submitted by a CO user targeting a criterion not in that user's assigned criteria set, the Auth_Service SHALL return a 403 Forbidden response.

**Validates: Requirements 8.5**

---

### Property 9: Unauthenticated Request Rejection

*For any* API endpoint and any request lacking a valid authentication token, the Auth_Service SHALL return a 401 Unauthorized response.

**Validates: Requirements 8.4**

---

### Property 10: Audit Trail Immutability

*For any* audit entry recorded by the Audit_Trail_Service, querying that entry at any later point in time SHALL return the identical timestamp, actor, action type, and entity identifier as when it was first recorded.

**Validates: Requirements 10.5**

---

### Property 11: Document Deletion Removes All Associations

*For any* document stored in the Document_Service, deleting that document SHALL result in zero criterion associations remaining for that document identifier across all criteria.

**Validates: Requirements 7.3**

---

### Property 12: Task Creation Requires Assignee and Due Date

*For any* task creation request, if either the assignee or the due date field is absent or null, the Task_Manager SHALL reject the request and leave the task list unchanged.

**Validates: Requirements 5.2**

---

### Property 13: Export Role Scoping

*For any* export request, the generated file SHALL contain only data that the requesting user's role is authorized to read — no data from panels or criteria outside the user's RBAC scope SHALL appear in the export.

**Validates: Requirements 10.1**
