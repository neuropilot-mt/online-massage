<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Teacher = 'teacher';
    case Moderator = 'moderator';
    case Student = 'student';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Администратор',
            self::Teacher => 'Преподаватель',
            self::Moderator => 'Модератор',
            self::Student => 'Ученик',
        };
    }

    public function isStaff(): bool
    {
        return $this !== self::Student;
    }

    public function canManageUsers(): bool
    {
        return $this === self::Admin;
    }

    public function canEnroll(): bool
    {
        return in_array($this, [self::Admin, self::Teacher], true);
    }

    public function canCreate(): bool
    {
        return in_array($this, [self::Admin, self::Teacher], true);
    }

    public function canDelete(): bool
    {
        return in_array($this, [self::Admin, self::Teacher], true);
    }

    public function canEdit(): bool
    {
        return $this->isStaff();
    }
}
