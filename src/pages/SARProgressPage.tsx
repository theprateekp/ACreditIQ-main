import { useCriteria } from '@/hooks/useDashboardData';
import { useDispatch } from 'react-redux';
import { setActivePanel } from '@/store/uiSlice';
import { MOCK_USERS } from '@/data/mockData';

function barColor(pct: number, status: string) {
  if (status === 'Complete') return '#2563EB';
  if (pct < 30) return '#EF4444';
  if (pct < 70) return '#F59E0B';
  return '#16A34A';
}

export default function SARProgressPage() {
  const { data: criteria } = useCriteria();
  const dispatch = useDispatch();

  const list = criteria ?? [];
  const tot  = list.reduce((s, c) => s + c.maxMarks, 0);
  const ach  = list.reduce((s, c) => s + c.scoredMarks, 0);
  const sp   = tot ? Math.round((ach / tot) * 100) : 0;
  const comp = list.filter((c) => c.status === 'Complete').length;

  return (
    <div className="flex flex-col gap-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Overall SAR Score', value: `${sp}%`,   sub: `Weighted across ${list.length} criteria` },
          { label: 'Points Achieved',   value: ach,         sub: `of ${tot} total marks` },
          { label: 'Criteria Complete', value: comp,        sub: `of ${list.length} active` },
          { label: 'Criteria Active',   value: list.length, sub: 'GAPC V4.0 · C1–C9' },
        ].map((k) => (
          <div key={k.label} className="card p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{k.label}</div>
            <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--accent)' }}>{k.value}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Score table */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <span>Criteria Score Summary</span>
          <button
            className="btn-outline-blue text-xs px-3 py-1.5"
            onClick={() => dispatch(setActivePanel('export'))}
          >
            ↓ Export SAR
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="inst-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Criterion</th>
                <th>Max</th>
                <th>Completion</th>
                <th>Achieved</th>
                <th>Deadline</th>
                <th>Incharge</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => {
                const color = barColor(c.completionPct, c.status);
                const incharge = MOCK_USERS.find((u) => u.assignedCriteria.includes(c.id));
                return (
                  <tr
                    key={c.id}
                    style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)', cursor: 'pointer' }}
                    onClick={() => dispatch(setActivePanel(c.id as any))}
                  >
                    <td>
                      <span className="badge badge-info">{c.id}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.title}</td>
                    <td className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{c.maxMarks}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ width: `${c.completionPct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                        </div>
                        <span className="font-mono text-[11px]" style={{ color }}>{c.completionPct}%</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{c.scoredMarks}/{c.maxMarks}</td>
                    <td className="text-xs" style={{ color: 'var(--text-muted)' }}>—</td>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{incharge?.name ?? '—'}</td>
                    <td>
                      <span className={`badge ${c.status === 'Complete' ? 'badge-success' : c.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
