<?php

namespace App\Actions\Quote;

use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class GetCustomerQuotesAction
{
    /**
     * Retrieve paginated quotes for a customer's service request.
     *
     * @return LengthAwarePaginator<Quote>
     */
    public function execute(User $user, int $requestId, int $perPage = 15): LengthAwarePaginator
    {
        $serviceRequest = ServiceRequest::where('id', $requestId)
            ->where('customer_id', $user->id)
            ->first();

        if (! $serviceRequest) {
            abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
        }

        return Quote::where('request_id', $serviceRequest->id)
            ->with([
                'tradieProfile',
                'attachments',
            ])
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }
}
