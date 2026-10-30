<?php

use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\SiteController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CabinetController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function () {
    Route::get('/home', [PublicController::class, 'home']);
    Route::get('/courses', [PublicController::class, 'courses']);
    Route::get('/courses/{course:slug}', [PublicController::class, 'course']);
    Route::get('/schedule', [PublicController::class, 'schedule']);
    Route::get('/about', [PublicController::class, 'about']);
    Route::post('/leads', [PublicController::class, 'storeLead']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);

    Route::prefix('cabinet')->group(function () {
        Route::get('/courses', [CabinetController::class, 'courses']);
        Route::get('/courses/{course}', [CabinetController::class, 'course']);
        Route::get('/lessons/{lesson}', [CabinetController::class, 'lesson']);
        Route::post('/lessons/{lesson}/complete', [CabinetController::class, 'complete']);
        Route::get('/certificates', [CabinetController::class, 'certificates']);
    });

    Route::prefix('admin')->middleware('role:admin,teacher,moderator')->group(function () {
        Route::get('/dashboard', DashboardController::class);

        Route::get('/programs', [ProgramController::class, 'index']);
        Route::post('/programs', [ProgramController::class, 'store']);
        Route::put('/programs/{program}', [ProgramController::class, 'update']);
        Route::delete('/programs/{program}', [ProgramController::class, 'destroy']);

        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses/{course}', [CourseController::class, 'show']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        Route::post('/courses/{course}/modules', [ModuleController::class, 'store']);
        Route::put('/modules/{module}', [ModuleController::class, 'update']);
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);

        Route::post('/modules/{module}/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);

        Route::get('/leads', [LeadController::class, 'index']);
        Route::put('/leads/{lead}', [LeadController::class, 'update']);

        Route::get('/enrollments', [EnrollmentController::class, 'index']);
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'destroy']);
        Route::get('/students', [EnrollmentController::class, 'students']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        Route::get('/banners', [SiteController::class, 'banners']);
        Route::post('/banners', [SiteController::class, 'storeBanner']);
        Route::put('/banners/{banner}', [SiteController::class, 'updateBanner']);
        Route::delete('/banners/{banner}', [SiteController::class, 'destroyBanner']);

        Route::get('/schedule', [SiteController::class, 'schedule']);
        Route::post('/schedule', [SiteController::class, 'storeSchedule']);
        Route::put('/schedule/{scheduleEvent}', [SiteController::class, 'updateSchedule']);
        Route::delete('/schedule/{scheduleEvent}', [SiteController::class, 'destroySchedule']);

        Route::get('/testimonials', [SiteController::class, 'testimonials']);
        Route::post('/testimonials', [SiteController::class, 'storeTestimonial']);
        Route::put('/testimonials/{testimonial}', [SiteController::class, 'updateTestimonial']);
        Route::delete('/testimonials/{testimonial}', [SiteController::class, 'destroyTestimonial']);

        Route::get('/faqs', [SiteController::class, 'faqs']);
        Route::post('/faqs', [SiteController::class, 'storeFaq']);
        Route::put('/faqs/{faqItem}', [SiteController::class, 'updateFaq']);
        Route::delete('/faqs/{faqItem}', [SiteController::class, 'destroyFaq']);

        Route::get('/settings', [SiteController::class, 'settings']);
        Route::put('/settings', [SiteController::class, 'updateSettings']);
        Route::post('/uploads', [SiteController::class, 'upload']);

        Route::get('/certificates', [CertificateController::class, 'index']);
        Route::post('/certificates', [CertificateController::class, 'store']);
        Route::put('/certificates/{certificate}', [CertificateController::class, 'update']);
        Route::delete('/certificates/{certificate}', [CertificateController::class, 'destroy']);
        Route::get('/issued-certificates', [CertificateController::class, 'issued']);
        Route::post('/issued-certificates', [CertificateController::class, 'storeIssued']);
        Route::delete('/issued-certificates/{issuedCertificate}', [CertificateController::class, 'destroyIssued']);
    });
});
