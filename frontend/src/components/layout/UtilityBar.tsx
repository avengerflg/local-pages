import Link from 'next/link';
import { ShieldCheck, Key, Wrench, Zap, Sparkles } from 'lucide-react';

export const UtilityBar = () => {
  return (
    <div className="w-full bg-[#040E1E] text-white text-[12px] font-semibold h-10 sm:h-11 border-b border-white/10 flex items-center justify-between px-3 sm:px-6 lg:px-8 overflow-hidden select-none">
      
      {/* Left Emergency & Verification Action - Phone number removed */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link 
          href="/services" 
          className="group inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-bright hover:from-brand-pink-bright hover:to-brand-pink text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold tracking-wide shadow-[0_2px_10px_rgba(245,43,104,0.35)] transition-all shrink-0 active:scale-95"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap font-extrabold">24/7 PRIORITY DISPATCH</span>
        </Link>

        {/* Status text on mobile / Desktop description */}
        <span className="hidden sm:inline-flex items-center text-[11px] font-medium text-white/60 border-l border-white/10 pl-2.5 sm:pl-3 truncate">
          Avg. tradie response &lt; 15 mins
        </span>
      </div>

      {/* Mobile Live Badge */}
      <div className="flex sm:hidden items-center gap-1.5 text-[11px] text-emerald-400 font-bold shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>On Call 24/7</span>
      </div>

      {/* Desktop Quick Emergency Pills */}
      <div className="hidden lg:flex items-center gap-2 shrink-0 pl-4">
        <span className="text-[11px] uppercase tracking-wider text-white/40 font-bold mr-1">
          Fast Dispatches:
        </span>
        <Link 
          href="/services?trade=locksmith" 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/90 hover:text-white border border-white/10 transition-all text-[11px] font-semibold"
        >
          <Key className="w-3 h-3 text-brand-pink" />
          <span>Emergency Locksmith</span>
        </Link>
        <Link 
          href="/services?trade=plumber" 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/90 hover:text-white border border-white/10 transition-all text-[11px] font-semibold"
        >
          <Wrench className="w-3 h-3 text-blue-400" />
          <span>24hr Plumber</span>
        </Link>
        <Link 
          href="/services?trade=electrician" 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/90 hover:text-white border border-white/10 transition-all text-[11px] font-semibold"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Emergency Sparky</span>
        </Link>
        <Link 
          href="/services" 
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-pink/20 hover:bg-brand-pink/30 text-brand-pink border border-brand-pink/30 transition-all text-[11px] font-bold"
        >
          <Sparkles className="w-3 h-3" />
          <span>+ All 24hr Trades</span>
        </Link>
      </div>
    </div>
  );
};
