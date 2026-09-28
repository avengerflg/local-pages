import { RoleGuard } from '@/components/ui/RoleGuard';
export default function TradieLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['tradie']}>{children}</RoleGuard>;
}
