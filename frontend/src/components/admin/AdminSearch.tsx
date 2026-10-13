import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSearch: React.FC<AdminSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setInternalValue(value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(internalValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] transition-all font-medium shadow-2xs"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};
