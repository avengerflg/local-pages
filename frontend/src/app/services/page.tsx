'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  PhoneCall, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { useServices } from '@/hooks/use-services';
import { Service } from '@/types/api';

const defaultServices: Service[] = [
  { id: 1, name: 'Plumber', slug: 'plumber', description: 'Licensed and professional plumbing, burst pipe repairs, gas fitting and hot water services.', status: 'active' },
  { id: 2, name: 'Electrician', slug: 'electrician', description: 'Certified electrical repairs, power hazard troubleshooting, switchboards and safety audits.', status: 'active' },
  { id: 3, name: 'Cleaner', slug: 'cleaner', description: 'Domestic and commercial deep cleaning, sanitisation, and end-of-lease bond back cleans.', status: 'active' },
  { id: 4, name: 'Painter', slug: 'painter', description: 'Interior and exterior house painting, timber staining, roof coatings and plaster finishing.', status: 'active' },
  { id: 5, name: 'Concreting', slug: 'concreting', description: 'High quality driveways, exposed aggregate, house slabs, pathways and concrete resurfacing.', status: 'active' },
  { id: 6, name: 'Landscaping', slug: 'landscaping', description: 'Complete garden design, turf laying, retaining walls, paving and outdoor property maintenance.', status: 'active' },
  { id: 7, name: 'Pest Control', slug: 'pest-control', description: 'Eco-friendly termite inspections, barrier treatments, bug and rodent management solutions.', status: 'active' },
  { id: 8, name: 'Locksmith', slug: 'locksmith', description: '24hr emergency home and vehicle lockouts, key duplication, deadbolt repairs and security rekeying.', status: 'active' },
  { id: 9, name: 'Roofing & Guttering', slug: 'roofing', description: 'Storm damage leak repairs, roof restorations, tile replacement and gutter guard installation.', status: 'active' },
];

const categoryFilters = [
  { id: 'all', label: 'All Services' },
  { id: 'emergency', label: '🚨 Emergency 24/7' },
  { id: 'home', label: '🏡 Home Maintenance' },
  { id: 'building', label: '🏗️ Building & Renovation' },
  { id: 'outdoor', label: '🌿 Outdoor & Garden' },
];

export default function ServicesPage() {
  const { data: apiServices, isLoading } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Consolidate API services with defaults so the directory is always rich and reliable
  const servicesList: Service[] = useMemo(() => {
    if (apiServices && apiServices.length > 0) {
      // Create a map by slug to ensure all full fields exist
      const map = new Map<string, Service>();
      defaultServices.forEach(s => map.set(s.slug, s));
      apiServices.forEach(s => map.set(s.slug, { ...map.get(s.slug), ...s }));
      return Array.from(map.values());
    }
    return defaultServices;
  }, [apiServices]);

  // Filter based on search query and category
  const filteredServices = useMemo(() => {
    return servicesList.filter((service) => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'emergency') {
        return ['plumber', 'electrician', 'locksmith', 'roofing'].includes(service.slug);
      }
      if (activeCategory === 'home') {
        return ['cleaner', 'painter', 'plumber', 'electrician', 'pest-control'].includes(service.slug);
      }
      if (activeCategory === 'building') {
        return ['concreting', 'painter', 'roofing'].includes(service.slug);
      }
      if (activeCategory === 'outdoor') {
        return ['landscaping', 'concreting', 'roofing', 'pest-control'].includes(service.slug);
      }

      return true;
    });
  }, [servicesList, searchTerm, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <UtilityBar />
      <PublicHeader />

      <main className="flex-grow">
        
        {/* Hero Header Section */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-12 pb-16 border-b border-slate-200/80">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/15 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Australian Trade Directory</span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
                Find Trusted Local <span className="text-brand-pink whitespace-nowrap">Trades Fast</span>
              </h1>
              
              <p className="mt-3.5 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Connect directly with licensed, police-checked and customer-reviewed trade specialists ready for callouts across all Australian suburbs.
              </p>
            </div>

            {/* Search and Category Filter Console */}
            <div className="max-w-3xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-5">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5 text-brand-navy" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by trade or service (e.g. Plumber, Electrician, Concreting...)"
                  className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_rgba(4,19,41,0.06)] text-sm sm:text-base font-bold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-brand-pink"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                      activeCategory === cat.id
                        ? 'bg-brand-navy text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:border-brand-pink/40 hover:text-brand-pink shadow-sm'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy">
                  Available Specialties
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Showing {filteredServices.length} licensed trade categories
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% License Audited</span>
              </div>
            </div>

            {/* Grid */}
            {isLoading && !apiServices ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Loading trade services...
              </div>
            ) : (
              <ServiceGrid services={filteredServices} />
            )}

          </div>
        </section>

        {/* 24/7 Urgent Dispatch Banner */}
        <section className="pb-16 lg:pb-24">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#071731] border border-slate-700/60 p-8 sm:p-10 shadow-[0_20px_50px_rgba(4,19,41,0.2)] text-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Emergency Priority Response</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    Need an Emergency Tradie Right Now?
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 max-w-xl">
                    Immediate phone dispatch for burst pipes, complete blackouts, storm leaks & urgent lockouts.
                  </p>
                </div>

                <a
                  href="tel:1300000000"
                  className="inline-flex items-center justify-center gap-2.5 bg-brand-pink hover:bg-brand-pink-bright text-white font-heading font-extrabold text-base py-3.5 px-7 rounded-2xl transition-all shadow-[0_8px_25px_rgba(245,43,104,0.4)] active:scale-95 shrink-0"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Call 1300 000 000</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
