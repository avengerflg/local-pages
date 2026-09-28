import { RoleGuard } from '@/components/ui/RoleGuard';
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['customer']}>{children}</RoleGuard>;
}
