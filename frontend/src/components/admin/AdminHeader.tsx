'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#071B3A]/10 text-[#071B3A] font-bold text-[10px] uppercase tracking-wider">
            Operations Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-[#071B3A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Admin Access</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
