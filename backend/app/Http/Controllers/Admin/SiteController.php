<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\FaqItem;
use App\Models\ScheduleEvent;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteController extends Controller
{
    use AuthorizesStaff;

    public function banners()
    {
        return Banner::query()->orderBy('sort_order')->get();
    }

    public function storeBanner(Request $request)
    {
        $this->assertCanCreate($request);

        return Banner::query()->create($this->bannerData($request));
    }

    public function updateBanner(Request $request, Banner $banner)
    {
        $banner->update($this->bannerData($request, false));

        return $banner->fresh();
    }

    public function destroyBanner(Request $request, Banner $banner)
    {
        $this->assertCanDelete($request);
        $banner->delete();

        return response()->json(['ok' => true]);
    }

    public function schedule()
    {
        return ScheduleEvent::query()->with('course')->orderBy('starts_at')->get();
    }

    public function storeSchedule(Request $request)
    {
        $this->assertCanCreate($request);

        return ScheduleEvent::query()->create($this->scheduleData($request))->load('course');
    }

    public function updateSchedule(Request $request, ScheduleEvent $scheduleEvent)
    {
        $scheduleEvent->update($this->scheduleData($request, false));

        return $scheduleEvent->fresh('course');
    }

    public function destroySchedule(Request $request, ScheduleEvent $scheduleEvent)
    {
        $this->assertCanDelete($request);
        $scheduleEvent->delete();

        return response()->json(['ok' => true]);
    }

    public function testimonials()
    {
        return Testimonial::query()->orderBy('sort_order')->get();
    }

    public function storeTestimonial(Request $request)
    {
        $this->assertCanCreate($request);

        return Testimonial::query()->create($request->validate([
            'name' => ['required', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'max:120'],
            'text' => ['required', 'string'],
            'photo_url' => ['nullable', 'string', 'max:500'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]));
    }

    public function updateTestimonial(Request $request, Testimonial $testimonial)
    {
        $testimonial->update($request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'max:120'],
            'text' => ['sometimes', 'string'],
            'photo_url' => ['nullable', 'string', 'max:500'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]));

        return $testimonial->fresh();
    }

    public function destroyTestimonial(Request $request, Testimonial $testimonial)
    {
        $this->assertCanDelete($request);
        $testimonial->delete();

        return response()->json(['ok' => true]);
    }

    public function faqs()
    {
        return FaqItem::query()->orderBy('sort_order')->get();
    }

    public function storeFaq(Request $request)
    {
        $this->assertCanCreate($request);

        return FaqItem::query()->create($request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]));
    }

    public function updateFaq(Request $request, FaqItem $faqItem)
    {
        $faqItem->update($request->validate([
            'question' => ['sometimes', 'string', 'max:255'],
            'answer' => ['sometimes', 'string'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]));

        return $faqItem->fresh();
    }

    public function destroyFaq(Request $request, FaqItem $faqItem)
    {
        $this->assertCanDelete($request);
        $faqItem->delete();

        return response()->json(['ok' => true]);
    }

    public function settings()
    {
        return SiteSetting::query()->findOrFail('default');
    }

    public function updateSettings(Request $request)
    {
        $settings = SiteSetting::query()->findOrFail('default');
        $settings->update($request->validate([
            'phone' => ['nullable', 'string', 'max:64'],
            'email' => ['nullable', 'email'],
            'address' => ['nullable', 'string', 'max:255'],
            'telegram' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string'],
            'about' => ['nullable', 'string'],
        ]));

        return $settings->fresh();
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,gif'],
        ]);

        $disk = $this->uploadDisk();
        $path = $request->file('file')->store('uploads', $disk);

        return [
            'url' => url(Storage::disk($disk)->url($path)),
            'path' => $path,
        ];
    }

    private function uploadDisk(): string
    {
        $default = (string) config('filesystems.default');

        return in_array($default, ['local', 'public'], true) ? 'public' : $default;
    }

    private function bannerData(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'title' => [$required, 'string', 'max:190'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:64'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'cta_label' => ['nullable', 'string', 'max:64'],
            'cta_href' => ['nullable', 'string', 'max:255'],
            'active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);
    }

    private function scheduleData(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'title' => [$required, 'string', 'max:190'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'city' => ['nullable', 'string', 'max:120'],
            'starts_at' => [$required, 'date'],
            'ends_at' => ['nullable', 'date'],
            'hours' => ['nullable', 'integer'],
            'spots' => ['nullable', 'integer'],
            'published' => ['sometimes', 'boolean'],
        ]);
    }
}
