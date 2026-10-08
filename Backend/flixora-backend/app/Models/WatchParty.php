<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WatchParty extends Model
{
    use HasFactory;

    protected $fillable = ['room_code', 'host_profile_id', 'movie_id', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function hostProfile()
    {
        return $this->belongsTo(Profile::class, 'host_profile_id');
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}