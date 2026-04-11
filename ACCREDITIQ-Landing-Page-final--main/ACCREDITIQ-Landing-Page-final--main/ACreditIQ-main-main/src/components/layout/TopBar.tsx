import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAdmin, logout } from '@/store/authSlice';
import { toggleSidebar, setDepartment, setAcademicYear, selectDepartment, selectAcademicYear } from '@/store/uiSlice';
import { selectUserNotifications, selectUnreadCount, markAllRead, markRead } from '@/store/notificationsSlice';
import { SparklesIcon } from '@/components/ui/Icon';

const DEPARTMENTS = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
];
const ACADEMIC_YEARS = ['2024-25', '2023-24', '2022-23'];

const TYPE_ICON: Record<string, string> = {
  criteria_assigned: '📋',
  role_changed:      '🔑',
  doc_approved:      '✅',
  doc_rejected:      '❌',
  general:           '🔔',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function TopBar() {
  const user       = useSelector(selectCurrentUser);
  const isAdmin    = useSelector(selectIsAdmin);
  const dispatch   = useDispatch();
  const department = useSelector(selectDepartment);
  const academicYear = useSelector(selectAcademicYear);

  // Notification state — scoped to current user
  const notifications = useSelector(user ? selectUserNotifications(user.id) : () => []);
  const unreadCount   = useSelector(user ? selectUnreadCount(user.id) : () => 0);

  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click (mirrors reference dashboard behaviour)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0F2044] border-b border-[#1E3A5F] flex items-center px-4 gap-3">
      {/* Hamburger */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-1.5 rounded hover:bg-[#1E3A5F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center">
          <span className="text-white text-xs font-black">IQ</span>
        </div>
        <span className="text-[#F1F5F9] font-bold text-base tracking-tight">AccreditIQ</span>
        <span className="hidden lg:block text-[#1E3A5F] text-lg">|</span>
        <span className="hidden lg:block text-[#94A3B8] text-xs">NBA SAR · GAPC V4.0</span>
      </div>

      <div className="flex-1" />

      {/* Department selector */}
      <select
        value={department}
        onChange={(e) => dispatch(setDepartment(e.target.value))}
        className="hidden md:block bg-[#0A1628] border border-[#1E3A5F] text-[#F1F5F9] text-xs rounded px-2 py-1.5 focus:outline-none focus:border-[#2563EB] max-w-[180px]"
        aria-label="Department"
      >
        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      {/* Academic year */}
      <select
        value={academicYear}
        onChange={(e) => dispatch(setAcademicYear(e.target.value))}
        className="hidden sm:block bg-[#0A1628] border border-[#1E3A5F] text-[#F1F5F9] text-xs rounded px-2 py-1.5 focus:outline-none focus:border-[#2563EB]"
        aria-label="Academic Year"
      >
        {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>

      {/* AI Assistant */}
      <button
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded hover:bg-indigo-600/30 transition-colors"
        aria-label="AI Assistant"
      >
        <SparklesIcon className="w-3.5 h-3.5" />
        <span className="hidden md:inline">AI Assistant</span>
      </button>

      {/* ── Notification Bell + Panel ── */}
      <div className="relative" ref={bellRef}>
        <button
          onClick={() => setBellOpen((p) => !p)}
          className="relative p-1.5 rounded hover:bg-[#1E3A5F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ background: '#EF4444', color: '#fff' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification dropdown panel */}
        {bellOpen && (
          <div
            className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50"
            style={{ background: '#0F2044', border: '1px solid #1E3A5F', top: '100%' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1E3A5F' }}>
              <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Notifications</span>
              {unreadCount > 0 && user && (
                <button
                  onClick={() => dispatch(markAllRead(user.id))}
                  className="text-[11px] font-medium"
                  style={{ color: '#93C5FD' }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-2xl mb-2">🔔</div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => dispatch(markRead(n.id))}
                    className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      background: n.read ? 'transparent' : 'rgba(37,99,235,0.1)',
                      borderBottom: '1px solid rgba(30,58,95,0.5)',
                    }}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] ?? '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed" style={{ color: n.read ? '#94A3B8' : '#F1F5F9' }}>
                        {n.message}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: '#475569' }}>{timeAgo(n.timestamp)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#2563EB' }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      {user && (
        <div className="flex items-center gap-2 pl-2 border-l border-[#1E3A5F]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.avatarInitials}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[#F1F5F9] text-xs font-semibold">{user.name}</span>
            <span className="text-[10px]" style={{ color: isAdmin ? '#93C5FD' : '#6EE7B7' }}>
              {user.roleGroup}
            </span>
          </div>
          <button
            onClick={() => dispatch(logout())}
            title="Logout"
            className="ml-1 p-1.5 rounded hover:bg-[#1E3A5F] text-[#94A3B8] hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
