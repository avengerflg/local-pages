<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
    ];

    /**
     * Get all configurable questions defined for this service.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(ServiceQuestion::class, 'service_id')->orderBy('sort_order');
    }

    /**
     * Get all tradies offering this service.
     */
    public function tradieProfiles(): BelongsToMany
    {
        return $this->belongsToMany(TradieProfile::class, 'tradie_services', 'service_id', 'tradie_id')->withTimestamps();
    }

    /**
     * Get all customer service requests for this service.
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'service_id');
    }
}
