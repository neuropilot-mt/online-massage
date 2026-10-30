<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'subtitle', 'description', 'image_url', 'is_state_sample', 'published', 'sort_order'])]
class Certificate extends Model
{
    protected function casts(): array
    {
        return [
            'is_state_sample' => 'boolean',
            'published' => 'boolean',
        ];
    }

    public function issued(): HasMany
    {
        return $this->hasMany(IssuedCertificate::class);
    }
}
