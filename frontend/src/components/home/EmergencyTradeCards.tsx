"use client";

import { Key, Wrench, Home, PhoneCall, Zap, Clock } from "lucide-react";

const emergencies = [
  {
    name: "Emergency Plumber",
    description: "Burst pipes, hot water failures, gas leaks & blocked drains.",
    eta: "15–20 min ETA",
    icon: Wrench,
    accent: "text-blue-600 bg-blue-50 border-blue-100",
    phone: "1300 000 000",
  },
  {
    name: "Emergency Electrician",
    description: "Power outages, switchboard trips & urgent safety hazards.",
    eta: "15–20 min ETA",
    icon: Zap,
    accent: "text-amber-600 bg-amber-50 border-amber-100",
    phone: "1300 000 000",
  },
  {
    name: "Emergency Locksmith",
    description: "Locked out of home or vehicle, broken keys & urgent lock repair.",
    eta: "15–25 min ETA",
    icon: Key,
    accent: "text-rose-600 bg-rose-50 border-rose-100",
    phone: "1300 000 000",
  },
  {
    name: "Emergency Glazier",
    description: "Smashed windows, glass replacement & emergency boarding.",
    eta: "20–30 min ETA",
    icon: Home,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    phone: "1300 000 000",
  },
];

export const EmergencyTradeCards = () => {
  return (
    <section className="py-16 lg:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="w-full max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>24/7 Priority Emergency Dispatches</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-brand-navy tracking-tight leading-tight">
            Urgent Trade <span className="text-brand-pink">Emergency?</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Immediate phone dispatch to licensed Australian tradies on standby across all major suburbs.
          </p>
        </div>

        {/* Simplified 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencies.map((trade) => {
            const Icon = trade.icon;
            return (
              <div 
                key={trade.name}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(7,27,58,0.08)] hover:border-brand-pink/30 transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Top Bar: Icon + ETA Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 ${trade.accent}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{trade.eta}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-brand-navy group-hover:text-brand-pink transition-colors leading-tight mb-2">
                    {trade.name}
                  </h3>

                  {/* Clean Short Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {trade.description}
                  </p>
                </div>

                {/* Call Action Button */}
                <a
                  href={`tel:${trade.phone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-pink text-white text-sm font-heading font-extrabold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 group/btn"
                >
                  <PhoneCall className="w-4 h-4 text-brand-pink group-hover/btn:text-white transition-colors" />
                  <span>Call {trade.phone}</span>
                </a>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


