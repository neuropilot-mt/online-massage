<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeadStatus;
use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    use AuthorizesStaff;

    public function index(Request $request)
    {
        $this->assertCanEnroll($request);

        return Lead::query()
            ->with('course')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();
    }

    public function update(Request $request, Lead $lead)
    {
        $this->assertCanEnroll($request);

        $data = $request->validate([
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ]);

        $lead->update($data);

        return $lead->fresh('course');
    }
}
