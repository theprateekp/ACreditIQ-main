import { useState } from 'react';
import { CheckCircleIcon, WarningIcon, DocumentIcon } from '@/components/ui/Icon';

const DECLARATIONS = [
  { id: 'd1', text: 'All information provided in this SAR is true and accurate to the best of our knowledge.' },
  { id: 'd2', text: 'All documents uploaded are authentic and have not been fabricated or altered.' },
  { id: 'd3', text: 'The institution has complied with all AICTE norms and NBA guidelines for GAPC V4.0.' },
  { id: 'd4', text: 'The faculty data, student data, and infrastructure data are as on the date of submission.' },
  { id: 'd5', text: 'The CO-PO attainment calculations have been verified by the academic committee.' },
  { id: 'd6', text: 'The institution agrees to provide access to all records during the NBA site visit.' },
  { id: 'd7', text: 'The Principal and HOD have reviewed and approved this SAR before submission.' },
];

export default function PartDPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const allChecked = DECLARATIONS.every((d) => checked[d.id]);

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="card p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--accent-lt)', border: '1px solid #93C5FD' }}>
        <span className="badge badge-info">Part D</span>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Final declaration before SAR submission. All statements must be acknowledged by the Principal and HOD.
        </p>
      </div>

      {submitted ? (
        <div className="card p-8 text-center flex flex-col items-center gap-3"
          style={{ backgroundColor: 'var(--success-bg)', border: '1px solid #86EFAC' }}>
          <CheckCircleIcon className="w-12 h-12" style={{ color: 'var(--success)' }} />
          <h3 className="text-base font-bold" style={{ color: 'var(--success)' }}>Declaration Submitted</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>The SAR declaration has been recorded. The SAR is now locked for final export.</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Submitted on: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      ) : (
        <>
          {/* Declaration statements */}
          <div className="card overflow-hidden">
            <div className="card-header">Declaration Statements</div>
            <div className="p-4 flex flex-col gap-2">
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Read each statement carefully and check the box to acknowledge.</p>
              {DECLARATIONS.map((d) => (
                <label key={d.id} className="flex items-start gap-3 p-2.5 rounded cursor-pointer transition-colors"
                  style={{
                    backgroundColor: checked[d.id] ? 'var(--success-bg)' : 'var(--bg-row-alt)',
                    border: `1px solid ${checked[d.id] ? '#86EFAC' : 'var(--border)'}`,
                  }}>
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer"
                    style={{ backgroundColor: checked[d.id] ? 'var(--success)' : 'var(--bg-input)', border: `1px solid ${checked[d.id] ? 'var(--success)' : 'var(--border-dk)'}` }}
                    onClick={() => setChecked((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}>
                    {checked[d.id] && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{d.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Signatories */}
          <div className="card overflow-hidden">
            <div className="card-header">Signatories</div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { role: 'Principal', name: 'Dr. G.A. Hinge', status: 'Approved' },
                { role: 'HOD', name: 'Kanade Sir', status: 'Approved' },
                { role: 'NBA Coordinator', name: 'Hasarmuni Sir', status: 'Pending' },
              ].map((sig) => (
                <div key={sig.role} className="text-center p-3 rounded"
                  style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: 'var(--accent-lt)', border: '1px solid #93C5FD' }}>
                    <DocumentIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{sig.name}</p>
                  <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{sig.role}</p>
                  <span className={sig.status === 'Approved' ? 'badge badge-success' : 'badge badge-warning'}>{sig.status}</span>
                </div>
              ))}
            </div>
          </div>

          {!allChecked && (
            <div className="flex items-center gap-2 p-3 rounded text-xs"
              style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid #FCD34D', color: 'var(--warning)' }}>
              <WarningIcon className="w-4 h-4 flex-shrink-0" />
              Please acknowledge all {DECLARATIONS.length} declaration statements before submitting.
            </div>
          )}

          <button
            disabled={!allChecked}
            onClick={() => setSubmitted(true)}
            className={allChecked ? 'btn-primary py-3 text-sm font-bold w-full' : 'py-3 text-sm font-bold w-full rounded cursor-not-allowed'}
            style={!allChecked ? { backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}>
            Submit Declaration &amp; Lock SAR
          </button>
        </>
      )}
    </div>
  );
}
