'use client';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/customer' },
    { name: 'Profile', href: '/customer/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50 hover:text-gray-900"
            >
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-grow">
          {children}
        </main>
      </div>
      <PublicFooter />
    </div>
  );
}
