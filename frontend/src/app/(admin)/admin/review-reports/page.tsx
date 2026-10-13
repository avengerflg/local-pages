'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Star,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import {
  useAdminReviewReports,
  useResolveAdminReviewReport,
} from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';
import { AdminReviewReport } from '@/types/admin';

export default function AdminReviewReportsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'resolved'>('pending');

  const { data, isLoading, isError, refetch } = useAdminReviewReports({
    page,
    per_page: 15,
    status: statusFilter,
  });

  const resolveMutation = useResolveAdminReviewReport();

  const [selectedReport, setSelectedReport] = useState<AdminReviewReport | null>(null);
  const [pendingResolution, setPendingResolution] = useState<'dismiss' | 'uphold' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleResolutionClick = (report: AdminReviewReport, resolution: 'dismiss' | 'uphold') => {
    setSelectedReport(report);
    setPendingResolution(resolution);
  };

  const handleConfirmResolution = async () => {
    if (!selectedReport || !pendingResolution) return;

    try {
      setFeedback(null);
      await resolveMutation.mutateAsync({
        id: selectedReport.id,
        resolution: pendingResolution,
      });

      setFeedback({
        type: 'success',
        message:
          pendingResolution === 'uphold'
            ? `Report #${selectedReport.id} upheld. The reported review has been rejected and removed.`
            : `Report #${selectedReport.id} dismissed. The original review remains published.`,
      });
      setSelectedReport(null);
      setPendingResolution(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to resolve report.'
          : 'Failed to resolve report.';
      setFeedback({ type: 'error', message: errorMsg });
      setSelectedReport(null);
      setPendingResolution(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Review Reports & Disputes"
        description="Mediate complaints against reviews submitted by tradies or consumers."
        breadcrumbs={[{ label: 'Review Reports' }]}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setStatusFilter('pending');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-[#071B3A] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Pending Disputes
        </button>

        <button
          onClick={() => {
            setStatusFilter('resolved');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusFilter === 'resolved'
              ? 'bg-[#071B3A] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Resolved Archive
        </button>
      </div>

      {/* Reports Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading review reports..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load review reports"
            message="Unable to fetch dispute reports from the API."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title={
              statusFilter === 'pending'
                ? 'No pending review disputes'
                : 'No resolved reports in archive'
            }
            description={
              statusFilter === 'pending'
                ? 'All review complaints have been investigated and resolved.'
                : 'Resolved dispute logs will appear here.'
            }
            icon={Scale}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.data.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-4 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">
                      Report #{report.id}
                    </span>
                    <StatusBadge status={report.status} variant={report.status} />
                    <span className="text-xs text-slate-400">
                      Filed on{' '}
                      {report.created_at
                        ? new Date(report.created_at).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>

                  {/* Complaint Reason */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                    <div className="font-bold text-amber-900 uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Report Reason / Violation Claim</span>
                    </div>
                    <div className="text-amber-950 font-medium leading-relaxed">
                      {report.reason}
                    </div>
                  </div>

                  {/* Associated Review Details */}
                  {report.review && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">
                            Subject Review #{report.review_id}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {report.review.rating} / 5
                          </span>
                        </div>
                        <StatusBadge
                          status={report.review.moderation_status}
                        />
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        &ldquo;{report.review.review_text}&rdquo;
                      </p>
                      {report.review.tradieProfile && (
                        <div className="text-[11px] text-slate-500">
                          Reviewed Tradie:{' '}
                          <strong className="text-slate-800">
                            {report.review.tradieProfile.business_name}
                          </strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reporter and Resolver Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reporter:</span>
                      <strong className="text-slate-800">
                        {report.reporter?.name || `User #${report.reporter_id}`}
                      </strong>
                    </div>

                    {report.resolved_at && (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Resolved by:</span>
                        <strong>
                          {report.resolver?.name || `Admin #${report.resolved_by}`}
                        </strong>
                        <span>on {new Date(report.resolved_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolution Controls for Pending Reports */}
                {report.status === 'pending' && (
                  <div className="flex items-center md:flex-col gap-2.5 shrink-0">
                    <button
                      type="button"
                      disabled={resolveMutation.isPending}
                      onClick={() => handleResolutionClick(report, 'uphold')}
                      className="flex-1 md:w-36 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                      title="Uphold dispute & reject review"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Uphold (Reject Review)</span>
                    </button>

                    <button
                      type="button"
                      disabled={resolveMutation.isPending}
                      onClick={() => handleResolutionClick(report, 'dismiss')}
                      className="flex-1 md:w-36 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      title="Dismiss report & retain review"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dismiss Report</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            <AdminPagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              perPage={data.meta.per_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Resolution */}
      <ConfirmActionDialog
        isOpen={!!selectedReport && !!pendingResolution}
        onClose={() => {
          setSelectedReport(null);
          setPendingResolution(null);
        }}
        onConfirm={handleConfirmResolution}
        title={
          pendingResolution === 'uphold'
            ? `Uphold Dispute for Report #${selectedReport?.id}?`
            : `Dismiss Dispute for Report #${selectedReport?.id}?`
        }
        description={
          pendingResolution === 'uphold'
            ? `Upholding this dispute will mark the report as resolved AND immediately reject/remove the associated customer review #${selectedReport?.review_id} from public listings.`
            : `Dismissing this dispute will close the report without making any changes to the associated review. The review will remain published.`
        }
        confirmText={
          pendingResolution === 'uphold'
            ? 'Uphold & Remove Review'
            : 'Dismiss Report'
        }
        intent={pendingResolution === 'uphold' ? 'danger' : 'primary'}
        isLoading={resolveMutation.isPending}
      />
    </div>
  );
}
