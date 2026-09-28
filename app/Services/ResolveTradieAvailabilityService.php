<?php

namespace App\Services;

use App\Models\TradieAvailability;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ResolveTradieAvailabilityService
{
    /**
     * Resolves the available timeblocks for a given tradie on a specific date.
     * Returns a collection of arrays with 'starts_at' and 'ends_at' Carbon instances.
     */
    public function execute(int $tradieId, Carbon $date): Collection
    {
        $dateString = $date->toDateString();

        $specificOverrides = TradieAvailability::where('tradie_id', $tradieId)
            ->whereDate('specific_date', $dateString)
            ->get();

        if ($specificOverrides->isNotEmpty()) {
            return $this->processSlots($specificOverrides, $dateString);
        }

        $weeklySlots = TradieAvailability::where('tradie_id', $tradieId)
            ->whereNull('specific_date')
            ->where('day_of_week', $date->dayOfWeek)
            ->get();

        return $this->processSlots($weeklySlots, $dateString);
    }

    protected function processSlots(Collection $slots, string $dateString): Collection
    {
        $availableSlots = collect();

        foreach ($slots as $slot) {
            if (! $slot->is_available) {
                continue;
            }

            $startsAt = $slot->start_time
                ? Carbon::parse($dateString.' '.$slot->start_time)
                : Carbon::parse($dateString.' 00:00:00');

            $endsAt = $slot->end_time
                ? Carbon::parse($dateString.' '.$slot->end_time)
                : Carbon::parse($dateString.' 23:59:59');

            $availableSlots->push([
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
            ]);
        }

        return $availableSlots;
    }
}
