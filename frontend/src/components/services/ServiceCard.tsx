import Link from 'next/link';
import { Service } from '@/types/api';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="block border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
      {service.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{service.description}</p>
      )}
    </Link>
  );
}
