<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        return [
            'leads_new' => Lead::query()->where('status', 'new')->count(),
            'leads_total' => Lead::query()->count(),
            'students' => User::query()->where('role', 'student')->count(),
            'courses' => Course::query()->count(),
            'enrollments' => Enrollment::query()->count(),
            'recent_leads' => Lead::query()->with('course')->latest()->limit(6)->get(),
        ];
    }
}
