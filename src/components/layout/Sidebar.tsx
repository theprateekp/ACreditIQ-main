import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarCollapsed, selectActivePanel, setActivePanel } from '@/store/uiSlice';
import { selectIsAdmin } from '@/store/authSlice';
import type { PanelId } from '@/store/uiSlice';

const ic = (d: string) => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

interface NavItem { id: PanelId; label: string; icon: React.ReactNode; badge?: string; children?: NavItem[] }

const NAV_ADMIN: { group: string; items: NavItem[] }[] = [
  { group: 'Main', items: [
    { id: 'overview', label: 'Dashboard', icon: ic('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6') },
  ]},
  { group: 'SAR Structure', items: [
    { id: 'part-a', label: 'Part A — Inst. Info', icon: ic('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4') },
    { id: 'criteria', label: 'Part B — Criteria', icon: ic('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'),
      children: [
        { id: 'C1', label: 'C1 — Vision & Mission', icon: ic('M9 12l2 2 4-4') },
        { id: 'C2', label: 'C2 — Curriculum', icon: ic('M9 12l2 2 4-4') },
        { id: 'C3', label: 'C3 — COs & POs', icon: ic('M9 12l2 2 4-4') },
        { id: 'C4', label: 'C4 — Students', icon: ic('M9 12l2 2 4-4') },
        { id: 'C5', label: 'C5 — Faculty', icon: ic('M9 12l2 2 4-4') },
        { id: 'C6', label: 'C6 — Facilities', icon: ic('M9 12l2 2 4-4') },
        { id: 'C7', label: 'C7 — Improvement', icon: ic('M9 12l2 2 4-4') },
        { id: 'C8', label: 'C8 — First Year', icon: ic('M9 12l2 2 4-4') },
        { id: 'C9', label: 'C9 — Student Support', icon: ic('M9 12l2 2 4-4') },
      ],
    },
    { id: 'part-d', label: 'Part D — Declaration', icon: ic('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z') },
  ]},
  { group: 'Tools', items: [
    { id: 'evidence', label: 'Document Vault', icon: ic('M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z') },
    { id: 'insights', label: 'AI Assistant', icon: ic('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z') },
    { id: 'audit', label: 'Audit Simulator', icon: ic('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z') },
    { id: 'co-po', label: 'CO-PO Mapping', icon: ic('M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2') },
    { id: 'export', label: 'Export SAR', icon: ic('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4') },
  ]},
  { group: 'Monitor', items: [
    { id: 'gaps', label: 'Gaps', icon: ic('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'), badge: '10' },
    { id: 'tasks', label: 'Tasks', icon: ic('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'), badge: '4' },
    { id: 'activity', label: 'Activity Log', icon: ic('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z') },
    { id: 'admin', label: 'Settings / Roles', icon: ic('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z') },
  ]},
  { group: 'Reports', items: [
    { id: 'sar',           label: 'SAR Progress',      icon: ic('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z') },
    { id: 'sar-generator', label: 'SAR Generator ✨',  icon: ic('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5') },
    { id: 'docsearch',     label: 'Document Search',   icon: ic('M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z') },
    { id: 'reports',       label: 'Reports & Export',  icon: ic('M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z') },
    { id: 'settings',      label: 'Settings',          icon: ic('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z') },
  ]},
];

// Faculty Member nav — mirrors fR routes from dashboard-helpers.js
const NAV_FACULTY: { group: string; items: NavItem[] }[] = [
  { group: 'Main', items: [
    { id: 'fdash',     label: 'My Dashboard',        icon: ic('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6') },
  ]},
  { group: 'My Work', items: [
    { id: 'criteria',  label: 'My Criteria',         icon: ic('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4') },
    { id: 'evidence',  label: 'Upload Documents',    icon: ic('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12') },
    { id: 'docsearch', label: 'Document Search',     icon: ic('M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z') },
    { id: 'co-po',     label: 'CO-PO Mapping',       icon: ic('M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2') },
    { id: 'insights',  label: 'AI Assistant',        icon: ic('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z') },
    { id: 'tasks',     label: 'My Tasks',            icon: ic('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01') },
  ]},
];

function NavBtn({ item, collapsed, depth = 0 }: { item: NavItem; collapsed: boolean; depth?: number }) {
  const activePanel = useSelector(selectActivePanel);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isActive = activePanel === item.id;
  const hasChildren = item.children && item.children.length > 0;
  const childActive = item.children?.some((c) => c.id === activePanel);

  const activeBg = 'rgba(37,99,235,0.18)';
  const activeColor = '#93C5FD';
  const normalColor = 'var(--hdr-muted)';
  const hoverBg = 'rgba(255,255,255,0.06)';

  return (
    <>
      <button
        onClick={() => { if (hasChildren) setOpen((p) => !p); else dispatch(setActivePanel(item.id)); }}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        style={{
          backgroundColor: isActive || childActive ? activeBg : 'transparent',
          color: isActive || childActive ? activeColor : normalColor,
          borderRight: isActive ? '3px solid #2563EB' : '3px solid transparent',
        }}
        className={`w-full flex items-center gap-2 py-2 text-xs font-medium transition-colors
          ${depth > 0 ? 'pl-8 pr-3' : 'px-3'}
          ${collapsed ? 'justify-center' : ''}
          hover:bg-white/5`}
      >
        {item.icon}
        {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ backgroundColor: 'rgba(185,28,28,0.3)', color: '#FCA5A5', border: '1px solid rgba(185,28,28,0.4)' }}>{item.badge}</span>
        )}
        {!collapsed && hasChildren && (
          <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        {collapsed && item.badge && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
      </button>
      {!collapsed && hasChildren && open && item.children?.map((child) => (
        <NavBtn key={child.id} item={child} collapsed={collapsed} depth={depth + 1} />
      ))}
    </>
  );
}

export default function Sidebar() {
  const collapsed = useSelector(selectSidebarCollapsed);
  const isAdmin = useSelector(selectIsAdmin);
  const NAV = isAdmin ? NAV_ADMIN : NAV_FACULTY;
  return (
    <aside
      className={`flex-shrink-0 flex flex-col transition-all duration-200 ease-in-out ${collapsed ? 'w-12' : 'w-52'}`}
      style={{ backgroundColor: 'var(--bg-header-2)', borderRight: '1px solid var(--hdr-border)' }}
    >
      <div className="flex-1 overflow-y-auto py-1">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            {!collapsed && (
              <div className="px-3 pt-3 pb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.5)' }}>{group}</span>
              </div>
            )}
            {items.map((item) => <NavBtn key={item.id} item={item} collapsed={collapsed} />)}
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="px-3 py-2" style={{ borderTop: '1px solid var(--hdr-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px]" style={{ color: 'var(--hdr-muted)' }}>AccreditIQ v1.0 · GAPC V4.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}
