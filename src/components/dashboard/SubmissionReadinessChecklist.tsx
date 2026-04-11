import { useGaps, useTasks } from '@/hooks/useDashboardData';
import { CheckCircleIcon, WarningIcon } from '@/components/ui/Icon';

export default function SubmissionReadinessChecklist() {
  const { data: gaps } = useGaps();
  const { data: tasks } = useTasks();

  const critGaps = (gaps ?? []).filter((g) => !g.resolved && g.severity === 'Critical').length;
  const overdueTasks = (tasks ?? []).filter((t) => t.status === 'Overdue' || (t.status !== 'Complete' && new Date(t.dueDate) < new Date())).length;

  const items = [
    { label: `Resolve all Critical gaps (${critGaps} remaining)`, done: critGaps === 0, critical: critGaps > 0 },
    { label: `Clear overdue tasks (${overdueTasks} overdue)`, done: overdueTasks === 0, critical: overdueTasks > 0 },
    { label: 'All criteria have at least one evidence item', done: false, critical: false },
    { label: 'C9 Ethical Standards — evidence collection initiated', done: false, critical: true },
    { label: 'Internal review window scheduled with IR team', done: false, critical: false },
    { label: 'AI insights reviewed and action items addressed', done: false, critical: false },
    { label: 'Export final SAR progress report for AC sign-off', done: false, critical: false },
  ];

  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <span>Pre-Submission Checklist</span>
        <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{doneCount}/{items.length} complete</span>
      </div>
      <div className="p-3 flex flex-col gap-0">
        <div className="progress-track mb-3">
          <div className="progress-fill" style={{ width: `${(doneCount / items.length) * 100}%`, backgroundColor: 'var(--success)' }} />
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="mt-0.5 flex-shrink-0" style={{ color: item.done ? 'var(--success)' : item.critical ? 'var(--danger)' : 'var(--warning)' }}>
              {item.done ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <WarningIcon className="w-3.5 h-3.5" />}
            </span>
            <span className="text-xs" style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
