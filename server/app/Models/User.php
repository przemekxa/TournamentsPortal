<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class User extends Model implements AuthenticatableContract
{

    use Authenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstName', 'lastName', 'email'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'activation', 'restoration', 'password'
    ];

    protected $primaryKey = 'email';

    protected $keyType = 'string';

    public $incrementing = false;

    public function organizer() {
        return $this->hasMany(Tournament::class, 'organizer');
    }

    public function registrations() {
        return $this->hasMany(Registration::class, 'user');
    }

}
