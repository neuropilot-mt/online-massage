<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

#[Fillable([
    'program_id',
    'title',
    'slug',
    'excerpt',
    'description',
    'cover_url',
    'price',
    'duration_hours',
    'format',
    'level',
    'published',
    'featured',
    'sort_order',
])]
class Course extends Model
{
    protected function casts(): array
    {
        return [
            'published' => 'boolean',
            'featured' => 'boolean',
            'price' => 'integer',
            'duration_hours' => 'integer',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('sort_order');
    }

    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')->withTimestamps();
    }

    public function scheduleEvents(): HasMany
    {
        return $this->hasMany(ScheduleEvent::class);
    }

    public function toCardArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'cover_url' => $this->cover_url,
            'price' => $this->price,
            'duration_hours' => $this->duration_hours,
            'format' => $this->format,
            'level' => $this->level,
            'featured' => $this->featured,
            'program' => $this->program ? [
                'id' => $this->program->id,
                'title' => $this->program->title,
                'slug' => $this->program->slug,
            ] : null,
        ];
    }
}
