import { useSelector } from 'react-redux';
import { selectActivePanel } from '@/store/uiSlice';
import { useReadinessScore, useKPIs } from '@/hooks/useDashboardData';
import { ReadinessRingPanel } from '@/components/charts/ReadinessRing';
import MarksDistributionChart from '@/components/charts/MarksDistributionChart';
import KPITile from '@/components/ui/KPITile';
import CriteriaGrid from '@/components/dashboard/CriteriaGrid';
import GapsPanel from '@/components/dashboard/GapsPanel';
import TasksPanel from '@/components/dashboard/TasksPanel';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActionsBar from '@/components/dashboard/QuickActionsBar';
import EvidencePanel from '@/components/dashboard/EvidencePanel';
import EvidenceHealthBar from '@/components/dashboard/EvidenceHealthBar';
import COPOMapping from '@/components/dashboard/COPOMapping';
import AuditSimulator from '@/components/dashboard/AuditSimulator';
import ExportPanel from '@/components/dashboard/ExportPanel';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';
import CriterionWorkspace from './CriterionWorkspace';
import PartAPage from './PartAPage';
import PartDPage from './PartDPage';
import AdminPage from './AdminPage';
import PageTransition from '@/components/ui/PageTransition';
import { DocumentIcon, WarningIcon, ClockIcon, CalendarIcon, ChartBarIcon, SparklesIcon } from '@/components/ui/Icon';

const CRITERION_IDS = ['C1','C2','C3','C4','C5','C6','C7','C8','C9'] as const;

function OverviewPanel() {
  const { data: readiness } = useReadinessScore();
  const { data: kpis } = useKPIs();

  return (
    <div className="flex flex-col gap-4">
      <ReadinessRingPanel score={readiness?.overall ?? 0} estimatedMarks={readiness?.estimatedMarks ?? 0} totalMarks={readiness?.totalMarks ?? 1000} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPITile label="Total Criteria"   value={kpis?.totalCriteria ?? 9}        icon={<DocumentIcon className="w-4 h-4" />}  accentColor="text-blue-700"   subLabel="GAPC V4.0" />
        <KPITile label="Missing Evidence" value={kpis?.evidenceGaps ?? 0}         icon={<WarningIcon className="w-4 h-4" />}   accentColor="text-amber-700"  subLabel="Across all criteria" />
        <KPITile label="Overdue Tasks"    value={kpis?.overdueTasks ?? 0}         icon={<ClockIcon className="w-4 h-4" />}     accentColor="text-red-700"    subLabel="Require attention" />
        <KPITile label="Days to Deadline" value={kpis?.daysToDeadline ?? 0}       icon={<CalendarIcon className="w-4 h-4" />}  accentColor="text-green-700"  subLabel="SAR submission" />
        <KPITile label="Total Documents"  value={kpis?.totalDocuments ?? 0}       icon={<DocumentIcon className="w-4 h-4" />}  accentColor="text-indigo-700" subLabel="Uploaded" />
        <KPITile label="AI Readiness"     value={`${kpis?.aiReadinessAvg ?? 0}%`} icon={<SparklesIcon className="w-4 h-4" />} accentColor="text-purple-700" subLabel="Avg across C1–C9" />
      </div>

      <EvidenceHealthBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Marks Distribution — C1 to C9</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Scored vs Max Marks</span>
          </div>
          <MarksDistributionChart />
        </div>
        <RiskHeatmap />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>GAPC V4.0 Criteria — Part B &amp; C</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click any criterion to open workspace</span>
        </div>
        <CriteriaGrid />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 380 }}>
        <div style={{ height: 380 }}><GapsPanel /></div>
        <div style={{ height: 380 }}><TasksPanel /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIInsightsPanel />
        <ActivityFeed />
      </div>
    </div>
  );
}

