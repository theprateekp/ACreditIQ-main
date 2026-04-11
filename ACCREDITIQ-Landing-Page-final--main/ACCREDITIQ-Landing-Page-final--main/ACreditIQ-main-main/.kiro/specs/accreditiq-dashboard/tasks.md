# Implementation Plan: AccreditIQ Dashboard

## Overview

Build the AccreditIQ NBA SAR automation dashboard as a standalone React + TypeScript + Vite application. The dashboard serves three roles (AC, CO, IR) with role-based rendering, displays readiness metrics across nine GAPC V4.0 criteria, and provides panels for gaps, tasks, AI insights, and activity feed.

## Tasks

- [x] 1. Project scaffold — Vite + React + TypeScript + Tailwind CSS
  - Initialize Vite project with React + TypeScript template
  - Install and configure Tailwind CSS with custom color tokens (navy/blue/surface palette)
  - Install dependencies: recharts, @reduxjs/toolkit, react-redux, @tanstack/react-query
  - Create folder structure: src/types, src/data, src/store, src/hooks, src/components/layout, src/components/ui, src/components/charts, src/components/dashboard, src/pages
  - Configure tsconfig paths and vite aliases
  - _Requirements: 11.1_

- [-] 2. TypeScript types and mock data layer
  - [x] 2.1 Define all TypeScript interfaces in src/types/index.ts
    - User (id, name, role: 'AC'|'CO'|'IR', assignedCriteria), Criterion (id C1–C9, title, completionPct, status, evidenceCount), Evidence, Task (id, title, assignee, dueDate, priority, status), Gap (id, description, criterionId, severity: 'Critical'|'Major'|'Minor', owner), AIInsight (id, text, confidenceScore, sourceRefs, criterionId), AuditEntry (id, timestamp, actor, actionType, entityId)
    - _Requirements: 3.2, 4.1, 5.1, 6.1, 10.3_
  - [ ]* 2.2 Write property test for Gap severity completeness
    - **Property 4: Gap Severity Completeness**
    - **Validates: Requirements 4.2**
  - [x] 2.3 Create src/data/mockData.ts with realistic mock data
    - Nine criteria C1–C9 with titles, completion percentages, statuses
    - Mock readiness score (0–100), mock KPI values
    - Mock gaps (mix of Critical/Major/Minor severities across criteria)
    - Mock tasks with assignees, due dates, priorities, statuses (including overdue)
    - Mock AI insights with confidence scores and source references
    - Mock audit entries (chronological activity feed)
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 10.3_
  - [ ]* 2.4 Write property test for readiness score bounded range
    - **Property 1: Readiness Score Bounded Range**
    - **Validates: Requirements 2.2**

- [-] 3. Redux store — auth and UI slices
  - [x] 3.1 Create src/store/authSlice.ts
    - State: currentUser (User | null), isAuthenticated
    - Actions: setUser, logout
    - Selector: selectCurrentUser, selectUserRole
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 3.2 Create src/store/uiSlice.ts
    - State: sidebarCollapsed (boolean), activePanel (string), severityFilter (string | null), assigneeFilter (string | null)
    - Actions: toggleSidebar, setActivePanel, setSeverityFilter, setAssigneeFilter
    - _Requirements: 1.2, 1.3, 4.4, 5.5_
  - [x] 3.3 Create src/store/index.ts wiring both slices
    - Configure store with authSlice and uiSlice reducers
    - Export RootState and AppDispatch types
    - _Requirements: 1.4_

- [x] 4. React Query data hook
  - Create src/hooks/useDashboardData.ts
  - useQuery hooks for: criteria, readinessScore, gaps, tasks, aiInsights, activityFeed
  - Use mock data as query functions with simulated 300ms delay
  - Export individual hooks: useCriteria, useReadinessScore, useGaps, useTasks, useAIInsights, useActivityFeed
  - _Requirements: 9.1, 9.2, 9.4_

- [-] 5. UI primitives
  - [x] 5.1 Create src/components/ui/RoleGate.tsx
    - Props: allowedRoles: Role[], children, fallback?: ReactNode
    - Reads role from Redux auth state
    - Renders children only if currentUser.role is in allowedRoles, else renders fallback or null
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 5.2 Create src/components/ui/StatusBadge.tsx
    - Props: status: string, variant: 'criterion'|'gap'|'task'
    - Color-coded pill badges using Tailwind classes matching the color system
    - _Requirements: 3.2, 4.1, 5.1_
  - [x] 5.3 Create src/components/ui/KPITile.tsx
    - Props: label, value, icon?, trend?, accentColor?
    - Surface card with label, large numeric value, optional trend indicator
    - _Requirements: 2.1_

- [-] 6. Dashboard shell layout
  - [x] 6.1 Create src/components/layout/TopBar.tsx
    - Sticky topbar: institution name "GAPC V4.0 — SAR Dashboard", SAR cycle selector, notification bell icon, user profile menu (name + role badge)
    - Uses Redux auth state for user info
    - _Requirements: 1.1_
  - [x] 6.2 Create src/components/layout/Sidebar.tsx
    - Collapsible left sidebar with nav links for 7 panels: Overview, Criteria, Gaps, Tasks, AI Insights, Evidence, Activity
    - Collapsed state shows icon-only with tooltip
    - Active panel highlighted; dispatches setActivePanel on click
    - Reads/writes sidebarCollapsed from Redux uiSlice
    - _Requirements: 1.2, 1.3_
  - [x] 6.3 Create src/components/layout/DashboardShell.tsx
    - Composes TopBar + Sidebar + main content area
    - Responsive: sidebar collapses on mobile (< 768px)
    - Passes activePanel to render correct panel component
    - _Requirements: 1.4, 1.5_

