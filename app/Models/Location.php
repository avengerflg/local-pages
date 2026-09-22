<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'parent_id',
        'type',
        'name',
        'code',
        'postcode',
        'status',
    ];

    /**
     * Get the parent location in the geographic hierarchy.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    /**
     * Get all child locations under this location.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    /**
     * Get all tradies that cover this service area location.
     */
    public function tradieProfiles(): BelongsToMany
    {
        return $this->belongsToMany(TradieProfile::class, 'tradie_service_areas', 'location_id', 'tradie_id')->withTimestamps();
    }

    /**
     * Get all service requests created within this location.
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'location_id');
    }
}
