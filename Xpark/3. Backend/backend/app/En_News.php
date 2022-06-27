<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class En_News extends Model
{
    protected $table = 'en_news';

    protected $fillable = [
        'sort', 'title', 'date', 'image', 'info'
    ];
}
