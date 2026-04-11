import type {
  Criterion, Gap, Task, AIInsight, AuditEntry,
  ReadinessScore, DashboardKPIs, User, AISummary,
} from '@/types';

// ─── Users ────────────────────────────────────────────────────────────────────
// Credentials mirror the reference dashboard's Auth.login() logic:
// Super Admin roles → full admin nav | Faculty Member roles → restricted nav
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Sarah Mitchell', email: 'sarah@college.edu',  password: 'admin123',   role: 'NBA_Coordinator', roleGroup: 'Super Admin',    department: 'Computer Science', assignedCriteria: ['C1','C2','C3','C4','C5','C6','C7','C8','C9'], avatarInitials: 'SM' },
  { id: 'u2', name: 'Prof. James Okafor', email: 'james@college.edu',  password: 'hod123',     role: 'HOD',             roleGroup: 'Super Admin',    department: 'Computer Science', assignedCriteria: ['C1','C2','C3'], avatarInitials: 'JO' },
  { id: 'u3', name: 'Dr. Priya Nair',     email: 'priya@college.edu',  password: 'faculty123', role: 'Faculty',         roleGroup: 'Faculty Member', department: 'Computer Science', assignedCriteria: ['C4','C5'], avatarInitials: 'PN' },
  { id: 'u4', name: 'Admin User',         email: 'admin@college.edu',  password: 'admin123',   role: 'Admin',           roleGroup: 'Super Admin',    department: 'Administration',   assignedCriteria: [], avatarInitials: 'AU' },
  { id: 'u5', name: 'Dr. Ravi Kumar',     email: 'ravi@college.edu',   password: 'faculty123', role: 'Faculty',         roleGroup: 'Faculty Member', department: 'Computer Science', assignedCriteria: ['C6','C7'], avatarInitials: 'RK' },
];

// ─── Criteria (C1–C9 with marks) ─────────────────────────────────────────────
export const MOCK_CRITERIA: Criterion[] = [
  { id: 'C1', title: 'Mission, Governance & Strategy',         maxMarks: 75,  scoredMarks: 69, completionPct: 92, aiReadinessScore: 88, status: 'Complete',    evidenceCount: 18, requiredEvidence: 20, gapCount: 0, riskLevel: 'Low' },
  { id: 'C2', title: 'Academic Programs & Curriculum',         maxMarks: 125, scoredMarks: 93, completionPct: 74, aiReadinessScore: 71, status: 'In Progress', evidenceCount: 22, requiredEvidence: 30, gapCount: 3, riskLevel: 'Medium' },
  { id: 'C3', title: 'Faculty Qualifications & Development',   maxMarks: 175, scoredMarks: 107, completionPct: 61, aiReadinessScore: 58, status: 'In Progress', evidenceCount: 14, requiredEvidence: 25, gapCount: 5, riskLevel: 'High' },
  { id: 'C4', title: 'Student Admissions & Support',           maxMarks: 100, scoredMarks: 85, completionPct: 85, aiReadinessScore: 82, status: 'In Progress', evidenceCount: 19, requiredEvidence: 22, gapCount: 1, riskLevel: 'Low' },
  { id: 'C5', title: 'Research & Scholarly Activity',          maxMarks: 100, scoredMarks: 48, completionPct: 48, aiReadinessScore: 44, status: 'In Progress', evidenceCount: 9,  requiredEvidence: 20, gapCount: 7, riskLevel: 'Critical' },
  { id: 'C6', title: 'Industry Engagement & Partnerships',     maxMarks: 75,  scoredMarks: 25, completionPct: 33, aiReadinessScore: 30, status: 'In Progress', evidenceCount: 6,  requiredEvidence: 18, gapCount: 4, riskLevel: 'Critical' },
  { id: 'C7', title: 'Infrastructure & Learning Resources',    maxMarks: 100, scoredMarks: 78, completionPct: 78, aiReadinessScore: 75, status: 'In Progress', evidenceCount: 16, requiredEvidence: 20, gapCount: 2, riskLevel: 'Medium' },
  { id: 'C8', title: 'Quality Assurance & Improvement',        maxMarks: 150, scoredMarks: 83, completionPct: 55, aiReadinessScore: 52, status: 'In Progress', evidenceCount: 11, requiredEvidence: 22, gapCount: 6, riskLevel: 'High' },
  { id: 'C9', title: 'Ethical Standards & Compliance',         maxMarks: 100, scoredMarks: 0,  completionPct: 0,  aiReadinessScore: 0,  status: 'Not Started', evidenceCount: 0,  requiredEvidence: 15, gapCount: 0, riskLevel: 'Critical' },
];

