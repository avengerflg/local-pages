<?php

namespace App\Actions\Admin\Service;

use App\Models\Service;
use App\Models\ServiceQuestion;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\Response;

class GetAdminServiceQuestionsAction
{
    /**
     * Retrieve all intake questions for a service, ordered by sort order, with options.
     *
     * @return Collection<int, ServiceQuestion>
     */
    public function execute(int $serviceId): Collection
    {
        $service = Service::find($serviceId);

        if (! $service) {
            abort(Response::HTTP_NOT_FOUND, 'Service not found.');
        }

        return ServiceQuestion::with('options')
            ->where('service_id', $serviceId)
            ->orderBy('sort_order')
            ->get();
    }
}
