'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  const getDashboardDestination = () => {
    if (!user) return '/login';
    if (user.role === 'customer') return '/customer';
    if (user.role === 'tradie') return '/tradie/dashboard';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <UtilityBar />
      <PublicHeader />

      <main className="flex-grow flex items-center justify-center py-16 px-5 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-[0_15px_40px_rgba(4,19,41,0.06)] text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">
            <span>403 • Access Restricted</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
            Permission Required
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-8">
            You do not have the required permissions to access this area. This section is restricted to specific account roles.
          </p>

          <div className="space-y-3">
            {user ? (
              <Link
                href={getDashboardDestination()}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_6px_20px_rgba(245,43,104,0.3)]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Your Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_6px_20px_rgba(245,43,104,0.3)]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sign In to Continue</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs sm:text-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
