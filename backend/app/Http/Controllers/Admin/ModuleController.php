<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    use AuthorizesStaff;

    public function store(Request $request, Course $course)
    {
        $this->assertCanCreate($request);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $data['sort_order'] ??= ((int) $course->modules()->max('sort_order')) + 1;

        return $course->modules()->create($data);
    }

    public function update(Request $request, Module $module)
    {
        $module->update($request->validate([
            'title' => ['sometimes', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['sometimes', 'integer'],
        ]));

        return $module->fresh('lessons');
    }

    public function destroy(Request $request, Module $module)
    {
        $this->assertCanDelete($request);
        $module->delete();

        return response()->json(['ok' => true]);
    }
}
