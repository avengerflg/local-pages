"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Flame,
  CheckCircle2
} from 'lucide-react';

const popularQuickSearches = [
  { name: 'Blocked Drain Plumber', slug: 'plumber', icon: '🔧' },
  { name: 'Emergency Electrician', slug: 'electrician', icon: '⚡' },
  { name: 'End of Lease Cleaning', slug: 'cleaner', icon: '✨' },
  { name: 'Interior House Painting', slug: 'painter', icon: '🎨' },
  { name: 'Driveways & Concreting', slug: 'concreting', icon: '🧱' },
  { name: 'Termite & Pest Inspection', slug: 'pest-control', icon: '🐜' },
  { name: 'Emergency Locksmith', slug: 'locksmith', icon: '🔑' },
  { name: 'Roof Restoration', slug: 'roofing', icon: '🏠' },
];

export const TradeSearch = () => {
  const router = useRouter();
  const [trade, setTrade] = useState('');
  const [suburb, setSuburb] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (trade) query.set('trade', trade);
    if (suburb.trim()) query.set('location', suburb.trim());
    router.push(`/services?${query.toString()}`);
  };

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12 relative z-20">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8">
        
        {/* Main Card Container with Architectural Backdrop - Compact */}
        <div className="relative overflow-hidden rounded-3xl bg-[#071731] border border-slate-700/50 shadow-[0_20px_50px_rgba(4,19,41,0.22)] p-6 sm:p-8 lg:p-9">
          
          {/* Ambient Lighting & Micro-Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-pink/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Header Content - Compact */}
          <div className="relative z-10 max-w-2xl mx-auto text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 border border-white/15 text-[11px] font-bold tracking-wider uppercase mb-2.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-brand-pink animate-pulse" />
              <span>National Trade Directory</span>
            </div>
            
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-white tracking-tight leading-tight">
              Looking for a Specific <span className="bg-gradient-to-r from-brand-pink via-pink-400 to-rose-400 bg-clip-text text-transparent">Trade Specialist?</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm font-normal mt-2 max-w-xl mx-auto leading-relaxed">
              Instantly connect with verified trade pros across Australia. Filter by certified specialty or local suburb.
            </p>
          </div>

          {/* Elevated Multi-Bay Search Console - Compact */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <form 
              onSubmit={handleSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col sm:flex-row items-stretch gap-2"
            >
              
              {/* Bay 1: Trade Category Selector */}
              <div className="flex-1 relative flex items-center px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-pink/40 border border-slate-200/80 transition-all">
                <div className="w-8 h-8 rounded-lg bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 mr-2.5">
                  <Search className="w-4 h-4 text-brand-navy" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    What Trade?
                  </label>
                  <select 
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-brand-navy outline-none cursor-pointer truncate"
                  >
                    <option value="">All Trade Categories</option>
                    <option value="plumber">Plumber & Gas Fitting</option>
                    <option value="electrician">Electrician & Solar</option>
                    <option value="cleaner">Home & Commercial Cleaning</option>
                    <option value="painter">Painter & Decorator</option>
                    <option value="concreting">Concreter & Paving</option>
                    <option value="pest-control">Pest Control & Termite</option>
                    <option value="landscaping">Landscaper & Gardener</option>
                    <option value="carpenter">Carpenter & Joinery</option>
                    <option value="roofing">Roof Repair & Restoration</option>
                    <option value="locksmith">Locksmith & Security</option>
                    <option value="air-conditioning">Air Conditioning & HVAC</option>
                  </select>
                </div>
              </div>

              {/* Bay 2: Suburb / Postcode Input */}
              <div className="flex-1 relative flex items-center px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-pink/40 border border-slate-200/80 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 mr-2.5">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Where?
                  </label>
                  <input 
                    type="text" 
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="Suburb, City or Postcode" 
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button 
                type="submit"
                className="h-[46px] sm:h-auto sm:min-w-[150px] bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white px-5 rounded-xl font-heading font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-[0_6px_20px_rgba(245,43,104,0.35)] active:scale-[0.98] group"
              >
                <span>Find Tradies</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>

            {/* Trending Quick Search Chips - Compact */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-white/70 mr-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Popular:</span>
              </div>
              
              {popularQuickSearches.map((item) => (
                <Link
                  key={item.name}
                  href={`/services?trade=${item.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 hover:border-brand-pink/50 px-2.5 py-1 rounded-full transition-all duration-200 backdrop-blur-sm active:scale-95"
                >
                  <span className="text-[10px]">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Bottom Credibility Micro-Bar - Compact */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Police & License Audited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Contact • Zero Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink" />
                <span>Over 8,500+ Verified Tradies</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


