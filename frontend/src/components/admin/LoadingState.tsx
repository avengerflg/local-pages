import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-[#F52B68] animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};
