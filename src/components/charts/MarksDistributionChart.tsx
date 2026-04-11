import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';
import { useCriteria } from '@/hooks/useDashboardData';
import type { Criterion } from '@/types';

function barColor(c: Criterion) {
  if (c.completionPct >= 80) return '#15803D';
  if (c.completionPct >= 50) return '#B45309';
  return '#B91C1C';
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Criterion }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded p-2.5 text-xs shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-dk)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--accent)' }}>{d.id}</p>
      <p className="font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{d.title}</p>
      <div className="flex justify-between gap-4"><span style={{ color: 'var(--text-muted)' }}>Scored</span><span className="font-semibold" style={{ color: 'var(--success)' }}>{d.scoredMarks}</span></div>
      <div className="flex justify-between gap-4"><span style={{ color: 'var(--text-muted)' }}>Max</span><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.maxMarks}</span></div>
      <div className="flex justify-between gap-4 mt-1 pt-1" style={{ borderTop: '1px solid var(--border)' }}><span style={{ color: 'var(--text-muted)' }}>AI Score</span><span className="font-semibold" style={{ color: 'var(--accent)' }}>{d.aiReadinessScore}</span></div>
    </div>
  );
}

export default function MarksDistributionChart() {
  const { data: criteria } = useCriteria();
  if (!criteria) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={criteria} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C8C5B8" vertical={false} />
        <XAxis dataKey="id" tick={{ fill: '#7A7A8A', fontSize: 11 }} axisLine={{ stroke: '#C8C5B8' }} tickLine={false} />
        <YAxis tick={{ fill: '#7A7A8A', fontSize: 11 }} axisLine={false} tickLine={false} />
        <ReferenceLine y={80} stroke="#15803D" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Audit Ready', fill: '#15803D', fontSize: 10, position: 'insideTopRight' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8E7E0', opacity: 0.6 }} />
        <Legend formatter={(v) => <span style={{ fontSize: 11, color: '#7A7A8A' }}>{v === 'scoredMarks' ? 'Scored Marks' : 'Max Marks'}</span>} wrapperStyle={{ paddingTop: 8 }} />
        <Bar dataKey="maxMarks" name="maxMarks" fill="#E0DED5" radius={[2, 2, 0, 0]} maxBarSize={28} />
        <Bar dataKey="scoredMarks" name="scoredMarks" radius={[2, 2, 0, 0]} maxBarSize={28}>
          {criteria.map((c: Criterion) => <Cell key={c.id} fill={barColor(c)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
