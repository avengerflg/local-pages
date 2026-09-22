<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestAnswer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'request_id',
        'question_id',
        'answer_text',
        'selected_option_id',
        'structured_value',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'structured_value' => 'array',
        ];
    }

    /**
     * Get the service request this answer belongs to.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    /**
     * Get the question answered.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(ServiceQuestion::class, 'question_id');
    }

    /**
     * Get the selected option if this question had predefined choices.
     */
    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(ServiceQuestionOption::class, 'selected_option_id');
    }
}
