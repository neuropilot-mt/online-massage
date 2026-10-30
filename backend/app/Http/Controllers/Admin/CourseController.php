<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    use AuthorizesStaff;

    public function index()
    {
        return Course::query()->with('program')->withCount('modules', 'enrollments')->orderBy('sort_order')->get();
    }

    public function show(Course $course)
    {
        $course->load(['program', 'modules.lessons']);

        return $course;
    }

    public function store(Request $request)
    {
        $this->assertCanCreate($request);

        return Course::query()->create($this->validated($request));
    }

    public function update(Request $request, Course $course)
    {
        $course->update($this->validated($request, $course->id));

        return $course->fresh(['program', 'modules.lessons']);
    }

    public function destroy(Request $request, Course $course)
    {
        $this->assertCanDelete($request);
        $course->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, ?int $id = null): array
    {
        $data = $request->validate([
            'program_id' => ['nullable', 'exists:programs,id'],
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', 'unique:courses,slug'.($id ? ','.$id : '')],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'cover_url' => ['nullable', 'string', 'max:500'],
            'price' => ['nullable', 'integer', 'min:0'],
            'duration_hours' => ['nullable', 'integer', 'min:0'],
            'format' => ['nullable', 'string', 'max:120'],
            'level' => ['nullable', 'string', 'max:120'],
            'published' => ['sometimes', 'boolean'],
            'featured' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $slug = $data['slug'] ?? null;
        $data['slug'] = $slug
            ? (Str::slug($slug) ?: $slug)
            : (Str::slug($data['title']) ?: 'course-'.Str::lower(Str::random(6)));

        return $data;
    }
}
