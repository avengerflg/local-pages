import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  lastPage: number;
  total?: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className = '',
}) => {
  if (lastPage <= 1 && (!total || total <= (perPage || 15))) {
    return null;
  }

  const startItem = total !== undefined && perPage ? Math.min((currentPage - 1) * perPage + 1, total) : null;
  const endItem = total !== undefined && perPage ? Math.min(currentPage * perPage, total) : null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-500 ${className}`}
    >
      <div>
        {total !== undefined && startItem !== null && endItem !== null ? (
          <span>
            Showing <strong className="text-slate-800">{startItem}</strong> to{' '}
            <strong className="text-slate-800">{endItem}</strong> of{' '}
            <strong className="text-slate-800">{total}</strong> results
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{lastPage}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="px-3 py-1.5 font-bold text-slate-700">
          {currentPage} / {lastPage}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
