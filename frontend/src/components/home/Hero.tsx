"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Star, Search, MapPin, ArrowRight, 
  CheckCircle2, Clock, Check
} from 'lucide-react';

export const Hero = () => {
  const router = useRouter();
  const [selectedTrade, setSelectedTrade] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedTrade) query.set('trade', selectedTrade);
    if (location.trim()) query.set('location', location.trim());
    router.push(`/services?${query.toString()}`);
  };

  return (
    <section className="relative bg-[#051329] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Background Architectural House Image - Clearly Visible */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/pool-fencing.jpg" 
          alt="Modern Australian Home Renovation" 
          fill
          priority
          className="object-cover object-[center_35%] opacity-85 lg:opacity-90 scale-100"
        />
        {/* Balanced directional overlay: soft dark tint on left for text legibility, clear on right for vivid house visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051329]/92 via-[#051329]/70 to-[#051329]/25 z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#051329] to-transparent z-10" />
      </div>

      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Social Proof Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5</span>
              <span className="text-white/70 hidden sm:inline">• Verified Australian homeowner feedback</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
              Find Trusted <span className="text-brand-pink">Local Tradies</span> Near You.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Compare free, no-obligation quotes from licensed, police-checked and insured tradespeople across Australia.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-100 max-w-2xl mx-auto lg:mx-0 text-slate-900">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
                
                {/* Trade Service Select */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5 text-brand-pink" />
                  </div>
                  <select 
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="w-full h-13 pl-11 pr-4 bg-slate-50 hover:bg-slate-100/70 rounded-xl text-sm font-bold text-brand-navy outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-brand-pink transition-all border border-slate-200"
                  >
                    <option value="">Select a trade or service...</option>
                    <option value="plumber">Plumber & Gasfitter</option>
                    <option value="electrician">Electrician</option>
                    <option value="air-conditioning">Air Conditioning & Heating</option>
                    <option value="carpenter">Carpenter & Joiner</option>
                    <option value="painter">Painter & Decorator</option>
                    <option value="handyman">Handyman & Repairs</option>
                    <option value="roofing">Roofing & Guttering</option>
                    <option value="cleaner">Cleaning Services</option>
                    <option value="locksmith">Emergency Locksmith</option>
                    <option value="landscaping">Landscaper</option>
                  </select>
                </div>

                {/* Suburb or Postcode Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-5 h-5 text-brand-blue" />
                  </div>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter suburb or postcode"
                    className="w-full h-13 pl-11 pr-4 bg-slate-50 hover:bg-slate-100/70 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-brand-pink transition-all border border-slate-200"
                  />
                </div>

                {/* Search Button */}
                <button 
                  type="submit"
                  className="h-13 px-7 rounded-xl bg-brand-pink hover:bg-brand-pink-dark text-white font-heading font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <span>Get Quotes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-300">
              <span className="font-bold text-white/90">Popular:</span>
              {[
                { name: 'Plumbers', slug: 'plumber' },
                { name: 'Electricians', slug: 'electrician' },
                { name: 'Air Con', slug: 'air-conditioning' },
                { name: 'Painters', slug: 'painter' },
                { name: 'Handymen', slug: 'handyman' },
                { name: 'Roofers', slug: 'roofing' },
              ].map((trade) => (
                <button
                  key={trade.name}
                  type="button"
                  onClick={() => {
                    setSelectedTrade(trade.slug);
                    router.push(`/services?trade=${trade.slug}`);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  {trade.name}
                </button>
              ))}
            </div>

            {/* Human Trust Checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={3} />
                <span>100% Free Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={3} />
                <span>Verified ABN & Trade Licenses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={3} />
                <span>Direct Contact — Zero Booking Fees</span>
              </div>
            </div>

          </div>

          {/* Right Column: Real Tradie Photo with Authentic Verified Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900">
              <Image 
                src="/images/tradie-hero.jpg" 
                alt="Licensed Australian Tradie on Site"
                fill
                priority
                className="object-cover object-top"
              />
              
              {/* Natural subtle gradient so text chips pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

              {/* Floating Top Badge: Rapid Callout */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Rapid Callout Available</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-pink text-white text-[11px] font-extrabold uppercase shadow-md">
                  Active
                </div>
              </div>

              {/* Authentic Verified Tradie Profile Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 text-slate-900 shadow-xl border border-white/40">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm shrink-0">
                      LP
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-extrabold text-sm text-brand-navy">
                          Dave&apos;s Electrical Services
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Sydney & Greater NSW • Verified Trade Pro
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>4.9</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ABN & $20M Insured</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>Responds in ~10 mins</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

