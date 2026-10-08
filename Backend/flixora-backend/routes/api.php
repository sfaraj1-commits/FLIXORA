<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\AiController; // تعديل حرف i إلى صغير

/*
|--------------------------------------------------------------------------
| API Routes — FLIXORA Backend
|--------------------------------------------------------------------------
*/

// المسارات العامة (بدون تسجيل دخول)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// مسار المساعد الذكي المباشر من الشات
Route::post('/ai/chat', [AiController::class, 'chat']);


// المسارات المحمية (تتطلب Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // جلب بيانات المستخدم الحالي
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // إدارة البروفايلات (Profiles Management)
    Route::get('/profiles', [ProfileController::class, 'index']);
    Route::post('/profiles', [ProfileController::class, 'store']);
    
    // التفضيلات والإعدادات
    Route::post('/settings', [ProfileController::class, 'updateSettings']);
    
    // المساعد الذكي الخاص بداخل النظام
    Route::post('/ai-recommend', [AiAssistantController::class, 'recommend']);
    
    // تسجيل الخروج
    Route::post('/logout', [AuthController::class, 'logout']);
});