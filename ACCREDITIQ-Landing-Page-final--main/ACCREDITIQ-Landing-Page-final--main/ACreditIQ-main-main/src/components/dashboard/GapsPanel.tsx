import { useSelector, useDispatch } from 'react-redux';
import { selectSeverityFilter, setSeverityFilter } from '@/store/uiSlice';
import { useGaps } from '@/hooks/useDashboardData';
import { CheckCircleIcon, WarningIcon } from '@/components/ui/Icon';
import type { GapSeverity, GapType } from '@/types';

const SEV: (GapSeverity | 'All')[] = ['All', 'Critical', 'Major', 'Minor'];
const sevOrder: Record<GapSeverity, number> = { Critical: 0, Major: 1, Minor: 2 };
const TYPE_LABELS: Record<GapType, string> = {
  missing_document: 'Missing Doc', wrong_calculation: 'Wrong Calc',
  weak_criterion: 'Weak Criterion', incomplete_data: 'Incomplete Data',
};

export default function GapsPanel() {
  const dispatch = useDispatch();
  const filter = useSelector(selectSeverityFilter);
  const { data: gaps, isLoading } = useGaps();

  const active = (gaps ?? []).filter((g) => !g.resolved);
  const filtered = filter && filter !== 'All' ? active.filter((g) => g.severity === filter) : active;
  const sorted = [...filtered].sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  const critCount = active.filter((g) => g.severity === 'Critical').length;
  const totalImpact = active.reduce((s, g) => s + g.marksImpact, 0);

  return (
    <div className="card flex flex-col h-full">
      <div className="card-header flex items-center justify-between">
        <span>Compliance Gaps {critCount > 0 && <span className="badge badge-danger ml-2">{critCount} Critical</span>}</span>
        <span className="text-xs font-normal" style={{ color: 'var(--danger)' }}>−{totalImpact} marks at risk</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-row-alt)' }}>
        {SEV.map((s) => (
          <button key={s} onClick={() => dispatch(setSeverityFilter(s === 'All' ? null : s))}
            className="text-xs px-2.5 py-1 rounded transition-colors"
            style={{
              backgroundColor: (s === 'All' && !filter) || filter === s ? 'var(--accent)' : 'var(--bg-surface)',
              color: (s === 'All' && !filter) || filter === s ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-dk)',
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="relative flex-1 min-h-0">
        <div className="overflow-y-auto h-full" style={{ borderTop: 'none' }}>
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 m-3 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />
          ))}

          {!isLoading && sorted.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <CheckCircleIcon className="w-8 h-8" style={{ color: 'var(--success)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No active gaps for this filter.</p>
            </div>
          )}

          {!isLoading && sorted.map((gap, i) => (
            <div key={gap.id} className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)', backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
              <div className="flex items-start gap-2 mb-1">
                <WarningIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: gap.severity === 'Critical' ? 'var(--danger)' : gap.severity === 'Major' ? 'var(--warning)' : 'var(--info)' }} />
                <p className="text-xs leading-snug flex-1" style={{ color: 'var(--text-primary)' }}>{gap.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap ml-5">
                <span className="badge badge-info">{gap.criterionId}</span>
                <span className={`badge ${gap.severity === 'Critical' ? 'badge-danger' : gap.severity === 'Major' ? 'badge-warning' : 'badge-info'}`}>{gap.severity}</span>
                <span className="badge badge-neutral">{TYPE_LABELS[gap.type]}</span>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--danger)' }}>−{gap.marksImpact} marks</span>
              </div>
              <div className="ml-5 mt-1 flex items-start gap-1">
                <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: 'var(--success)' }}>Fix:</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{gap.suggestedFix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
