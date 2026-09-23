<?php

namespace App\Actions\Matching;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\RequestTradie;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class SelectMatchingTradiesAction
{
    public function __construct(
        protected FindMatchingTradiesAction $findMatchingTradiesAction,
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Select one or multiple matching tradies for a service request.
     *
     * @param  list<int>  $tradieIds
     * @return Collection<int, RequestTradie>
     */
    public function execute(User $customer, ServiceRequest $serviceRequest, array $tradieIds): Collection
    {
        // 1. Verify ownership
        if ($serviceRequest->customer_id !== $customer->id) {
            abort(Response::HTTP_NOT_FOUND);
        }

        // 2. Verify lifecycle state
        if (in_array($serviceRequest->status, ['completed', 'cancelled'], true)) {
            throw ValidationException::withMessages([
                'service_request' => ['Cannot select tradies for a completed or cancelled request.'],
            ]);
        }

        // 3. Verify that all submitted tradie IDs are genuinely eligible
        $eligibleTradieIds = $this->findMatchingTradiesAction->execute($serviceRequest)
            ->whereIn('tradie_profiles.id', $tradieIds)
            ->pluck('tradie_profiles.id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $uniqueRequestedIds = array_values(array_unique(array_map('intval', $tradieIds)));
        $ineligibleIds = array_diff($uniqueRequestedIds, $eligibleTradieIds);

        if (! empty($ineligibleIds)) {
            throw ValidationException::withMessages([
                'tradie_ids' => ['One or more selected tradies are not eligible for this request.'],
            ]);
        }

        // 4. Atomically persist selections and notify newly selected tradies.
        return DB::transaction(function () use ($serviceRequest, $uniqueRequestedIds) {
            $createdSelections = new Collection;

            foreach ($uniqueRequestedIds as $tradieId) {
                $selection = RequestTradie::firstOrCreate(
                    [
                        'request_id' => $serviceRequest->id,
                        'tradie_id' => $tradieId,
                    ],
                    [
                        'status' => 'selected',
                        'selected_at' => now(),
                    ]
                );

                $createdSelections->push($selection);

                // Notify only for new selections; do not re-notify if already selected.
                if ($selection->wasRecentlyCreated) {
                    $selection->loadMissing('tradieProfile.user');
                    $tradieUser = $selection->tradieProfile?->user;

                    if ($tradieUser) {
                        $this->createNotificationAction->execute(
                            recipient: $tradieUser,
                            type: 'tradie_selected',
                            title: 'You have been selected for a job',
                            body: 'A customer has selected you for their service request.',
                            data: [
                                'service_request_id' => $serviceRequest->id,
                                'request_tradie_id' => $selection->id,
                            ]
                        );
                    }
                }
            }

            if ($serviceRequest->status === 'submitted') {
                $serviceRequest->update(['status' => 'matching']);
            }

            return $createdSelections->loadMissing(['tradieProfile']);
        });
    }
}
