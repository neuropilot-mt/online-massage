<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\IssuedCertificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    use AuthorizesStaff;

    public function index()
    {
        return Certificate::query()->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $this->assertCanCreate($request);

        return Certificate::query()->create($this->typeData($request));
    }

    public function update(Request $request, Certificate $certificate)
    {
        $certificate->update($this->typeData($request, false));

        return $certificate->fresh();
    }

    public function destroy(Request $request, Certificate $certificate)
    {
        $this->assertCanDelete($request);
        $certificate->delete();

        return response()->json(['ok' => true]);
    }

    public function issued()
    {
        $this->assertCanEnroll(request());

        return IssuedCertificate::query()
            ->with(['certificate', 'user', 'course'])
            ->latest()
            ->get();
    }

    public function storeIssued(Request $request)
    {
        $this->assertCanEnroll($request);

        $data = $request->validate([
            'certificate_id' => ['required', 'exists:certificates,id'],
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'number' => ['nullable', 'string', 'max:120'],
            'issued_on' => ['nullable', 'date'],
            'file_url' => ['nullable', 'string', 'max:500'],
        ]);

        return IssuedCertificate::query()->create($data)->load(['certificate', 'user', 'course']);
    }

    public function destroyIssued(Request $request, IssuedCertificate $issuedCertificate)
    {
        $this->assertCanEnroll($request);
        $issuedCertificate->delete();

        return response()->json(['ok' => true]);
    }

    private function typeData(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'title' => [$required, 'string', 'max:190'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'is_state_sample' => ['sometimes', 'boolean'],
            'published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);
    }
}
