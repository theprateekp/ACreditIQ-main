import { useState } from 'react';
import { useCriteria } from '@/hooks/useDashboardData';
import { MOCK_USERS } from '@/data/mockData';

function barColor(pct: number, status: string) {
  if (status === 'Complete') return '#2563EB';
  if (pct < 30) return '#EF4444';
  if (pct < 70) return '#F59E0B';
  return '#16A34A';
}

const REPORT_TYPES = [
  'SAR Summary Report',
  'Criterion-wise Progress',
  'Faculty Contribution Report',
  'Document Audit Report',
  'CO-PO Attainment Report',
];

const SECTIONS = ['Executive Summary', 'Criteria Progress', 'Faculty Data', 'Document Audit'];

export default function ReportsPage() {
  const { data: criteria } = useCriteria();
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s, true]))
  );
  const [showPreview, setShowPreview] = useState(false);

  const list = criteria ?? [];
  const tot  = list.reduce((s, c) => s + c.maxMarks, 0);
  const ach  = list.reduce((s, c) => s + c.scoredMarks, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Generator */}
        <div className="card p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Generate Report</div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="text-sm rounded px-2 py-1.5"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}
            >
              {REPORT_TYPES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Academic Year</label>
            <input
              readOnly value="2024-25"
              className="text-sm rounded px-2 py-1.5"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Include Sections</label>
            {SECTIONS.map((s) => (
              <label key={s} className="flex items-center gap-2 text-xs cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={sections[s]}
                  onChange={() => setSections((p) => ({ ...p, [s]: !p[s] }))}
                  style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              className="btn-outline-blue text-xs px-3 py-1.5"
              onClick={() => alert('PDF export coming soon.')}
            >
              ↓ Export PDF
            </button>
            <button
              className="btn-primary text-xs px-3 py-1.5"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Quick summary */}
        <div className="card overflow-hidden">
          <div className="card-header">Quick Summary</div>
          {list.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="inst-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Criterion</th>
                    <th>Max</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((c, i) => {
                    const color = barColor(c.completionPct, c.status);
                    return (
                      <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                        <td><span className="badge badge-info">{c.id}</span></td>
                        <td className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.title}</td>
                        <td className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.maxMarks}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                              <div style={{ width: `${c.completionPct}%`, height: '100%', background: color, borderRadius: 3 }} />
                            </div>
                            <span className="font-mono text-[10px]" style={{ color }}>{c.completionPct}%</span>
                          </div>
                        </td>
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
          ) : (
            <div className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No criteria active.</div>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="card overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <span>Preview — {reportType} · 2024-25</span>
            <button className="text-xs" style={{ color: 'var(--text-muted)' }} onClick={() => setShowPreview(false)}>✕ Close</button>
          </div>
          <div className="p-4">
            {sections['Executive Summary'] && (
              <div className="mb-4 p-3 rounded" style={{ background: 'var(--accent-lt)', border: '1px solid #93C5FD' }}>
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--accent)' }}>Executive Summary</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Overall SAR readiness: <strong>{tot ? Math.round((ach / tot) * 100) : 0}%</strong> ({ach}/{tot} marks).{' '}
                  {list.filter((c) => c.status === 'Complete').length} of {list.length} criteria complete.
                  Academic Year: 2024-25 · GAPC V4.0.
                </div>
              </div>
            )}
            {sections['Criteria Progress'] && (
              <div style={{ overflowX: 'auto' }}>
                <table className="inst-table">
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th>Max</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Incharge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c, i) => {
                      const color = barColor(c.completionPct, c.status);
                      const incharge = MOCK_USERS.find((u) => u.assignedCriteria.includes(c.id));
                      return (
                        <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                          <td><span className="badge badge-info">{c.id}</span> <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{c.title}</span></td>
                          <td className="font-mono text-xs">{c.maxMarks}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                                <div style={{ width: `${c.completionPct}%`, height: '100%', background: color, borderRadius: 3 }} />
                              </div>
                              <span className="font-mono text-[10px]" style={{ color }}>{c.completionPct}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'Complete' ? 'badge-success' : c.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{incharge?.name ?? '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
