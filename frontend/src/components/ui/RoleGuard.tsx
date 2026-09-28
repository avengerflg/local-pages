'use client';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/api';

export function RoleGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
