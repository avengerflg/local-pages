import React from 'react';
import { AdminBreadcrumbs, BreadcrumbItem } from './AdminBreadcrumbs';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className = 'mb-6',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AdminBreadcrumbs items={breadcrumbs} className="mb-2" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[#64748B] max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
