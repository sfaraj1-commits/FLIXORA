<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyList extends Model
{
    use HasFactory;

    protected $fillable = ['profile_id', 'movie_id'];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}