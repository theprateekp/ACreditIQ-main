import { useState } from 'react';

type Tab = 'college' | 'depts' | 'programs' | 'notif' | 'perms';

interface Dept    { id: string; name: string; code: string; hod: string; intake: number }
interface Program { id: string; name: string; dept: string; intake: number; nba: string }

const uid = () => Math.random().toString(36).slice(2, 9);

const INIT_COLLEGE = {
  full: "TSSM'S BSCOER",
  name: 'BSCOER',
  address: 'Pune, Maharashtra',
  phone: '+91-22-1234-5678',
  email: 'principal@tssm.edu.in',
  website: 'www.tssm.edu.in',
  established: '2010',
  affiliation: 'SPPU',
  naac: 'A+',
  nba: 'Applied — Tier II',
  principal: 'Dr.G.A.Hinge',
};

const INIT_DEPTS: Dept[] = [
  { id: 'd1', name: 'Electrical Engineering', code: 'EE', hod: 'Kanade Sir', intake: 60 },
  { id: 'd2', name: 'Electronics & Telecommunication', code: 'ENTC', hod: 'Shinde Sir',  intake: 60 },
];

const INIT_PROGRAMS: Program[] = [
  { id: 'p1', name: 'B.E. Electrical Engineering', dept: 'EE', intake: 60, nba: 'Applied' },
  { id: 'p2', name: 'B.E. Electronics & Telecommunication', dept: 'ENTC', intake: 60, nba: 'Not Applied' },
];

const NOTIF_PREFS = [
  { key: 'email',     label: 'Email Alerts',             desc: 'Receive email for all platform activity' },
  { key: 'deadline',  label: 'Deadline Reminders',       desc: 'Get notified before deadlines' },
  { key: 'docUpload', label: 'Document Notifications',   desc: 'Alert when documents are uploaded or reviewed' },
  { key: 'ai',        label: 'AI Analysis Updates',      desc: 'Notify when AI re-scores criteria' },
];

const ROLE_PERMS = [
  { r: 'Faculty Member',     p: [1,1,1,0,0,0] },
  { r: 'Criterion Incharge', p: [1,1,1,0,0,0] },
  { r: 'Department Head',    p: [1,1,1,0,1,0] },
  { r: 'NBA Coordinator',    p: [1,1,1,1,1,0] },
  { r: 'Super Admin',        p: [1,1,1,1,1,1] },
];
const PERM_COLS = ['Dashboard', 'Upload Docs', 'Fill Criteria', 'Approve Docs', 'Manage Faculty', 'Settings'];

