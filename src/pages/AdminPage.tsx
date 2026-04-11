import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MOCK_USERS } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { PlusIcon, LockIcon } from '@/components/ui/Icon';
import { pushNotification } from '@/store/notificationsSlice';
import type { Role } from '@/types';

const ROLES = ['Admin', 'NBA_Coordinator', 'HOD', 'Faculty', 'Viewer'] as const;
const ALL_CRITERIA = ['C1','C2','C3','C4','C5','C6','C7','C8','C9'];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin:           ['Full system access', 'User management', 'Role assignment', 'All modules'],
  NBA_Coordinator: ['Cross-department visibility', 'Progress control', 'Audit overview', 'Export SAR'],
  HOD:             ['Department-level control', 'Criterion approval', 'Faculty management'],
  Faculty:         ['Assigned criterion uploads', 'Narrative editing', 'Evidence upload'],
  Viewer:          ['Read-only access to all modules', 'No edit or upload permissions'],
};

// Local mutable copy so edits reflect in the same session
const usersState = MOCK_USERS.map((u) => ({ ...u, assignedCriteria: [...u.assignedCriteria] }));

export default function AdminPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [users, setUsers] = useState(usersState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role>('Faculty');
  const [editCriteria, setEditCriteria] = useState<string[]>([]);

  function openEdit(userId: string) {
    const u = users.find((x) => x.id === userId)!;
    setEditingId(userId);
    setEditRole(u.role);
    setEditCriteria([...u.assignedCriteria]);
  }

  function saveEdit(userId: string) {
    const prev = users.find((x) => x.id === userId)!;
    const roleChanged = prev.role !== editRole;
    const prevCrits = new Set(prev.assignedCriteria);
    const newCrits  = new Set(editCriteria);
    const added     = editCriteria.filter((c) => !prevCrits.has(c));
    const removed   = prev.assignedCriteria.filter((c) => !newCrits.has(c));

    // Update local state
    setUsers((us) =>
      us.map((u) =>
        u.id === userId
          ? { ...u, role: editRole, assignedCriteria: editCriteria }
          : u
      )
    );

    // ── Dispatch notifications (mirrors reference dashboard notification logic) ──
    if (roleChanged) {
      dispatch(pushNotification({
        recipientId: userId,
        type: 'role_changed',
        message: `Your role has been updated to ${editRole} by the administrator.`,
      }));
    }
    if (added.length > 0) {
      dispatch(pushNotification({
        recipientId: userId,
        type: 'criteria_assigned',
        message: `You have been assigned ${added.join(', ')} — please review your criteria and begin evidence collection.`,
      }));
    }
    if (removed.length > 0) {
      dispatch(pushNotification({
        recipientId: userId,
        type: 'criteria_assigned',
        message: `Criteria ${removed.join(', ')} have been unassigned from you.`,
      }));
    }

    setEditingId(null);
  }

  function toggleCrit(c: string) {
    setEditCriteria((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs — layout unchanged */}
      <div className="flex" style={{ borderBottom: '2px solid var(--border)' }}>
        {(['users', 'roles', 'settings'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 text-sm font-semibold capitalize transition-colors"
            style={{
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -2,
              backgroundColor: 'transparent',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{users.length} users registered</p>
            <button className="btn-primary flex items-center gap-1.5">
              <PlusIcon className="w-3.5 h-3.5" />Invite User
            </button>
          </div>

          <div className="card overflow-hidden">
            <table className="inst-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Assigned Criteria</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <>
                    <tr key={user.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}>
                            {user.avatarInitials}
                          </div>
                          <div>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><StatusBadge status={user.role} variant="role" /></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.department ?? '—'}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {user.assignedCriteria.slice(0, 4).map((c) => <span key={c} className="badge badge-info">{c}</span>)}
                          {user.assignedCriteria.length > 4 && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>+{user.assignedCriteria.length - 4}</span>}
                          {user.assignedCriteria.length === 0 && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>None</span>}
                        </div>
                      </td>
                      <td><span className="badge badge-success">Active</span></td>
                      <td>
                        <button
                          className="text-xs font-semibold mr-3"
                          style={{ color: 'var(--accent)' }}
                          onClick={() => editingId === user.id ? setEditingId(null) : openEdit(user.id)}
                        >
                          {editingId === user.id ? 'Cancel' : 'Edit'}
                        </button>
                      </td>
                    </tr>

                    {/* Inline edit row — appears below the user row when editing */}
                    {editingId === user.id && (
                      <tr key={`${user.id}-edit`} style={{ backgroundColor: 'rgba(37,99,235,0.06)' }}>
                        <td colSpan={6} style={{ padding: '12px 16px' }}>
                          <div className="flex flex-wrap gap-6 items-start">
                            {/* Role selector */}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</p>
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as Role)}
                                className="text-xs rounded px-2 py-1.5 focus:outline-none"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                              >
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </div>

                            {/* Criteria checkboxes */}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Assigned Criteria</p>
                              <div className="flex flex-wrap gap-1.5">
                                {ALL_CRITERIA.map((c) => (
                                  <label key={c} className="flex items-center gap-1 cursor-pointer text-xs px-2 py-1 rounded"
                                    style={{
                                      background: editCriteria.includes(c) ? 'rgba(37,99,235,0.2)' : 'var(--bg-surface)',
                                      border: `1px solid ${editCriteria.includes(c) ? '#2563EB' : 'var(--border)'}`,
                                      color: editCriteria.includes(c) ? '#93C5FD' : 'var(--text-secondary)',
                                    }}>
                                    <input
                                      type="checkbox"
                                      checked={editCriteria.includes(c)}
                                      onChange={() => toggleCrit(c)}
                                      className="w-3 h-3"
                                      style={{ accentColor: '#2563EB' }}
                                    />
                                    {c}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Save */}
                            <div className="flex items-end">
                              <button
                                onClick={() => saveEdit(user.id)}
                                className="btn-primary text-xs px-4 py-1.5"
                              >
                                Save & Notify
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map((role) => (
            <div key={role} className="card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={role} variant="role" />
                <LockIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex flex-col gap-1.5">
                {ROLE_PERMISSIONS[role]?.map((perm, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{perm}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] pt-2" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {users.filter((u) => u.role === role).length} users assigned
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex flex-col gap-3 max-w-2xl">
          {[
            { label: 'Institution Name',        value: "TSSM'S BSCOER" },
            { label: 'NBA Submission Deadline',  value: '31 December 2024' },
            { label: 'Academic Year',            value: '2024-25' },
            { label: 'GAPC Version',             value: 'V4.0' },
            { label: 'Total Marks',              value: '1000' },
          ].map((s) => (
            <div key={s.label} className="card p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              </div>
              <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
