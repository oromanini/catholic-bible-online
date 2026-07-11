<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiCommentFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'ai_comment_id',
        'user_id',
        'rating',
    ];

    public function comment(): BelongsTo
    {
        return $this->belongsTo(AiComment::class, 'ai_comment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
