import type { ReactNode } from 'react';

interface KPITileProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accentColor?: string;
  subLabel?: string;
}

export default function KPITile({ label, value, icon, accentColor = 'text-blue-700', subLabel }: KPITileProps) {
  return (
    <div className="card flex flex-col gap-1 p-3">
      <div className="flex items-center justify-between">
        <span className="section-title mb-0 border-0 pb-0" style={{ fontSize: 10 }}>{label}</span>
        {icon && <span className={`opacity-50 ${accentColor}`}>{icon}</span>}
      </div>
      <span className={`text-2xl font-bold tabular-nums ${accentColor}`}>{value}</span>
      {subLabel && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subLabel}</span>}
    </div>
  );
}
