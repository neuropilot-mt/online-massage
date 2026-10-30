<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    use AuthorizesStaff;

    public function index()
    {
        return Program::query()->withCount('courses')->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $this->assertCanCreate($request);

        return Program::query()->create($this->validated($request));
    }

    public function update(Request $request, Program $program)
    {
        $program->update($this->validated($request, $program->id));

        return $program->fresh();
    }

    public function destroy(Request $request, Program $program)
    {
        $this->assertCanDelete($request);
        $program->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, ?int $id = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', 'unique:programs,slug'.($id ? ','.$id : '')],
            'description' => ['nullable', 'string'],
            'cover_url' => ['nullable', 'string', 'max:500'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $slug = $data['slug'] ?? null;
        $data['slug'] = $slug
            ? (Str::slug($slug) ?: $slug)
            : (Str::slug($data['title']) ?: 'program-'.Str::lower(Str::random(6)));

        return $data;
    }
}
