import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';
import { setActivePanel } from '@/store/uiSlice';
import { useCriteria } from '@/hooks/useDashboardData';
import { MOCK_TASKS } from '@/data/mockData';

function barColor(pct: number) {
  if (pct < 30) return '#EF4444';
  if (pct < 70) return '#F59E0B';
  return '#16A34A';
}

export default function FacultyDashboardPage() {
  const user     = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { data: allCriteria } = useCriteria();

  const mycrits = (allCriteria ?? []).filter((c) =>
    user?.assignedCriteria.includes(c.id)
  );
  const myTasks = MOCK_TASKS.filter((t) => t.assignee === user?.name);
  const pendingTasks = myTasks.filter((t) => t.status !== 'Complete').length;
  const overdueTasks = myTasks.filter((t) => t.status === 'Overdue').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stat bar */}
      <div className="card p-4 flex flex-wrap gap-6 items-center">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>My Assignments</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name?.split(' ')[0]}</div>
        </div>
        <div className="w-px h-8 flex-shrink-0" style={{ background: 'var(--border)' }} />
        {[
          { label: 'Criteria Assigned', value: mycrits.length,  color: 'var(--accent)' },
          { label: 'Pending Tasks',     value: pendingTasks,    color: 'var(--warning)' },
          { label: 'Overdue Tasks',     value: overdueTasks,    color: 'var(--danger)' },
          { label: 'Total Tasks',       value: myTasks.length,  color: 'var(--text-primary)' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Ask bar */}
      <div className="card p-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(79,70,229,0.08))', border: '1px solid rgba(37,99,235,0.25)' }}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <input
          readOnly
          placeholder="Ask AI — Get help with your criteria, NBA guidelines, document requirements…"
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <button
          className="btn-primary text-xs px-3 py-1.5"
          onClick={() => dispatch(setActivePanel('insights'))}
        >
          Ask AI
        </button>
      </div>

      {/* My Assigned Criteria */}
      <div>
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>My Assigned Criteria</div>
        {mycrits.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mycrits.map((c) => {
              const color = barColor(c.completionPct);
              return (
                <div
                  key={c.id}
                  className="card p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => dispatch(setActivePanel(c.id as any))}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-info">{c.id}</span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{c.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color }}>{c.completionPct}%</span>
                  </div>
                  <div className="progress-track mb-2">
                    <div className="progress-fill" style={{ width: `${c.completionPct}%`, backgroundColor: color }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.scoredMarks}/{c.maxMarks} marks</span>
                    <span className={`badge ${c.status === 'Complete' ? 'badge-success' : c.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                      {c.status}
                    </span>
                  </div>
                  <button
                    className="btn-primary w-full text-xs mt-3 py-1.5"
                    onClick={(e) => { e.stopPropagation(); dispatch(setActivePanel(c.id as any)); }}
                  >
                    View Criterion Structure →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No criteria assigned yet.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Contact your NBA Coordinator to get criteria assigned.</p>
          </div>
        )}
      </div>

      {/* My Tasks */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <span>My Tasks</span>
          <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}
            onClick={() => dispatch(setActivePanel('tasks'))}>
            View All
          </button>
        </div>
        {myTasks.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="inst-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Criterion</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.slice(0, 8).map((t, i) => (
                  <tr key={t.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                    <td className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{t.title}</td>
                    <td><span className="badge badge-info">{t.criterionId}</span></td>
                    <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.dueDate}</td>
                    <td>
                      <span className={`badge ${t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-neutral'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'Complete' ? 'badge-success' : t.status === 'Overdue' ? 'badge-danger' : t.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No tasks assigned.</div>
        )}
      </div>
    </div>
  );
}
