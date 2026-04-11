import { useState } from 'react';
import { useCriteria } from '@/hooks/useDashboardData';
import { CheckCircleIcon, WarningIcon, ClockIcon, SparklesIcon } from '@/components/ui/Icon';
import AIQueryBox from '@/components/ui/AIQueryBox';

type SimResult = 'PASS' | 'CONDITIONAL' | 'FAIL' | 'NOT_STARTED';

function getResult(pct: number): SimResult {
  if (pct === 0) return 'NOT_STARTED';
  if (pct >= 80) return 'PASS';
  if (pct >= 50) return 'CONDITIONAL';
  return 'FAIL';
}

type IconComponent = (props: { className?: string; style?: React.CSSProperties }) => JSX.Element;

const RESULT_CFG: Record<SimResult, { label: string; badgeCls: string; bg: string; border: string; color: string; Icon: IconComponent }> = {
  PASS:        { label: 'PASS',        badgeCls: 'badge badge-success', bg: 'var(--success-bg)', border: '#86EFAC',  color: 'var(--success)', Icon: CheckCircleIcon },
  CONDITIONAL: { label: 'CONDITIONAL', badgeCls: 'badge badge-warning', bg: 'var(--warning-bg)', border: '#FCD34D',  color: 'var(--warning)', Icon: WarningIcon },
  FAIL:        { label: 'FAIL',        badgeCls: 'badge badge-danger',  bg: 'var(--danger-bg)',  border: '#FCA5A5',  color: 'var(--danger)',  Icon: WarningIcon },
  NOT_STARTED: { label: 'NOT STARTED', badgeCls: 'badge badge-neutral', bg: 'var(--bg-row-alt)', border: 'var(--border)', color: 'var(--text-muted)', Icon: ClockIcon },
};

export default function AuditSimulator() {
  const { data: criteria, isLoading } = useCriteria();
  const [showAI, setShowAI] = useState(false);

  const results = (criteria ?? []).map((c) => ({ ...c, result: getResult(c.completionPct) }));
  const passCount  = results.filter((r) => r.result === 'PASS').length;
  const failCount  = results.filter((r) => r.result === 'FAIL').length;
  const condCount  = results.filter((r) => r.result === 'CONDITIONAL').length;
  const overall: SimResult = failCount > 0 ? 'FAIL' : condCount > 2 ? 'CONDITIONAL' : passCount >= 7 ? 'PASS' : 'CONDITIONAL';
  const oCfg = RESULT_CFG[overall];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>Audit Simulator</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAI(p => !p)}
              className="btn-secondary flex items-center gap-1.5 text-xs"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              {showAI ? 'Hide AI' : 'AI Analysis'}
            </button>
            <button className="btn-primary">Run Simulation</button>
          </div>
        </div>

        {/* Overall result */}
        <div className="p-4 flex items-center gap-4 rounded m-3"
          style={{ backgroundColor: oCfg.bg, border: `1px solid ${oCfg.border}` }}>
          <oCfg.Icon className="w-10 h-10" style={{ color: oCfg.color }} />
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>Simulated Overall Result</p>
            <p className="text-2xl font-black" style={{ color: oCfg.color }}>{overall}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{passCount} Pass · {condCount} Conditional · {failCount} Fail</p>
          </div>
        </div>

        {/* AI Analysis box */}
        {showAI && (
          <div className="px-3 pb-3">
            <AIQueryBox
              prefillPrompt={`Based on this NBA audit simulation result: Overall ${overall} (${passCount} Pass, ${condCount} Conditional, ${failCount} Fail across 9 GAPC V4.0 criteria), provide a detailed analysis of: 1) What this result means for accreditation, 2) Which criteria need immediate attention, 3) Specific steps to improve the result to PASS, 4) Timeline recommendations.`}
              placeholder="Ask AI to analyze this audit result…"
            />
          </div>
        )}
      </div>

      {/* Per-criterion table */}
      <div className="card overflow-hidden">
        <div className="card-header">Criterion-wise Simulation Results</div>
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-10 m-3 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />)
          : (
            <table className="inst-table">
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Title</th>
                  <th className="text-right">Scored / Max</th>
                  <th className="text-center">Completion</th>
                  <th className="text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const cfg = RESULT_CFG[r.result];
                  return (
                    <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                      <td className="font-bold" style={{ color: 'var(--accent)' }}>{r.id}</td>
                      <td style={{ color: 'var(--text-primary)' }}>{r.title}</td>
                      <td className="text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>{r.scoredMarks} / {r.maxMarks}</td>
                      <td className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 progress-track"><div className="progress-fill" style={{ width: `${r.completionPct}%`, backgroundColor: cfg.color }} /></div>
                          <span className="text-xs tabular-nums" style={{ color: cfg.color }}>{r.completionPct}%</span>
                        </div>
                      </td>
                      <td className="text-center"><span className={cfg.badgeCls}>{cfg.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
