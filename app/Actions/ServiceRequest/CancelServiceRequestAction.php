<?php

namespace App\Actions\ServiceRequest;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CancelServiceRequestAction
{
    /**
     * Cancel a service request if it has not yet accepted a quote.
     */
    public function execute(User $user, int $id): ServiceRequest
    {
        return DB::transaction(function () use ($user, $id) {
            $serviceRequest = ServiceRequest::where('id', $id)
                ->where('customer_id', $user->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Check if cancellation is allowed
            // Only allow cancellation if status is 'draft' or 'submitted'
            // If quote_accepted, scheduling, completed, etc., deny cancellation.
            if (! in_array($serviceRequest->status, ['draft', 'submitted'])) {
                throw new HttpException(422, 'Service request cannot be cancelled at this stage.');
            }

            $serviceRequest->status = 'cancelled';
            $serviceRequest->save();

            // Optionally notify tradies who quoted or matched if we wanted to (outside scope for now)

            return $serviceRequest;
        });
    }
}
