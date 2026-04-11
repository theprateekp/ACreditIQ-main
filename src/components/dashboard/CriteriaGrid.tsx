import { useCriteria } from '@/hooks/useDashboardData';
import CriterionCard from './CriterionCard';
import type { Criterion } from '@/types';

const CLUSTERS = [
  { label: 'Governance & Strategy', part: 'Part B', ids: ['C1', 'C2', 'C3'] },
  { label: 'Academic Quality',      part: 'Part B', ids: ['C4', 'C5', 'C6'] },
  { label: 'Resources & Compliance',part: 'Part B/C', ids: ['C7', 'C8', 'C9'] },
];

function clusterAvg(criteria: Criterion[], ids: string[]) {
  const sub = criteria.filter((c) => ids.includes(c.id));
  return sub.length ? Math.round(sub.reduce((s, c) => s + c.completionPct, 0) / sub.length) : 0;
}

export default function CriteriaGrid() {
  const { data: criteria, isLoading, isError, refetch } = useCriteria();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {CLUSTERS.map((cl) => (
          <div key={cl.label}>
            <div className="h-4 w-48 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--bg-row-alt)' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cl.ids.map((id) => <div key={id} className="h-32 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !criteria) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CriterionCard key={i} criterion={{ id: `C${i+1}`, title: '', completionPct: 0, status: 'Not Started', evidenceCount: 0, gapCount: 0, maxMarks: 0, scoredMarks: 0, aiReadinessScore: 0, requiredEvidence: 0, riskLevel: 'Low' }} error onRetry={() => refetch()} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {CLUSTERS.map((cl) => {
        const clCriteria = cl.ids.map((id) => criteria.find((c) => c.id === id)).filter(Boolean) as Criterion[];
        const avg = clusterAvg(criteria, cl.ids);
        const avgColor = avg >= 80 ? '#15803D' : avg >= 50 ? '#B45309' : '#B91C1C';
        return (
          <div key={cl.label}>
            {/* Cluster header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="badge badge-info">{cl.part}</span>
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{cl.label}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <span className="text-sm font-bold" style={{ color: avgColor }}>{avg}%</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clCriteria.map((c) => <CriterionCard key={c.id} criterion={c} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
