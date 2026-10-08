<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function chat(Request $request)
    {
        $prompt = $request->input('prompt');
        $apiKey = env('TOGETHER_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'مفتاح TOGETHER_API_KEY غير مضاف في ملف .env'], 500);
        }

        try {
            $response = Http::timeout(30)->withHeaders([
                'Authorization' => 'Bearer ' . trim($apiKey),
                'Content-Type' => 'application/json',
            ])->post('https://api.together.xyz/v1/chat/completions', [
                'model' => 'meta-llama/Meta-Llama-3-8B-Instruct-Turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'أنت مساعد سينمائي ذكي لموقع FLIXORA. أجب عن أسئلة الأفلام بأسلوب جذاب ومختصر بالعربية.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $reply = $result['choices'][0]['message']['content'] ?? 'أهلاً بك!';
                return response()->json(['reply' => $reply]);
            }

            return response()->json(['error' => 'خطأ من السيرفر: ' . $response->body()], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => 'خطأ في الاتصال: ' . $e->getMessage()], 500);
        }
    }
}