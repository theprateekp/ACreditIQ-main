# Requirements Document

## Introduction

This feature extends the AccreditIQ dashboard with a complete role assignment and notification system. When any privileged user (Admin, NBA_Coordinator, or HOD) assigns a role, criteria, task, or evaluation parameters to another user, the recipient instantly receives an in-dashboard notification scoped to their own account. The system builds on the existing `notificationsSlice`, `TopBar` bell panel, and `AdminPage` assignment flows — adding coverage for task assignment, evaluation parameter assignment, and a dedicated Notifications panel — without altering any existing UI layout, design style, or core functionality.

## Glossary

- **Notification_System**: The end-to-end pipeline that creates, stores, delivers, and displays in-dashboard notifications for assignment events.
- **Assignment_Actor**: A user with role Admin, NBA_Coordinator, or HOD who performs an assignment action.
- **Recipient**: The user whose account receives a notification as a result of an assignment action.
- **Assignment_Event**: Any of the four triggering actions — role assignment, criteria assignment, task assignment, or evaluation parameter assignment.
- **Notification_Bell**: The bell icon in the TopBar that shows the unread badge count and opens the notification dropdown panel.
- **Notification_Panel**: The dropdown panel rendered below the Notification_Bell listing all notifications for the currently logged-in user.
- **Notification_Center**: A full-page or full-panel view accessible from the dashboard sidebar or Notification_Panel that lists all notifications with filtering and bulk actions.
- **notificationsSlice**: The Redux slice (`src/store/notificationsSlice.ts`) that holds all in-memory notification state.
- **AppNotification**: The TypeScript interface defined in `notificationsSlice` representing a single notification record.
- **AdminPage**: The existing `src/pages/AdminPage.tsx` component where role and criteria assignments are performed.
- **TasksPanel**: The existing `src/components/dashboard/TasksPanel.tsx` component where tasks are listed and can be assigned.
- **RoleGate**: The existing `src/components/ui/RoleGate.tsx` component used to conditionally render UI based on the current user's role.
- **Assignment_Actor_Role**: The set of roles permitted to trigger assignment events — Admin, NBA_Coordinator, HOD.
- **Evaluation_Parameter**: A configurable scoring weight or threshold tied to a criterion (e.g., marks weight, evidence threshold, risk tolerance).

---

## Requirements

### Requirement 1: Role Assignment Notification

**User Story:** As a faculty member or user, I want to receive an instant in-dashboard notification when my system role is changed, so that I am immediately aware of my new permissions and responsibilities.

#### Acceptance Criteria

1. WHEN an Assignment_Actor saves a role change for a Recipient in the AdminPage, THE Notification_System SHALL dispatch a `role_changed` notification to the Recipient's notification queue.
2. THE AppNotification for a role change SHALL include the new role name, the name of the Assignment_Actor, and a human-readable description of the change.
3. WHEN the Recipient's dashboard is active at the time of the role change, THE Notification_Bell SHALL update its unread badge count within 1 second of the dispatch.
4. IF the role submitted is identical to the Recipient's current role, THEN THE Notification_System SHALL NOT dispatch a duplicate `role_changed` notification.
5. THE Notification_System SHALL persist the `role_changed` notification in the Redux store so it remains visible until the Recipient explicitly marks it as read.

---

### Requirement 2: Criteria Assignment Notification

**User Story:** As a faculty member, I want to receive an in-dashboard notification when criteria are assigned to or removed from me, so that I know exactly which SAR criteria I am responsible for.

#### Acceptance Criteria

1. WHEN an Assignment_Actor adds one or more criteria to a Recipient's assigned criteria list and saves, THE Notification_System SHALL dispatch a `criteria_assigned` notification listing the newly added criteria IDs.
2. WHEN an Assignment_Actor removes one or more criteria from a Recipient's assigned criteria list and saves, THE Notification_System SHALL dispatch a `criteria_assigned` notification listing the removed criteria IDs with a removal indicator.
3. THE AppNotification message for criteria assignment SHALL name each affected criterion ID (e.g., "C4, C5") and state whether the criteria were added or removed.
4. IF no criteria are added or removed during a save operation, THEN THE Notification_System SHALL NOT dispatch a `criteria_assigned` notification for that save.
5. WHILE the Recipient is viewing the dashboard, THE Notification_Bell SHALL reflect the updated unread count immediately after a criteria assignment notification is dispatched.

---

