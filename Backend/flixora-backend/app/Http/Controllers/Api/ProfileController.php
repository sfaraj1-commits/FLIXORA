<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $validated = $request->validate([
            'name'   => 'required|string|max:50',
            'avatar' => 'nullable|string',
            'is_kid' => 'boolean',
        ]);

        $profile = $request->user()->profiles()->create($validated);

        return response()->json($profile, 201);
    }

    public function destroy(Request $request, $id)
    {
        $profile = $request->user()->profiles()->findOrFail($id);
        $profile->delete();

        return response()->json(['message' => 'تم حذف البروفايل بنجاح']);
    }
}