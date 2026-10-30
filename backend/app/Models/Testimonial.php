<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'role', 'text', 'photo_url', 'published', 'sort_order'])]
class Testimonial extends Model
{
    protected function casts(): array
    {
        return [
            'published' => 'boolean',
        ];
    }
}
