<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AiAssistantController extends Controller
{
    public function recommend(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        $prompt = mb_strtolower($request->prompt);

        // خوارزمية فلترة مبسطة بناءً على الكلمات المفتاحية
        if (str_contains($prompt, 'مسلسل') || str_contains($prompt, 'قصير')) {
            $recommendedMovie = [
                'id' => 101,
                'title' => 'Chernobyl',
                'rating' => '9.4',
                'year' => '2019',
                'poster' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
                'description' => 'دراما تاريخية قصيرة توثق إحدى أكبر الكوارث البشرية حبكةً وإثارة.'
            ];
        } elseif (str_contains($prompt, 'أكشن') || str_contains($prompt, 'سيارات') || str_contains($prompt, 'سرعة')) {
            $recommendedMovie = [
                'id' => 102,
                'title' => 'Mad Max: Fury Road',
                'rating' => '8.1',
                'year' => '2015',
                'poster' => 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=300',
                'description' => 'مطاردات صحراوية حابسة للأنفاس في عالم ما بعد نهاية العالم.'
            ];
        } else {
            $recommendedMovie = [
                'id' => 1,
                'title' => 'Interstellar',
                'rating' => '8.7',
                'year' => '2014',
                'poster' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300',
                'description' => 'رحلة ملحمية عبر الثقوب الدودية للبحث عن موطن جديد للبشرية.'
            ];
        }

        return response()->json([
            'status' => 'success',
            'movie' => $recommendedMovie
        ]);
    }
}