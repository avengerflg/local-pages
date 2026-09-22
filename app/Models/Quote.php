<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'request_id',
        'tradie_id',
        'amount',
        'description',
        'valid_until',
        'terms_notes',
        'estimated_duration',
        'proposed_date',
        'status',
        'accepted_at',
        'rejected_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'valid_until' => 'date',
            'proposed_date' => 'date',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    /**
     * Get the service request this quote was issued for.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    /**
     * Get the tradie profile who submitted this quote.
     */
    public function tradieProfile(): BelongsTo
    {
        return $this->belongsTo(TradieProfile::class, 'tradie_id');
    }

    /**
     * Get all attachments accompanying this quote.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(QuoteAttachment::class, 'quote_id');
    }

    /**
     * Get the appointment resulting from this quote if accepted.
     */
    public function appointment(): HasOne
    {
        return $this->hasOne(Appointment::class, 'quote_id');
    }
}
