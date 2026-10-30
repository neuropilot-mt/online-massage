<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    use AuthorizesStaff;

    public function index(Request $request)
    {
        $this->assertCanEnroll($request);

        return Enrollment::query()->with(['user', 'course', 'grantedBy'])->latest()->get()->map(fn (Enrollment $enrollment) => [
            'id' => $enrollment->id,
            'created_at' => $enrollment->created_at,
            'user' => $enrollment->user->toAuthArray(),
            'course' => $enrollment->course->toCardArray(),
            'granted_by' => $enrollment->grantedBy?->toAuthArray(),
        ]);
    }

    public function store(Request $request)
    {
        $this->assertCanEnroll($request);

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $enrollment = Enrollment::query()->firstOrCreate(
            [
                'user_id' => $data['user_id'],
                'course_id' => $data['course_id'],
            ],
            ['granted_by' => $request->user()->id]
        );

        return $enrollment->load(['user', 'course', 'grantedBy']);
    }

    public function destroy(Request $request, Enrollment $enrollment)
    {
        $this->assertCanEnroll($request);
        $enrollment->delete();

        return response()->json(['ok' => true]);
    }

    public function students()
    {
        return User::query()
            ->where('role', 'student')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone']);
    }
}
