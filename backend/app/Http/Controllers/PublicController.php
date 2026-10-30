<?php

namespace App\Http\Controllers;

use App\Enums\LeadStatus;
use App\Models\Banner;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\FaqItem;
use App\Models\Lead;
use App\Models\ScheduleEvent;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        return [
            'settings' => $this->settings(),
            'banners' => Banner::query()->where('active', true)->orderBy('sort_order')->get(),
            'courses' => Course::query()
                ->with('program')
                ->where('published', true)
                ->orderByDesc('featured')
                ->orderBy('sort_order')
                ->get()
                ->map->toCardArray(),
            'schedule' => ScheduleEvent::query()
                ->with('course')
                ->where('published', true)
                ->where('starts_at', '>=', now()->subDay())
                ->orderBy('starts_at')
                ->limit(6)
                ->get()
                ->map(fn (ScheduleEvent $event) => $this->eventArray($event)),
            'testimonials' => Testimonial::query()->where('published', true)->orderBy('sort_order')->get(),
            'faqs' => FaqItem::query()->where('published', true)->orderBy('sort_order')->get(),
            'certificates' => Certificate::query()
                ->where('published', true)
                ->orderByDesc('is_state_sample')
                ->orderBy('sort_order')
                ->get(),
        ];
    }

    public function courses()
    {
        return Course::query()
            ->with('program')
            ->where('published', true)
            ->orderBy('sort_order')
            ->get()
            ->map->toCardArray();
    }

    public function course(Course $course)
    {
        abort_unless($course->published, 404);

        $course->load(['program', 'modules.lessons']);

        return [
            ...$course->toCardArray(),
            'description' => $course->description,
            'modules' => $course->modules->map(fn ($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'description' => $module->description,
                'lessons' => $module->lessons->map(fn ($lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'duration_min' => $lesson->duration_min,
                ]),
            ]),
            'schedule' => $course->scheduleEvents()
                ->where('published', true)
                ->where('starts_at', '>=', now()->subDay())
                ->orderBy('starts_at')
                ->get()
                ->map(fn (ScheduleEvent $event) => $this->eventArray($event)),
        ];
    }

    public function schedule()
    {
        return ScheduleEvent::query()
            ->with('course')
            ->where('published', true)
            ->where('starts_at', '>=', now()->subDay())
            ->orderBy('starts_at')
            ->get()
            ->map(fn (ScheduleEvent $event) => $this->eventArray($event));
    }

    public function about()
    {
        return [
            'settings' => $this->settings(),
            'testimonials' => Testimonial::query()->where('published', true)->orderBy('sort_order')->get(),
        ];
    }

    public function storeLead(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:190'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $lead = Lead::query()->create([
            ...$data,
            'status' => LeadStatus::New,
        ]);

        return response()->json([
            'ok' => true,
            'id' => $lead->id,
            'message' => 'Заявка отправлена. Мы свяжемся с вами, чтобы подобрать группу и открыть доступ к курсу.',
        ], 201);
    }

    private function settings(): SiteSetting
    {
        return SiteSetting::query()->findOrFail('default');
    }

    private function eventArray(ScheduleEvent $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'city' => $event->city,
            'starts_at' => $event->starts_at?->toIso8601String(),
            'ends_at' => $event->ends_at?->toIso8601String(),
            'hours' => $event->hours,
            'spots' => $event->spots,
            'course' => $event->course ? [
                'id' => $event->course->id,
                'slug' => $event->course->slug,
                'title' => $event->course->title,
            ] : null,
        ];
    }
}
