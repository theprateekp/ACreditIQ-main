// Centralized SVG icon set
import type { CSSProperties } from 'react';

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

const svg = (path: string, { className = 'w-4 h-4', style }: IconProps) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

export const UploadIcon       = (p: IconProps) => svg('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', p);
export const PlusIcon         = (p: IconProps) => svg('M12 4v16m8-8H4', p);
export const SearchIcon       = (p: IconProps) => svg('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', p);
export const DownloadIcon     = (p: IconProps) => svg('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', p);
export const SparklesIcon     = (p: IconProps) => svg('M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', p);
export const DocumentIcon     = (p: IconProps) => svg('M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', p);
export const WarningIcon      = (p: IconProps) => svg('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', p);
export const CheckCircleIcon  = (p: IconProps) => svg('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', p);
export const ClockIcon        = (p: IconProps) => svg('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', p);
export const LockIcon         = (p: IconProps) => svg('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', p);
export const CalendarIcon     = (p: IconProps) => svg('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', p);
export const ChartBarIcon     = (p: IconProps) => svg('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', p);
export const InfoIcon         = (p: IconProps) => svg('M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', p);
export const AuditIcon        = (p: IconProps) => svg('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', p);
export const EvidenceUploadIcon = (p: IconProps) => svg('M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', p);
