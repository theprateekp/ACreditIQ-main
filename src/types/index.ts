// ─── Roles ────────────────────────────────────────────────────────────────────
export type Role = 'Admin' | 'NBA_Coordinator' | 'HOD' | 'Faculty' | 'Viewer' | 'AC' | 'CO' | 'IR';

// ─── Role Groups (mirrors reference dashboard logic) ──────────────────────────
// 'Super Admin' roles: Admin, NBA_Coordinator, HOD
// 'Faculty Member' roles: Faculty, Viewer, AC, CO, IR
export type RoleGroup = 'Super Admin' | 'Faculty Member';

// ─── Criterion ────────────────────────────────────────────────────────────────
export type CriterionStatus = 'Not Started' | 'In Progress' | 'Complete';

export interface Criterion {
  id: string;           // C1–C9
  title: string;
  maxMarks: number;
  scoredMarks: number;
  completionPct: number;
  aiReadinessScore: number; // 0–100
  status: CriterionStatus;
  evidenceCount: number;
  requiredEvidence: number;
  gapCount: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

// ─── Gap ──────────────────────────────────────────────────────────────────────
export type GapSeverity = 'Critical' | 'Major' | 'Minor';
export type GapType = 'missing_document' | 'wrong_calculation' | 'weak_criterion' | 'incomplete_data';

export interface Gap {
  id: string;
  description: string;
  criterionId: string;
  severity: GapSeverity;
  type: GapType;
  marksImpact: number;
  suggestedFix: string;
  owner: string;
  resolved: boolean;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Complete' | 'Overdue';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  criterionId: string;
}

// ─── AI Insight ───────────────────────────────────────────────────────────────
export interface AIInsight {
  id: string;
  text: string;
  confidenceScore: number; // 0–1
  riskScore: number;       // 0–1
  sourceRefs: string[];
  criterionId: string;
  type: 'readiness' | 'risk' | 'suggestion';
}

// ─── Audit / Activity ─────────────────────────────────────────────────────────
export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: Role;
  actionType: string;
  entityId: string;
  entityType: string;
  description: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  roleGroup: RoleGroup;
  department?: string;
  assignedCriteria: string[];
  avatarInitials: string;
}

// ─── Evidence ─────────────────────────────────────────────────────────────────
export interface Evidence {
  id: string;
  name: string;
  fileType: string;
  uploadDate: string;
  uploader: string;
  criterionIds: string[];
  validationStatus: 'valid' | 'invalid' | 'pending' | 'flagged';
}

// ─── Dashboard aggregates ─────────────────────────────────────────────────────
export interface ReadinessScore {
  overall: number;
  estimatedMarks: number;
  totalMarks: number;
  byCategory: Record<string, number>;
}

export interface DashboardKPIs {
  totalCriteria: number;
  evidenceGaps: number;
  overdueTasks: number;
  daysToDeadline: number;
  totalDocuments: number;
  aiReadinessAvg: number;
}

// ─── AI Summary ───────────────────────────────────────────────────────────────
export interface AISummary {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  strongestCriterion: string;
  weakestCriterion: string;
  gaps: string[];
  suggestions: string[];
}
