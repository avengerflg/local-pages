<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'request_id' => $this->request_id,
            'quote_id' => $this->quote_id,
            'service_request' => $this->whenLoaded('serviceRequest', fn () => [
                'id' => $this->serviceRequest->id,
                'title' => $this->serviceRequest->title,
                'status' => $this->serviceRequest->status,
                'postcode' => $this->serviceRequest->postcode,
                'service' => $this->serviceRequest->service ? [
                    'id' => $this->serviceRequest->service->id,
                    'name' => $this->serviceRequest->service->name,
                ] : null,
                'location' => $this->serviceRequest->location ? [
                    'id' => $this->serviceRequest->location->id,
                    'name' => $this->serviceRequest->location->name,
                    'postcode' => $this->serviceRequest->location->postcode,
                ] : null,
            ]),
            'quote' => $this->whenLoaded('quote', fn () => [
                'id' => $this->quote->id,
                'amount' => (string) $this->quote->amount,
                'description' => $this->quote->description,
                'status' => $this->quote->status,
            ]),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
                'abn' => $this->tradieProfile->abn,
                'verification_status' => $this->tradieProfile->verification_status,
            ]),
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'status' => $this->status,
            'notes' => $this->notes,
            'job' => $this->whenLoaded('job', fn () => [
                'id' => $this->job->id,
                'status' => $this->job->status,
                'started_at' => $this->job->started_at?->toIso8601String(),
                'completed_at' => $this->job->completed_at?->toIso8601String(),
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
