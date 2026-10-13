"use client";

import { Service } from '@/types/api';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="text-center bg-white rounded-3xl p-12 border border-slate-200/80 shadow-sm max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          🔍
        </div>
        <h3 className="text-lg font-bold text-brand-navy mb-1">No services found</h3>
        <p className="text-sm text-slate-500">Try changing your search terms or selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {services.map((service) => (
        <ServiceCard key={service.id || service.slug} service={service} />
      ))}
    </div>
  );
}
