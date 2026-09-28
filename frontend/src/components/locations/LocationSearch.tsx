'use client';
import { useState, useEffect } from 'react';
import { useLocations } from '@/hooks/use-locations';
import { useDebounce } from '@/hooks/use-debounce';

export function LocationSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: locations, isLoading, error } = useLocations(debouncedSearch);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search locations or postcodes..."
          className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading && <div className="p-4 text-center text-gray-500">Loading locations...</div>}
      {error && <div className="p-4 text-center text-red-500">Failed to load locations.</div>}
      
      {!isLoading && !error && locations && locations.length > 0 && (
        <div className="mt-4 border rounded-lg bg-white overflow-hidden shadow-sm">
          <ul className="divide-y">
            {locations.map((loc) => (
              <li key={loc.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-gray-900">{loc.name} {loc.postcode && `(${loc.postcode})`}</div>
                <div className="text-sm text-gray-500 capitalize">{loc.type}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isLoading && !error && debouncedSearch && locations?.length === 0 && (
         <div className="p-4 text-center text-gray-500">No locations found.</div>
      )}
    </div>
  );
}
