import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LocationSearch } from '@/components/locations/LocationSearch';

export const metadata = {
  title: 'Locations | Local Pages',
  description: 'Find tradies in your local area.',
};

export default function LocationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow mx-auto max-w-7xl px-6 py-12 lg:px-8 w-full">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Find Locations</h1>
          <p className="mt-2 text-gray-600">Search for your suburb, council, or postcode to see if we operate in your area.</p>
        </div>
        
        <LocationSearch />
      </main>
      <PublicFooter />
    </div>
  );
}
