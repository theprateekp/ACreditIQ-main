import { useState, useRef } from 'react';
import { CRITERIA_DATA, TOTAL_MARKS } from '@/data/sarCriteriaData';
import type { Criterion, SubCriterion } from '@/data/sarCriteriaData';

const CHATBOT_URL = 'http://localhost:3000';

// ── Simple markdown renderer ──────────────────────────────────
function md(text: string) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`(.+?)`/g,'<code style="background:rgba(37,99,235,0.15);padding:1px 4px;border-radius:3px;font-size:11px;">$1</code>')
    .replace(/^### (.+)$/gm,'<div style="font-weight:700;font-size:13px;margin:10px 0 4px;color:var(--accent);">$1</div>')
    .replace(/^## (.+)$/gm,'<div style="font-weight:700;font-size:14px;margin:12px 0 4px;color:var(--accent);">$1</div>')
    .replace(/^# (.+)$/gm,'<div style="font-weight:800;font-size:15px;margin:12px 0 6px;color:var(--text-primary);">$1</div>')
    .replace(/^- (.+)$/gm,'<div style="display:flex;gap:6px;margin:2px 0;"><span style="color:var(--accent);">•</span><span>$1</span></div>')
    .replace(/\n\n/g,'<br/><br/>').replace(/\n/g,'<br/>');
}

type View = 'welcome' | 'criterion' | 'subcrit';

export default function SARGeneratorPage() {
  const [view, setView]                   = useState<View>('welcome');
  const [activeCrit, setActiveCrit]       = useState<Criterion | null>(null);
  const [activeSC, setActiveSC]           = useState<SubCriterion | null>(null);
  const [mode, setMode]                   = useState<'generate' | 'audit'>('generate');
  const [userData, setUserData]           = useState<Record<string, string>>({});
  const [generated, setGenerated]         = useState<Record<string, string>>({});
  const [scores, setScores]               = useState<Record<string, number>>({});
  const [scoreOutput, setScoreOutput]     = useState<Record<string, string>>({});
  const [generating, setGenerating]       = useState(false);
  const [scoring, setScoring]             = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Record<string, {name:string;content:string}[]>>({});
  const [coverInst, setCoverInst]         = useState("TSSM'S BSCOER");
  const [coverTitle, setCoverTitle]       = useState('Self-Assessment Report (SAR) - GAPC V4.0');
  const fileRef = useRef<HTMLInputElement>(null);

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const pct = Math.round((totalScore / TOTAL_MARKS) * 100);

  // ── Select criterion ─────────────────────────────────────
  function selectCrit(c: Criterion) {
    setActiveCrit(c);
    setActiveSC(null);
    setView('criterion');
  }

  // ── Expand sub-criterion ──────────────────────────────────
  function expandSC(sc: SubCriterion) {
    setActiveSC(sc);
    setMode('generate');
    setView('subcrit');
  }

  // ── Generate SAR narrative ────────────────────────────────
  async function generate() {
    if (!activeSC) return;
    const sc = activeSC;
    const userInput = userData[sc.id] || '';
    const files = attachedFiles[sc.id] || [];
    setGenerating(true);
    setGenerated((p) => ({ ...p, [sc.id]: '' }));

    const prompt = `You are a strict, expert National Board of Accreditation (NBA) Auditor and SAR Narrative Architect for GAPC V4.0 (Tier-II Undergraduate Engineering Programs).

Your task is to generate a comprehensive, meticulously formatted Self-Assessment Report (SAR) narrative for the following section:

**Sub-Criterion ${sc.id}: ${sc.name}**
**Maximum Marks:** ${sc.marks}

### I. GAPC V4.0 COMPLIANCE REQUIREMENTS
To achieve maximum marks, ensure the following constraints are rigorously followed:
- Required Documents to Reference: ${sc.documents.join('; ')}
${sc.tables.length ? `- Required Mandatory Tables: ${sc.tables.join('; ')}` : '- Required Mandatory Tables: Evaluate based on holistic data context'}
${sc.formula ? `- Scoring Formula: ${sc.formula}` : '- Scoring Formula: Evaluate based on holistic data context'}
${sc.subItems.length ? `- Sub-items:\n${sc.subItems.map(si => `  * ${si.id}: ${si.name} (${si.marks} marks)`).join('\n')}` : ''}

### II. INSTITUTIONAL DATA
Institution: TSSM'S BSCOER (Established 2010)
Principal: Dr. G.A. Hinge | NBA Coordinator: Hasarmuni Sir
Departments: Electrical Engineering (HOD: Kanade Sir), ENTC (HOD: Shinde Sir)

Use the following raw institutional data provided by the user. If data is missing for required sections, you MUST generate the perfect structural framework (exact tables, exact headers) and prominently mark missing data cells with **[__INSERT DATA__]**.
---
${userInput || '[No institutional data provided — generate complete template with all required tables and placeholder fields marked as [__INSERT DATA__]]'}
---

### III. STRICT EXECUTION DIRECTIVES (FAILURE IS NOT AN OPTION)
1. **STRUCTURAL REPLICATION**: Strictly follow the exact formatting, phrasing, table header configurations, and hierarchical layout from the official NBA SAR format (2-SAR-UG-EG-T2-6-2-2026_Format).
2. **VERBATIM INSTRUCTIONS (THE BLUE TEXT)**: Every sub-criterion header must be followed by the official NBA instructional guidelines in parentheses, formatted in isolated markdown italics (e.g., *(Provide details of courses in terms of teaching and learning scheme...)*).
3. **MANDATORY TABLES**: Draw exact markdown tables with the official NBA column headers. NEVER alter official column names. Use official table numbering (e.g., Table No. 1.2.1.1).
4. **IMAGE PLACEHOLDERS**: Print exact placeholder tags like **[INSERT IMAGE: Description]** isolated on a new line where graphics are needed.
5. **ACADEMIC TONE**: Maintain a highly professional, objective tone suitable for a global accreditation board. DO NOT use emojis.
6. **NO CONVERSATIONAL FILLER**: DO NOT use phrases like "Here is your report," "I took reference from the file," or "According to the provided data." Output ONLY the pure SAR markup seamlessly.
7. **GAP ANALYSIS**: At the absolute end, append a short "Gap Analysis" block analyzing what the institution is missing to achieve the full designated marks.`;

    try {
      const res = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: [], fileContents: files }),
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
          try { const d = JSON.parse(line.slice(6)); if (d.text) { full += d.text; setGenerated((p) => ({ ...p, [sc.id]: full })); } } catch { /* skip */ }
        }
      }
    } catch {
      setGenerated((p) => ({ ...p, [sc.id]: '⚠️ Server offline. Start the chatbot server at localhost:3000 to enable AI generation.' }));
    } finally {
      setGenerating(false);
    }
  }

  // ── Score content ─────────────────────────────────────────
  async function score() {
    if (!activeSC) return;
    const sc = activeSC;
    const gen = generated[sc.id] || '';
    const ud = userData[sc.id] || '';
    if (!gen && !ud) { alert('Generate content or enter data first.'); return; }
    setScoring(true);
    setScoreOutput((p) => ({ ...p, [sc.id]: '' }));

    const prompt = `You are an NBA GAPC V4.0 Lead Evaluator. Calculate the AI Readiness Score for sub-criterion ${sc.id}: "${sc.name}" (Maximum marks: ${sc.marks}).

Evaluate against:
- Required documents: ${sc.documents.join('; ')}
${sc.formula ? `- Scoring formula: ${sc.formula}` : ''}
${sc.tables.length ? `- Required tables: ${sc.tables.join('; ')}` : ''}

Content to evaluate:
${gen || ud}

Provide:
1. **Estimated AI Readiness Score: X/${sc.marks}** (be rigorous and justifiably accurate)
2. **Strengths** (2-3 specific points well covered)
3. **Missing Items & Gaps** (specific documents or data still needed)
4. **Actionable Recommendations** (3-5 explicit steps to improve the score)

Output in Markdown.`;

    try {
      const res = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: [] }),
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
            if (d.text) {
              full += d.text;
              setScoreOutput((p) => ({ ...p, [sc.id]: full }));
              const m = full.match(/Score[:\s]*(\d+)\s*[\/]/i);
              if (m) setScores((p) => ({ ...p, [sc.id]: parseInt(m[1]) }));
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setScoreOutput((p) => ({ ...p, [sc.id]: '⚠️ Server offline.' }));
    } finally {
      setScoring(false);
    }
  }

  // ── File upload ───────────────────────────────────────────
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!activeSC || !e.target.files?.length) return;
    const files = Array.from(e.target.files);
    try {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));
      form.append('scId', activeSC.id);
      const res = await fetch(`${CHATBOT_URL}/api/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) {
        setAttachedFiles((p) => ({ ...p, [activeSC.id]: [...(p[activeSC.id] || []), ...data.files] }));
      }
    } catch {
      // fallback: read as text
      for (const f of files) {
        const text = await f.text().catch(() => '');
        setAttachedFiles((p) => ({ ...p, [activeSC!.id]: [...(p[activeSC!.id] || []), { name: f.name, content: text.slice(0, 50000) }] }));
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="flex gap-0 h-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* ── Sidebar ── */}
      <div className="flex-shrink-0 flex flex-col" style={{ width: 220, background: 'var(--bg-header-2)', borderRight: '1px solid var(--hdr-border)', overflowY: 'auto' }}>
        {/* Score ring */}
        <div className="p-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--hdr-border)' }}>
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="22" cy="22" r="18" fill="none" stroke="#2563EB" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold" style={{ color: '#F1F5F9' }}>{pct}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: '#F1F5F9' }}>{totalScore} / {TOTAL_MARKS}</div>
            <div className="text-[10px]" style={{ color: 'var(--hdr-muted)' }}>Overall Readiness</div>
          </div>
        </div>

        {/* Criteria list */}
        <div className="flex-1 py-1">
          {CRITERIA_DATA.map((c) => {
            const critScore = c.subCriteria.reduce((s, sc) => s + (scores[sc.id] ?? 0), 0);
            const hasScore = c.subCriteria.some((sc) => scores[sc.id] !== undefined);
            const isActive = activeCrit?.id === c.id;
            return (
              <button key={c.id} onClick={() => selectCrit(c)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                style={{
                  background: isActive ? 'rgba(37,99,235,0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                  color: isActive ? '#93C5FD' : 'var(--hdr-muted)',
                }}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: isActive ? '#2563EB' : 'rgba(255,255,255,0.08)', color: '#F1F5F9' }}>
                  {c.id.replace('C', '')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium truncate">{c.name}</div>
                  <div className="text-[9px]" style={{ color: 'var(--hdr-muted)' }}>{c.marks} marks{hasScore ? ` · ${critScore}/${c.marks}` : ''}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Export */}
        <div className="p-3" style={{ borderTop: '1px solid var(--hdr-border)' }}>
          <button
            className="w-full btn-primary text-xs py-2"
            onClick={async () => {
              try {
                const body = {
                  generated,
                  scores,
                  userData,
                  criteria: CRITERIA_DATA.map(c => ({
                    id: c.id, name: c.name, marks: c.marks,
                    subCriteria: c.subCriteria.map(sc => ({ id: sc.id, name: sc.name, marks: sc.marks })),
                  })),
                };
                const res = await fetch('http://localhost:3000/api/export-pdf', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error('Failed');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'SAR_Report_TSSM_BSCOER.pdf';
                a.click();
                URL.revokeObjectURL(url);
              } catch {
                alert('PDF export failed. Ensure backend is running at localhost:3000.');
              }
            }}
          >
            ↓ Export PDF Report
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Welcome */}
        {view === 'welcome' && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-lt)' }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>SAR Report Generator</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a criterion from the sidebar to begin building your NBA GAPC V4.0 Self-Assessment Report. Each sub-criterion shows required documents, format, and AI-powered scoring.</p>
            </div>
            {/* Cover config */}
            <div className="card p-4 w-full text-left">
              <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>PDF Cover Page Configuration</div>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Institution Name</label>
                  <input value={coverInst} onChange={(e) => setCoverInst(e.target.value)}
                    className="w-full text-sm rounded px-2 py-1.5 mt-1"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Report Title</label>
                  <input value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)}
                    className="w-full text-sm rounded px-2 py-1.5 mt-1"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Criterion sub-criteria grid */}
        {view === 'criterion' && activeCrit && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>PART B › {activeCrit.id}</div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{activeCrit.id}: {activeCrit.name}</h2>
              <span className="badge badge-info mt-1">{activeCrit.marks} marks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeCrit.subCriteria.map((sc) => {
                const hasContent = !!generated[sc.id];
                const scScore = scores[sc.id];
                return (
                  <button key={sc.id} onClick={() => expandSC(sc)}
                    className="card p-4 text-left hover:shadow-md transition-all"
                    style={{ borderLeft: hasContent ? '3px solid var(--success)' : '3px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-info">{sc.id}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sc.marks} marks</span>
                    </div>
                    <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{sc.name}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>📄 {sc.documents.length} documents required</div>
                    <div className="text-[10px] mt-1 font-semibold" style={{ color: hasContent ? 'var(--success)' : 'var(--text-muted)' }}>
                      {hasContent ? `✅ Generated${scScore !== undefined ? ` · Score: ${scScore}/${sc.marks}` : ''}` : '○ Not started'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-criterion expanded view */}
        {view === 'subcrit' && activeSC && activeCrit && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('criterion')} className="flex items-center gap-1.5 text-xs font-semibold self-start" style={{ color: 'var(--accent)' }}>
              ← Back to sub-criteria
            </button>

            <div className="flex items-center gap-3">
              <span className="badge badge-info text-sm">{activeSC.id}</span>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{activeSC.name}</h2>
              <span className="badge badge-neutral">{activeSC.marks} marks</span>
            </div>

            {/* Required docs */}
            {activeSC.documents.length > 0 && (
              <div className="card p-3">
                <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>📋 Required Documents</div>
                <ul className="flex flex-col gap-1">
                  {activeSC.documents.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>○</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tables + Formula */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSC.tables.length > 0 && (
                <div className="card p-3">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>📊 Tables to Include</div>
                  <ul className="flex flex-col gap-1">
                    {activeSC.tables.map((t, i) => <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {t}</li>)}
                  </ul>
                </div>
              )}
              {activeSC.formula && (
                <div className="card p-3">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>🧮 Scoring Formula</div>
                  <div className="font-mono text-xs p-2 rounded" style={{ background: 'var(--accent-lt)', color: 'var(--accent)', border: '1px solid #93C5FD' }}>{activeSC.formula}</div>
                </div>
              )}
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2" style={{ borderBottom: '2px solid var(--border)', paddingBottom: 8 }}>
              {(['generate', 'audit'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="px-4 py-2 text-xs font-semibold rounded-t transition-colors"
                  style={{
                    background: mode === m ? 'var(--accent-lt)' : 'transparent',
                    color: mode === m ? 'var(--accent)' : 'var(--text-muted)',
                    borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent',
                    marginBottom: -10,
                  }}>
                  {m === 'generate' ? '✏️ Generate New SAR' : '🔍 AI Readiness Score'}
                </button>
              ))}
            </div>

            {/* Hidden file input for both Generate & Audit modes */}
            <input ref={fileRef} type="file" multiple accept=".txt,.csv,.md,.json,.pdf,.docx,.xlsx" hidden onChange={handleFile} />

            {/* Generate mode */}
            {mode === 'generate' && (
              <div className="flex flex-col gap-3">
                <div className="card p-3">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>✏️ Your Data & Content</div>
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>Paste your institution's raw data. The AI will use this along with GAPC V4.0 framework to generate your SAR narrative.</p>
                  <textarea
                    value={userData[activeSC.id] || ''}
                    onChange={(e) => setUserData((p) => ({ ...p, [activeSC!.id]: e.target.value }))}
                    rows={6}
                    placeholder={`Enter your institution's data for ${activeSC.id}...\n\nExamples:\n- Vision statement\n- Numerical data (intake, placements, etc.)\n- Faculty details`}
                    className="w-full text-xs resize-none rounded px-3 py-2"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => fileRef.current?.click()} className="btn-outline-blue text-xs px-3 py-1.5 flex items-center gap-1.5">
                      📎 Attach Files
                    </button>
                    {(attachedFiles[activeSC.id] || []).map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--accent-lt)', color: 'var(--accent)' }}>📎 {f.name}</span>
                    ))}
                  </div>
                </div>

                <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2 self-start px-5 py-2.5">
                  {generating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🚀'}
                  {generating ? 'Generating…' : 'Generate SAR Narrative with AI'}
                </button>

                {generated[activeSC.id] && (
                  <div className="card overflow-hidden">
                    <div className="card-header flex items-center justify-between">
                      <span>📝 Generated SAR Narrative</span>
                      <button onClick={() => navigator.clipboard.writeText(document.getElementById('gen-output')?.innerText ?? '')}
                        className="text-xs" style={{ color: 'var(--accent)' }}>Copy</button>
                    </div>
                    <div id="gen-output" className="p-4 text-xs leading-relaxed overflow-y-auto" style={{ maxHeight: 400, color: 'var(--text-primary)' }}
                      dangerouslySetInnerHTML={{ __html: md(generated[activeSC.id]) }} />
                  </div>
                )}
              </div>
            )}

            {/* Audit/Score mode */}
            {mode === 'audit' && (
              <div className="flex flex-col gap-3">
                <div className="card p-4 text-center" style={{ border: '2px dashed var(--border)' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🔍 Calculate AI Readiness Score</div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Upload your SAR draft or use the generated content. The AI will critically analyze it against NBA rubrics and provide a score with actionable recommendations.</p>
                  <button onClick={() => fileRef.current?.click()} className="btn-outline-blue text-xs px-4 py-2">
                    ↑ Upload Draft Document
                  </button>
                  {(attachedFiles[activeSC.id] || []).map((f, i) => (
                    <div key={i} className="text-[10px] mt-2" style={{ color: 'var(--accent)' }}>📎 {f.name}</div>
                  ))}
                </div>

                <button onClick={score} disabled={scoring} className="btn-primary flex items-center gap-2 self-start px-5 py-2.5">
                  {scoring ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✅'}
                  {scoring ? 'Scoring…' : 'Calculate AI Readiness Score'}
                </button>

                {scoreOutput[activeSC.id] && (
                  <div className="card overflow-hidden">
                    <div className="card-header">
                      <span>📊 AI Score Assessment</span>
                      {scores[activeSC.id] !== undefined && (
                        <span className="badge badge-success ml-2">{scores[activeSC.id]}/{activeSC.marks}</span>
                      )}
                    </div>
                    <div className="p-4 text-xs leading-relaxed overflow-y-auto" style={{ maxHeight: 400, color: 'var(--text-primary)' }}
                      dangerouslySetInnerHTML={{ __html: md(scoreOutput[activeSC.id]) }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
