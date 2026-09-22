<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradieAvailability extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tradie_availability';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tradie_id',
        'day_of_week',
        'start_time',
        'end_time',
        'specific_date',
        'is_available',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'specific_date' => 'date',
            'is_available' => 'boolean',
        ];
    }

    /**
     * Get the tradie profile that owns the availability slot.
     */
    public function tradieProfile(): BelongsTo
    {
        return $this->belongsTo(TradieProfile::class, 'tradie_id');
    }
}
