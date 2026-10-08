<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movie extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * الحقول القابلة للتعبئة الجماعية (Mass Assignable)
     */
    protected $fillable = [
        'title',
        'description',
        'poster_url',
        'video_url',
        'type',
        'genre',
        'release_year',
        'is_trending',
        'views_count',
    ];

    /**
     * تحويل أنواع البيانات عند الاسترجاع (Attribute Casting)
     */
    protected $casts = [
        'is_trending' => 'boolean',
        'views_count' => 'integer',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    /**
     * العلاقة مع قائمة المشاهدة (My List)
     */
    public function addedToLists()
    {
        return $this->hasMany(MyList::class);
    }

    /**
     * العلاقة مع جلسات المشاهدة الجماعية (Watch Parties)
     */
    public function watchParties()
    {
        return $this->hasMany(WatchParty::class);
    }

    /**
     * Scope لاسترجاع المحتوى الشائع فقط (Trending)
     */
    public function scopeTrending($query)
    {
        return $query->where('is_trending', true);
    }

    /**
     * Scope للفلترة بحسب النوع (Movie أو Series)
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}