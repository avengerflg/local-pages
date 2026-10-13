import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 font-medium ${className}`}>
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-[#071B3A] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Admin</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#071B3A] transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
