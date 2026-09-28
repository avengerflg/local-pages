'use client';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { useServices } from '@/hooks/use-services';

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow mx-auto max-w-7xl px-6 py-12 lg:px-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
          <p className="mt-2 text-gray-600">Browse our directory of available tradie services.</p>
        </div>
        
        {isLoading && <div className="text-center py-12 text-gray-500">Loading services...</div>}
        {error && <div className="text-center py-12 text-red-500">Failed to load services. Please try again later.</div>}
        {!isLoading && !error && services && <ServiceGrid services={services} />}
      </main>
      <PublicFooter />
    </div>
  );
}
