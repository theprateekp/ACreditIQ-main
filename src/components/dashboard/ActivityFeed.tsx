import { useActivityFeed } from '@/hooks/useDashboardData';
import { DocumentIcon, CheckCircleIcon, WarningIcon, UploadIcon, SparklesIcon, DownloadIcon, AuditIcon, ClockIcon } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getIcon(type: string): ReactNode {
  const cls = 'w-3.5 h-3.5';
  switch (type) {
    case 'EVIDENCE_UPLOADED': return <UploadIcon className={cls} />;
    case 'TASK_UPDATED': case 'TASK_CREATED': return <AuditIcon className={cls} />;
    case 'TASK_COMPLETED': case 'GAP_RESOLVED': return <CheckCircleIcon className={cls} />;
    case 'GAP_CREATED': return <WarningIcon className={cls} />;
    case 'AI_SCORING_RUN': case 'AI_INSIGHTS_GENERATED': return <SparklesIcon className={cls} />;
    case 'EXPORT_REQUESTED': return <DownloadIcon className={cls} />;
    case 'AUDIT_SIMULATION_RUN': return <AuditIcon className={cls} />;
    default: return <DocumentIcon className={cls} />;
  }
}

const ROLE_LABELS: Record<string, string> = { NBA_Coordinator: 'NBA Coord.' };

export default function ActivityFeed() {
  const { data: entries, isLoading } = useActivityFeed();
  const sorted = [...(entries ?? [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="card flex flex-col">
      <div className="card-header flex items-center justify-between">
        <span>Activity Log</span>
        <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>Immutable audit trail</span>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 360 }}>
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 m-3 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />
        ))}
        {!isLoading && sorted.map((entry, i) => (
          <div key={entry.id} className="flex items-start gap-2.5 px-3 py-2.5"
            style={{ borderBottom: '1px solid var(--border)', backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
            <span className="mt-0.5 flex-shrink-0 p-1 rounded" style={{ backgroundColor: 'var(--accent-lt)', color: 'var(--accent)' }}>
              {getIcon(entry.actionType)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-snug" style={{ color: 'var(--text-primary)' }}>{entry.description}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{entry.actor}</span>
                <span className="badge badge-neutral">{ROLE_LABELS[entry.actorRole] ?? entry.actorRole}</span>
                <span className="text-[10px] flex items-center gap-0.5" style={{ color: 'var(--text-muted)' }}>
                  <ClockIcon className="w-3 h-3" />{timeAgo(entry.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
