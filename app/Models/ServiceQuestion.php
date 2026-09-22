<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceQuestion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'service_id',
        'question_text',
        'question_type',
        'required',
        'sort_order',
        'conditional_rule',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'required' => 'boolean',
            'sort_order' => 'integer',
            'conditional_rule' => 'array',
        ];
    }

    /**
     * Get the service that owns the question.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * Get all predefined choice options for this question.
     */
    public function options(): HasMany
    {
        return $this->hasMany(ServiceQuestionOption::class, 'question_id')->orderBy('sort_order');
    }

    /**
     * Get all answers submitted across requests for this question.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(RequestAnswer::class, 'question_id');
    }
}
