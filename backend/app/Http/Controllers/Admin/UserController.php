<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Concerns\AuthorizesStaff;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use AuthorizesStaff;

    public function index(Request $request)
    {
        $this->assertCanManageUsers($request);

        return User::query()->orderBy('name')->get()->map->toAuthArray();
    }

    public function store(Request $request)
    {
        $this->assertCanManageUsers($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:32'],
            'password' => ['required', Password::min(6)],
            'role' => ['required', Rule::enum(Role::class)],
        ]);

        $user = User::query()->create($data);

        return response()->json($user->toAuthArray(), 201);
    }

    public function update(Request $request, User $user)
    {
        $this->assertCanManageUsers($request);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:32'],
            'password' => ['nullable', Password::min(6)],
            'role' => ['sometimes', Rule::enum(Role::class)],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return $user->fresh()->toAuthArray();
    }

    public function destroy(Request $request, User $user)
    {
        $this->assertCanManageUsers($request);
        abort_if($user->id === $request->user()->id, 422, 'Нельзя удалить собственный аккаунт.');
        $user->delete();

        return response()->json(['ok' => true]);
    }
}
