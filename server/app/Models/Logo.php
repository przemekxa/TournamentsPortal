<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logo extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tournament', 'filename'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [ ];

    public function tournament() {
        return $this->belongsTo(Tournament::class, 'tournament');
    }

}
