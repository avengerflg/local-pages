<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceQuestionOption extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'question_id',
        'label',
        'value',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the question that owns this option.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(ServiceQuestion::class, 'question_id');
    }

    /**
     * Get all answers selecting this option.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(RequestAnswer::class, 'selected_option_id');
    }
}
