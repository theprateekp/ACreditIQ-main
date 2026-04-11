import { useSelector, useDispatch } from 'react-redux';
import { selectAssigneeFilter, setAssigneeFilter } from '@/store/uiSlice';
import { useTasks } from '@/hooks/useDashboardData';
import { ClockIcon } from '@/components/ui/Icon';
import { MOCK_USERS } from '@/data/mockData';

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
function overdue(t: { status: string; dueDate: string }) {
  return t.status === 'Overdue' || (t.status !== 'Complete' && new Date(t.dueDate) < new Date());
}

export default function TasksPanel() {
  const dispatch = useDispatch();
  const filter = useSelector(selectAssigneeFilter);
  const { data: tasks, isLoading } = useTasks();
  const assignees = MOCK_USERS.map((u) => u.name);

  const filtered = filter ? (tasks ?? []).filter((t) => t.assignee === filter) : (tasks ?? []);
  const sorted = [...filtered].sort((a, b) => {
    const ao = overdue(a) ? 0 : 1, bo = overdue(b) ? 0 : 1;
    if (ao !== bo) return ao - bo;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  const overdueCount = (tasks ?? []).filter(overdue).length;

  return (
    <div className="card flex flex-col h-full">
      <div className="card-header flex items-center justify-between">
        <span>Task Queue {overdueCount > 0 && <span className="badge badge-danger ml-2">{overdueCount} Overdue</span>}</span>
        <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{(tasks ?? []).length} tasks</span>
      </div>

      {/* Assignee filter */}
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-row-alt)' }}>
        {['All', ...assignees.map((n) => n.split(' ')[0])].map((name, i) => {
          const fullName = i === 0 ? null : assignees[i - 1];
          const active = i === 0 ? !filter : filter === fullName;
          return (
            <button key={name} onClick={() => dispatch(setAssigneeFilter(i === 0 ? null : fullName))}
              className="text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors"
              style={{ backgroundColor: active ? 'var(--accent)' : 'var(--bg-surface)', color: active ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border-dk)' }}>
              {name}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="relative flex-1 min-h-0">
        <div className="overflow-y-auto h-full">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 m-3 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-row-alt)' }} />
          ))}
          {!isLoading && sorted.map((task, i) => {
            const od = overdue(task);
            return (
              <div key={task.id} className="px-3 py-2.5 flex items-start gap-2"
                style={{ borderBottom: '1px solid var(--border)', backgroundColor: od ? '#FEF2F2' : i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)', borderLeft: od ? '3px solid var(--danger)' : '3px solid transparent' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug" style={{ color: od ? 'var(--danger)' : 'var(--text-primary)' }}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="badge badge-info">{task.criterionId}</span>
                    <span className={`badge ${task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-neutral'}`}>{task.priority}</span>
                    <span className={`badge ${od ? 'badge-danger' : task.status === 'Complete' ? 'badge-success' : task.status === 'In Progress' ? 'badge-info' : 'badge-neutral'}`}>{od ? 'Overdue' : task.status}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{task.assignee.split(' ')[0]}</span>
                    <span className="text-[10px] flex items-center gap-0.5" style={{ color: od ? 'var(--danger)' : 'var(--text-muted)' }}>
                      <ClockIcon className="w-3 h-3" />{fmt(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
