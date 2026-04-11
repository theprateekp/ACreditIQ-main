import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '@/store/authSlice';
import type { Role } from '@/types';

interface RoleGateProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const role = useSelector(selectUserRole);
  if (!role || !allowedRoles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
