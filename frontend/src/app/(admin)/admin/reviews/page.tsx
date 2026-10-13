'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Briefcase,
} from 'lucide-react';
import {
  useAdminPendingReviews,
  useApproveAdminReview,
  useRejectAdminReview,
} from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';
import { AdminReview } from '@/types/admin';

export default function AdminReviewsModerationPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAdminPendingReviews({
    page,
    per_page: 15,
  });

  const approveMutation = useApproveAdminReview();
  const rejectMutation = useRejectAdminReview();

  const [rejectingReview, setRejectingReview] = useState<AdminReview | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApprove = async (review: AdminReview) => {
    try {
      setFeedback(null);
      await approveMutation.mutateAsync(review.id);
      setFeedback({
        type: 'success',
        message: `Review #${review.id} approved and published to the live marketplace.`,
      });
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to approve review.'
          : 'Failed to approve review.';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingReview) return;

    try {
      setFeedback(null);
      await rejectMutation.mutateAsync(rejectingReview.id);
      setFeedback({
        type: 'success',
        message: `Review #${rejectingReview.id} rejected and removed from moderation queue.`,
      });
      setRejectingReview(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to reject review.'
          : 'Failed to reject review.';
      setFeedback({ type: 'error', message: errorMsg });
      setRejectingReview(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-current' : 'text-slate-200 stroke-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Review Moderation"
        description="Moderate customer ratings and testimonials before publication on tradie public profiles."
        breadcrumbs={[{ label: 'Reviews' }]}
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

      {/* Moderation Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              Pending Moderation Queue ({data?.meta.total ?? 0})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Processed in FIFO order
          </span>
        </div>

        {isLoading ? (
          <LoadingState message="Loading pending reviews..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load reviews"
            message="Unable to fetch moderation queue from the server."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No reviews pending moderation"
            description="All submitted ratings have been approved or rejected. Outstanding queue is clear."
            icon={CheckCircle2}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.data.map((review) => (
              <div
                key={review.id}
                className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    {renderStars(review.rating)}
                    <span className="font-bold text-slate-800 text-sm">
                      {review.rating} / 5 Stars
                    </span>
                    <StatusBadge
                      status={review.moderation_status}
                      variant="pending"
                    />
                    <span className="text-xs text-slate-400">
                      Submitted on{' '}
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    &ldquo;{review.review_text}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Customer:</span>
                      <strong className="text-slate-800">
                        {review.customer?.name || 'Verified Customer'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tradie:</span>
                      <strong className="text-slate-800">
                        {review.tradie?.business_name || 'Tradie Profile'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center md:flex-col gap-2.5 shrink-0">
                  <button
                    type="button"
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    onClick={() => handleApprove(review)}
                    className="flex-1 md:w-32 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    onClick={() => setRejectingReview(review)}
                    className="flex-1 md:w-32 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
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

      {/* Rejection Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={!!rejectingReview}
        onClose={() => setRejectingReview(null)}
        onConfirm={handleConfirmReject}
        title={`Reject Review #${rejectingReview?.id}?`}
        description={`Are you sure you want to reject this review from ${rejectingReview?.customer?.name || 'the customer'}? Rejected reviews will not be displayed on the platform.`}
        confirmText="Confirm Rejection"
        intent="danger"
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
