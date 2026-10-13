import Link from 'next/link';
import { 
  Droplet, Zap, Hammer, TreeDeciduous, 
  ShieldCheck, Wind, Home, PenTool, 
  Paintbrush, Grid, Sparkles, Truck,
  ArrowUpRight, ChevronRight
} from 'lucide-react';

const categories = [
  { 
    name: 'Plumbing & Gas', 
    slug: 'plumber',
    icon: Droplet, 
    color: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
    pros: '1,420+ Pros',
    popularJobs: 'Hot water, blocked drains, gas leaks'
  },
  { 
    name: 'Electrical Services', 
    slug: 'electrician',
    icon: Zap, 
    color: 'from-amber-500/10 to-yellow-500/10 text-amber-600',
    pros: '1,280+ Pros',
    popularJobs: 'Safety switches, switchboards, EV chargers'
  },
  { 
    name: 'Air Conditioning & Heating', 
    slug: 'air-conditioning',
    icon: Wind, 
    color: 'from-cyan-500/10 to-sky-500/10 text-cyan-600',
    pros: '940+ Pros',
    popularJobs: 'Ducted systems, split installs, servicing'
  },
  { 
    name: 'Roofing & Guttering', 
    slug: 'roofing',
    icon: Home, 
    color: 'from-rose-500/10 to-red-500/10 text-rose-600',
    pros: '810+ Pros',
    popularJobs: 'Leak repairs, restorations, gutter guard'
  },
  { 
    name: 'Carpentry & Joinery', 
    slug: 'carpenter',
    icon: PenTool, 
    color: 'from-orange-500/10 to-amber-500/10 text-orange-600',
    pros: '730+ Pros',
    popularJobs: 'Decks, pergolas, framing, custom shelving'
  },
  { 
    name: 'Painting & Decorating', 
    slug: 'painter',
    icon: Paintbrush, 
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600',
    pros: '1,150+ Pros',
    popularJobs: 'Interior, exterior, feature walls, spray paint'
  },
  { 
    name: 'Landscaping & Gardening', 
    slug: 'landscaper',
    icon: TreeDeciduous, 
    color: 'from-emerald-500/10 to-green-500/10 text-emerald-600',
    pros: '690+ Pros',
    popularJobs: 'Paving, turf, retaining walls, garden maintenance'
  },
  { 
    name: 'Handyman & Home Repairs', 
    slug: 'handyman',
    icon: Hammer, 
    color: 'from-slate-500/10 to-gray-500/10 text-slate-700',
    pros: '1,560+ Pros',
    popularJobs: 'Doors, plaster repairs, assembly, general odd jobs'
  },
  { 
    name: 'Tiling & Waterproofing', 
    slug: 'tiler',
    icon: Grid, 
    color: 'from-indigo-500/10 to-blue-500/10 text-indigo-600',
    pros: '540+ Pros',
    popularJobs: 'Bathrooms, splashbacks, balcony tiling'
  },
  { 
    name: 'House & Commercial Cleaning', 
    slug: 'cleaner',
    icon: Sparkles, 
    color: 'from-teal-500/10 to-emerald-500/10 text-teal-600',
    pros: '1,890+ Pros',
    popularJobs: 'Bond cleaning, deep clean, pressure washing'
  },
  { 
    name: 'Fencing & Gates', 
    slug: 'fencing',
    icon: ShieldCheck, 
    color: 'from-amber-500/10 to-rose-500/10 text-amber-700',
    pros: '620+ Pros',
    popularJobs: 'Colorbond, timber paling, pool glass fences'
  },
  { 
    name: 'Rubbish & Waste Removal', 
    slug: 'rubbish-removal',
    icon: Truck, 
    color: 'from-red-500/10 to-orange-500/10 text-red-600',
    pros: '780+ Pros',
    popularJobs: 'Deceased estate, green waste, site cleanups'
  },
];

export const PopularJobs = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#F8FAFC] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-3">
              Comprehensive Trade Directory
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-navy leading-tight">
              Popular Trade <span className="text-brand-pink">Categories</span>
            </h2>
            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Browse licensed and verified professionals across Australia’s most in-demand home and commercial trades.
            </p>
          </div>

          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-brand-pink font-bold text-sm sm:text-base hover:text-brand-pink-dark transition-colors group shrink-0"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={idx} 
                href={`/services?category=${cat.slug}`}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-[0_12px_32px_rgba(4,19,41,0.08)] hover:border-brand-pink/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 group-hover:bg-brand-pink/10 group-hover:text-brand-pink px-2.5 py-1 rounded-full transition-colors">
                      {cat.pros}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-brand-navy group-hover:text-brand-pink transition-colors mb-1.5 flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand-pink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.popularJobs}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-blue group-hover:text-brand-pink transition-colors">
                  <span>Browse local tradies</span>
                  <span className="font-bold">→</span>
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

