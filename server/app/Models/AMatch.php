<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AMatch extends Model
{

    protected $table = 'matches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tournament',
        'playerA', 'playerB',
        'level',
        'winnerA', 'winnerB',
        'nextMatch', 'nextMatchFirst'
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

    public function playerA() {
        return $this->belongsTo(User::class, 'playerA');
    }

    public function playerB() {
        return $this->belongsTo(User::class, 'playerB');
    }


}
