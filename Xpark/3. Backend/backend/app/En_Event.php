<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class En_Event extends Model
{
    protected $fillable = [
        'sort', 'title', 'sub_title','date', 'image', 'info'
    ];
}
