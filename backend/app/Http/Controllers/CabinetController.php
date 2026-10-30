<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\IssuedCertificate;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class CabinetController extends Controller
{
    public function courses(Request $request)
    {
        $user = $request->user();

        $courses = Course::query()
            ->with(['program', 'modules.lessons'])
            ->whereHas('enrollments', fn ($q) => $q->where('user_id', $user->id))
            ->orderBy('title')
            ->get();

        $completed = LessonProgress::query()
            ->where('user_id', $user->id)
            ->pluck('lesson_id');

        return $courses->map(function (Course $course) use ($completed) {
            $lessonIds = $course->modules->flatMap->lessons->pluck('id');
            $total = $lessonIds->count();
            $done = $lessonIds->filter(fn ($id) => $completed->contains($id))->count();

            return [
                ...$course->toCardArray(),
                'progress' => [
                    'total' => $total,
                    'completed' => $done,
                    'percent' => $total ? (int) round($done / $total * 100) : 0,
                ],
            ];
        });
    }

    public function course(Request $request, Course $course)
    {
        $this->assertEnrolled($request, $course);

        $course->load(['program', 'modules.lessons']);
        $completed = LessonProgress::query()
            ->where('user_id', $request->user()->id)
            ->pluck('lesson_id');

        $lessonIds = $course->modules->flatMap->lessons->pluck('id');
        $total = $lessonIds->count();
        $done = $lessonIds->filter(fn ($id) => $completed->contains($id))->count();

        return [
            ...$course->toCardArray(),
            'description' => $course->description,
            'progress' => [
                'total' => $total,
                'completed' => $done,
                'percent' => $total ? (int) round($done / $total * 100) : 0,
            ],
            'modules' => $course->modules->map(fn ($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'description' => $module->description,
                'lessons' => $module->lessons->map(fn ($lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'duration_min' => $lesson->duration_min,
                    'has_video' => (bool) $lesson->video_url,
                    'completed' => $completed->contains($lesson->id),
                ]),
            ]),
        ];
    }

    public function lesson(Request $request, Lesson $lesson)
    {
        $lesson->load('module.course');
        $course = $lesson->module->course;
        $this->assertEnrolled($request, $course);

        $completed = LessonProgress::query()
            ->where('user_id', $request->user()->id)
            ->where('lesson_id', $lesson->id)
            ->exists();

        $siblings = $lesson->module->course->modules()
            ->with('lessons')
            ->get()
            ->flatMap->lessons
            ->values();

        $index = $siblings->search(fn ($item) => $item->id === $lesson->id);
        $prev = $index > 0 ? $siblings[$index - 1] : null;
        $next = $index !== false && $index < $siblings->count() - 1 ? $siblings[$index + 1] : null;

        return [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'content' => $lesson->content,
            'video_url' => $lesson->video_url,
            'image_url' => $lesson->image_url,
            'duration_min' => $lesson->duration_min,
            'completed' => $completed,
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
            ],
            'module' => [
                'id' => $lesson->module->id,
                'title' => $lesson->module->title,
            ],
            'prev_id' => $prev?->id,
            'next_id' => $next?->id,
        ];
    }

    public function complete(Request $request, Lesson $lesson)
    {
        $lesson->load('module.course');
        $this->assertEnrolled($request, $lesson->module->course);

        LessonProgress::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'lesson_id' => $lesson->id,
            ],
            ['completed_at' => now()]
        );

        return ['ok' => true];
    }

    public function certificates(Request $request)
    {
        return IssuedCertificate::query()
            ->with(['certificate', 'course'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    private function assertEnrolled(Request $request, Course $course): void
    {
        $enrolled = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->exists();

        abort_unless($enrolled, 403, 'Нет доступа к этому курсу.');
    }
}
