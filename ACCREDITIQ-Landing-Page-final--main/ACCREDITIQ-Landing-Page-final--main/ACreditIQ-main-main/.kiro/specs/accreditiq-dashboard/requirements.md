# Requirements Document

## Introduction

AccreditIQ is an NBA SAR (Self-Assessment Report) automation platform for GAPC V4.0 accreditation. The dashboard is the primary interface for three user roles — Accreditation Coordinator (AC), Compliance Officer (CO), and Internal Reviewer (IR) — to monitor institutional readiness, manage evidence, track compliance gaps, assign tasks, and generate AI-assisted insights across all nine GAPC criteria (C1–C9).

This document derives functional, role-based, performance, security, and AI requirements from the approved design, and includes correctness properties for property-based testing.

---

## Glossary

- **Dashboard_Shell**: The top-level layout component comprising the sticky topbar, collapsible left sidebar, and main content area.
- **Topbar**: The sticky horizontal navigation bar at the top of the dashboard.
- **Sidebar**: The collapsible left navigation panel linking to all seven dashboard panels.
- **Readiness_Ring**: The circular progress indicator displaying the overall SAR readiness score (0–100).
- **Criterion_Card**: One of nine cards (C1–C9) representing a GAPC V4.0 criterion, showing completion percentage and status.
- **Gaps_Panel**: The dashboard panel listing all identified compliance gaps with severity classification.
- **Tasks_Panel**: The dashboard panel listing all pending and completed tasks with assignee, due date, and priority.
- **AI_Insights_Panel**: The dashboard panel displaying AI-generated natural language explanations, risk scores, and audit suggestions.
- **Evidence_Panel**: The dashboard panel for uploading, viewing, and managing supporting documents mapped to criteria.
- **Activity_Feed**: The chronological log of all user actions displayed in the dashboard.
- **Auth_Service**: The backend service responsible for authentication, session management, and RBAC enforcement.
- **SAR_Data_Service**: The backend service responsible for fetching and caching SAR data.
- **Document_Service**: The backend service responsible for document storage, retrieval, and criterion association.
- **Calculation_Service**: The backend service responsible for computing readiness scores and criterion completion percentages.
- **AI_Service**: The backend service responsible for readiness scoring explanations, gap analysis, risk scoring, and source-grounded NL responses.
- **Notification_Service**: The backend service responsible for delivering in-app and email notifications.
- **Audit_Trail_Service**: The backend service responsible for recording and serving immutable audit log entries.
- **Export_Service**: The backend service responsible for generating PDF and XLSX exports.
- **Task_Manager**: The component responsible for creating, assigning, updating, and completing tasks.
- **Gap_Analyzer**: The component responsible for identifying and classifying compliance gaps.
- **AC**: Accreditation Coordinator — full read/write access across all panels and criteria.
- **CO**: Compliance Officer — read/write access scoped to assigned criteria only.
- **IR**: Internal Reviewer — read-only access across all panels.
- **GAPC_V4.0**: The accreditation framework defining nine criteria (C1–C9) evaluated in the SAR.
- **SAR**: Self-Assessment Report — the primary accreditation submission document.
- **RBAC**: Role-Based Access Control — the access control model enforced at the API layer.

---

## Requirements

### Requirement 1: Dashboard Shell Layout

**User Story:** As any authenticated user, I want a consistent shell layout with topbar and sidebar navigation, so that I can orient myself and move between dashboard panels efficiently.

#### Acceptance Criteria

1. THE Dashboard_Shell SHALL render a sticky topbar containing the institution name, SAR cycle selector, notification bell, and user profile menu.
2. THE Dashboard_Shell SHALL render a collapsible left sidebar containing navigation links for all seven dashboard panels.
3. WHEN the sidebar is collapsed, THE Dashboard_Shell SHALL keep all navigation links accessible via icon-only buttons with visible tooltips.
4. WHEN a user navigates between panels, THE Dashboard_Shell SHALL preserve the topbar and sidebar state without a full page reload.
5. WHEN the dashboard is first loaded, THE Dashboard_Shell SHALL display the Readiness Ring panel as the default active view.

---

### Requirement 2: Readiness Ring Panel

**User Story:** As an AC or CO, I want to see an overall SAR readiness score displayed as a circular progress indicator, so that I can quickly assess institutional preparedness at a glance.

#### Acceptance Criteria

