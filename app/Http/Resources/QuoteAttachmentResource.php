<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class QuoteAttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote_id' => $this->quote_id,
            'original_name' => $this->original_name,
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'download_url' => URL::temporarySignedRoute(
                'files.download',
                now()->addMinutes(60),
                ['type' => 'quote-attachment', 'id' => $this->id]
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
