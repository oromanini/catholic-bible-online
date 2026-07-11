<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\AiComment;
use App\Models\AiCommentFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiCommentaryFeedbackController extends Controller
{
    public function store(Request $request, AiComment $comment): JsonResponse
    {
        $data = $request->validate([
            'rating' => ['required', 'in:up,down'],
        ]);

        AiCommentFeedback::updateOrCreate(
            ['ai_comment_id' => $comment->id, 'user_id' => $request->user()->id],
            ['rating' => $data['rating']]
        );

        return response()->json(['ok' => true]);
    }
}
