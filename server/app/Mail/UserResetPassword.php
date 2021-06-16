<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserResetPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $encodedEmail = base64_encode($user->email);
        $this->name = $user->firstName . ' ' . $user->lastName;
        $this->link = url() . '/#/resetPassword/' . $encodedEmail . '/' . $user->restoration;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject('Portal turniejowy - resetowanie hasła')
            ->view('userResetPassword');
    }
}
