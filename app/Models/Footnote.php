<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Footnote extends Model
{
    use HasFactory;

    protected $fillable = [
        'verse_id',
        'marker',
        'position',
        'content',
    ];

    public function verse(): BelongsTo
    {
        return $this->belongsTo(Verse::class);
    }
}
