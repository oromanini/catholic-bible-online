<?php

namespace App\Http\Requests\Bible;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'version' => ['nullable', 'string', 'max:20'],
        ];
    }
}
