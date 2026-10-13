'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Briefcase, FileText, Filter } from 'lucide-react';
import { useAdminTradies } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';

export default function AdminTradiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isError, refetch } = useAdminTradies({
    page,
    per_page: 15,
    search: search || undefined,
    verification_status: verificationStatus || undefined,
    status: status || undefined,
  });

  const handleSearchChange = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tradie Management"
        description="Verify business credentials, ABN records, and review tradie accounts."
        breadcrumbs={[{ label: 'Tradies' }]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <AdminSearch
            value={search}
            onChange={handleSearchChange}
            placeholder="Search business name, phone, ABN..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={verificationStatus}
              onChange={(e) => {
                setVerificationStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
              aria-label="Filter by verification status"
            >
              <option value="">All Verification Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
            aria-label="Filter by user status"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Tradies Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading tradie accounts..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load tradies"
            message="Unable to fetch tradie accounts from the API."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No tradies match your criteria"
            description="Try adjusting your filters or search keywords."
            icon={Briefcase}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Business & Contact</th>
                    <th className="px-5 py-3.5">ABN</th>
                    <th className="px-5 py-3.5">Verification</th>
                    <th className="px-5 py-3.5">User Status</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((tradie) => (
                    <tr
                      key={tradie.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#172033]">
                          {tradie.business_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {tradie.email || tradie.user?.email || '—'}
                          {tradie.phone && ` • ${tradie.phone}`}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-700">
                        {tradie.abn || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={tradie.verification_status}
                          variant={tradie.verification_status}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={tradie.user?.status || 'active'}
                        />
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        {[tradie.suburb, tradie.state, tradie.postcode]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/tradies/${tradie.id}/documents`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                            title="Review documents"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Docs</span>
                          </Link>
                          <Link
                            href={`/admin/tradies/${tradie.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                            title="View tradie details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              perPage={data.meta.per_page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
