'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  useAdminTradie,
  useAdminTradieDocuments,
  useUpdateAdminTradieDocumentStatus,
} from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';
import { TradieDocumentStatus, AdminTradieDocument } from '@/types/admin';

export default function AdminTradieDocumentsPage() {
  const params = useParams();
  const tradieId = Number(params.id);

  const { data: tradie } = useAdminTradie(tradieId);
  const {
    data: documents,
    isLoading,
    isError,
    refetch,
  } = useAdminTradieDocuments(tradieId);

  const updateDocMutation = useUpdateAdminTradieDocumentStatus(tradieId);

  const [selectedDoc, setSelectedDoc] = useState<AdminTradieDocument | null>(null);
  const [pendingStatus, setPendingStatus] = useState<TradieDocumentStatus | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleStatusChange = (doc: AdminTradieDocument, status: TradieDocumentStatus) => {
    setSelectedDoc(doc);
    setPendingStatus(status);
  };

  const handleConfirmStatus = async () => {
    if (!selectedDoc || !pendingStatus) return;

    try {
      setFeedback(null);
      await updateDocMutation.mutateAsync({
        documentId: selectedDoc.id,
        status: pendingStatus,
      });
      setFeedback({
        type: 'success',
        message: `Document "${selectedDoc.original_name}" marked as ${pendingStatus}.`,
      });
      setSelectedDoc(null);
      setPendingStatus(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to update document status.'
          : 'Failed to update document status.';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      setSelectedDoc(null);
      setPendingStatus(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Verification Documents`}
        description={
          tradie
            ? `Review licenses, insurance and compliance files for ${tradie.business_name}.`
            : 'Review submitted verification credentials.'
        }
        breadcrumbs={[
          { label: 'Tradies', href: '/admin/tradies' },
          {
            label: tradie?.business_name || `Tradie #${tradieId}`,
            href: `/admin/tradies/${tradieId}`,
          },
          { label: 'Documents' },
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

      {/* Documents List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading verification documents..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load documents"
            message="Unable to retrieve tradie documents from the server."
            onRetry={() => refetch()}
          />
        ) : !documents || documents.length === 0 ? (
          <EmptyState
            title="No documents uploaded"
            description="This tradie has not submitted any verification documents yet."
            icon={FileText}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Document Name & Type</th>
                  <th className="px-5 py-3.5">Size & Format</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Uploaded</th>
                  <th className="px-5 py-3.5">Reviewed By</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#172033] max-w-xs truncate">
                            {doc.original_name}
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            Type: {doc.document_type.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs font-mono">
                      {formatFileSize(doc.file_size)} • {doc.mime_type}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={doc.status} variant={doc.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {doc.reviewer?.name || (doc.reviewed_at ? 'Admin' : '—')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Secure Temporary Signed Download Link */}
                        <a
                          href={doc.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                          title="Secure Download"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>View / Download</span>
                        </a>

                        {/* Approve Document Button */}
                        <button
                          type="button"
                          disabled={doc.status === 'approved' || updateDocMutation.isPending}
                          onClick={() => handleStatusChange(doc, 'approved')}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Approve document"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Reject Document Button */}
                        <button
                          type="button"
                          disabled={doc.status === 'rejected' || updateDocMutation.isPending}
                          onClick={() => handleStatusChange(doc, 'rejected')}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Reject document"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={!!selectedDoc && !!pendingStatus}
        onClose={() => {
          setSelectedDoc(null);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmStatus}
        title={`Set Document to ${pendingStatus?.toUpperCase()}?`}
        description={`Are you sure you want to change the status of "${selectedDoc?.original_name}" to ${pendingStatus}?`}
        confirmText={`Confirm ${pendingStatus}`}
        intent={pendingStatus === 'rejected' ? 'danger' : 'primary'}
        isLoading={updateDocMutation.isPending}
      />
    </div>
  );
}
