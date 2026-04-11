import { DownloadIcon, DocumentIcon, AuditIcon } from '@/components/ui/Icon';

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
              <button className={exp.primary ? 'btn-primary flex items-center justify-center gap-2' : 'btn-secondary flex items-center justify-center gap-2'}>
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
