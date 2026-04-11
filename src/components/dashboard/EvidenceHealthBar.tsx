import { useGaps, useCriteria } from '@/hooks/useDashboardData';

export default function EvidenceHealthBar() {
  const { data: criteria } = useCriteria();
  const { data: gaps } = useGaps();

  const total = (criteria ?? []).reduce((s, c) => s + c.evidenceCount, 0);
  const missing = (gaps ?? []).filter((g) => !g.resolved).length;
  const uploaded = Math.max(0, total - missing);
  const flagged = Math.floor(missing * 0.3);

  const tiles = [
    { label: 'Uploaded', value: uploaded, color: 'var(--success)', bg: 'var(--success-bg)', border: '#86EFAC' },
    { label: 'Missing',  value: missing,  color: 'var(--danger)',  bg: 'var(--danger-bg)',  border: '#FCA5A5' },
    { label: 'Flagged',  value: flagged,  color: 'var(--warning)', bg: 'var(--warning-bg)', border: '#FCD34D' },
    { label: 'Total',    value: total,    color: 'var(--accent)',  bg: 'var(--accent-lt)',  border: '#93C5FD' },
  ];

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="section-title mb-0 border-0 pb-0">Evidence Health</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Across all criteria</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded p-2.5 text-center" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
            <div className="text-xl font-bold tabular-nums" style={{ color: t.color }}>{t.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
