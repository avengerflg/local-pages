'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col selection:bg-[#F52B68]/20 selection:text-[#F52B68]">
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-40">
        <AdminSidebar />
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-[#071B3A]/70 backdrop-blur-xs z-50 lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Sliding Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
      </aside>

      {/* Main Canvas */}
      <div className="lg:pl-64 xl:pl-72 flex flex-col flex-1 min-h-screen">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        <footer className="px-6 py-4 border-t border-slate-200/80 bg-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div>
            © 2026 Local Pages Pty Ltd. Operations & Verification Dashboard.
          </div>
          <div className="text-slate-400">
            Administrative Control Layer v1.0
          </div>
        </footer>
      </div>
    </div>
  );
}
