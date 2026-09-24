<?php

namespace App\Actions\Tradie;

use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DeleteTradieDocumentAction
{
    /**
     * Delete an unapproved document belonging to the authenticated tradie.
     */
    public function execute(User $user, int $documentId): void
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        /** @var TradieDocument|null $document */
        $document = TradieDocument::where('id', $documentId)
            ->where('tradie_id', $profile->id)
            ->first();

        if (! $document) {
            throw (new ModelNotFoundException)->setModel(TradieDocument::class, [$documentId]);
        }

        // Check if approved
        if ($document->status === 'approved') {
            throw ValidationException::withMessages([
                'document' => ['Approved verification documents cannot be deleted.'],
            ]);
        }

        DB::transaction(function () use ($document) {
            // Delete physical file if exists
            if ($document->file_path && Storage::disk('local')->exists($document->file_path)) {
                Storage::disk('local')->delete($document->file_path);
            }

            $document->delete();
        });
    }
}