const TITLES: Record<string, { title: string; sub: string }> = {
  overview: { title: 'Dashboard Overview',           sub: 'SAR Cycle 2024–25 · GAPC V4.0 · Computer Science Engineering' },
  criteria: { title: 'Part B — Criteria C1–C9',      sub: 'All 9 GAPC V4.0 criteria' },
  evidence: { title: 'Document Vault',               sub: 'Evidence repository — supporting documents mapped to criteria' },
  'co-po':  { title: 'CO-PO Mapping Studio',         sub: 'Course Outcomes vs Program Outcomes correlation matrix' },
  audit:    { title: 'Audit Simulator',              sub: 'Simulated NBA audit result based on current SAR state' },
  insights: { title: 'AI Assistant',                 sub: 'AI-powered readiness analysis and gap detection' },
  export:   { title: 'Export SAR',                   sub: 'Generate and download accreditation reports' },
  gaps:     { title: 'Compliance Gaps',              sub: 'Active gaps requiring resolution before submission' },
  tasks:    { title: 'Task Queue',                   sub: 'Assigned tasks and upcoming deadlines' },
  activity: { title: 'Activity Log',                 sub: 'Immutable audit trail of all system actions' },
  'part-a': { title: 'Part A — Institutional Info',  sub: 'Basic institutional and program details for NBA SAR' },
  'part-d': { title: 'Part D — Declaration',         sub: 'Final declaration before SAR submission' },
  admin:    { title: 'Settings / Roles / Users',     sub: 'User management and system configuration' },
  C1: { title: 'C1 — Vision, Mission & PEOs',         sub: 'Criterion Workspace · Part B · 75 marks' },
  C2: { title: 'C2 — Curriculum & Teaching-Learning', sub: 'Criterion Workspace · Part B · 125 marks' },
  C3: { title: 'C3 — Course & Program Outcomes',      sub: 'Criterion Workspace · Part B · 175 marks' },
  C4: { title: "C4 — Students' Performance",          sub: 'Criterion Workspace · Part B · 100 marks' },
  C5: { title: 'C5 — Faculty Information',            sub: 'Criterion Workspace · Part B · 100 marks' },
  C6: { title: 'C6 — Facilities & Technical Support', sub: 'Criterion Workspace · Part B · 75 marks' },
  C7: { title: 'C7 — Continuous Improvement',         sub: 'Criterion Workspace · Part B · 75 marks' },
  C8: { title: 'C8 — First Year Academics',           sub: 'Criterion Workspace · Part B · 75 marks' },
  C9: { title: 'C9 — Student Support Systems',        sub: 'Criterion Workspace · Part C · 100 marks' },
};

export default function DashboardPage() {
  const activePanel = useSelector(selectActivePanel);
  const meta = TITLES[activePanel] ?? { title: 'Dashboard', sub: '' };
  const isCriterion = (CRITERION_IDS as readonly string[]).includes(activePanel);

  return (
    <div className="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '2px solid var(--border)' }}>
        <div>
          <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{meta.title}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{meta.sub}</p>
        </div>
        <QuickActionsBar />
      </div>

      <PageTransition panelKey={activePanel}>
        {activePanel === 'overview'  && <OverviewPanel />}
        {activePanel === 'criteria'  && <CriteriaGrid />}
        {activePanel === 'evidence'  && <EvidencePanel />}
        {activePanel === 'co-po'     && <COPOMapping />}
        {activePanel === 'audit'     && <AuditSimulator />}
        {activePanel === 'insights'  && <AIInsightsPanel />}
        {activePanel === 'export'    && <ExportPanel />}
        {activePanel === 'gaps'      && <GapsPanel />}
        {activePanel === 'tasks'     && <TasksPanel />}
        {activePanel === 'activity'  && <ActivityFeed />}
        {activePanel === 'part-a'    && <PartAPage />}
        {activePanel === 'part-d'    && <PartDPage />}
        {activePanel === 'admin'     && <AdminPage />}
        {isCriterion && <CriterionWorkspace criterionId={activePanel} />}
      </PageTransition>
    </div>
  );
}