export default function SettingsPage() {
  const [tab, setTab]         = useState<Tab>('college');
  const [college, setCollege] = useState(INIT_COLLEGE);
  const [depts, setDepts]     = useState<Dept[]>(INIT_DEPTS);
  const [programs, setPrograms] = useState<Program[]>(INIT_PROGRAMS);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((n) => [n.key, true]))
  );
  const [flash, setFlash] = useState('');

  // Dept modal state
  const [deptModal, setDeptModal] = useState<Dept | null | 'new'>(null);
  const [deptForm, setDeptForm]   = useState<Omit<Dept,'id'>>({ name:'', code:'', hod:'', intake:60 });

  // Program modal state
  const [progModal, setProgModal] = useState<Program | null | 'new'>(null);
  const [progForm, setProgForm]   = useState<Omit<Program,'id'>>({ name:'', dept: INIT_DEPTS[0]?.code ?? '', intake:60, nba:'Applied' });

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2500);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'college',  label: 'College Info' },
    { id: 'depts',    label: 'Departments' },
    { id: 'programs', label: 'Programs' },
    { id: 'notif',    label: 'Notifications' },
    { id: 'perms',    label: 'Role Permissions' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {flash && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xl"
          style={{ background: '#16A34A', color: '#fff' }}>
          {flash}
        </div>
      )}

      <div className="card overflow-hidden">
        {/* Tab nav */}
        <div className="flex" style={{ borderBottom: '2px solid var(--border)' }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-xs font-semibold transition-colors"
              style={{
                color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -2,
                background: 'transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* ── College Info ── */}
          {tab === 'college' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['Institution Full Name', 'full'],
                  ['Short Name / Acronym',  'name'],
                  ['Address',               'address'],
                  ['Phone',                 'phone'],
                  ['Email',                 'email'],
                  ['Website',               'website'],
                  ['Established Year',      'established'],
                  ['University Affiliation','affiliation'],
                  ['NAAC Grade',            'naac'],
                  ['NBA Status',            'nba'],
                  ['Principal / HOD',       'principal'],
                ].map(([label, key]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    <input
                      value={(college as any)[key] ?? ''}
                      onChange={(e) => setCollege((p) => ({ ...p, [key]: e.target.value }))}
                      className="text-sm rounded px-2 py-1.5"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="btn-primary text-xs px-4 py-1.5" onClick={() => showFlash('✓ College info saved!')}>
                  Save College Info
                </button>
              </div>
            </div>
          )}

          {/* ── Departments ── */}
          {tab === 'depts' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <button className="btn-primary text-xs px-3 py-1.5"
                  onClick={() => { setDeptForm({ name:'', code:'', hod:'', intake:60 }); setDeptModal('new'); }}>
                  + Add Department
                </button>
              </div>
              {depts.length ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="inst-table">
                    <thead><tr><th>Department Name</th><th>Code</th><th>HOD</th><th>Intake</th><th>Actions</th></tr></thead>
                    <tbody>
                      {depts.map((d, i) => (
                        <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                          <td className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{d.name}</td>
                          <td><span className="badge badge-neutral">{d.code}</span></td>
                          <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.hod || '—'}</td>
                          <td className="font-mono text-xs">{d.intake}</td>
                          <td>
                            <div className="flex gap-2">
                              <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}
                                onClick={() => { setDeptForm({ name: d.name, code: d.code, hod: d.hod, intake: d.intake }); setDeptModal(d); }}>
                                Edit
                              </button>
                              <button className="text-xs font-semibold" style={{ color: 'var(--danger)' }}
                                onClick={() => { if (confirm('Remove this department?')) setDepts((p) => p.filter((x) => x.id !== d.id)); }}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No departments added yet.</div>
              )}
            </div>
          )}

          {/* ── Programs ── */}
          {tab === 'programs' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <button className="btn-primary text-xs px-3 py-1.5"
                  onClick={() => { setProgForm({ name:'', dept: depts[0]?.code ?? '', intake:60, nba:'Applied' }); setProgModal('new'); }}>
                  + Add Program
                </button>
              </div>
              {programs.length ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="inst-table">
                    <thead><tr><th>Program Name</th><th>Department</th><th>Intake</th><th>NBA Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {programs.map((p, i) => (
                        <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                          <td className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                          <td><span className="badge badge-neutral">{p.dept}</span></td>
                          <td className="font-mono text-xs">{p.intake}</td>
                          <td>
                            <span className={`badge ${p.nba === 'Applied' ? 'badge-warning' : 'badge-neutral'}`}>{p.nba}</span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}
                                onClick={() => { setProgForm({ name: p.name, dept: p.dept, intake: p.intake, nba: p.nba }); setProgModal(p); }}>
                                Edit
                              </button>
                              <button className="text-xs font-semibold" style={{ color: 'var(--danger)' }}
                                onClick={() => { if (confirm('Remove this program?')) setPrograms((prev) => prev.filter((x) => x.id !== p.id)); }}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No programs added yet.</div>
              )}
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notif' && (
            <div className="flex flex-col gap-4 max-w-lg">
              {NOTIF_PREFS.map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPrefs[n.key] ?? true}
                      onChange={() => setNotifPrefs((p) => ({ ...p, [n.key]: !p[n.key] }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 rounded-full peer transition-colors"
                      style={{ background: notifPrefs[n.key] ? 'var(--accent)' : 'var(--border-dk)' }}>
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        style={{ transform: notifPrefs[n.key] ? 'translateX(20px)' : 'translateX(0)' }} />
                    </div>
                  </label>
                </div>
              ))}
              <button className="btn-primary text-xs px-4 py-1.5 self-start mt-2"
                onClick={() => showFlash('✓ Preferences saved!')}>
                Save Preferences
              </button>
            </div>
          )}

          {/* ── Role Permissions ── */}
          {tab === 'perms' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="inst-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    {PERM_COLS.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ROLE_PERMS.map((row, i) => (
                    <tr key={row.r} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-row-alt)' }}>
                      <td className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{row.r}</td>
                      {row.p.map((v, j) => (
                        <td key={j} style={{ textAlign: 'center' }}>
                          {v
                            ? <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>✓</span>
                            : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Dept Modal ── */}
      {deptModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setDeptModal(null)}>
          <div className="card p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {deptModal === 'new' ? 'Add Department' : 'Edit Department'}
            </div>
            {[['Department Name','name'],['Code','code'],['HOD Name','hod']].map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1 mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</label>
                <input value={(deptForm as any)[key]} onChange={(e) => setDeptForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="text-sm rounded px-2 py-1.5"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
              </div>
            ))}
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student Intake</label>
              <input type="number" value={deptForm.intake} onChange={(e) => setDeptForm((p) => ({ ...p, intake: +e.target.value }))}
                className="text-sm rounded px-2 py-1.5"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
            </div>
            <div className="flex gap-2">
              <button className="btn-outline-blue text-xs px-3 py-1.5" onClick={() => setDeptModal(null)}>Cancel</button>
              <button className="btn-primary text-xs px-3 py-1.5" onClick={() => {
                if (!deptForm.name || !deptForm.code) { alert('Name and code required.'); return; }
                if (deptModal === 'new') {
                  setDepts((p) => [...p, { id: uid(), ...deptForm }]);
                } else {
                  setDepts((p) => p.map((d) => d.id === (deptModal as Dept).id ? { ...d, ...deptForm } : d));
                }
                setDeptModal(null);
                showFlash('✓ Department saved!');
              }}>
                {deptModal === 'new' ? 'Add Department' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Program Modal ── */}
      {progModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setProgModal(null)}>
          <div className="card p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {progModal === 'new' ? 'Add Program' : 'Edit Program'}
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Program Name</label>
              <input value={progForm.name} onChange={(e) => setProgForm((p) => ({ ...p, name: e.target.value }))}
                className="text-sm rounded px-2 py-1.5"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Department</label>
                <select value={progForm.dept} onChange={(e) => setProgForm((p) => ({ ...p, dept: e.target.value }))}
                  className="text-sm rounded px-2 py-1.5"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}>
                  {depts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Intake</label>
                <input type="number" value={progForm.intake} onChange={(e) => setProgForm((p) => ({ ...p, intake: +e.target.value }))}
                  className="text-sm rounded px-2 py-1.5"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>NBA Application Status</label>
              <select value={progForm.nba} onChange={(e) => setProgForm((p) => ({ ...p, nba: e.target.value }))}
                className="text-sm rounded px-2 py-1.5"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)', color: 'var(--text-primary)' }}>
                <option>Applied</option>
                <option>Not Applied</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline-blue text-xs px-3 py-1.5" onClick={() => setProgModal(null)}>Cancel</button>
              <button className="btn-primary text-xs px-3 py-1.5" onClick={() => {
                if (!progForm.name) { alert('Program name required.'); return; }
                if (progModal === 'new') {
                  setPrograms((p) => [...p, { id: uid(), ...progForm }]);
                } else {
                  setPrograms((p) => p.map((x) => x.id === (progModal as Program).id ? { ...x, ...progForm } : x));
                }
                setProgModal(null);
                showFlash('✓ Program saved!');
              }}>
                {progModal === 'new' ? 'Add Program' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
