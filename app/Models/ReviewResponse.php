<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewResponse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'review_id',
        'tradie_id',
        'response_text',
    ];

    /**
     * Get the review this response belongs to.
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class, 'review_id');
    }

    /**
     * Get the responding tradie profile.
     */
    public function tradieProfile(): BelongsTo
    {
        return $this->belongsTo(TradieProfile::class, 'tradie_id');
    }
}
