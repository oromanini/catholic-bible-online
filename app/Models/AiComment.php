<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiComment extends Model
{
    protected $fillable = [
        'book_id',
        'chapter_id',
        'version_id',
        'content',
        'provider',
        'model',
    ];

    /**
     * @return BelongsTo<Book, $this>
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * @return BelongsTo<Chapter, $this>
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * @return BelongsTo<Version, $this>
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    /**
     * @return HasMany<AiCommentFeedback, $this>
     */
    public function feedback(): HasMany
    {
        return $this->hasMany(AiCommentFeedback::class);
    }
}
