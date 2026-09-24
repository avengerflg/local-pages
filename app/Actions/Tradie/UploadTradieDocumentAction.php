<?php

namespace App\Actions\Tradie;

use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadTradieDocumentAction
{
    /**
     * Upload and securely persist a tradie verification document.
     */
    public function execute(User $user, string $documentType, UploadedFile $file): TradieDocument
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Generate private storage path
        $extension = $file->getClientOriginalExtension();
        $storedFilename = Str::random(40).($extension ? '.'.$extension : '');
        $directory = 'tradie-documents/'.$profile->id;

        $path = $file->storeAs($directory, $storedFilename, 'local');

        return TradieDocument::create([
            'tradie_id' => $profile->id,
            'document_type' => $documentType,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType() ?: 'application/octet-stream',
            'file_size' => $file->getSize(),
            'status' => 'pending',
        ]);
    }
}