### Requirement 3: Task Assignment Notification

**User Story:** As a faculty member, I want to receive an in-dashboard notification when a task is assigned to me, so that I can act on it promptly and meet deadlines.

#### Acceptance Criteria

1. WHEN an Assignment_Actor creates a new task and assigns it to a Recipient, THE Notification_System SHALL dispatch a `task_assigned` notification to the Recipient.
2. WHEN an Assignment_Actor reassigns an existing task from one user to a different Recipient, THE Notification_System SHALL dispatch a `task_assigned` notification to the new Recipient.
3. THE AppNotification for task assignment SHALL include the task title, the associated criterion ID, the due date, and the priority level.
4. IF a task is assigned to the same user who is currently assigned to it (no change), THEN THE Notification_System SHALL NOT dispatch a duplicate `task_assigned` notification.
5. THE `task_assigned` notification type SHALL be added to the `AppNotification` type union in `notificationsSlice` and the `TYPE_ICON` map in `TopBar`.
6. WHEN a task assignment notification is dispatched, THE Notification_Bell SHALL update the unread badge count within 1 second.

---

### Requirement 4: Evaluation Parameter Assignment Notification

**User Story:** As a faculty member, I want to receive an in-dashboard notification when evaluation parameters (marks weights, evidence thresholds, or risk tolerances) are assigned or updated for criteria I own, so that I can adjust my evidence collection accordingly.

#### Acceptance Criteria

1. WHEN an Assignment_Actor assigns or updates evaluation parameters for a criterion owned by a Recipient, THE Notification_System SHALL dispatch an `eval_param_assigned` notification to the Recipient.
2. THE AppNotification for evaluation parameter assignment SHALL include the criterion ID, the parameter name (e.g., "marks weight"), and the new value.
3. THE `eval_param_assigned` notification type SHALL be added to the `AppNotification` type union in `notificationsSlice` and the `TYPE_ICON` map in `TopBar`.
4. IF the submitted evaluation parameter value is identical to the existing value, THEN THE Notification_System SHALL NOT dispatch a duplicate `eval_param_assigned` notification.
5. WHEN an `eval_param_assigned` notification is dispatched, THE Notification_Bell SHALL update the unread badge count within 1 second.

---

### Requirement 5: Notification Bell and Dropdown Panel

**User Story:** As any logged-in user, I want a clearly visible notification bell in the top bar that shows my unread count and lets me read notifications inline, so that I never miss an assignment.

#### Acceptance Criteria

1. THE Notification_Bell SHALL display a numeric badge showing the count of unread notifications for the currently logged-in user.
2. WHEN the unread count exceeds 9, THE Notification_Bell badge SHALL display "9+" instead of the exact count.
3. WHEN the unread count is zero, THE Notification_Bell SHALL NOT display a badge.
4. WHEN a user clicks the Notification_Bell, THE Notification_Panel SHALL open as a dropdown below the bell icon.
5. THE Notification_Panel SHALL list notifications in reverse-chronological order (newest first).
6. WHEN a user clicks a notification item in the Notification_Panel, THE Notification_System SHALL mark that notification as read and update the unread badge count.
7. WHEN a user clicks "Mark all read" in the Notification_Panel, THE Notification_System SHALL mark all of the current user's notifications as read.
8. WHEN the Notification_Panel is open and the user clicks outside it, THE Notification_Panel SHALL close.
9. THE Notification_Panel SHALL display a "No notifications yet" empty state when the current user has no notifications.
10. THE Notification_Panel SHALL display a relative timestamp (e.g., "5m ago", "2h ago") for each notification.
11. THE Notification_Panel SHALL visually distinguish unread notifications from read ones (e.g., highlighted background, blue dot indicator).

---

### Requirement 6: Notification Center Panel

**User Story:** As any logged-in user, I want a dedicated Notification Center panel accessible from the dashboard where I can view, filter, and manage all my notifications in one place.

#### Acceptance Criteria

