<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'id',
    'phone',
    'email',
    'address',
    'telegram',
    'instagram',
    'hero_title',
    'hero_subtitle',
    'about',
])]
class SiteSetting extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';
}
