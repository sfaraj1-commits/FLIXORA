<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->profiles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'is_kid' => 'boolean',
            'avatar' => 'nullable|string',
        ]);

        $profile = $request->user()->profiles()->create([
            'name' => $request->name,
            'is_kid' => $request->is_kid ?? false,
            'avatar' => $request->avatar ?? 'https://i.pravatar.cc/150?img=60',
        ]);

        return response()->json($profile, 201);
    }

    public function updateSettings(Request $request)
    {
        $user = $request->user();
        // تحديث إعدادات المستخدم أو البروفايل الحالي
        return response()->json(['message' => 'تم حفظ التفضيلات بنجاح']);
    }
}