1. THE Readiness_Ring SHALL display the overall SAR readiness score as a circular progress indicator with a numeric percentage label.
2. WHEN the readiness score is calculated, THE Calculation_Service SHALL produce a score value between 0 and 100 inclusive.
3. WHEN evidence items are added to a criterion, THE Calculation_Service SHALL recalculate the readiness score and the updated value SHALL be greater than or equal to the previous value.
4. WHEN evidence items are removed from a criterion, THE Calculation_Service SHALL recalculate the readiness score and the updated value SHALL be less than or equal to the previous value.
5. WHEN the readiness score changes, THE Readiness_Ring SHALL reflect the updated value within the next data refresh cycle.

---

### Requirement 3: C1–C9 Criterion Cards Panel

**User Story:** As an AC or CO, I want to see one card per GAPC V4.0 criterion showing completion status, so that I can identify which criteria need attention.

#### Acceptance Criteria

1. THE Dashboard_Shell SHALL render exactly nine Criterion_Cards, one for each GAPC V4.0 criterion (C1 through C9).
2. EACH Criterion_Card SHALL display the criterion identifier, title, completion percentage, and a status indicator (e.g., Not Started, In Progress, Complete).
3. WHEN a Criterion_Card is clicked, THE Dashboard_Shell SHALL navigate to the detailed view for that criterion.
4. WHEN criterion data is updated, THE Criterion_Card SHALL reflect the updated completion percentage within the next data refresh cycle.
5. IF criterion data cannot be loaded, THEN THE Criterion_Card SHALL display an error state with a retry option.

---

### Requirement 4: Gaps Panel

**User Story:** As an AC or CO, I want to see all identified compliance gaps with severity classifications, so that I can prioritize remediation efforts.

#### Acceptance Criteria

1. THE Gaps_Panel SHALL display all active compliance gaps, each showing gap description, affected criterion, severity, and assigned owner.
2. WHEN gap analysis is run, THE Gap_Analyzer SHALL classify each identified gap as exactly one of: Critical, Major, or Minor.
3. WHEN a gap is marked as resolved, THE Gaps_Panel SHALL remove it from the active gaps list and move it to a resolved gaps history.
4. WHEN the Gaps_Panel is filtered by severity, THE Gaps_Panel SHALL display only gaps matching the selected severity level.
5. IF no active gaps exist, THEN THE Gaps_Panel SHALL display a confirmation message indicating full compliance for the current criteria set.

---

### Requirement 5: Tasks Panel

**User Story:** As an AC or CO, I want to manage a task queue with assignees and due dates, so that I can coordinate remediation work across the team.

#### Acceptance Criteria

1. THE Tasks_Panel SHALL display all tasks with task title, assignee, due date, priority, and current status.
2. WHEN a task is created, THE Task_Manager SHALL require an assignee and a due date before persisting the task.
3. WHEN a task is marked as complete, THE Task_Manager SHALL update the task status to "Complete" and record the completion timestamp.
4. WHEN a task's due date passes without completion, THE Notification_Service SHALL send a reminder notification to the assignee.
5. WHEN the Tasks_Panel is filtered by assignee, THE Tasks_Panel SHALL display only tasks assigned to the selected user.
6. IF a task is deleted, THEN THE Task_Manager SHALL remove it from the active task list and record the deletion in the audit trail.

---

### Requirement 6: AI Insights Panel

**User Story:** As an AC, I want AI-generated insights explaining readiness score changes and surfacing risks, so that I can make informed decisions without manually reviewing all evidence.

#### Acceptance Criteria

1. THE AI_Insights_Panel SHALL display natural language explanations for the current readiness score and recent score changes.
2. WHEN the AI_Service generates an insight, THE AI_Service SHALL ground the explanation in at least one specific evidence item or criterion data point.
3. WHEN the AI_Service generates a readiness score explanation, THE AI_Service SHALL produce a non-empty string response.
4. WHEN the AI_Service calculates a risk score, THE AI_Service SHALL produce a value between 0 and 1 inclusive.
5. THE AI_Insights_Panel SHALL display audit suggestions generated by the AI_Service for each criterion with a completion percentage below 80%.
6. WHEN a user submits a natural language query in the AI_Insights_Panel, THE AI_Service SHALL return a source-grounded response citing specific evidence items.
7. IF the AI_Service is unavailable, THEN THE AI_Insights_Panel SHALL display a degraded-mode message and surface the last cached insights.

---

### Requirement 7: Evidence and Document Management

**User Story:** As a CO, I want to upload and manage supporting documents mapped to specific criteria, so that I can maintain a complete and traceable evidence record.

#### Acceptance Criteria

