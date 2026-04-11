import { useSelector, useDispatch } from 'react-redux';
import { selectUserRole } from '@/store/authSlice';
import { setActivePanel } from '@/store/uiSlice';
import RoleGate from '@/components/ui/RoleGate';
import { UploadIcon, PlusIcon, SearchIcon, DownloadIcon, SparklesIcon, LockIcon, AuditIcon } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

function Btn({ label, icon, onClick, primary = false }: { label: string; icon: ReactNode; onClick?: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className={primary ? 'btn-primary flex items-center gap-1.5' : 'btn-secondary flex items-center gap-1.5'}>
      {icon}<span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function QuickActionsBar() {
  const role = useSelector(selectUserRole);
  const dispatch = useDispatch();

  if (role === 'Viewer' || role === 'IR') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)' }}>
        <LockIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Read-only</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <RoleGate allowedRoles={['Admin', 'NBA_Coordinator', 'HOD', 'Faculty', 'AC', 'CO']}>
        <Btn label="Upload Document" icon={<UploadIcon />} primary onClick={() => dispatch(setActivePanel('evidence'))} />
        <Btn label="Add Task" icon={<PlusIcon />} onClick={() => dispatch(setActivePanel('tasks'))} />
        <Btn label="Run AI Check" icon={<SparklesIcon />} onClick={() => dispatch(setActivePanel('insights'))} />
      </RoleGate>
      <RoleGate allowedRoles={['Admin', 'NBA_Coordinator', 'HOD', 'AC']}>
        <Btn label="Start Audit" icon={<AuditIcon />} onClick={() => dispatch(setActivePanel('audit'))} />
        <Btn label="CO-PO Mapping" icon={<SearchIcon />} onClick={() => dispatch(setActivePanel('co-po'))} />
        <div className="w-px h-5" style={{ backgroundColor: 'var(--border-dk)' }} />
        <Btn label="Export SAR" icon={<DownloadIcon />} onClick={() => dispatch(setActivePanel('export'))} />
      </RoleGate>
    </div>
  );
}
