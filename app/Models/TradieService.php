<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TradieService extends Pivot
{
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tradie_services';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tradie_id',
        'service_id',
    ];

    /**
     * Get the tradie profile associated with this offering.
     */
    public function tradieProfile(): BelongsTo
    {
        return $this->belongsTo(TradieProfile::class, 'tradie_id');
    }

    /**
     * Get the service associated with this offering.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
