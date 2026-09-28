import { Service } from '@/types/api';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <div className="text-center text-gray-500 py-12">No services found.</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
