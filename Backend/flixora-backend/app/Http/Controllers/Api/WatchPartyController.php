<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WatchParty;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WatchPartyController extends Controller
{
    public function createRoom(Request $request)
    {
        $validated = $request->validate([
            'host_profile_id' => 'required|exists:profiles,id',
            'movie_id'        => 'required|exists:movies,id',
        ]);

        $roomCode = strtoupper(Str::random(6));

        $party = WatchParty::create([
            'room_code'       => $roomCode,
            'host_profile_id' => $validated['host_profile_id'],
            'movie_id'        => $validated['movie_id'],
        ]);

        return response()->json([
            'message'   => 'تمت إنشاء غرفة المشاهدة الجماعية',
            'room_code' => $party->room_code,
            'party'     => $party->load('movie'),
        ], 201);
    }

    public function joinRoom(Request $request)
    {
        $validated = $request->validate([
            'room_code' => 'required|string|exists:watch_parties,room_code',
        ]);

        $party = WatchParty::where('room_code', $validated['room_code'])
            ->where('is_active', true)
            ->with(['movie', 'hostProfile'])
            ->firstOrFail();

        return response()->json([
            'message' => 'تم الانضمام للغرفة بنجاح',
            'party'   => $party,
        ]);
    }
}