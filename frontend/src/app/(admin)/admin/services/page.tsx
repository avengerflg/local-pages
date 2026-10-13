'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Power, Layers, Filter } from 'lucide-react';
import { useAdminServices, useUpdateAdminServiceStatus } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';
import { AdminService } from '@/types/admin';

export default function AdminServicesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isError, refetch } = useAdminServices({
    page,
    per_page: 15,
    search: search || undefined,
    status: status || undefined,
  });

  const updateStatusMutation = useUpdateAdminServiceStatus();
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleToggleStatus = (service: AdminService) => {
    setSelectedService(service);
  };

  const handleConfirmToggle = async () => {
    if (!selectedService) return;
    const nextStatus = selectedService.status === 'active' ? 'inactive' : 'active';

    try {
      setFeedback(null);
      await updateStatusMutation.mutateAsync({
        id: selectedService.id,
        status: nextStatus,
      });
      setFeedback({
        type: 'success',
        message: `Service "${selectedService.name}" is now ${nextStatus}.`,
      });
      setSelectedService(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to update service status.'
          : 'Failed to update service status.';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      setSelectedService(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services Catalog"
        description="Configure trades, customer intake questions, and active service offerings."
        breadcrumbs={[{ label: 'Services' }]}
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(245,43,104,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Service</span>
          </Link>
        }
      />

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <AdminSearch
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search service name, slug..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading services catalog..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load services"
            message="Unable to fetch services from the API."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No services found"
            description="No trade services match your filters. Create a new service or adjust criteria."
            icon={Layers}
            action={
              <Link
                href="/admin/services/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F52B68] text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Create Service</span>
              </Link>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Service Name</th>
                    <th className="px-5 py-3.5">Slug</th>
                    <th className="px-5 py-3.5">Description</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Questions</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="font-bold text-[#172033] hover:text-[#F52B68] transition-colors"
                        >
                          {service.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {service.slug}
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs max-w-sm truncate">
                        {service.description || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={service.status}
                          variant={service.status}
                        />
                      </td>
                      <td className="px-5 py-4 text-slate-700 text-xs font-semibold">
                        {service.questions_count ?? (service.questions ? service.questions.length : 0)} questions
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/services/${service.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                            title="Edit Service & Questions"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(service)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              service.status === 'active'
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={
                              service.status === 'active'
                                ? 'Deactivate service'
                                : 'Activate service'
                            }
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
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

      {/* Confirmation Dialog for Status Toggle */}
      <ConfirmActionDialog
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onConfirm={handleConfirmToggle}
        title={`${
          selectedService?.status === 'active' ? 'Deactivate' : 'Activate'
        } "${selectedService?.name}"?`}
        description={
          selectedService?.status === 'active'
            ? `Deactivating this service will hide it from the customer service directory and quote intake flow.`
            : `Activating this service will make it available to homeowners and listed on the marketplace.`
        }
        confirmText={
          selectedService?.status === 'active' ? 'Deactivate' : 'Activate'
        }
        intent={selectedService?.status === 'active' ? 'warning' : 'primary'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
