'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Power,
  Filter,
  GitBranch,
} from 'lucide-react';
import {
  useAdminLocations,
  useCreateAdminLocation,
  useUpdateAdminLocation,
  useUpdateAdminLocationStatus,
} from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';
import { AdminLocation, AdminLocationType } from '@/types/admin';

export default function AdminLocationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError, refetch } = useAdminLocations({
    page,
    per_page: 15,
    search: search || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  // Also query states and councils to populate parent selection in the modal
  const { data: statesData } = useAdminLocations({ type: 'state', per_page: 50 });
  const { data: councilsData } = useAdminLocations({ type: 'council', per_page: 50 });
  const { data: suburbsData } = useAdminLocations({ type: 'suburb', per_page: 50 });

  const createLocationMutation = useCreateAdminLocation();
  const updateLocationMutation = useUpdateAdminLocation();
  const updateStatusMutation = useUpdateAdminLocationStatus();

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | null>(null);
  const [formType, setFormType] = useState<AdminLocationType>('state');
  const [formName, setFormName] = useState('');
  const [formParentId, setFormParentId] = useState<number | ''>('');
  const [formCode, setFormCode] = useState('');
  const [formPostcode, setFormPostcode] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formError, setFormError] = useState<string | null>(null);

  // Status toggle confirmation
  const [selectedLocation, setSelectedLocation] = useState<AdminLocation | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const openCreateModal = () => {
    setEditingLocation(null);
    setFormType('state');
    setFormName('');
    setFormParentId('');
    setFormCode('');
    setFormPostcode('');
    setFormStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (loc: AdminLocation) => {
    setEditingLocation(loc);
    setFormType(loc.type);
    setFormName(loc.name);
    setFormParentId(loc.parent_id ?? '');
    setFormCode(loc.code ?? '');
    setFormPostcode(loc.postcode ?? '');
    setFormStatus(loc.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTypeChange = (newType: AdminLocationType) => {
    setFormType(newType);
    setFormParentId(''); // reset parent since expected parent type changes
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Location name is required.');
      return;
    }

    if (formType !== 'state' && !formParentId) {
      setFormError(`A ${formType} requires a parent location according to Australian geographic hierarchy.`);
      return;
    }

    try {
      if (editingLocation) {
        await updateLocationMutation.mutateAsync({
          id: editingLocation.id,
          data: {
            type: formType,
            name: formName.trim(),
            parent_id: formType === 'state' ? null : Number(formParentId),
            code: formCode.trim() || null,
            postcode: formPostcode.trim() || null,
            status: formStatus,
          },
        });
        setFeedback({
          type: 'success',
          message: `Location "${formName}" updated successfully.`,
        });
      } else {
        await createLocationMutation.mutateAsync({
          type: formType,
          name: formName.trim(),
          parent_id: formType === 'state' ? null : Number(formParentId),
          code: formCode.trim() || null,
          postcode: formPostcode.trim() || null,
          status: formStatus,
        });
        setFeedback({
          type: 'success',
          message: `Location "${formName}" created successfully.`,
        });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to save location.'
          : 'Failed to save location.';
      setFormError(errorMsg);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedLocation) return;
    const nextStatus = selectedLocation.status === 'active' ? 'inactive' : 'active';

    try {
      setFeedback(null);
      await updateStatusMutation.mutateAsync({
        id: selectedLocation.id,
        status: nextStatus,
      });
      setFeedback({
        type: 'success',
        message: `Location "${selectedLocation.name}" status updated to ${nextStatus}.`,
      });
      setSelectedLocation(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to change status.'
          : 'Failed to change status.';
      setFeedback({ type: 'error', message: errorMsg });
      setSelectedLocation(null);
    }
  };

  // Determine allowed parents for currently selected formType
  const getParentOptions = () => {
    if (formType === 'council') {
      return statesData?.data || [];
    }
    if (formType === 'suburb') {
      return councilsData?.data || [];
    }
    if (formType === 'postcode') {
      return suburbsData?.data || [];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Location Hierarchy"
        description="Manage Australian geographic regions: State → Council/Municipality → Suburb → Postcode."
        breadcrumbs={[{ label: 'Locations' }]}
        actions={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(245,43,104,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Location</span>
          </button>
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
            placeholder="Search location name, postcode, code..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="state">State</option>
              <option value="council">Council</option>
              <option value="suburb">Suburb</option>
              <option value="postcode">Postcode</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
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

      {/* Locations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading location hierarchy..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load locations"
            message="Unable to fetch location hierarchy from the API."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No locations found"
            description="No locations match your filter criteria."
            icon={MapPin}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Location Name</th>
                    <th className="px-5 py-3.5">Hierarchy Type</th>
                    <th className="px-5 py-3.5">Parent Location</th>
                    <th className="px-5 py-3.5">Code / Postcode</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((loc) => (
                    <tr
                      key={loc.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#172033]">{loc.name}</div>
                        {loc.children_count !== undefined && loc.children_count > 0 && (
                          <div className="text-[11px] text-slate-400">
                            {loc.children_count} child regions
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                          <GitBranch className="w-3 h-3 text-slate-400" />
                          <span>{loc.type}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        {loc.parent ? (
                          <div>
                            <span className="font-bold text-slate-800">{loc.parent.name}</span>
                            <span className="text-[10px] text-slate-400 ml-1 uppercase">({loc.parent.type})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None (Top Level)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-700">
                        {loc.postcode || loc.code || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={loc.status} variant={loc.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(loc)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
                            title="Edit Location"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedLocation(loc)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              loc.status === 'active'
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={loc.status === 'active' ? 'Deactivate' : 'Activate'}
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

      {/* Create / Edit Location Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B3A]/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              {editingLocation ? 'Edit Geographic Location' : 'Add Geographic Location'}
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Hierarchy Type *
                </label>
                <select
                  value={formType}
                  onChange={(e) => handleTypeChange(e.target.value as AdminLocationType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <option value="state">State (Top Level)</option>
                  <option value="council">Council / Municipality (Parent: State)</option>
                  <option value="suburb">Suburb (Parent: Council)</option>
                  <option value="postcode">Postcode (Parent: Suburb)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. New South Wales, City of Sydney, Surry Hills"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              {formType !== 'state' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Parent Location * ({formType === 'council' ? 'Must be State' : formType === 'suburb' ? 'Must be Council' : 'Must be Suburb'})
                  </label>
                  <select
                    value={formParentId}
                    onChange={(e) => setFormParentId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                    required
                  >
                    <option value="">Select parent location...</option>
                    {getParentOptions().map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Code (e.g. NSW)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="NSW"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={formPostcode}
                    onChange={(e) => setFormPostcode(e.target.value)}
                    placeholder="2010"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Status Toggle */}
      <ConfirmActionDialog
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onConfirm={handleConfirmToggle}
        title={`${
          selectedLocation?.status === 'active' ? 'Deactivate' : 'Activate'
        } "${selectedLocation?.name}"?`}
        description={
          selectedLocation?.status === 'active'
            ? `Deactivating this location will hide it from location dropdowns and tradie coverage matching.`
            : `Activating this location will make it available for matching and search filters.`
        }
        confirmText={
          selectedLocation?.status === 'active' ? 'Deactivate' : 'Activate'
        }
        intent={selectedLocation?.status === 'active' ? 'warning' : 'primary'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
