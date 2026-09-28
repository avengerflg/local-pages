'use client';
import { useState } from 'react';
import { useLocations } from '@/hooks/use-locations';
import { useDebounce } from '@/hooks/use-debounce';

export function LocationSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: locations, isLoading, error } = useLocations(debouncedSearch, type);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            data-testid="location-search-input"
            placeholder="Search prefix or postcode..."
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          data-testid="location-type-select"
          className="p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="state">State</option>
          <option value="region">Region</option>
          <option value="council">Council</option>
          <option value="suburb">Suburb</option>
        </select>
      </div>
      
      {isLoading && <div data-testid="location-loading" className="p-4 text-center text-gray-500">Loading locations...</div>}
      {error && <div data-testid="location-error" className="p-4 text-center text-red-500">Failed to load locations.</div>}
      
      {!isLoading && !error && locations && locations.length > 0 && (
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm" data-testid="location-results">
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
         <div data-testid="location-empty" className="p-4 text-center text-gray-500">No locations found.</div>
      )}
    </div>
  );
}
