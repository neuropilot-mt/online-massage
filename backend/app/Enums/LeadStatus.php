<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Enrolled = 'enrolled';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Новая',
            self::Contacted => 'Связались',
            self::Enrolled => 'Зачислен',
            self::Rejected => 'Отклонена',
        };
    }
}
