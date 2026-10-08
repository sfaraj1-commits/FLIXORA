<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء مستخدم تجريبي
        $user = User::create([
            'name' => 'سوزان علي',
            'email' => 'susan@flixora.com',
            'password' => Hash::make('password123'),
            'role' => 'user'
        ]);

        // 2. إنشاء بروفايلات مرتبطة به
        Profile::create([
            'user_id' => $user->id,
            'name' => 'سوزان',
            'avatar' => 'https://i.pravatar.cc/150?img=33',
            'is_kid' => false,
        ]);

        Profile::create([
            'user_id' => $user->id,
            'name' => 'أطفال FLIXORA',
            'avatar' => 'https://i.pravatar.cc/150?img=12',
            'is_kid' => true,
        ]);
    }
}