'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAdminTradie, useUpdateAdminTradieVerification } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { ErrorState } from '@/components/admin/ErrorState';
import { TradieVerificationStatus } from '@/types/admin';

export default function AdminTradieDetailPage() {
  const params = useParams();
  const tradieId = Number(params.id);

  const { data: tradie, isLoading, isError, refetch } = useAdminTradie(tradieId);
  const updateVerificationMutation = useUpdateAdminTradieVerification();

  const [pendingVerification, setPendingVerification] = useState<TradieVerificationStatus | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleVerificationClick = (status: TradieVerificationStatus) => {
    if (status === tradie?.verification_status) return;
    setPendingVerification(status);
  };

  const handleConfirmVerification = async () => {
    if (!pendingVerification || !tradie) return;

    try {
      setFeedback(null);
      await updateVerificationMutation.mutateAsync({
        id: tradie.id,
        verification_status: pendingVerification,
      });
      setFeedback({
        type: 'success',
        message: `Tradie verification status successfully updated to ${pendingVerification.replace('_', ' ')}.`,
      });
      setPendingVerification(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to update verification status.'
          : 'Failed to update verification status.';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      setPendingVerification(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Tradie Profile"
          breadcrumbs={[{ label: 'Tradies', href: '/admin/tradies' }, { label: 'Loading...' }]}
        />
        <LoadingState message="Loading tradie profile..." />
      </div>
    );
  }

  if (isError || !tradie) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Tradie Not Found"
          breadcrumbs={[{ label: 'Tradies', href: '/admin/tradies' }, { label: 'Not Found' }]}
        />
        <ErrorState
          title="Tradie record could not be loaded"
          message="Could not find the requested tradie profile."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={tradie.business_name}
        description={`Tradie Profile #${tradie.id} • ABN: ${tradie.abn || 'Not provided'}`}
        breadcrumbs={[
          { label: 'Tradies', href: '/admin/tradies' },
          { label: tradie.business_name },
        ]}
        actions={
          <Link
            href={`/admin/tradies/${tradie.id}/documents`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071B3A] hover:bg-[#0B2342] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Review Documents ({tradie.documents_count ?? 0})</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business Details & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#071B3A]/5 text-[#071B3A] flex items-center justify-center font-bold text-lg">
                  <Briefcase className="w-6 h-6 text-[#071B3A]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172033]">
                    {tradie.business_name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    User Account: {tradie.user?.name || 'N/A'} (ID #{tradie.user_id})
                  </p>
                </div>
              </div>
              <StatusBadge
                status={tradie.verification_status}
                variant={tradie.verification_status}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Australian Business Number (ABN)
                </span>
                <span className="font-mono font-bold text-slate-800 mt-1 block">
                  {tradie.abn || 'Not registered'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Business Phone
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {tradie.phone || '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Business Email
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {tradie.email || '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Business Website
                </span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {tradie.website ? (
                    <a
                      href={tradie.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F52B68] hover:underline"
                    >
                      {tradie.website}
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  Address & Region
                </span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {[tradie.address, tradie.suburb, tradie.state, tradie.postcode]
                    .filter(Boolean)
                    .join(', ') || 'No physical address recorded'}
                </span>
              </div>

              {tradie.verified_at && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 sm:col-span-2">
                  <span className="text-emerald-700 font-semibold block text-[11px] uppercase">
                    Verification Confirmed At
                  </span>
                  <span className="font-bold text-emerald-900 mt-1 block">
                    {new Date(tradie.verified_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Associated Services */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              Associated Services Offered ({tradie.services?.length ?? 0})
            </h3>
            {!tradie.services || tradie.services.length === 0 ? (
              <p className="text-xs text-slate-500">
                This tradie has not attached any trade services to their profile yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tradie.services.map((svc) => (
                  <span
                    key={svc.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    {svc.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Service Areas */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              Coverage & Service Areas ({tradie.service_areas?.length ?? 0})
            </h3>
            {!tradie.service_areas || tradie.service_areas.length === 0 ? (
              <p className="text-xs text-slate-500">
                No specific service areas or postcodes linked.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tradie.service_areas.map((area) => (
                  <div
                    key={area.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <div className="font-bold text-slate-800">{area.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">
                      {area.type} {area.postcode && `• ${area.postcode}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification Workflow Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              Verification Controls
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Transition the tradie through the verified onboarding lifecycle. Verified tradies are displayed in search results and receive service request leads.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">
                Current Status
              </span>
              <StatusBadge
                status={tradie.verification_status}
                variant={tradie.verification_status}
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={tradie.verification_status === 'verified' || updateVerificationMutation.isPending}
                onClick={() => handleVerificationClick('verified')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tradie.verification_status === 'verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Approve Tradie</span>
              </button>

              <button
                type="button"
                disabled={tradie.verification_status === 'under_review' || updateVerificationMutation.isPending}
                onClick={() => handleVerificationClick('under_review')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tradie.verification_status === 'under_review'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default opacity-80'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Mark Under Review</span>
              </button>

              <button
                type="button"
                disabled={tradie.verification_status === 'pending' || updateVerificationMutation.isPending}
                onClick={() => handleVerificationClick('pending')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tradie.verification_status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-default opacity-80'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Reset to Pending</span>
              </button>

              <button
                type="button"
                disabled={tradie.verification_status === 'rejected' || updateVerificationMutation.isPending}
                onClick={() => handleVerificationClick('rejected')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tradie.verification_status === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 cursor-default opacity-80'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>

          {/* Quick link to associated User account */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Platform User Account
            </h4>
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-800">{tradie.user?.name}</div>
              <div className="text-slate-500">{tradie.user?.email}</div>
              <div className="pt-2">
                <Link
                  href={`/admin/users/${tradie.user_id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#F52B68] hover:underline"
                >
                  <span>Manage User Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={!!pendingVerification}
        onClose={() => setPendingVerification(null)}
        onConfirm={handleConfirmVerification}
        title={`Change Verification to ${pendingVerification?.replace('_', ' ').toUpperCase()}?`}
        description={
          pendingVerification === 'verified'
            ? `Are you sure you want to approve and verify ${tradie.business_name}? They will be marked as verified and can receive client requests.`
            : pendingVerification === 'rejected'
            ? `Are you sure you want to reject verification for ${tradie.business_name}?`
            : `Are you sure you want to set status to ${pendingVerification}?`
        }
        confirmText={`Confirm ${pendingVerification?.replace('_', ' ')}`}
        intent={
          pendingVerification === 'rejected'
            ? 'danger'
            : pendingVerification === 'verified'
            ? 'primary'
            : 'warning'
        }
        isLoading={updateVerificationMutation.isPending}
      />
    </div>
  );
}
