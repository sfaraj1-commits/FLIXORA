<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['user', 'admin'])->default('user')->index();
            $table->timestamps();
        });

        // Profiles Table
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('avatar')->default('default.png');
            $table->boolean('is_kid')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // Movies & Series Table
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->text('description');
            $table->string('poster_url');
            $table->string('video_url');
            $table->enum('type', ['movie', 'series'])->default('movie')->index();
            $table->string('genre')->index();
            $table->string('release_year', 4)->index();
            $table->boolean('is_trending')->default(false)->index();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['type', 'genre', 'is_trending']);
        });

        // My List Table
        Schema::create('my_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('movie_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['profile_id', 'movie_id']);
        });

        // Watch Party Rooms Table
        Schema::create('watch_parties', function (Blueprint $table) {
            $table->id();
            $table->string('room_code', 10)->unique();
            $table->foreignId('host_profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignId('movie_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('watch_parties');
        Schema::dropIfExists('my_lists');
        Schema::dropIfExists('movies');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('users');
    }
};