1. THE Notification_Center SHALL be accessible as a navigable panel within the existing dashboard sidebar navigation, using the panel ID `notifications`.
2. THE Notification_Center SHALL display all notifications for the currently logged-in user, sorted newest first.
3. THE Notification_Center SHALL provide filter tabs for notification types: All, Role Changes, Criteria, Tasks, Eval Params.
4. WHEN a filter tab is selected, THE Notification_Center SHALL display only notifications matching that type.
5. THE Notification_Center SHALL provide a "Mark all read" action that marks all of the current user's notifications as read.
6. WHEN a notification item is clicked in the Notification_Center, THE Notification_System SHALL mark it as read.
7. THE Notification_Center SHALL display the notification type icon, message, relative timestamp, and read/unread state for each item.
8. THE Notification_Center SHALL match the existing dashboard card and table visual style (dark theme, `var(--bg-surface)`, `var(--border)`, `var(--accent)` tokens).
9. IF the current user has no notifications matching the active filter, THE Notification_Center SHALL display an appropriate empty state message.

---

### Requirement 7: Notification Scoping and Security

**User Story:** As a user, I want to see only my own notifications, so that sensitive assignment information from other users' accounts is never exposed to me.

#### Acceptance Criteria

1. THE Notification_System SHALL scope all notification queries by `recipientId`, ensuring a user can only read notifications where `recipientId` equals their own user ID.
2. THE Notification_Panel and Notification_Center SHALL only render notifications whose `recipientId` matches the currently authenticated user's ID.
3. WHEN a user logs out, THE Notification_System SHALL not expose the previous user's notifications to the next user who logs in on the same session.
4. THE Notification_System SHALL only allow users with Assignment_Actor_Role (Admin, NBA_Coordinator, HOD) to trigger assignment notifications via the AdminPage and task assignment UI.
5. WHERE the RoleGate component is used to guard assignment actions, THE Notification_System SHALL rely on the same role checks to prevent unauthorized notification dispatch.

---

### Requirement 8: Notification Persistence and State Management

**User Story:** As a user, I want my notifications to remain visible across panel navigations within the same session, so that I do not lose track of unread items when switching dashboard views.

#### Acceptance Criteria

1. THE notificationsSlice SHALL store all notifications in the Redux store so they persist for the duration of the browser session.
2. WHEN a user navigates between dashboard panels, THE Notification_System SHALL retain all notification state without re-fetching or resetting.
3. THE notificationsSlice `pushNotification` reducer SHALL auto-generate a unique `id`, set `read` to `false`, and set `timestamp` to the current ISO string for every new notification.
4. THE notificationsSlice SHALL expose `selectUserNotifications(userId)` and `selectUnreadCount(userId)` selectors that filter by `recipientId`.
5. IF the Redux store is reset (e.g., on logout), THE Notification_System SHALL clear all notification state so no cross-user data leaks occur.

---

### Requirement 9: Notification Delivery Timing

**User Story:** As a user, I want assignment notifications to appear in near real-time so that I can respond to new responsibilities without delay.

#### Acceptance Criteria

1. WHEN an Assignment_Actor saves an assignment action, THE Notification_System SHALL dispatch the notification to the Redux store synchronously within the same user interaction event.
2. WHEN a notification is dispatched, THE Notification_Bell unread badge SHALL reflect the updated count within 1 second on the same browser client.
3. THE Notification_System SHALL not require a page refresh for new notifications to appear in the Notification_Bell or Notification_Panel.
4. WHERE a backend WebSocket or polling mechanism is available, THE Notification_System SHALL support receiving server-pushed notifications for cross-user real-time delivery.
5. WHERE no backend push mechanism is available, THE Notification_System SHALL fall back to Redux-only in-memory delivery, which covers same-session same-client assignment flows.

---

### Requirement 10: Existing UI and Feature Preservation

**User Story:** As a user, I want the notification feature to be added seamlessly without any change to the existing dashboard layout, design, or functionality, so that my workflow is not disrupted.

#### Acceptance Criteria

1. THE Notification_System SHALL NOT modify the visual layout, spacing, or component structure of any existing dashboard component other than adding the `notifications` panel entry to the sidebar navigation.
2. THE Notification_System SHALL NOT remove, rename, or alter the behaviour of any existing Redux action, selector, or reducer in `authSlice`, `uiSlice`, or the existing parts of `notificationsSlice`.
3. THE Notification_System SHALL NOT change the existing `TopBar` bell dropdown behaviour; it SHALL only extend it with the two new notification types (`task_assigned`, `eval_param_assigned`).
4. THE Notification_System SHALL preserve all existing role-based access controls enforced by `RoleGate` and `selectIsAdmin`.
5. THE Notification_System SHALL use the existing Tailwind CSS design tokens and CSS custom properties (`var(--bg-surface)`, `var(--accent)`, `var(--border)`, etc.) for all new UI elements.
