'use client';

import React, { useState } from 'react';
import { Location } from '@/types/api';
import { useLocations } from '@/hooks/use-locations';
import { useDebounce } from '@/hooks/use-debounce';
import { MapPin, Search, Check, AlertCircle } from 'lucide-react';

interface LocationPickerProps {
  locationId: number | null;
  postcode: string;
  selectedLocation: Location | null;
  onLocationChange: (location: Location | null, postcode: string) => void;
  error?: string;
}

export function LocationPicker({
  postcode,
  selectedLocation,
  onLocationChange,
  error,
}: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [manualPostcode, setManualPostcode] = useState(postcode);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: locations, isLoading } = useLocations(debouncedSearch);

  const handleSelectLocation = (loc: Location) => {
    const locPostcode = loc.postcode || manualPostcode || '';
    setManualPostcode(locPostcode);
    onLocationChange(loc, locPostcode);
    setSearchTerm('');
  };

  const handleManualPostcodeChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 10);
    setManualPostcode(cleaned);
    // If manual postcode diverges from selected location's postcode, reset locationId
    if (selectedLocation && selectedLocation.postcode && selectedLocation.postcode !== cleaned) {
      onLocationChange(null, cleaned);
    } else {
      onLocationChange(selectedLocation, cleaned);
    }
  };

  return (
    <div className="space-y-6" data-testid="location-picker">
      {/* Selected Location Pill / Card */}
      {selectedLocation ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-heading text-sm font-bold text-slate-900">
                {selectedLocation.name} {selectedLocation.postcode && `(${selectedLocation.postcode})`}
              </div>
              <div className="text-xs text-slate-500 capitalize">
                {selectedLocation.type} • Selected Service Location
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLocationChange(null, manualPostcode)}
            className="text-xs font-bold text-brand-pink hover:underline px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block font-heading text-sm font-bold text-brand-navy">
            Search Suburb or Postcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-brand-pink" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Richmond, 3121, Parramatta, 2150..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
              data-testid="location-search-input"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400">
                Searching...
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {debouncedSearch && locations && locations.length > 0 && (
            <div 
              className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100 z-10"
              data-testid="location-dropdown"
            >
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                  data-testid={`location-option-${loc.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-slate-800">{loc.name}</span>
                      {loc.postcode && (
                        <span className="ml-2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {loc.postcode}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold capitalize">
                    {loc.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {debouncedSearch && !isLoading && locations && locations.length === 0 && (
            <div className="p-3 text-xs text-slate-400 text-center bg-slate-50 rounded-xl">
              No matching Australian suburbs found. You can enter your postcode directly below.
            </div>
          )}
        </div>
      )}

      {/* Postcode Direct Field */}
      <div>
        <label htmlFor="postcode-input" className="block font-heading text-sm font-bold text-brand-navy mb-1.5">
          Australian Postcode <span className="text-brand-pink">*</span>
        </label>
        <div className="relative max-w-xs">
          <input
            id="postcode-input"
            type="text"
            value={manualPostcode}
            onChange={(e) => handleManualPostcodeChange(e.target.value)}
            placeholder="e.g. 2000"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
            data-testid="postcode-input"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          Tradies in your local postcode area will be alerted to review your job.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold" role="alert" data-testid="location-error">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
