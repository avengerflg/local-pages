'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useAdminUser, useUpdateAdminUserStatus } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { ErrorState } from '@/components/admin/ErrorState';
import { AdminUserStatus } from '@/types/admin';

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = Number(params.id);

  const { data: user, isLoading, isError, refetch } = useAdminUser(userId);
  const updateStatusMutation = useUpdateAdminUserStatus();

  const [pendingStatus, setPendingStatus] = useState<AdminUserStatus | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleStatusClick = (newStatus: AdminUserStatus) => {
    if (newStatus === user?.status) return;
    setPendingStatus(newStatus);
  };

  const handleConfirmStatus = async () => {
    if (!pendingStatus || !user) return;

    try {
      setFeedback(null);
      await updateStatusMutation.mutateAsync({
        id: user.id,
        status: pendingStatus,
      });
      setFeedback({
        type: 'success',
        message: `User status successfully changed to ${pendingStatus}.`,
      });
      setPendingStatus(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to update user status.'
          : 'Failed to update user status.';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      setPendingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="User Profile"
          breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Loading...' }]}
        />
        <LoadingState message="Loading user details..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="User Not Found"
          breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Not Found' }]}
        />
        <ErrorState
          title="User profile could not be loaded"
          message="The user record was not found or an error occurred."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={user.name}
        description={`User ID #${user.id} — Registered account details & permissions.`}
        breadcrumbs={[
          { label: 'Users', href: '/admin/users' },
          { label: user.name },
        ]}
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Identity Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#071B3A] text-white flex items-center justify-center font-bold text-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172033]">{user.name}</h3>
                  <p className="text-xs text-[#64748B]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={user.role} variant={user.role} />
                <StatusBadge status={user.status} variant={user.status} />
              </div>
            </div>

            {/* Profile Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Mobile Number
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {user.mobile || 'None provided'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Registration Date
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Email Verification
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {user.email_verified_at ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified (
                      {new Date(user.email_verified_at).toLocaleDateString()})
                    </span>
                  ) : (
                    <span className="text-amber-600">Unverified</span>
                  )}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Phone Verification
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {user.phone_verified_at ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-slate-400">Unverified</span>
                  )}
                </span>
              </div>
            </div>

            {/* Customer Profile Details if present */}
            {user.customer_profile && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Customer Profile
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Postcode:</span>{' '}
                    <strong className="text-slate-800">
                      {user.customer_profile.postcode || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Address:</span>{' '}
                    <strong className="text-slate-800">
                      {user.customer_profile.address || '—'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tradie Profile Details if present */}
            {user.tradie_profile && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Associated Tradie Business Profile
                  </h4>
                  <Link
                    href={`/admin/tradies/${user.tradie_profile.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F52B68] hover:underline"
                  >
                    <span>View Tradie File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Business Name:</span>{' '}
                    <strong className="text-slate-800">
                      {user.tradie_profile.business_name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ABN:</span>{' '}
                    <strong className="text-slate-800">
                      {user.tradie_profile.abn || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Verification:</span>{' '}
                    <StatusBadge
                      status={user.tradie_profile.verification_status}
                      variant={user.tradie_profile.verification_status}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Account Status Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              Account Status Controls
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Admins can activate, suspend, or put user accounts on pending hold. Suspended users cannot log in or participate in marketplace transactions.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={user.status === 'active' || updateStatusMutation.isPending}
                onClick={() => handleStatusClick('active')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  user.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Set to Active</span>
              </button>

              <button
                type="button"
                disabled={user.status === 'pending' || updateStatusMutation.isPending}
                onClick={() => handleStatusClick('pending')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  user.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-default opacity-80'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Set to Pending</span>
              </button>

              <button
                type="button"
                disabled={user.status === 'suspended' || updateStatusMutation.isPending}
                onClick={() => handleStatusClick('suspended')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  user.status === 'suspended'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 cursor-default opacity-80'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Suspend Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={!!pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={handleConfirmStatus}
        title={`Change User Status to ${pendingStatus?.toUpperCase()}?`}
        description={
          pendingStatus === 'suspended'
            ? `Are you sure you want to suspend ${user.name}? This will immediately revoke their active session and prevent further marketplace participation.`
            : `Are you sure you want to change ${user.name}'s account status to ${pendingStatus}?`
        }
        confirmText={`Confirm ${pendingStatus}`}
        intent={pendingStatus === 'suspended' ? 'danger' : 'primary'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
