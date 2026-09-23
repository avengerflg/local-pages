<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $lastMessage = $this->whenLoaded('messages', fn () => $this->messages->first());

        return [
            'id' => $this->id,
            'request_id' => $this->request_id,
            'status' => $this->status,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'service_request' => $this->whenLoaded('serviceRequest', fn () => [
                'id' => $this->serviceRequest->id,
                'title' => $this->serviceRequest->title,
                'status' => $this->serviceRequest->status,
                'service' => $this->serviceRequest->service ? [
                    'id' => $this->serviceRequest->service->id,
                    'name' => $this->serviceRequest->service->name,
                ] : null,
            ]),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
            ]),
            'last_message' => $lastMessage ? [
                'id' => $lastMessage->id,
                'sender_id' => $lastMessage->sender_id,
                'body' => $lastMessage->body,
                'message_type' => $lastMessage->message_type,
                'sent_at' => $lastMessage->sent_at?->toIso8601String(),
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