1. THE Evidence_Panel SHALL display all uploaded documents with name, file type, upload date, uploader, and criterion mapping.
2. WHEN a document is uploaded, THE Document_Service SHALL store the document and associate it with at least one GAPC criterion.
3. WHEN a document is deleted, THE Document_Service SHALL remove the document and all its criterion associations.
4. WHEN a document is uploaded, THE Document_Service SHALL trigger AI evidence detection to identify relevant criteria automatically.
5. WHEN the Evidence_Panel is filtered by criterion, THE Evidence_Panel SHALL display only documents associated with the selected criterion.
6. IF a document upload fails, THEN THE Document_Service SHALL return a descriptive error message and leave the evidence list unchanged.

---

### Requirement 8: Role-Based Access Control

**User Story:** As a system administrator, I want RBAC enforced at the API layer for all three user roles, so that users can only access and modify data appropriate to their role.

#### Acceptance Criteria

1. WHEN a user with the AC role is authenticated, THE Auth_Service SHALL grant full read and write access to all dashboard panels and all criteria.
2. WHEN a user with the CO role is authenticated, THE Auth_Service SHALL restrict write access to criteria assigned to that CO and grant read access to all panels.
3. WHEN a user with the IR role is authenticated, THE Auth_Service SHALL grant read-only access to all panels and reject all write operations with a 403 response.
4. WHEN an unauthenticated request is received by any API endpoint, THE Auth_Service SHALL return a 401 Unauthorized response.
5. WHEN a CO attempts a write operation on a criterion not assigned to them, THE Auth_Service SHALL return a 403 Forbidden response.
6. THE Auth_Service SHALL enforce RBAC checks at the API layer for every request, independent of frontend access controls.

---

### Requirement 9: Data Freshness and Real-Time Updates

**User Story:** As any authenticated user, I want dashboard data to stay current without requiring manual page refreshes, so that I always see the latest SAR state.

#### Acceptance Criteria

1. WHEN SAR data is fetched on initial load, THE SAR_Data_Service SHALL return a response within 3 seconds under normal load conditions.
2. THE SAR_Data_Service SHALL refresh all dashboard panel data at a maximum interval of 60 seconds.
3. WHEN a data mutation occurs (task update, document upload, gap resolution), THE Dashboard_Shell SHALL reflect the change in the affected panel within the next refresh cycle without a full page reload.
4. WHEN a data fetch fails, THE Dashboard_Shell SHALL display a stale-data warning banner and continue showing the last successfully fetched data.
5. WHERE real-time collaboration is enabled, THE Dashboard_Shell SHALL use WebSocket or server-sent events to push updates to all active sessions within 5 seconds of a change.

---

### Requirement 10: Export and Audit Trail

**User Story:** As an AC or IR, I want to export dashboard data and review an immutable audit trail, so that I can produce evidence for accreditation submissions and compliance reviews.

#### Acceptance Criteria

1. WHEN an export is requested, THE Export_Service SHALL generate a PDF or XLSX file containing all data visible to the requesting user's role.
2. WHEN an export is requested, THE Export_Service SHALL complete file generation within 30 seconds.
3. THE Activity_Feed SHALL display a chronological log of all user actions with timestamp, actor username, action type, and affected entity.
4. WHEN any user action is performed, THE Audit_Trail_Service SHALL record an entry containing timestamp, actor, action type, and affected entity identifier.
5. THE Audit_Trail_Service SHALL treat all recorded entries as immutable — no audit entry SHALL be modified or deleted after creation.
6. WHEN the audit trail is queried, THE Audit_Trail_Service SHALL return entries in reverse chronological order.

---

### Requirement 11: Non-Functional Requirements

**User Story:** As a platform operator, I want the dashboard to meet performance, security, and accessibility standards, so that it is reliable and usable for all accreditation stakeholders.

#### Acceptance Criteria

1. THE Dashboard_Shell SHALL complete initial load and render the above-the-fold content within 3 seconds on a standard broadband connection.
2. THE SAR_Data_Service SHALL complete all data refresh cycles within 60 seconds.
3. THE Auth_Service SHALL enforce RBAC at the API layer for every request without exception.
4. THE Dashboard_Shell SHALL be keyboard navigable — all interactive elements SHALL be reachable and operable via keyboard alone.
5. THE Dashboard_Shell SHALL meet WCAG 2.1 AA color contrast requirements for all text and interactive elements.
6. WHEN the system is under peak load (up to 200 concurrent users), THE SAR_Data_Service SHALL maintain response times within 5 seconds.
7. THE Auth_Service SHALL use short-lived JWT tokens with a maximum expiry of 1 hour and support token refresh without requiring re-login.

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
