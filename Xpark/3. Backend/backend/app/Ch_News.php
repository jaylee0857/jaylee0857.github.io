<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ch_News extends Model
{
    protected $table = 'ch_news';

    protected $fillable = [
        'sort', 'title', 'date', 'image', 'info'
    ];
}