// ─── Readiness ────────────────────────────────────────────────────────────────
export const MOCK_READINESS_SCORE: ReadinessScore = {
  overall: 67,
  estimatedMarks: 588,
  totalMarks: 1000,
  byCategory: { C1: 92, C2: 74, C3: 61, C4: 85, C5: 48, C6: 33, C7: 78, C8: 55, C9: 0 },
};

export const MOCK_KPIS: DashboardKPIs = {
  totalCriteria: 9,
  evidenceGaps: 28,
  overdueTasks: 4,
  daysToDeadline: 47,
  totalDocuments: 115,
  aiReadinessAvg: 67,
};

// ─── Gaps ─────────────────────────────────────────────────────────────────────
export const MOCK_GAPS: Gap[] = [
  { id: 'g1', description: 'No documented research output policy for faculty below associate level', criterionId: 'C5', severity: 'Critical', type: 'missing_document', marksImpact: 15, suggestedFix: 'Draft and ratify a research output policy document with faculty sign-off', owner: 'Prof. James Okafor', resolved: false },
  { id: 'g2', description: 'Industry advisory board meeting minutes missing for last two cycles', criterionId: 'C6', severity: 'Critical', type: 'missing_document', marksImpact: 12, suggestedFix: 'Retrieve or reconstruct minutes from email records and get board sign-off', owner: 'Dr. Sarah Mitchell', resolved: false },
  { id: 'g3', description: 'Faculty CVs not updated to reflect current qualifications for 6 members', criterionId: 'C3', severity: 'Major', type: 'incomplete_data', marksImpact: 10, suggestedFix: 'Collect updated CVs from all 6 faculty members within 7 days', owner: 'Prof. James Okafor', resolved: false },
  { id: 'g4', description: 'Curriculum mapping matrix incomplete for 3 elective modules', criterionId: 'C2', severity: 'Major', type: 'wrong_calculation', marksImpact: 8, suggestedFix: 'Complete CO-PO mapping for elective modules using the standard template', owner: 'Dr. Priya Nair', resolved: false },
  { id: 'g5', description: 'Student satisfaction survey response rate below 60% threshold', criterionId: 'C4', severity: 'Major', type: 'weak_criterion', marksImpact: 7, suggestedFix: 'Re-administer survey with mandatory participation and follow-up reminders', owner: 'Dr. Sarah Mitchell', resolved: false },
  { id: 'g6', description: 'QA committee charter not ratified by academic board', criterionId: 'C8', severity: 'Critical', type: 'missing_document', marksImpact: 18, suggestedFix: 'Schedule emergency academic board meeting to ratify the QA charter', owner: 'Prof. James Okafor', resolved: false },
  { id: 'g7', description: 'Library database subscriptions not documented in evidence repository', criterionId: 'C7', severity: 'Minor', type: 'missing_document', marksImpact: 4, suggestedFix: 'Upload subscription invoices and access logs to the evidence vault', owner: 'Dr. Priya Nair', resolved: false },
  { id: 'g8', description: 'Peer review process for course materials not formally documented', criterionId: 'C2', severity: 'Minor', type: 'missing_document', marksImpact: 5, suggestedFix: 'Create a peer review SOP document and collect faculty acknowledgements', owner: 'Prof. James Okafor', resolved: false },
  { id: 'g9', description: 'Research ethics approval records incomplete for 2 projects', criterionId: 'C5', severity: 'Major', type: 'incomplete_data', marksImpact: 9, suggestedFix: 'Obtain ethics approval certificates from the institutional ethics committee', owner: 'Dr. Sarah Mitchell', resolved: false },
  { id: 'g10', description: 'Industry partnership MoUs expired and not renewed', criterionId: 'C6', severity: 'Critical', type: 'missing_document', marksImpact: 14, suggestedFix: 'Contact all 3 industry partners and initiate MoU renewal process immediately', owner: 'Prof. James Okafor', resolved: false },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────
const today = new Date();
const daysFromNow = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

export const MOCK_TASKS: Task[] = [
  { id: 't1',  title: 'Collect and upload faculty CVs for all 6 flagged members',          assignee: 'Prof. James Okafor',  dueDate: daysFromNow(-3),  priority: 'High',   status: 'Overdue',     criterionId: 'C3' },
  { id: 't2',  title: 'Draft research output policy document for review',                   assignee: 'Dr. Sarah Mitchell',  dueDate: daysFromNow(5),   priority: 'High',   status: 'In Progress', criterionId: 'C5' },
  { id: 't3',  title: 'Schedule industry advisory board meeting and prepare agenda',        assignee: 'Dr. Sarah Mitchell',  dueDate: daysFromNow(7),   priority: 'High',   status: 'Pending',     criterionId: 'C6' },
  { id: 't4',  title: 'Complete curriculum mapping matrix for elective modules',            assignee: 'Dr. Priya Nair',      dueDate: daysFromNow(-1),  priority: 'Medium', status: 'Overdue',     criterionId: 'C2' },
  { id: 't5',  title: 'Obtain QA committee charter ratification from academic board',       assignee: 'Prof. James Okafor',  dueDate: daysFromNow(10),  priority: 'High',   status: 'Pending',     criterionId: 'C8' },
  { id: 't6',  title: 'Upload library database subscription agreements',                    assignee: 'Dr. Priya Nair',      dueDate: daysFromNow(14),  priority: 'Low',    status: 'Pending',     criterionId: 'C7' },
  { id: 't7',  title: 'Renew industry partnership MoUs with 3 key partners',               assignee: 'Dr. Sarah Mitchell',  dueDate: daysFromNow(-5),  priority: 'High',   status: 'Overdue',     criterionId: 'C6' },
  { id: 't8',  title: 'Distribute and collect student satisfaction surveys',                assignee: 'Prof. James Okafor',  dueDate: daysFromNow(21),  priority: 'Medium', status: 'In Progress', criterionId: 'C4' },
  { id: 't9',  title: 'Document peer review process for course materials',                  assignee: 'Dr. Priya Nair',      dueDate: daysFromNow(28),  priority: 'Low',    status: 'Pending',     criterionId: 'C2' },
  { id: 't10', title: 'Complete research ethics approval records for 2 projects',           assignee: 'Dr. Sarah Mitchell',  dueDate: daysFromNow(-2),  priority: 'High',   status: 'Overdue',     criterionId: 'C5' },
  { id: 't11', title: 'Initiate C9 Ethical Standards evidence collection',                  assignee: 'Prof. James Okafor',  dueDate: daysFromNow(35),  priority: 'Medium', status: 'Pending',     criterionId: 'C9' },
  { id: 't12', title: 'Review and approve C1 governance documentation',                     assignee: 'Dr. Sarah Mitchell',  dueDate: daysFromNow(3),   priority: 'Low',    status: 'Complete',    criterionId: 'C1' },
];

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  { id: 'ai1', text: 'Overall readiness stands at 67% (588/1000 marks). C9 (0%) and C6 (33%) are the primary drags. Prioritising MoU renewals and initiating C9 evidence collection could lift the score to ~74% within two weeks.', confidenceScore: 0.91, riskScore: 0.62, sourceRefs: ['C6', 'C9', 'g2', 'g10'], criterionId: 'C1', type: 'readiness' },
  { id: 'ai2', text: 'C5 Research & Scholarly Activity shows 4 overdue tasks and 7 active gaps with a combined marks impact of 24. The absence of a documented research output policy is the highest-risk item.', confidenceScore: 0.87, riskScore: 0.78, sourceRefs: ['g1', 'g9', 't2', 't10'], criterionId: 'C5', type: 'risk' },
  { id: 'ai3', text: 'C6 Industry Engagement is at 33% with two Critical gaps (marks impact: 26). Recommend scheduling the advisory board meeting within 7 days and uploading all MoU renewal documentation.', confidenceScore: 0.84, riskScore: 0.81, sourceRefs: ['g2', 'g10', 't3', 't7'], criterionId: 'C6', type: 'suggestion' },
  { id: 'ai4', text: 'C8 Quality Assurance has 6 active gaps. The QA committee charter ratification (marks impact: 18) is a prerequisite for 4 of these gaps. Escalating to the academic board is the critical path item.', confidenceScore: 0.79, riskScore: 0.69, sourceRefs: ['g6', 't5'], criterionId: 'C8', type: 'suggestion' },
  { id: 'ai5', text: 'C3 Faculty Qualifications is at 61%. Six faculty CVs remain unuploaded. Completion would raise C3 to ~78% and improve overall readiness by ~2 points (~20 marks).', confidenceScore: 0.93, riskScore: 0.44, sourceRefs: ['g3', 't1'], criterionId: 'C3', type: 'suggestion' },
];

