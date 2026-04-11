interface StatusBadgeProps {
  status: string;
  variant?: 'criterion' | 'gap' | 'task' | 'role' | 'risk';
}

const criterionMap: Record<string, string> = {
  'Complete':    'badge badge-success',
  'In Progress': 'badge badge-warning',
  'Not Started': 'badge badge-neutral',
};
const gapMap: Record<string, string> = {
  'Critical': 'badge badge-danger',
  'Major':    'badge badge-warning',
  'Minor':    'badge badge-info',
};
const taskMap: Record<string, string> = {
  'Complete':    'badge badge-success',
  'In Progress': 'badge badge-info',
  'Pending':     'badge badge-neutral',
  'Overdue':     'badge badge-danger',
  'High':        'badge badge-danger',
  'Medium':      'badge badge-warning',
  'Low':         'badge badge-neutral',
};
const roleMap: Record<string, string> = {
  'Admin':           'badge badge-danger',
  'NBA_Coordinator': 'badge badge-info',
  'HOD':             'badge badge-info',
  'Faculty':         'badge badge-neutral',
  'Viewer':          'badge badge-neutral',
  'AC':              'badge badge-info',
  'CO':              'badge badge-info',
  'IR':              'badge badge-neutral',
};
const riskMap: Record<string, string> = {
  'Low':      'badge badge-success',
  'Medium':   'badge badge-warning',
  'High':     'badge badge-danger',
  'Critical': 'badge badge-danger',
};

const ROLE_LABELS: Record<string, string> = { NBA_Coordinator: 'NBA Coord.' };

export default function StatusBadge({ status, variant = 'criterion' }: StatusBadgeProps) {
  const map = variant === 'gap' ? gapMap : variant === 'task' ? taskMap : variant === 'role' ? roleMap : variant === 'risk' ? riskMap : criterionMap;
  const cls = map[status] ?? 'badge badge-neutral';
  const label = variant === 'role' ? (ROLE_LABELS[status] ?? status) : status;
  return <span className={cls}>{label}</span>;
}
