import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSidebarCollapsed } from '@/store/uiSlice';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import DeadlineBanner from '@/components/dashboard/DeadlineBanner';
import type { ReactNode } from 'react';

export default function DashboardShell({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handle = () => { if (window.innerWidth < 768) dispatch(setSidebarCollapsed(true)); };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>
      <TopBar />
      <DeadlineBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-5" style={{ backgroundColor: 'var(--bg-page)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
