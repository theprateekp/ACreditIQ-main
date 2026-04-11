import { useCriteria } from '@/hooks/useDashboardData';
import type { Criterion } from '@/types';

const RISK_CFG = {
  Critical: { bg: 'var(--danger-bg)',  color: 'var(--danger)',  border: '#FCA5A5' },
  High:     { bg: 'var(--warning-bg)', color: 'var(--warning)', border: '#FCD34D' },
  Medium:   { bg: '#FFFBEB',           color: '#92400E',        border: '#FDE68A' },
  Low:      { bg: 'var(--success-bg)', color: 'var(--success)', border: '#86EFAC' },
};

function getRiskFactors(c: Criterion): string[] {
  const f: string[] = [];
  if (c.completionPct === 0) f.push('Not started');
  if (c.gapCount >= 5) f.push(`${c.gapCount} gaps`);
  if (c.evidenceCount < c.requiredEvidence * 0.5) f.push('Evidence < 50%');
  if (c.aiReadinessScore < 50) f.push('AI score critical');
  return f;
}

export default function RiskHeatmap() {
  const { data: criteria, isLoading } = useCriteria();

  const grouped = {
    Critical: (criteria ?? []).filter((c) => c.riskLevel === 'Critical'),
    High:     (criteria ?? []).filter((c) => c.riskLevel === 'High'),
    Medium:   (criteria ?? []).filter((c) => c.riskLevel === 'Medium'),
    Low:      (criteria ?? []).filter((c) => c.riskLevel === 'Low'),
  };

  const marksAtRisk = (criteria ?? [])
    .filter((c) => c.riskLevel === 'Critical' || c.riskLevel === 'High')
    .reduce((s, c) => s + (c.maxMarks - c.scoredMarks), 0);

  return (
    <div className="card flex flex-col">
      <div className="card-header flex items-center justify-between">
        <span>Risk Heatmap</span>
        <span className="text-xs font-normal" style={{ color: 'var(--danger)' }}>−{marksAtRisk} marks at risk</span>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => {
              const items = grouped[level];
              const cfg = RISK_CFG[level];
              return (
                <div key={level} className="rounded p-2.5" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold" style={{ color: cfg.color }}>{level}</span>
                    <span className="text-lg font-black" style={{ color: cfg.color }}>{items.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.map((c) => (
                      <div key={c.id} className="group relative">
                        <span className="badge badge-neutral cursor-default" style={{ color: cfg.color, backgroundColor: 'rgba(255,255,255,0.6)' }}>{c.id}</span>
                        <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10 rounded p-2 min-w-[130px] shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-dk)' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{c.id}: {c.completionPct}%</p>
                          {getRiskFactors(c).map((f, i) => <p key={i} className="text-[10px]" style={{ color: 'var(--text-muted)' }}>• {f}</p>)}
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>None</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Marks at stake */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          <p className="section-title mb-2">Marks at Stake</p>
          {(criteria ?? [])
            .filter((c) => c.riskLevel === 'Critical' || c.riskLevel === 'High')
            .sort((a, b) => (b.maxMarks - b.scoredMarks) - (a.maxMarks - a.scoredMarks))
            .slice(0, 5)
            .map((c) => {
              const gap = c.maxMarks - c.scoredMarks;
              return (
                <div key={c.id} className="flex items-center gap-2 mb-1">
                  <span className="badge badge-info w-8 text-center">{c.id}</span>
                  <div className="flex-1 progress-track"><div className="progress-fill" style={{ width: `${(gap / c.maxMarks) * 100}%`, backgroundColor: 'var(--danger)' }} /></div>
                  <span className="text-[10px] font-semibold w-14 text-right" style={{ color: 'var(--danger)' }}>−{gap} marks</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
