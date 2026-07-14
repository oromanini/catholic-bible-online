<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiCommentFeedback extends Model
{
    protected $fillable = [
        'ai_comment_id',
        'user_id',
        'rating',
    ];

    /**
     * @return BelongsTo<AiComment, $this>
     */
    public function comment(): BelongsTo
    {
        return $this->belongsTo(AiComment::class, 'ai_comment_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
