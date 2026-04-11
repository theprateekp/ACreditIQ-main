import { DownloadIcon, DocumentIcon, AuditIcon, SparklesIcon } from '@/components/ui/Icon';
import AIQueryBox from '@/components/ui/AIQueryBox';

const EXPORTS = [
  { id: 'sar_full',   label: 'Full SAR Report',        desc: 'Complete Self-Assessment Report — all criteria, evidence, marks', format: 'PDF',  icon: DocumentIcon, primary: true },
  { id: 'criteria',  label: 'Criteria Status Report',  desc: 'C1–C9 completion, marks, gaps, and AI scores',                   format: 'PDF',  icon: AuditIcon,    primary: false },
  { id: 'evidence',  label: 'Evidence Inventory',      desc: 'All uploaded documents with criterion mapping and validation',   format: 'XLSX', icon: DocumentIcon, primary: false },
  { id: 'gaps',      label: 'Gap Analysis Report',     desc: 'All active gaps with marks impact and suggested fixes',          format: 'PDF',  icon: DownloadIcon, primary: false },
  { id: 'copo',      label: 'CO-PO Attainment Report', desc: 'Course and Program Outcome attainment data',                    format: 'XLSX', icon: DocumentIcon, primary: false },
  { id: 'audit_sim', label: 'Audit Simulation Report', desc: 'Simulated NBA audit results per criterion',                     format: 'PDF',  icon: AuditIcon,    primary: false },
];

export default function ExportPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* AI SAR Summary Generator */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI SAR Executive Summary</span>
          <span className="badge badge-success ml-auto">Powered by Mistral AI</span>
        </div>
        <AIQueryBox
          prefillPrompt="Generate a formal NBA GAPC V4.0 SAR Executive Summary for a B.E. Electrical Engineering program at TSSM'S BSCOER. The current readiness is 60% (603/1000 marks). C2 Outcome-Based Teaching Learning is strongest at 92%, C1 Outcome-Based Curriculum is at 90%, C9 Student Support and Governance is not started (0%), C6 Faculty Contributions is at 33%. Include: program overview, current accreditation status, key strengths, critical gaps, and recommended actions before submission. Use formal academic language suitable for NBA evaluators."
          placeholder="Ask AI to generate your SAR executive summary, criterion analysis, or any section…"
        />
      </div>

      <div className="card">
        <div className="card-header">Export SAR — Generate Accreditation Reports</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXPORTS.map((exp) => (
            <div key={exp.id} className="flex flex-col gap-3 p-3 rounded"
              style={{
                backgroundColor: exp.primary ? 'var(--accent-lt)' : 'var(--bg-row-alt)',
                border: exp.primary ? '1px solid #93C5FD' : '1px solid var(--border)',
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <exp.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{exp.label}</span>
                </div>
                <span className="badge badge-neutral">{exp.format}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exp.desc}</p>
              <button onClick={async () => {
                if (exp.id === 'sar_full') {
                  try {
                    const res = await fetch('http://localhost:3000/api/export-pdf', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ generated: {}, scores: {}, userData: {}, criteria: [] }),
                    });
                    if (!res.ok) throw new Error('PDF generation failed');
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'SAR_Report_TSSM_BSCOER.pdf';
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    alert('PDF export failed. Make sure the server is running at localhost:3000.');
                  }
                } else {
                  window.print();
                }
              }} className={exp.primary ? 'btn-primary flex items-center justify-center gap-2' : 'btn-secondary flex items-center justify-center gap-2'}>
                <DownloadIcon className="w-3.5 h-3.5" />
                Generate &amp; Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
