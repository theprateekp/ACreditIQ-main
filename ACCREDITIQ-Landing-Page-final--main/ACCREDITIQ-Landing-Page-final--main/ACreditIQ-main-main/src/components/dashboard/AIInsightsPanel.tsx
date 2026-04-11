import { useAIInsights, useAISummary } from '@/hooks/useDashboardData';
import { SparklesIcon, WarningIcon, ChartBarIcon, InfoIcon, CheckCircleIcon } from '@/components/ui/Icon';
import SubmissionReadinessChecklist from './SubmissionReadinessChecklist';
import type { AIInsight } from '@/types';

const TYPE_CFG = {
  readiness: { label: 'Readiness',  Icon: ChartBarIcon, color: 'var(--accent)',   bg: 'var(--accent-lt)' },
  risk:      { label: 'Risk Alert', Icon: WarningIcon,  color: 'var(--danger)',   bg: 'var(--danger-bg)' },
  suggestion:{ label: 'Suggestion', Icon: SparklesIcon, color: 'var(--success)',  bg: 'var(--success-bg)' },
};

function ConfBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const c = pct >= 85 ? 'var(--success)' : pct >= 70 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Confidence</span>
      <div className="flex-1 progress-track"><div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: c }} /></div>
      <span className="text-[10px] w-7 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const cfg = TYPE_CFG[insight.type];
  return (
    <div className="card p-3 flex flex-col gap-2" style={{ borderLeft: `3px solid ${cfg.color}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
        <span className="badge badge-info">{insight.criterionId}</span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{insight.text}</p>
      <ConfBar score={insight.confidenceScore} />
      {insight.sourceRefs.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Sources:</span>
          {insight.sourceRefs.map((r) => <span key={r} className="badge badge-neutral font-mono">{r}</span>)}
        </div>
      )}
    </div>
  );
}

export default function AIInsightsPanel() {
  const { data: insights, isLoading, isError } = useAIInsights();
  const { data: summary } = useAISummary();

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>AI Insights</span>
          <span className="badge badge-success">AI Online</span>
        </div>

        {/* Summary */}
        {summary && (
          <div className="p-3 flex flex-col gap-2" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-row-alt)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Summary</span>
              <span className={`badge ${summary.riskLevel === 'Low' ? 'badge-success' : summary.riskLevel === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>{summary.riskLevel} Risk</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid #86EFAC' }}>
                <p className="text-[10px] font-bold mb-0.5" style={{ color: 'var(--success)' }}>Strongest</p>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{summary.strongestCriterion}</p>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid #FCA5A5' }}>
                <p className="text-[10px] font-bold mb-0.5" style={{ color: 'var(--danger)' }}>Weakest</p>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{summary.weakestCriterion}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Suggested Improvements</p>
              {summary.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-0.5">
                  <CheckCircleIcon className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="m-3 p-2 rounded flex items-center gap-2 text-xs" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid #FCD34D', color: 'var(--warning)' }}>
            <WarningIcon className="w-4 h-4 flex-shrink-0" />AI Service unavailable — showing cached insights.
          </div>
        )}

        <div className="p-3 flex flex-col gap-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />)}
          {!isLoading && (insights ?? []).map((insight) => <InsightCard key={insight.id} insight={insight} />)}
        </div>
      </div>

      <SubmissionReadinessChecklist />

      <div className="card p-3 flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>All AI insights are grounded in your current SAR data. No external knowledge is injected.</span>
      </div>
    </div>
  );
}