- [-] 7. Readiness Ring panel
  - [x] 7.1 Create src/components/charts/ReadinessRing.tsx
    - Recharts RadialBarChart displaying overall readiness score
    - Numeric percentage label centered inside the ring
    - Color transitions: red < 50, amber 50–79, green ≥ 80
    - _Requirements: 2.1, 2.5_
  - [ ] 7.2 Add KPI tiles row to Overview panel in DashboardPage
    - Four KPITile components: Total Criteria (9), Evidence Gaps count, Overdue Tasks count, Days to Deadline
    - Data sourced from useDashboardData hooks
    - _Requirements: 2.1_
  - [ ]* 7.3 Write property test for evidence addition monotonicity
    - **Property 2: Evidence Addition Monotonicity**
    - **Validates: Requirements 2.3**
  - [ ]* 7.4 Write property test for evidence removal anti-monotonicity
    - **Property 3: Evidence Removal Anti-Monotonicity**
    - **Validates: Requirements 2.4**

- [-] 8. Criterion Cards panel
  - [x] 8.1 Create src/components/dashboard/CriterionCard.tsx
    - Displays: criterion ID badge (C1–C9), title, completion percentage bar, status badge
    - Click handler dispatches navigation to criterion detail (setActivePanel)
    - Error state with retry option
    - _Requirements: 3.1, 3.2, 3.3, 3.5_
  - [x] 8.2 Create src/components/dashboard/CriteriaGrid.tsx
    - 3-column responsive grid of CriterionCard components
    - Renders all 9 cards from useCriteria hook
    - _Requirements: 3.1, 3.4_

- [-] 9. Gaps panel
  - [x] 9.1 Create src/components/dashboard/GapsPanel.tsx
    - List of gap items: description, affected criterion badge, severity badge (Critical/Major/Minor), owner
    - Severity filter buttons (All / Critical / Major / Minor) dispatching setSeverityFilter
    - Reads severityFilter from Redux uiSlice to filter displayed gaps
    - Empty state message when no active gaps
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
  - [ ]* 9.2 Write property test for gap severity completeness
    - **Property 4: Gap Severity Completeness**
    - **Validates: Requirements 4.2**

- [-] 10. Tasks panel
  - [x] 10.1 Create src/components/dashboard/TasksPanel.tsx
    - Task list rows: title, assignee avatar/name, due date, priority badge, status badge
    - Overdue tasks highlighted with Critical color border/background
    - Assignee filter dropdown dispatching setAssigneeFilter
    - Reads assigneeFilter from Redux uiSlice
    - _Requirements: 5.1, 5.4, 5.5_
  - [ ]* 10.2 Write property test for task creation validation
    - **Property 12: Task Creation Requires Assignee and Due Date**
    - **Validates: Requirements 5.2**

- [-] 11. AI Insights panel
  - [x] 11.1 Create src/components/dashboard/AIInsightsPanel.tsx
    - Insight cards: NL explanation text, confidence score bar, source reference chips
    - Audit suggestions for criteria below 80% completion
    - Degraded-mode banner when AI service unavailable (simulated via mock flag)
    - _Requirements: 6.1, 6.2, 6.5, 6.7_
  - [ ]* 11.2 Write property test for AI risk score bounded range
    - **Property 5: AI Risk Score Bounded Range**
    - **Validates: Requirements 6.4**
  - [ ]* 11.3 Write property test for AI insight source grounding
    - **Property 6: AI Insight Source Grounding**
    - **Validates: Requirements 6.2_

- [x] 12. Activity Feed
  - Create src/components/dashboard/ActivityFeed.tsx
  - Chronological list of audit entries: timestamp, actor name + role badge, action type, affected entity
  - Entries in reverse chronological order
  - _Requirements: 10.3, 10.6_

- [x] 13. Marks Distribution chart
  - Create src/components/charts/MarksDistributionChart.tsx
  - Recharts BarChart showing per-criterion completion percentages (C1–C9 on x-axis)
  - Color bars matching criterion status (green/amber/red)
  - _Requirements: 3.2_

- [x] 14. Quick Actions bar
  - Create src/components/dashboard/QuickActionsBar.tsx
  - Role-gated action buttons:
    - AC + CO: "Upload Evidence", "Add Task", "Run Gap Analysis"
    - AC only: "Export Report", "Generate AI Insights"
    - IR: no action buttons (read-only banner)
  - Uses RoleGate component for each button group
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 15. Compose DashboardPage and wire App
  - [x] 15.1 Create src/pages/DashboardPage.tsx
    - Reads activePanel from Redux uiSlice
    - Renders correct panel component based on activePanel
    - Default panel: Overview (ReadinessRing + KPI tiles + CriteriaGrid + MarksDistributionChart)
    - Includes QuickActionsBar at top of content area
    - _Requirements: 1.5_
  - [x] 15.2 Update src/App.tsx
    - Wrap app in Redux Provider and React Query QueryClientProvider
    - Seed Redux store with a default mock user (role: AC) on load
    - Render DashboardShell
    - _Requirements: 1.4_
  - [x] 15.3 Update src/main.tsx
    - Standard Vite entry point rendering App into #root
    - Import global Tailwind CSS

- [x] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npm run build` to verify no TypeScript or Vite build errors

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Color system: bg-[#0A1628] navy, bg-[#0F2044] surface, border-[#1E3A5F], accent blue-600, success emerald-500, warning amber-500, critical red-500
