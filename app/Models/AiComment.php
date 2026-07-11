<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'chapter_id',
        'version_id',
        'content',
        'provider',
        'model',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(AiCommentFeedback::class);
    }
}
