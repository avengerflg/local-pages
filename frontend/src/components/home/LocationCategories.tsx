'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ChevronRight, Navigation } from 'lucide-react';

const regions = [
  {
    city: 'Sydney',
    state: 'NSW',
    popularSuburbs: ['Bondi', 'Parramatta', 'Surry Hills', 'Chatswood', 'Cronulla', 'Penrith', 'Manly', 'Castle Hill'],
    trades: ['Electricians in Sydney', 'Plumbers in Sydney', 'Roofers in Sydney', 'Painters in Sydney', 'Handymen in Sydney', 'Air Conditioning Sydney'],
  },
  {
    city: 'Melbourne',
    state: 'VIC',
    popularSuburbs: ['Richmond', 'St Kilda', 'Brunswick', 'South Yarra', 'Berwick', 'Werribee', 'Preston', 'Brighton'],
    trades: ['Electricians Melbourne', 'Plumbers Melbourne', 'Carpenters Melbourne', 'Painters Melbourne', 'Tilers Melbourne', 'Heating & Cooling Melb'],
  },
  {
    city: 'Brisbane',
    state: 'QLD',
    popularSuburbs: ['Fortitude Valley', 'Paddington', 'Chermside', 'Indooroopilly', 'Carindale', 'South Brisbane', 'New Farm', 'Nundah'],
    trades: ['Electricians Brisbane', 'Plumbers Brisbane', 'Air Conditioning Brisbane', 'Landscapers Brisbane', 'Cleaners Brisbane', 'Fencing Brisbane'],
  },
  {
    city: 'Perth',
    state: 'WA',
    popularSuburbs: ['Fremantle', 'Scarborough', 'Subiaco', 'Joondalup', 'Mandurah', 'Victoria Park', 'Midland', 'Cottesloe'],
    trades: ['Electricians Perth', 'Plumbers Perth', 'Air Conditioning Perth', 'Painters Perth', 'Handymen Perth', 'Roofing Perth'],
  },
  {
    city: 'Adelaide',
    state: 'SA',
    popularSuburbs: ['Glenelg', 'Norwood', 'Prospect', 'Mawson Lakes', 'Marion', 'Unley', 'North Adelaide', 'Port Adelaide'],
    trades: ['Electricians Adelaide', 'Plumbers Adelaide', 'Carpenters Adelaide', 'Painters Adelaide', 'Rubbish Removal Adelaide', 'Tilers Adelaide'],
  },
  {
    city: 'Gold Coast',
    state: 'QLD',
    popularSuburbs: ['Surfers Paradise', 'Broadbeach', 'Robina', 'Burleigh Heads', 'Southport', 'Coolangatta'],
    trades: ['Plumbers Gold Coast', 'Electricians Gold Coast', 'Air Con Gold Coast', 'Pool Fencing Gold Coast', 'Painters Gold Coast'],
  },
];

export const LocationCategories = () => {
  const [activeCity, setActiveCity] = useState(0);
  const current = regions[activeCity];

  return (
    <section className="bg-white py-20 lg:py-24 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5" />
            Nationwide Local Coverage
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Find Trades Across <span className="text-brand-pink">Australia</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Covering all major capital cities and regional hubs with thousands of licensed, background-checked tradies.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {regions.map((region, idx) => {
            const isActive = activeCity === idx;
            return (
              <button
                key={region.city}
                onClick={() => setActiveCity(idx)}
                className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-brand-navy'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-brand-pink' : 'text-slate-400'}`} />
                <span>{region.city}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {region.state}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active City Card Details */}
        <div className="bg-[#F8FAFC] rounded-3xl p-8 lg:p-10 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Popular Suburbs */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-brand-blue" />
                <h3 className="font-heading font-bold text-lg text-brand-navy">
                  Popular {current.city} Suburbs
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Tradies on call with fast 30-minute dispatch across local council regions:
              </p>
              
              <div className="flex flex-wrap gap-2">
                {current.popularSuburbs.map((suburb) => (
                  <Link
                    key={suburb}
                    href={`/services?location=${encodeURIComponent(suburb + ', ' + current.state)}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-pink hover:text-brand-pink hover:shadow-sm transition-all"
                  >
                    {suburb}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Top Services in this City */}
            <div className="lg:col-span-7 lg:pl-4">
              <h3 className="font-heading font-bold text-lg text-brand-navy mb-4 flex items-center justify-between">
                <span>Top Services in {current.city}, {current.state}</span>
                <Link href="/services" className="text-xs text-brand-pink hover:underline font-bold flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.trades.map((trade) => (
                  <Link
                    key={trade}
                    href={`/services?q=${encodeURIComponent(trade)}`}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-pink/50 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-pink transition-colors">
                      {trade}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

