<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'discipline', 'organizer',
        'latitude', 'longitude',
        'maxParticipants', 'date', 'deadline'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [ ];

    public function organizer() {
        return $this->belongsTo(User::class, 'organizer');
    }

    public function registrations() {
        return $this->hasMany(Registration::class, 'tournament');
    }

    public function matches() {
        return $this->hasMany(AMatch::class, 'tournament');
    }

    public function logos() {
        return $this->hasMany(Logo::class, 'tournament');
    }

}
