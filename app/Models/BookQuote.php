<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookQuote extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'author',
        'work_title',
        'quote_original',
        'quote_translated',
        'source_url',
        'source_domain',
        'language',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
