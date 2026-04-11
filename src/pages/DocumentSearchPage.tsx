import { useState } from 'react';

interface IndexedDoc {
  id: string;
  name: string;
  crit: string;
  type: string;
  size: string;
  ext: string;
  text: string;
}

// Sample indexed documents with searchable text content
const INDEXED_DOCS: IndexedDoc[] = [
  { id: 'd1', name: 'CO_Attainment_Report_C3.xlsx',       crit: 'C3', type: 'CO Attainment Sheet',  size: '1.2 MB', ext: 'xlsx', text: 'CO attainment direct indirect PO1 PO2 PO3 course outcome program outcome bloom taxonomy level 3 apply analyze evaluate create' },
  { id: 'd2', name: 'Course_Files_Semester6_C2.pdf',      crit: 'C2', type: 'Course File',           size: '4.8 MB', ext: 'pdf',  text: 'curriculum syllabus semester 6 course file teaching learning process ICT tools lecture notes assignment rubric CO mapping' },
  { id: 'd3', name: 'Faculty_Resume_Dr_Joshi_C5.pdf',     crit: 'C5', type: 'Faculty Resume',        size: '820 KB', ext: 'pdf',  text: 'faculty resume PhD qualification research publications IEEE Scopus experience designation professor associate assistant' },
  { id: 'd4', name: 'Lab_Invoices_FY2024_C7.pdf',         crit: 'C7', type: 'Lab Invoice',           size: '2.1 MB', ext: 'pdf',  text: 'laboratory invoice equipment purchase infrastructure technical support facilities maintenance calibration safety' },
  { id: 'd5', name: 'PO_Mapping_Matrix_C1.xlsx',          crit: 'C1', type: 'PO Mapping Matrix',     size: '650 KB', ext: 'xlsx', text: 'PO mapping matrix program outcome PO1 PO2 PO3 PO4 PO5 PO6 PO7 PO8 PO9 PO10 PO11 PO12 PSO correlation high medium low' },
  { id: 'd6', name: 'Student_Feedback_C9.docx',           crit: 'C9', type: 'Student Feedback',      size: '340 KB', ext: 'docx', text: 'student feedback survey satisfaction mentoring counseling career guidance placement support welfare grievance' },
  { id: 'd7', name: 'Assessment_Rubrics_C2.docx',         crit: 'C2', type: 'Assessment Rubric',     size: '210 KB', ext: 'docx', text: 'assessment rubric bloom taxonomy question paper internal exam CO mapping marks distribution evaluation criteria' },
  { id: 'd8', name: 'NBA_Self_Assessment_C4.pdf',         crit: 'C4', type: 'NBA SAR Document',      size: '3.3 MB', ext: 'pdf',  text: 'NBA self assessment report students performance enrollment success rate academic performance placement higher studies' },
  { id: 'd9', name: 'Research_Publications_C5.docx',      crit: 'C5', type: 'Research Publications', size: '480 KB', ext: 'docx', text: 'research publications journal conference Scopus SCI impact factor funded project DST AICTE patent consultancy' },
  { id: 'd10', name: 'Continuous_Improv_Plan_C8.pdf',     crit: 'C8', type: 'Improvement Plan',      size: '1.1 MB', ext: 'pdf',  text: 'continuous improvement plan corrective action CO PO attainment gap analysis previous assessment weaknesses remedial' },
  { id: 'd11', name: 'Faculty_Contributions_List_C6.xlsx',crit: 'C6', type: 'Faculty Contributions', size: '740 KB', ext: 'xlsx', text: 'faculty contributions FDP STTP workshop professional membership IEEE ISTE award recognition e-content MOOC NPTEL' },
  { id: 'd12', name: 'Infrastructure_Report_C7.pdf',      crit: 'C7', type: 'Infrastructure Report', size: '5.2 MB', ext: 'pdf',  text: 'infrastructure report classroom laboratory computing facilities internet bandwidth software license technical staff' },
];

const EXT_LABEL: Record<string, string> = { pdf: 'PDF', xlsx: 'XLS', docx: 'DOC' };
const EXT_COLOR: Record<string, string> = { pdf: '#EF4444', xlsx: '#16A34A', docx: '#2563EB' };

function highlight(text: string, kw: string) {
  if (!kw) return text;
  const parts = text.split(new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === kw.toLowerCase()
      ? <mark key={i} style={{ background: '#FEF08A', color: '#1e293b', borderRadius: 2, padding: '0 2px' }}>{p}</mark>
      : p
  );
}

export default function DocumentSearchPage() {
  const [query, setQuery] = useState('');

  const results = query.trim().length >= 2
    ? INDEXED_DOCS.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.text.toLowerCase().includes(query.toLowerCase()) ||
        d.crit.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalMatches = results.reduce((s, d) => {
    const kw = query.toLowerCase();
    return s + (d.text.toLowerCase().split(kw).length - 1) + (d.name.toLowerCase().split(kw).length - 1);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="card p-4">
        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Cross-Document Search</div>
        <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Search any keyword across all uploaded documents. Text is extracted automatically when files are uploaded.
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a keyword… e.g. CO attainment, PO1, syllabus, research"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
          )}
        </div>

        {query.trim().length >= 2 && (
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Found <strong style={{ color: 'var(--text-primary)' }}>{totalMatches}</strong> match(es) in{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{results.length}</strong> document(s)
          </div>
        )}
        {query.trim().length > 0 && query.trim().length < 2 && (
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Type at least 2 characters to search…</div>
        )}
      </div>

      {/* Results */}
      {query.trim().length >= 2 && results.length === 0 && (
        <div className="card p-8 text-center">
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No documents contain "{query}"</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different keyword or check spelling.</p>
        </div>
      )}

      {results.map((doc) => {
        const kw = query.toLowerCase();
        const idx = doc.text.toLowerCase().indexOf(kw);
        const snippet = idx >= 0
          ? doc.text.slice(Math.max(0, idx - 60), idx + 120)
          : doc.text.slice(0, 160);

        return (
          <div key={doc.id} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-row-alt)' }}>
              <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: EXT_COLOR[doc.ext] ?? '#64748B' }}>
                {EXT_LABEL[doc.ext] ?? 'FILE'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge badge-info">{doc.crit}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{doc.type} · {doc.size}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: 'var(--accent-lt)', color: 'var(--accent)' }}>
                {(doc.text.toLowerCase().split(kw).length - 1) + (doc.name.toLowerCase().split(kw).length - 1)} match(es)
              </span>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                {doc.ext.toUpperCase()} Document
              </div>
              <div className="text-xs leading-relaxed p-2 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                …{highlight(snippet, query)}…
              </div>
            </div>
          </div>
        );
      })}

      {/* Index table */}
      <div className="card overflow-hidden">
        <div className="card-header">Indexed Documents ({INDEXED_DOCS.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="inst-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Criterion</th>
                <th>Type</th>
                <th>Size</th>
                <th>Text Indexed?</th>
              </tr>
            </thead>
            <tbody>
              {INDEXED_DOCS.map((d, i) => (
                <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                        style={{ background: EXT_COLOR[d.ext] ?? '#64748B' }}>
                        {EXT_LABEL[d.ext] ?? 'FILE'}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{d.crit}</span></td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.type}</td>
                  <td className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{d.size}</td>
                  <td><span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>✓ Indexed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
