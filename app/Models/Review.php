<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'job_id',
        'customer_id',
        'tradie_id',
        'rating',
        'review_text',
        'moderation_status',
        'published_at',
        'removed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'published_at' => 'datetime',
            'removed_at' => 'datetime',
        ];
    }

    /**
     * Get the completed job that this review evaluates.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    /**
     * Get the customer user who wrote the review.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the tradie profile reviewed.
     */
    public function tradieProfile(): BelongsTo
    {
        return $this->belongsTo(TradieProfile::class, 'tradie_id');
    }

    /**
     * Get the public response from the tradie, if any.
     */
    public function response(): HasOne
    {
        return $this->hasOne(ReviewResponse::class, 'review_id');
    }

    /**
     * Get all dispute/flag reports for this review.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(ReviewReport::class, 'review_id');
    }
}
