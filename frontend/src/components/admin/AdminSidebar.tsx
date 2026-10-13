'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  MapPin,
  Star,
  AlertTriangle,
  LogOut,
  ShieldAlert,
  Home,
  X,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

interface AdminSidebarProps {
  onClose?: () => void;
}

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Tradies', href: '/admin/tradies', icon: Briefcase },
  { name: 'Services', href: '/admin/services', icon: Layers },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Review Reports', href: '/admin/review-reports', icon: AlertTriangle },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const isNavActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-[#071B3A] text-white select-none border-r border-[#0B2342]">
      {/* Brand & Mobile Close */}
      <div className="p-5 sm:p-6 border-b border-[#0B2342] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="bg-white rounded-lg p-1.5 shadow-sm">
            <Image
              src="/logo.jpeg"
              alt="Local Pages Admin"
              width={160}
              height={45}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0B2342] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin User Badge */}
      <div className="p-4 mx-4 my-4 rounded-2xl bg-[#0B2342]/80 border border-slate-700/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F52B68] to-[#E01E5A] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(245,43,104,0.3)] shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-white text-xs truncate">
            {user?.name || 'Administrator'}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-pink-400 font-semibold mt-0.5">
            <ShieldAlert className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="uppercase tracking-wider">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? 'bg-[#F52B68] text-white shadow-[0_4px_14px_rgba(245,43,104,0.35)] font-bold'
                  : 'text-slate-300 hover:bg-[#0B2342] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-pink-400 transition-colors'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#0B2342] space-y-1 bg-[#071B3A]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0B2342] transition-colors"
        >
          <Home className="w-4 h-4 text-slate-400" />
          <span>View Public Website</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
