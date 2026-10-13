import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Bell } from 'lucide-react';

export const BusinessCTA = () => {
  return (
    <section className="relative bg-[#051329] overflow-hidden py-20 lg:py-28 text-white">
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-pink/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/20 border border-brand-pink/30 text-brand-pink text-xs font-heading font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              For Australian Trade Businesses
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Are You a Tradie Looking For <span className="bg-gradient-to-r from-brand-pink to-rose-400 bg-clip-text text-transparent">More Local Work?</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Stop paying inflated commissions to traditional lead brokers. Local Pages connects you directly with serious homeowners and property managers right in your local service radius.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-left">
              {[
                'Keep 100% of your earnings — zero commission',
                'Instant email & portal job notifications',
                'Verified ABN & license trust badge',
                'Control your service areas & trade categories',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-pink text-white font-heading font-extrabold text-base hover:bg-brand-pink-dark transition-all shadow-[0_8px_30px_rgba(245,43,104,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>List Your Business Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-base border border-white/20 transition-all hover:-translate-y-0.5"
              >
                Tradie Portal Sign In
              </Link>
            </div>

            {/* Trust Quote */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#051329] flex items-center justify-center text-[10px] font-bold text-white">✓</div>
                <div className="w-7 h-7 rounded-full bg-brand-blue border-2 border-[#051329] flex items-center justify-center text-[10px] font-bold text-white">✓</div>
                <div className="w-7 h-7 rounded-full bg-brand-pink border-2 border-[#051329] flex items-center justify-center text-[10px] font-bold text-white">✓</div>
              </div>
              <span>Connecting Australian trade businesses with local homeowners nationwide</span>
            </div>
          </div>

          {/* Right Column: Hero Graphic with Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              <Image 
                src="/images/business-cta.jpg"
                alt="Australian Tradie on job site"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051329]/90 via-[#051329]/20 to-transparent" />
            </div>

            {/* Floating Lead Notification Card */}
            <div className="absolute -top-6 -right-2 sm:-right-6 bg-white text-slate-900 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 max-w-[260px] animate-bounce-gentle hidden sm:block">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink">New Job Match</span>
                  <div className="text-xs font-bold text-slate-800">Switchboard Upgrade</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>📍 Parramatta NSW</span>
                <span className="font-bold text-emerald-600">Est. $1,250</span>
              </div>
            </div>

            {/* Floating Verified Pro Card */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/40 max-w-[240px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Verified Pro Status</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Active & Approved</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

