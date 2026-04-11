import { useKPIs } from '@/hooks/useDashboardData';
import { WarningIcon, CalendarIcon } from '@/components/ui/Icon';

export default function DeadlineBanner() {
  const { data: kpis } = useKPIs();
  const days = kpis?.daysToDeadline ?? 999;
  if (days > 30) return null;

  const isCritical = days <= 7;
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium"
      style={{
        backgroundColor: isCritical ? 'var(--danger-bg)' : 'var(--warning-bg)',
        borderBottom: `1px solid ${isCritical ? '#FCA5A5' : '#FCD34D'}`,
        color: isCritical ? 'var(--danger)' : 'var(--warning)',
      }}>
      {isCritical ? <WarningIcon className="w-4 h-4 flex-shrink-0" /> : <CalendarIcon className="w-4 h-4 flex-shrink-0" />}
      {isCritical
        ? `URGENT — SAR submission deadline in ${days} day${days === 1 ? '' : 's'}. Resolve all Critical gaps immediately.`
        : `SAR submission in ${days} days — review all In Progress criteria before the internal review window closes.`}
    </div>
  );
}
