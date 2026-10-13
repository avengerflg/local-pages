import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SubStat {
  label: string;
  value: number | string;
  color?: string;
}

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subStats?: SubStat[];
  badge?: {
    text: string;
    variant?: 'positive' | 'warning' | 'neutral';
  };
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon: Icon,
  subStats,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-[#64748B]">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            {value}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#071B3A]/5 text-[#071B3A] flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-[#071B3A]" />
        </div>
      </div>

      {badge && (
        <div className="mt-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              badge.variant === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : badge.variant === 'positive'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {badge.text}
          </span>
        </div>
      )}

      {subStats && subStats.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          {subStats.map((sub, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-slate-500 truncate mr-1">{sub.label}:</span>
              <span className={`font-bold ${sub.color || 'text-slate-800'}`}>
                {sub.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
