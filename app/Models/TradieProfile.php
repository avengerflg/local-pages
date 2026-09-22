<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TradieProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'abn',
        'phone',
        'email',
        'website',
        'address',
        'suburb',
        'state',
        'postcode',
        'verification_status',
        'verified_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the tradie profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all verification documents for the tradie.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(TradieDocument::class, 'tradie_id');
    }

    /**
     * Get all services offered by the tradie.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'tradie_services', 'tradie_id', 'service_id')->withTimestamps();
    }

    /**
     * Get all service area locations covered by the tradie.
     */
    public function serviceAreas(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'tradie_service_areas', 'tradie_id', 'location_id')->withTimestamps();
    }

    /**
     * Get availability slots and date overrides for the tradie.
     */
    public function availability(): HasMany
    {
        return $this->hasMany(TradieAvailability::class, 'tradie_id');
    }

    /**
     * Get all service request selections referencing this tradie.
     */
    public function requestTradies(): HasMany
    {
        return $this->hasMany(RequestTradie::class, 'tradie_id');
    }

    /**
     * Get all customer conversations with this tradie.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'tradie_id');
    }

    /**
     * Get all quotes submitted by this tradie.
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class, 'tradie_id');
    }

    /**
     * Get all appointments booked with this tradie.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'tradie_id');
    }

    /**
     * Get all jobs assigned to this tradie.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'tradie_id');
    }

    /**
     * Get all customer reviews received by this tradie.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'tradie_id');
    }

    /**
     * Get all review responses submitted by this tradie.
     */
    public function reviewResponses(): HasMany
    {
        return $this->hasMany(ReviewResponse::class, 'tradie_id');
    }
}
