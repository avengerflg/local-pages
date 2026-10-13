"use client";

import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Paintbrush, 
  HardHat, 
  Trees, 
  Bug, 
  Key, 
  Home, 
  ArrowRight, 
  Clock,
  LucideIcon
} from 'lucide-react';
import { Service } from '@/types/api';

// Curated metadata for every trade service to ensure top-tier visual presentation
const serviceMetaMap: Record<string, {
  icon: LucideIcon;
  category: string;
  badge: string;
  accent: string;
  iconBg: string;
  chips: string[];
  eta: string;
  rating: string;
}> = {
  plumber: {
    icon: Wrench,
    category: 'Emergency & Maintenance',
    badge: '1,420+ Pros',
    accent: 'text-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    chips: ['Blocked Drains', 'Hot Water Units', 'Gas Leaks', 'Burst Pipes'],
    eta: '15–20 min callout',
    rating: '4.9 ★',
  },
  electrician: {
    icon: Zap,
    category: 'Emergency & Safety',
    badge: '1,280+ Pros',
    accent: 'text-amber-600',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    chips: ['Switchboard Upgrades', 'Tripping Power', 'Safety Switches', 'Solar'],
    eta: '15–20 min callout',
    rating: '4.9 ★',
  },
  cleaner: {
    icon: Sparkles,
    category: 'Home & Commercial',
    badge: '1,850+ Pros',
    accent: 'text-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    chips: ['End of Lease', 'Deep Home Cleaning', 'Carpet Steam', 'Window Wash'],
    eta: 'Same-day available',
    rating: '4.8 ★',
  },
  painter: {
    icon: Paintbrush,
    category: 'Renovation & Finishes',
    badge: '960+ Pros',
    accent: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
    chips: ['Interior Walls', 'Exterior Facades', 'Deck Staining', 'Roofs'],
    eta: 'Fast free quote',
    rating: '4.9 ★',
  },
  concreting: {
    icon: HardHat,
    category: 'Building & Structural',
    badge: '640+ Pros',
    accent: 'text-orange-600',
    iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
    chips: ['Driveways', 'Exposed Aggregate', 'Slabs & Footings', 'Patios'],
    eta: 'Site measure in 24h',
    rating: '4.8 ★',
  },
  landscaping: {
    icon: Trees,
    category: 'Outdoor & Gardens',
    badge: '810+ Pros',
    accent: 'text-teal-600',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
    chips: ['Turf & Lawn', 'Retaining Walls', 'Paving & Paths', 'Garden Design'],
    eta: 'Free onsite quotes',
    rating: '4.9 ★',
  },
  'pest-control': {
    icon: Bug,
    category: 'Health & Safety',
    badge: '520+ Pros',
    accent: 'text-rose-600',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
    chips: ['Termite Inspections', 'Barrier Treatments', 'Rodents', 'Cockroaches'],
    eta: 'Priority dispatch',
    rating: '4.9 ★',
  },
  locksmith: {
    icon: Key,
    category: '24/7 Security',
    badge: '680+ Pros',
    accent: 'text-pink-600',
    iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
    chips: ['House Lockouts', 'Car Keys', 'Rekeying & Deadbolts', 'Smart Locks'],
    eta: '15–25 min callout',
    rating: '4.9 ★',
  },
  roofing: {
    icon: Home,
    category: 'Storm & Protection',
    badge: '740+ Pros',
    accent: 'text-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    chips: ['Storm Leaks', 'Tile Replacement', 'Gutter Restorations', 'Colorbond'],
    eta: 'Urgent tarping',
    rating: '4.8 ★',
  },
};

export function ServiceCard({ service }: { service: Service }) {
  const meta = serviceMetaMap[service.slug] || {
    icon: Wrench,
    category: 'Licensed Trade',
    badge: 'Verified Pros',
    accent: 'text-brand-pink',
    iconBg: 'bg-rose-50 text-brand-pink border-rose-100',
    chips: ['Repairs & Installs', 'Emergency Callouts', 'Free Quotes'],
    eta: 'Quick response',
    rating: '4.9 ★',
  };

  const Icon = meta.icon;

  return (
    <Link 
      href={`/services/${service.slug}`}
      className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_rgba(4,19,41,0.04)] hover:shadow-[0_20px_45px_rgba(7,27,58,0.09)] hover:border-brand-pink/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Icon + Category Badge */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${meta.iconBg}`}>
            <Icon className="w-6 h-6" strokeWidth={2.2} />
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700">
              {meta.badge}
            </span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {meta.rating}
            </span>
          </div>
        </div>

        {/* Category Pill */}
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
          {meta.category}
        </div>

        {/* Service Name */}
        <h3 className="font-heading text-xl font-bold text-brand-navy group-hover:text-brand-pink transition-colors leading-tight mb-2 flex items-center justify-between">
          <span>{service.name}</span>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-pink group-hover:translate-x-1 transition-all" />
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
          {service.description || `Connect with pre-screened and certified ${service.name.toLowerCase()} specialists across Australia.`}
        </p>

        {/* Popular Tags / Sub-services */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {meta.chips.map((chip, i) => (
            <span 
              key={i}
              className="text-[11px] font-medium text-slate-600 bg-slate-100/80 group-hover:bg-brand-pink/10 group-hover:text-brand-pink px-2.5 py-1 rounded-lg transition-colors"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer: ETA + CTA */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{meta.eta}</span>
        </div>

        <span className="font-bold text-brand-pink group-hover:underline flex items-center gap-1">
          <span>Find Tradies</span>
          <span className="text-sm">→</span>
        </span>
      </div>

    </Link>
  );
}
