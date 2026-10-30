<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait AuthorizesStaff
{
    protected function assertCanCreate(Request $request): void
    {
        abort_unless($request->user()->role->canCreate(), 403, 'Создание доступно преподавателю и администратору.');
    }

    protected function assertCanDelete(Request $request): void
    {
        abort_unless($request->user()->role->canDelete(), 403, 'Удаление недоступно модератору.');
    }

    protected function assertCanEnroll(Request $request): void
    {
        abort_unless($request->user()->role->canEnroll(), 403, 'Выдавать доступ может преподаватель или администратор.');
    }

    protected function assertCanManageUsers(Request $request): void
    {
        abort_unless($request->user()->role->canManageUsers(), 403, 'Пользователями управляет только администратор.');
    }
}
