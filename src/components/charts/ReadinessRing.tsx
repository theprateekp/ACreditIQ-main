import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { useKPIs } from '@/hooks/useDashboardData';
import { CalendarIcon } from '@/components/ui/Icon';

function color(s: number) { return s >= 80 ? '#15803D' : s >= 50 ? '#B45309' : '#B91C1C'; }
function label(s: number) {
  return s >= 80 ? { text: 'On Track', sub: 'Submission readiness is healthy' }
    : s >= 50 ? { text: 'At Risk', sub: 'Action required on key criteria' }
    : { text: 'Critical', sub: 'Immediate intervention needed' };
}

export function ReadinessRingPanel({ score, estimatedMarks, totalMarks }: { score: number; estimatedMarks: number; totalMarks: number }) {
  const { data: kpis } = useKPIs();
  const days = kpis?.daysToDeadline ?? 0;
  const c = color(score);
  const { text, sub } = label(score);
  const deadlineColor = days <= 7 ? '#B91C1C' : days <= 30 ? '#B45309' : '#15803D';

  return (
    <div className="card p-4 flex flex-col sm:flex-row items-center gap-6">
      {/* Ring */}
      <div style={{ width: 180, height: 180 }} className="relative flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="88%" barSize={16} data={[{ value: score, fill: c }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#E0DED5' }} dataKey="value" angleAxisId={0} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold tabular-nums" style={{ color: c }}>{score}%</span>
          <span className="text-xs font-semibold mt-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>NBA Readiness</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-3 flex-1 w-full">
        <div>
          <span className="inline-block text-sm font-bold px-3 py-1 rounded mb-1" style={{ color: c, backgroundColor: `${c}18`, border: `1px solid ${c}40` }}>{text}</span>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
        </div>

        {/* Marks */}
        <div className="rounded p-3 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated Marks</p>
            <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{estimatedMarks} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/ {totalMarks}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Marks Gap</p>
            <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--danger)' }}>−{totalMarks - estimatedMarks}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Deadline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2" style={{ color: deadlineColor }}>
            <CalendarIcon className="w-5 h-5" />
            <span className="text-3xl font-bold tabular-nums">{days}</span>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Days to Submission</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>NBA SAR deadline · GAPC V4.0</p>
          </div>
        </div>

        {/* Cluster bars */}
        <div className="flex flex-col gap-1.5">
          {[{ label: 'Governance & Strategy', pct: 76 }, { label: 'Academic Quality', pct: 55 }, { label: 'Resources & Compliance', pct: 44 }].map((cl) => (
            <div key={cl.label} className="flex items-center gap-2">
              <span className="text-xs w-40 truncate" style={{ color: 'var(--text-muted)' }}>{cl.label}</span>
              <div className="flex-1 progress-track">
                <div className="progress-fill" style={{ width: `${cl.pct}%`, backgroundColor: cl.pct >= 80 ? '#15803D' : cl.pct >= 50 ? '#B45309' : '#B91C1C' }} />
              </div>
              <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{cl.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReadinessRing({ score, size = 180 }: { score: number; size?: number }) {
  const c = color(score);
  const { text } = label(score);
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="88%" barSize={14} data={[{ value: score, fill: c }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#E0DED5' }} dataKey="value" angleAxisId={0} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold tabular-nums" style={{ color: c }}>{score}%</span>
          <span className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Readiness</span>
        </div>
      </div>
      <span className="text-xs font-semibold px-3 py-1 rounded" style={{ color: c, backgroundColor: `${c}18`, border: `1px solid ${c}40` }}>{text}</span>
    </div>
  );
}