export const MOCK_AI_SUMMARY: AISummary = {
  score: 67,
  riskLevel: 'High',
  strongestCriterion: 'C1 — Mission, Governance & Strategy (92%)',
  weakestCriterion: 'C9 — Ethical Standards & Compliance (0%)',
  gaps: ['C9 not started', 'C6 MoUs expired', 'C8 QA charter missing', 'C5 research policy absent'],
  suggestions: [
    'Initiate C9 evidence collection immediately',
    'Renew all industry MoUs within 7 days',
    'Escalate QA charter ratification to academic board',
    'Upload 6 pending faculty CVs for C3',
  ],
};

// ─── Activity Feed ────────────────────────────────────────────────────────────
export const MOCK_ACTIVITY_FEED: AuditEntry[] = [
  { id: 'ae1',  timestamp: new Date(Date.now() - 1000*60*8).toISOString(),      actor: 'Dr. Sarah Mitchell',  actorRole: 'NBA_Coordinator', actionType: 'EVIDENCE_UPLOADED',     entityId: 'C1',        entityType: 'Criterion', description: 'Uploaded governance charter v3.2 to C1' },
  { id: 'ae2',  timestamp: new Date(Date.now() - 1000*60*23).toISOString(),     actor: 'Prof. James Okafor',  actorRole: 'HOD',             actionType: 'TASK_UPDATED',          entityId: 't8',        entityType: 'Task',      description: 'Updated task "Distribute student satisfaction surveys" to In Progress' },
  { id: 'ae3',  timestamp: new Date(Date.now() - 1000*60*47).toISOString(),     actor: 'Dr. Priya Nair',      actorRole: 'Faculty',         actionType: 'DOCUMENT_REVIEWED',     entityId: 'C2',        entityType: 'Criterion', description: 'Reviewed C2 curriculum mapping evidence' },
  { id: 'ae4',  timestamp: new Date(Date.now() - 1000*60*90).toISOString(),     actor: 'Dr. Sarah Mitchell',  actorRole: 'NBA_Coordinator', actionType: 'GAP_CREATED',           entityId: 'g10',       entityType: 'Gap',       description: 'Logged Critical gap: Industry partnership MoUs expired (marks impact: 14)' },
  { id: 'ae5',  timestamp: new Date(Date.now() - 1000*60*135).toISOString(),    actor: 'Prof. James Okafor',  actorRole: 'HOD',             actionType: 'TASK_CREATED',          entityId: 't11',       entityType: 'Task',      description: 'Created task: Initiate C9 Ethical Standards evidence collection' },
  { id: 'ae6',  timestamp: new Date(Date.now() - 1000*60*200).toISOString(),    actor: 'Dr. Sarah Mitchell',  actorRole: 'NBA_Coordinator', actionType: 'AI_SCORING_RUN',        entityId: 'dashboard', entityType: 'Dashboard', description: 'AI readiness scoring completed — overall score: 67% (588/1000 marks)' },
  { id: 'ae7',  timestamp: new Date(Date.now() - 1000*60*60*3).toISOString(),   actor: 'Dr. Priya Nair',      actorRole: 'Faculty',         actionType: 'EXPORT_REQUESTED',      entityId: 'exp-001',   entityType: 'Export',    description: 'Requested PDF export of full SAR progress report' },
  { id: 'ae8',  timestamp: new Date(Date.now() - 1000*60*60*5).toISOString(),   actor: 'Prof. James Okafor',  actorRole: 'HOD',             actionType: 'EVIDENCE_UPLOADED',     entityId: 'C3',        entityType: 'Criterion', description: 'Uploaded 3 faculty CVs to C3 evidence repository' },
  { id: 'ae9',  timestamp: new Date(Date.now() - 1000*60*60*8).toISOString(),   actor: 'Dr. Sarah Mitchell',  actorRole: 'NBA_Coordinator', actionType: 'AUDIT_SIMULATION_RUN',  entityId: 'C1',        entityType: 'Criterion', description: 'Audit simulation completed for C1 — result: PASS (69/75 marks)' },
  { id: 'ae10', timestamp: new Date(Date.now() - 1000*60*60*24).toISOString(),  actor: 'Dr. Sarah Mitchell',  actorRole: 'NBA_Coordinator', actionType: 'TASK_COMPLETED',        entityId: 't12',       entityType: 'Task',      description: 'Completed: Review and approve C1 governance documentation' },
];
