import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarCollapsed, selectSidebarCollapsed } from '@/store/uiSlice';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import DeadlineBanner from '@/components/dashboard/DeadlineBanner';
import AIChatBot from './AIChatBot';
import type { ReactNode } from 'react';

export default function DashboardShell({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);

  // Auto-collapse on small screens
  useEffect(() => {
    const handle = () => {
      if (window.innerWidth < 768) dispatch(setSidebarCollapsed(true));
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [dispatch]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>
      <TopBar />
      <DeadlineBanner />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay backdrop */}
        {!collapsed && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => dispatch(setSidebarCollapsed(true))}
          />
        )}

        {/* Sidebar — fixed on mobile, static on desktop */}
        <div
          className={`
            md:relative md:flex md:flex-shrink-0
            fixed top-0 left-0 h-full z-30
            transition-transform duration-200 ease-in-out
            ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
          `}
          style={{ paddingTop: collapsed ? 0 : '56px' }}
        >
          <Sidebar />
        </div>

        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-page)',
            padding: 'clamp(12px, 2vw, 20px)',
          }}
        >
          {children}
        </main>
      </div>

      <AIChatBot />
    </div>
  );
}
