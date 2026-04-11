import { useState } from 'react';
import { useCriteria } from '@/hooks/useDashboardData';
import { CRITERIA_DEFINITIONS } from '@/data/criteriaData';
import type { SubCriterion } from '@/data/criteriaData';
import { DocumentIcon, WarningIcon, CheckCircleIcon, SparklesIcon } from '@/components/ui/Icon';
import AIQueryBox from '@/components/ui/AIQueryBox';
import type { Criterion } from '@/types';

function SubCriterionCard({ sub, criterion }: { sub: SubCriterion; criterion: Criterion }) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'narrative' | 'ai'>('checklist');
  const completedItems = Math.floor(sub.checklistItems.length * (criterion.completionPct / 100));

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge badge-info">{sub.id}</span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{sub.title}</span>
        </div>
        <div className="flex items-center gap-3 font-normal">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub.maxMarks} marks</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>{completedItems}/{sub.checklistItems.length} items</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-row-alt)' }}>
        {(['checklist', 'narrative', 'ai'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-xs font-semibold capitalize transition-colors"
            style={{
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              backgroundColor: 'transparent',
            }}>
            {tab === 'ai' ? 'AI Insights' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'checklist' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{sub.description}</p>
            {sub.formula && (
              <div className="p-2 rounded mb-2 font-mono text-xs"
                style={{ backgroundColor: 'var(--accent-lt)', border: '1px solid #93C5FD', color: 'var(--accent)' }}>
                {sub.formula}
              </div>
            )}
            {sub.checklistItems.map((item, i) => {
              const done = i < completedItems;
              return (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded"
                  style={{
                    backgroundColor: done ? 'var(--success-bg)' : 'var(--bg-row-alt)',
                    border: `1px solid ${done ? '#86EFAC' : 'var(--border)'}`,
                  }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: done ? 'var(--success)' : 'var(--bg-input)', border: `1px solid ${done ? 'var(--success)' : 'var(--border-dk)'}` }}>
                    {done && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-xs flex-1" style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                  {!done && <span className="badge badge-warning">Pending</span>}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'narrative' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Write the narrative for this sub-criterion. Be specific, evidence-based, and aligned to NBA evaluation rubric.</p>
            <textarea
              className="w-full text-sm resize-none"
              rows={6}
              style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-dk)', borderRadius: 2, padding: '8px', color: 'var(--text-primary)' }}
              placeholder={`Describe the ${sub.title} with specific evidence, data, and outcomes...`}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>0 / 500 words recommended</span>
              <button className="btn-primary">Save Draft</button>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded" style={{ backgroundColor: 'var(--accent-lt)', border: '1px solid #93C5FD' }}>
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>AI Analysis for {sub.id}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {completedItems < sub.checklistItems.length
                  ? `${sub.checklistItems.length - completedItems} checklist items are pending. Focus on: ${sub.checklistItems.slice(completedItems, completedItems + 2).join(', ')}.`
                  : `All checklist items complete for ${sub.id}. Review the narrative for completeness.`}
              </p>
            </div>
            <AIQueryBox
              prefillPrompt={`For NBA GAPC V4.0 sub-criterion ${sub.id} "${sub.title}" (${sub.maxMarks} marks): ${sub.description}. Provide specific guidance on: 1) What evidence is required, 2) How to calculate/demonstrate compliance, 3) Common mistakes to avoid, 4) How to maximize marks.`}
              placeholder={`Ask AI about ${sub.id}…`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CriterionWorkspace({ criterionId }: { criterionId: string }) {
  const { data: criteria } = useCriteria();
  const def = CRITERIA_DEFINITIONS.find((c) => c.id === criterionId);
  const criterion = criteria?.find((c) => c.id === criterionId);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);

  if (!def || !criterion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DocumentIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading criterion workspace...</p>
        </div>
      </div>
    );
  }

  const activeSub = activeSubId ? def.subCriteria.find((s) => s.id === activeSubId) : null;
  const pctColor = criterion.completionPct >= 80 ? 'var(--success)' : criterion.completionPct >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="flex gap-4">
      {/* Left nav */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-3">
        {/* Criterion summary */}
        <div className="card p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-info">{def.id}</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: pctColor }}>{criterion.completionPct}%</span>
          </div>
          <p className="text-xs font-semibold leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>{def.title}</p>
          <div className="progress-track mb-1">
            <div className="progress-fill" style={{ width: `${criterion.completionPct}%`, backgroundColor: pctColor }} />
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>{criterion.scoredMarks}/{criterion.maxMarks} marks</span>
            <span>AI: {criterion.aiReadinessScore}</span>
          </div>
        </div>

        {/* Sub-criteria list */}
        <div className="card overflow-hidden">
          <div className="card-header">Sub-Criteria</div>
          {def.subCriteria.map((sub) => {
            const isActive = activeSubId === sub.id;
            const done = Math.floor(sub.checklistItems.length * (criterion.completionPct / 100)) >= sub.checklistItems.length;
            return (
              <button key={sub.id} onClick={() => setActiveSubId(isActive ? null : sub.id)}
                className="w-full flex items-start gap-2 px-3 py-2.5 text-left transition-colors"
                style={{
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--accent-lt)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: done ? 'var(--success)' : 'var(--warning)' }}>
                  {done ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <WarningIcon className="w-3.5 h-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>{sub.id}</p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{sub.title}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sub.maxMarks} marks</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Incharge */}
        <div className="card p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Criterion Incharge</p>
          <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{def.incharge ?? 'Not assigned'}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{def.cluster}</p>
        </div>
      </div>

      {/* Center workspace */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Max Marks', value: criterion.maxMarks, color: 'var(--accent)' },
            { label: 'Scored',    value: criterion.scoredMarks, color: 'var(--success)' },
            { label: 'AI Score',  value: criterion.aiReadinessScore, color: '#7C3AED' },
            { label: 'Gaps',      value: criterion.gapCount, color: 'var(--danger)' },
          ].map((t) => (
            <div key={t.label} className="card p-3 text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: t.color }}>{t.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.label}</div>
            </div>
          ))}
        </div>

        {activeSub ? (
          <SubCriterionCard sub={activeSub} criterion={criterion} />
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select a sub-criterion from the left panel to view its checklist, narrative editor, and AI insights.</p>
            {def.subCriteria.map((sub) => {
              const done = Math.floor(sub.checklistItems.length * (criterion.completionPct / 100));
              const pct = Math.round((done / sub.checklistItems.length) * 100);
              const c = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
              return (
                <button key={sub.id} onClick={() => setActiveSubId(sub.id)}
                  className="card p-3 text-left w-full hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-info">{sub.id}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{sub.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub.maxMarks} marks</span>
                      <span className="text-xs font-bold tabular-nums" style={{ color: c }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-track mb-1.5">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: c }} />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{done}/{sub.checklistItems.length} items · {sub.description.slice(0, 80)}...</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right AI panel */}
      <div className="w-60 flex-shrink-0 flex flex-col gap-3">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>AI Assistant</span>
            </div>
            <span className="badge badge-success font-normal">Online</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              `${def.id} is at ${criterion.completionPct}% — ${criterion.gapCount} active gaps`,
              criterion.completionPct < 50 ? 'Critical: Below 50% threshold' : criterion.completionPct < 80 ? 'At Risk: Below audit-ready threshold' : 'On Track: Above 80%',
              `AI Readiness Score: ${criterion.aiReadinessScore}/100`,
            ].map((msg, i) => (
              <div key={i} className="p-2 rounded text-xs" style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{msg}</div>
            ))}
            <AIQueryBox
              compact
              placeholder={`Ask about ${def.id}…`}
              prefillPrompt={`For NBA GAPC V4.0 criterion ${def.id} "${def.title}" currently at ${criterion.completionPct}% with ${criterion.gapCount} gaps: what are the most critical actions needed to improve the score?`}
            />
          </div>
        </div>

        {/* Evidence */}
        <div className="card">
          <div className="card-header">Evidence Status</div>
          <div className="p-3 flex flex-col gap-1.5">
            {[
              { label: 'Uploaded', value: criterion.evidenceCount, color: 'var(--success)' },
              { label: 'Required', value: criterion.requiredEvidence, color: 'var(--text-primary)' },
              { label: 'Missing',  value: Math.max(0, criterion.requiredEvidence - criterion.evidenceCount), color: 'var(--danger)' },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span className="font-semibold tabular-nums" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
            <div className="progress-track mt-1">
              <div className="progress-fill" style={{ width: `${Math.min(100, (criterion.evidenceCount / criterion.requiredEvidence) * 100)}%`, backgroundColor: 'var(--accent)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
