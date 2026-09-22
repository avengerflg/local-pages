<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServiceRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'customer_id',
        'service_id',
        'location_id',
        'postcode',
        'title',
        'description',
        'status',
        'submitted_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * Get the customer (user) who submitted the request.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the service requested.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * Get the geographical location of the request.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    /**
     * Get all answers to service questions provided with this request.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(RequestAnswer::class, 'request_id');
    }

    /**
     * Get all files and photos attached to this request.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(RequestAttachment::class, 'request_id');
    }

    /**
     * Get all tradies selected by the customer for this request.
     */
    public function requestTradies(): HasMany
    {
        return $this->hasMany(RequestTradie::class, 'request_id');
    }

    /**
     * Get all quotes submitted by tradies for this request.
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class, 'request_id');
    }

    /**
     * Get all conversations opened for this request.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'request_id');
    }

    /**
     * Get the scheduled appointment for this request.
     */
    public function appointment(): HasOne
    {
        return $this->hasOne(Appointment::class, 'request_id');
    }

    /**
     * Get the executing job for this request.
     */
    public function job(): HasOne
    {
        return $this->hasOne(Job::class, 'request_id');
    }
}
