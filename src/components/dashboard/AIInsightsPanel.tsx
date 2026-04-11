import { useState, useRef, useEffect } from 'react';
import { useAIInsights, useAISummary } from '@/hooks/useDashboardData';
import { SparklesIcon, WarningIcon, ChartBarIcon, InfoIcon, CheckCircleIcon } from '@/components/ui/Icon';
import SubmissionReadinessChecklist from './SubmissionReadinessChecklist';
import type { AIInsight } from '@/types';

const CHATBOT_URL = 'http://localhost:3001';
// Real Mistral + Supabase credentials from accreditIQ-main/.env
// MISTRAL_API_KEY: DSxy0LbakLsXDPPuEf6cS8JZJXk2eQ8F
// SUPABASE_URL: https://gogcmcfcjzlwexzjiisn.supabase.co

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

// ── Inline AI Chat ────────────────────────────────────────────
interface Msg { role: 'user' | 'assistant'; content: string }

function renderMd(text: string) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`(.+?)`/g,'<code style="background:rgba(37,99,235,0.15);padding:1px 4px;border-radius:3px;font-size:11px;">$1</code>')
    .replace(/^### (.+)$/gm,'<div style="font-weight:700;font-size:12px;margin:8px 0 3px;color:var(--accent);">$1</div>')
    .replace(/^- (.+)$/gm,'<div style="display:flex;gap:5px;margin:1px 0;"><span style="color:var(--accent);">•</span><span>$1</span></div>')
    .replace(/\n\n/g,'<br/><br/>').replace(/\n/g,'<br/>');
}

function AIChatSection() {
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [input, setInput]     = useState('');
  const [busy, setBusy]       = useState(false);
  const histRef               = useRef<Msg[]>([]);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if (msgs.length > 0) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
  }, [msgs]);

  async function ask() {
    const q = input.trim();
    if (!q || busy) return;
    setMsgs((p) => [...p, { role: 'user', content: q }]);
    histRef.current.push({ role: 'user', content: q });
    setInput('');
    setBusy(true);
    setMsgs((p) => [...p, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: histRef.current.slice(-8) }),
      });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let full = '', buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const d = JSON.parse(line.slice(6));
            if (d.text) { full += d.text; setMsgs((p) => p.map((m,i) => i===p.length-1 ? {...m,content:full} : m)); }
          } catch { /* skip */ }
        }
      }
      histRef.current.push({ role: 'assistant', content: full });
    } catch {
      setMsgs((p) => p.map((m,i) => i===p.length-1 ? {...m,content:'⚠️ Server offline. Start the backend server: `cd server && npm start`'} : m));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="card-header flex items-center gap-2">
        <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
        <span>Ask AccreditIQ AI</span>
        <span className="badge badge-success ml-auto font-normal">Mistral AI · RAG</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto" style={{ maxHeight: 320, scrollbarWidth: 'thin' }}>
        {msgs.length === 0 && (
          <div className="text-center py-6">
            <SparklesIcon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ask anything about NBA GAPC V4.0, SAR criteria, or accreditation guidance.</p>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
              style={{ background: m.role === 'user' ? 'var(--accent)' : 'var(--accent-lt)', color: m.role === 'user' ? '#fff' : 'var(--accent)' }}>
              {m.role === 'user' ? 'Y' : '✦'}
            </div>
            <div className="text-xs leading-relaxed px-2.5 py-1.5 rounded-lg max-w-[85%]"
              style={{ background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-row-alt)', border: m.role === 'user' ? 'none' : '1px solid var(--border)', color: m.role === 'user' ? '#fff' : 'var(--text-primary)' }}>
              {!m.content && busy && i === msgs.length - 1
                ? <span className="flex gap-1"><span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{animationDelay:'0ms'}}/><span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{animationDelay:'150ms'}}/><span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{animationDelay:'300ms'}}/></span>
                : <div dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
              }
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') ask(); }}
            placeholder="Ask about criteria, scoring, documents…"
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <button onClick={ask} disabled={busy || !input.trim()} style={{ color: busy || !input.trim() ? 'var(--border-dk)' : 'var(--accent)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIInsightsPanel() {
  const { data: insights, isLoading, isError } = useAIInsights();
  const { data: summary } = useAISummary();

  return (
    <div className="flex flex-col gap-4">
      {/* ── Live AI Chat ── */}
      <AIChatSection />

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
