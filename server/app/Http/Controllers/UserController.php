<?php

namespace App\Http\Controllers;

use App\Mail\UserCreated;
use App\Mail\UserResetPassword;
use App\Models\AMatch;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'create',
            'login',
            'activate',
            'requestResetPassword',
            'resetPassword'
        ]]);
    }

    // public function showAll()
    // {
    //     return response()->json(User::all());
    // }

    public function create(Request $request)
    {
        $messages = [
            'required' => 'Pole :attribute jest wymagane',
            'email' => 'Nieprawidłowy adres email',
            'unique' => 'Użytkownik o podanym adresie email już znajduje się w bazie.',
            'password.min' => 'Hasło musi mieć długość co najmniej 8'
        ];
        $this->validate($request, [
            'email' => 'required|email|unique:users,email',
            'firstName' => 'required',
            'lastName' => 'required',
            'password' => 'required|min:8'
        ], $messages);

        $user = new User;
        $user->fill($request->all());
        $user->password = Hash::make($request->input('password'));
        $user->activation = substr(str_shuffle(str_repeat(
            $x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(64/strlen($x)) 
        )),1,64);
        $user->save();

        $activationData = [
            'email' => $user->email,
            'activation' => $user->activation
        ];
        $activationDataEncoded = base64_encode(json_encode($activationData));
        error_log('activation: ' . $activationDataEncoded . ' to be sent to ' . $user->email);

        Mail::to($user->email)->send(new UserCreated($user, $activationDataEncoded));

        return response()->json($user, 201);

    }


    public function delete(Request $request) {

        $user = User::find(Auth::user()->email);

        // Logout user
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $user->delete();

        return response(null);
    }

    public function activate(Request $request) {
        $email = $request->input('email');
        $activation = $request->input('activation');

        $user = User::findOrFail($email);
        if(isset($user->activation) && $user->activation == $activation) {
            $user->activation = null;
            $user->save();
            return response(null);
        } else {
            return response('Activation link not found', 404);
        }
    }

    public function requestResetPassword($email) {
        $user = User::findOrFail(base64_decode($email));
        $user->restoration = substr(str_shuffle(str_repeat(
            $x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(64/strlen($x)) 
        )),1,64);
        $user->save();

        // /#/resetPassword/:email/:restoration
        error_log('restoration: ' . $user->restoration . ' to be sent to ' . $user->email);

        Mail::to($user->email)->send(new UserResetPassword($user));

        return response(null);
    }

    public function resetPassword(Request $request) {

        $this->validate($request, [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
            'restoration' => 'required'
        ]);
        
        $email = $request->input('email');
        $password = $request->input('password');
        $restoration = $request->input('restoration');

        $user = User::findOrFail($email);
        if(isset($user->restoration) && $user->restoration == $restoration) {
            $user->restoration = null;
            $user->password = Hash::make($password);
            $user->save();
            return response(null);
        } else {
            return response('Activation link not found', 404);
        }
    }

    
    /**
     * User authentication
     */

    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['email', 'password']);
        $credentials['activation'] = null;

        // $user = User::findOrFail($credentials['email']);

        // if(isset($user->activation)) {
        //     return response('Konto nieaktywne', 401);
        // }

        if(Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json(Auth::user());
            
        }

        return response(null, 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me() {

        $user = User::with(['organizer', 'registrations.tournament'])
            ->findOrFail(Auth::user()->email);
        $matches = AMatch::with(['tournament', 'playerA', 'playerB'])
            ->where('playerA', $user->email)
            ->orWhere('playerB', $user->email)
            ->get()
            ->toArray();
        $user = $user->toArray();
        $user['matches'] = $matches;
        //$organized = Tournament::where('')
        return response()->json($user);
    }
}
