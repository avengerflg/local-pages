'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink,
  Search,
  Bell,
  Menu,
  X,
  Compass,
  Zap,
  HelpCircle,
  Home
} from 'lucide-react';
import { User } from '@/types/api';

const mainNavItems = [
  { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
  { name: 'My Requests', href: '/customer/jobs', icon: ClipboardList },
  { name: 'Appointments', href: '/customer/appointments', icon: Calendar },
  { name: 'Profile & Settings', href: '/customer/profile', icon: UserCheck },
];

const exploreNavItems = [
  { name: 'Browse All Trades', href: '/services', icon: Compass },
  { name: 'Emergency Dispatch', href: '/#emergency', icon: Zap },
];

// Generate initials for avatar
const getInitials = (name?: string) => {
  if (!name) return 'CU';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

interface SidebarContentProps {
  user: User | null;
  pathname: string;
  logout: () => void;
  onClose?: () => void;
}

const SidebarContent = ({ user, pathname, logout, onClose }: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-white border-r border-slate-200/90 select-none">
    
    {/* Brand Header */}
    <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <Image 
          src="/logo.jpeg" 
          alt="Local Pages" 
          width={200} 
          height={60} 
          className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
        />
      </Link>
      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20 text-[10px] font-bold uppercase tracking-wider">
        Portal
      </span>
    </div>

    {/* User Badge Pill */}
    <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink to-[#E01E5A] text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-[0_4px_12px_rgba(245,43,104,0.25)] shrink-0">
        {getInitials(user?.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-heading font-bold text-slate-900 text-xs truncate leading-tight">
          {user?.name || 'Customer Account'}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Verified Homeowner</span>
        </div>
      </div>
    </div>

    {/* Scrollable Navigation Bay */}
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
      
      {/* Core Workspace */}
      <div className="space-y-1">
        <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onClose?.()}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-pink text-white shadow-[0_4px_14px_rgba(245,43,104,0.28)] font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-navy'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-pink transition-colors'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Explore Trades */}
      <div className="space-y-1">
        <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Trades & Services
        </div>
        {exploreNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onClose?.()}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
                <span>{item.name}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
            </Link>
          );
        })}
      </div>

      {/* Quick Sidebar Post Job Card */}
      <div className="pt-2">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-navy text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-20 h-20 bg-brand-pink/20 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest text-brand-pink bg-white/10 px-2 py-0.5 rounded">
              Instant Dispatch
            </span>
            <h5 className="font-heading font-bold text-xs leading-snug">
              Need a Tradie?
            </h5>
            <p className="text-slate-300 text-[10px] leading-relaxed">
              Post your job in 60s and compare local verified quotes.
            </p>
            <Link
              href="/services"
              onClick={() => onClose?.()}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-brand-pink hover:bg-[#E01E5A] text-white text-[11px] font-heading font-extrabold tracking-wide transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>
      </div>

    </div>

    {/* Sidebar Footer Controls */}
    <div className="p-4 border-t border-slate-100 space-y-1 bg-white">
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-brand-navy hover:bg-slate-50 transition-colors"
      >
        <Home className="w-4 h-4 text-slate-400" />
        <span>Back to Main Website</span>
      </Link>
      <Link
        href="/contact"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-brand-navy hover:bg-slate-50 transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-slate-400" />
        <span>Help & Support</span>
      </Link>
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
      >
        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
        <span>Sign Out</span>
      </button>
    </div>

  </div>
);

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/customer') return 'Dashboard Overview';
    if (pathname === '/customer/jobs') return 'My Service Requests';
    if (pathname === '/customer/appointments') return 'Tradie Appointments';
    if (pathname === '/customer/profile') return 'Account & Settings';
    return 'Customer Portal';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-brand-pink/20 selection:text-brand-pink">
      
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-40">
        <SidebarContent user={user} pathname={pathname} logout={logout} />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Sliding Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="relative h-full">
          <SidebarContent user={user} pathname={pathname} logout={logout} onClose={() => setMobileMenuOpen(false)} />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="lg:pl-64 xl:pl-72 flex flex-col flex-1 min-h-screen">
        
        {/* Top App Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between shadow-xs">
          
          {/* Left: Mobile Toggle & Page Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400 font-medium hidden sm:inline">Portal</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Center Search Pill (Desktop) */}
          <div className="hidden md:flex items-center max-w-sm w-full mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search trades, active requests, quotes..."
                className="w-full pl-9 pr-12 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] text-slate-400 font-bold">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Notification Bell */}
            <button 
              className="relative p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-50 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-pink ring-2 ring-white" />
            </button>

            {/* Primary Post Job CTA in Top Bar */}
            <Link
              href="/customer/requests/new"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-xs tracking-wide transition-all shadow-[0_4px_12px_rgba(245,43,104,0.22)]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">POST A JOB</span>
              <span className="sm:hidden">POST</span>
            </Link>

            {/* User Dropdown Preview */}
            <Link 
              href="/customer/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-heading font-extrabold text-xs group-hover:bg-brand-pink transition-colors">
                {getInitials(user?.name)}
              </div>
            </Link>

          </div>

        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        {/* Minimal Clean Dashboard App Footer */}
        <footer className="px-6 py-4 border-t border-slate-200/70 bg-white/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © 2026 Local Pages Pty Ltd. Australian Registered Service Directory.
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/about" className="hover:text-slate-600 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-600 transition-colors">Support</Link>
            <Link href="/" className="hover:text-brand-pink transition-colors">Public Website</Link>
          </div>
        </footer>

      </div>

    </div>
  );
}
