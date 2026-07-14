<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Footnote extends Model
{
    protected $fillable = [
        'verse_id',
        'marker',
        'position',
        'content',
    ];

    /**
     * @return BelongsTo<Verse, $this>
     */
    public function verse(): BelongsTo
    {
        return $this->belongsTo(Verse::class);
    }
}
