import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'verified'
  | 'approved'
  | 'resolved'
  | 'pending'
  | 'under_review'
  | 'suspended'
  | 'rejected'
  | 'inactive'
  | 'dismiss'
  | 'uphold'
  | 'customer'
  | 'tradie'
  | 'admin';

interface StatusBadgeProps {
  status: string | null | undefined;
  variant?: BadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className = '',
}) => {
  if (!status) return null;

  const normalized = (variant || status).toLowerCase().replace(/\s+/g, '_');

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (normalized) {
    case 'active':
    case 'verified':
    case 'approved':
    case 'resolved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'pending':
    case 'under_review':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'suspended':
    case 'rejected':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'inactive':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'admin':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'tradie':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'customer':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  // Format label nicely
  const label = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
};
