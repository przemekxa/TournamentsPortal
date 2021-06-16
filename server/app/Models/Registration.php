<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tournament', 'user', 'license', 'rank'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [ ];

    public function user() {
        return $this->belongsTo(User::class, 'user');
    }

    public function tournament() {
        return $this->belongsTo(Tournament::class, 'tournament');
    }


}
