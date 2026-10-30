<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    use AuthorizesStaff;

    public function store(Request $request, Module $module)
    {
        $this->assertCanCreate($request);

        $data = $this->validated($request);
        $data['sort_order'] ??= ((int) $module->lessons()->max('sort_order')) + 1;

        return $module->lessons()->create($data);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $lesson->update($this->validated($request, false));

        return $lesson->fresh();
    }

    public function destroy(Request $request, Lesson $lesson)
    {
        $this->assertCanDelete($request);
        $lesson->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'title' => [$required, 'string', 'max:190'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'duration_min' => ['nullable', 'integer', 'min:0'],
            'sort_order' => ['sometimes', 'integer'],
        ]);
    }
}
