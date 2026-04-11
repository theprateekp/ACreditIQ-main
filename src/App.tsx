import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import DashboardShell from '@/components/layout/DashboardShell';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import LandingPage from '@/pages/LandingPage';
import { selectIsAuthenticated } from '@/store/authSlice';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchInterval: 60_000 } },
});

function AppInner() {
  const [hasPassedLanding, setHasPassedLanding] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!hasPassedLanding) {
    return <LandingPage onEnter={() => setHasPassedLanding(true)} />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DashboardShell>
      <DashboardPage />
    </DashboardShell>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </Provider>
  );
}
