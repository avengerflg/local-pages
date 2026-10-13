import { ShieldCheck, Zap, MapPin, Award, CheckCircle2 } from 'lucide-react';

const stats = [
  { 
    value: '4.9', 
    suffix: '★',
    suffixColor: 'text-amber-500',
    label: 'Average Client Rating', 
    sub: 'Verified customer feedback' 
  },
  { 
    value: '100%', 
    suffix: '',
    suffixColor: '',
    label: 'ABN & License Checked', 
    sub: 'Strict police & trade credentials' 
  },
  { 
    value: '< 60s', 
    suffix: '',
    suffixColor: '',
    label: 'Direct Tradie Connect', 
    sub: 'Instant phone call or quote' 
  },
  { 
    value: '$0', 
    suffix: 'Fee',
    suffixColor: 'text-emerald-600 font-bold text-xl ml-1',
    label: 'Free for Homeowners', 
    sub: 'Zero hidden middleman charges' 
  },
];

const features = [
  {
    icon: MapPin,
    title: 'Hyper-Local Tradies',
    description: 'We connect you with qualified tradespeople living and working right in your local suburb for faster arrival and lower callout fees.',
    badge: 'Nearby Pros',
    accent: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & Insured',
    description: 'Every business is pre-verified against the Australian Business Register (ABN) and required state licensing databases.',
    badge: '100% Audited',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: Zap,
    title: 'Fast 24/7 Response',
    description: 'Emergency pipe burst or power outage? Access on-call licensed trades standing by for priority dispatch to your doorstep.',
    badge: 'Rapid Dispatch',
    accent: 'bg-rose-50 text-brand-pink border-rose-100',
  },
  {
    icon: Award,
    title: 'Zero Booking Fees',
    description: 'Direct communication with no platform commissions or hidden middleman charges. You deal directly with your chosen tradie.',
    badge: '100% Free',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
  },
];

export const TrustFeatures = () => {
  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] py-16 lg:py-24 relative overflow-hidden border-b border-slate-200/80">
      
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Unified Sleek Metric Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-[0_12px_40px_rgba(4,19,41,0.06)] mb-16 lg:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''}`}
              >
                <div className="flex items-baseline justify-center mb-1.5 font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
                  <span>{stat.value}</span>
                  {stat.suffix && (
                    <span className={stat.suffixColor || 'text-brand-pink'}>
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-800 text-sm sm:text-base">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header with Balanced Wrapping */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4 border border-brand-pink/15 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Built For Australian Homes</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-brand-navy tracking-tight leading-tight">
            Why Australians Choose <span className="text-brand-pink whitespace-nowrap">Local Pages</span>
          </h2>
          
          <p className="mt-3.5 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Say goodbye to waiting days for callbacks. Get direct access to licensed, reviewed, and reliable local professionals.
          </p>
        </div>

        {/* 4 Polished Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl p-7 border border-slate-200/90 shadow-[0_4px_20px_rgba(4,19,41,0.04)] hover:shadow-[0_16px_45px_rgba(7,27,58,0.08)] hover:border-brand-pink/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${feature.accent}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-navy mb-2.5 group-hover:text-brand-pink transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


