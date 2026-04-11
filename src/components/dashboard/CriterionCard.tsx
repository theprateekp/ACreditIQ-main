import { useDispatch } from 'react-redux';
import { setActivePanel } from '@/store/uiSlice';
import { DocumentIcon, WarningIcon, ClockIcon } from '@/components/ui/Icon';
import type { Criterion } from '@/types';
import type { PanelId } from '@/store/uiSlice';

type CriterionPanelId = Extract<PanelId, 'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7'|'C8'|'C9'>;

function pctColor(pct: number) {
  if (pct >= 80) return 'var(--success)';
  if (pct >= 50) return 'var(--warning)';
  return 'var(--danger)';
}

function barColor(pct: number) {
  if (pct >= 80) return '#15803D';
  if (pct >= 50) return '#B45309';
  if (pct > 0)   return '#B91C1C';
  return '#C8C5B8';
}

function auditLabel(c: Criterion): { text: string; cls: string } {
  if (c.completionPct === 0) return { text: 'Blocked', cls: 'badge badge-danger' };
  if (c.riskLevel === 'Critical' || c.completionPct < 50) return { text: 'At Risk', cls: 'badge badge-danger' };
  if (c.completionPct >= 80 && c.gapCount === 0) return { text: 'Audit Ready', cls: 'badge badge-success' };
  return { text: 'In Progress', cls: 'badge badge-warning' };
}

export default function CriterionCard({ criterion: c, error, onRetry }: { criterion: Criterion; error?: boolean; onRetry?: () => void }) {
  const dispatch = useDispatch();

  if (error) {
    return (
      <div className="card p-3 flex flex-col gap-1">
        <span className="text-xs" style={{ color: 'var(--danger)' }}>Failed to load.</span>
        {onRetry && <button onClick={onRetry} className="text-xs" style={{ color: 'var(--accent)' }}>Retry</button>}
      </div>
    );
  }

  const audit = auditLabel(c);

  return (
    <button
      onClick={() => dispatch(setActivePanel(c.id as CriterionPanelId))}
      className="card p-3 flex flex-col gap-2 text-left w-full transition-all hover:shadow-md focus:outline-none"
      style={{ cursor: 'pointer' }}
      aria-label={`${c.id}: ${c.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="badge badge-info">{c.id}</span>
        <div className="text-right">
          <div className="text-lg font-bold tabular-nums" style={{ color: pctColor(c.completionPct) }}>{c.completionPct}%</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.scoredMarks}/{c.maxMarks} marks</div>
        </div>
      </div>

      {/* Title */}
      <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>{c.title}</p>

      {/* Progress bar */}
      <div className="progress-track w-full">
        <div className="progress-fill" style={{ width: `${c.completionPct}%`, backgroundColor: barColor(c.completionPct) }} role="progressbar" aria-valuenow={c.completionPct} aria-valuemin={0} aria-valuemax={100} />
      </div>

      {/* AI readiness */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>AI</span>
        <div className="flex-1 progress-track" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${c.aiReadinessScore}%`, backgroundColor: barColor(c.aiReadinessScore), height: '100%' }} />
        </div>
        <span className="text-[10px] font-bold" style={{ color: pctColor(c.aiReadinessScore) }}>{c.aiReadinessScore}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-0.5"><DocumentIcon className="w-3 h-3" />{c.evidenceCount}/{c.requiredEvidence}</span>
          {c.gapCount > 0 && <span className="flex items-center gap-0.5" style={{ color: 'var(--danger)' }}><WarningIcon className="w-3 h-3" />{c.gapCount}</span>}
          {c.completionPct === 0 && <span className="flex items-center gap-0.5 animate-pulse" style={{ color: 'var(--danger)' }}><ClockIcon className="w-3 h-3" />Not started</span>}
        </div>
        <span className={audit.cls}>{audit.text}</span>
      </div>
    </button>
  );
}
