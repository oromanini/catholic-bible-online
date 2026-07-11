<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\ReadingPlan;
use App\Models\ReadingPlanProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReadingPlanProgressController extends Controller
{
    /**
     * Alterna o status de um dia do plano entre concluído/pendente.
     */
    public function toggle(Request $request, ReadingPlan $plan, int $day): RedirectResponse
    {
        abort_unless($day >= 1 && $day <= $plan->duration_days, 404);

        $userId = $request->user()->id;

        $progress = ReadingPlanProgress::where('user_id', $userId)
            ->where('reading_plan_id', $plan->id)
            ->where('day_number', $day)
            ->first();

        if ($progress) {
            $progress->delete();
        } else {
            ReadingPlanProgress::create([
                'user_id' => $userId,
                'reading_plan_id' => $plan->id,
                'day_number' => $day,
                'completed_at' => now(),
            ]);
        }

        return back();
    }
}
