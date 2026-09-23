<?php

namespace App\Actions\Admin\Tradie;

use App\Actions\Admin\LogAuditAction;
use App\Models\TradieDocument;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateTradieDocumentStatusAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Review and update a tradie document status (pending, approved, rejected) with reviewer tracking and audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $documentId, array $data): TradieDocument
    {
        return DB::transaction(function () use ($admin, $documentId, $data) {
            $document = TradieDocument::where('id', $documentId)
                ->lockForUpdate()
                ->first();

            if (! $document) {
                abort(Response::HTTP_NOT_FOUND, 'Document not found.');
            }

            $newStatus = $data['status'];
            $oldStatus = $document->status;

            if ($oldStatus !== $newStatus) {
                $document->update([
                    'status' => $newStatus,
                    'reviewed_by' => $admin->id,
                    'reviewed_at' => now(),
                ]);

                $this->logAuditAction->execute(
                    actor: $admin,
                    action: 'tradie_document.status_updated',
                    entityType: 'tradie_documents',
                    entityId: $document->id,
                    oldValues: ['status' => $oldStatus],
                    newValues: ['status' => $newStatus, 'reviewed_by' => $admin->id]
                );
            }

            return $document->loadMissing('reviewer');
        });
    }
}
