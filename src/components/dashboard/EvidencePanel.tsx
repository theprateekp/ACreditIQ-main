import { useState, useRef } from 'react';
import RoleGate from '@/components/ui/RoleGate';
import EvidenceHealthBar from './EvidenceHealthBar';
import AIQueryBox from '@/components/ui/AIQueryBox';
import { UploadIcon, DocumentIcon, LockIcon, SparklesIcon } from '@/components/ui/Icon';
import { useAIQuery } from '@/hooks/useAIQuery';

export default function EvidencePanel() {
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; size: string; status: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [aiCheckResult, setAiCheckResult] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ask, loading: aiLoading } = useAIQuery();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFiles(prev => [
          { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, status: 'Ready for AI Check' },
          ...prev
        ]);
        setIsUploading(false);
      }, 1200);
    }
  };

  async function runAICheck(fileName: string, idx: number) {
    const result = await ask(
      `A document named "${fileName}" has been uploaded for NBA GAPC V4.0 accreditation. Based on the filename, identify: 1) Which criterion it likely belongs to, 2) Whether it meets typical NBA evidence requirements, 3) Any missing information that should be included, 4) Compliance checklist for this document type.`
    );
    setAiCheckResult(p => ({ ...p, [idx]: result }));
  }
  return (
    <div className="flex flex-col gap-4">
      <EvidenceHealthBar />

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>Evidence Repository</span>
          <RoleGate allowedRoles={['Admin', 'NBA_Coordinator', 'HOD', 'Faculty', 'AC', 'CO']}>
            <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-1.5" disabled={isUploading}>
              <UploadIcon className="w-3.5 h-3.5" />
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </RoleGate>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-10 rounded text-center cursor-pointer transition-colors"
            style={{ border: '2px dashed var(--border-dk)', backgroundColor: 'var(--bg-row-alt)' }}
          >
            <DocumentIcon className="w-10 h-10 mb-3" style={{ color: 'var(--border-dk)' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Drag &amp; drop files here, or click to browse
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              PDF, DOCX, XLSX — each file must be tagged to a GAPC criterion
            </p>
            <RoleGate allowedRoles={['Admin', 'NBA_Coordinator', 'HOD', 'Faculty', 'AC', 'CO']}>
              <button className="btn-primary flex items-center gap-1.5" disabled={isUploading}>
                <UploadIcon className="w-3.5 h-3.5" />
                {isUploading ? 'Uploading...' : 'Upload Evidence'}
              </button>
            </RoleGate>
            <RoleGate allowedRoles={['Viewer', 'IR']}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <LockIcon className="w-4 h-4" />
                Read-only access — contact your NBA Coordinator to upload documents.
              </div>
            </RoleGate>
          </div>

          {/* Missing evidence alert + AI guidance */}
          <div className="mt-4 p-3 rounded flex items-start gap-2"
            style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid #FCD34D' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>⚠ Missing Evidence Alert:</span>
            <span className="text-xs" style={{ color: 'var(--warning)' }}>
              28 required documents are not yet uploaded. C5, C6, and C9 have the most critical gaps.
            </span>
          </div>

          {/* AI document guidance */}
          <div className="mt-4">
            <AIQueryBox
              prefillPrompt="For NBA GAPC V4.0 accreditation, list all required documents for criteria C5 (Faculty Information), C6 (Faculty Contributions), and C9 (Student Support & Governance) that are most commonly missing. For each, specify the exact document name, format required, and what data it must contain."
              placeholder="Ask AI what documents are needed for each criterion…"
            />
          </div>

          {/* Uploaded Files Feed */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Recently Uploaded</h4>
              <div className="flex flex-col gap-2">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-blue-50 text-blue-600">
                          <DocumentIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{file.size} • <span style={{ color: 'var(--success)' }}>{file.status}</span></p>
                        </div>
                      </div>
                      <button
                        onClick={() => runAICheck(file.name, i)}
                        disabled={aiLoading}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                      >
                        <SparklesIcon className="w-3 h-3" />
                        {aiLoading ? 'Checking…' : 'Run AI Check'}
                      </button>
                    </div>
                    {aiCheckResult[i] && (
                      <div className="text-xs leading-relaxed p-2 rounded"
                        style={{ background: 'var(--accent-lt)', border: '1px solid #93C5FD', color: 'var(--text-primary)' }}
                        dangerouslySetInnerHTML={{ __html: aiCheckResult[i].replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>') }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
