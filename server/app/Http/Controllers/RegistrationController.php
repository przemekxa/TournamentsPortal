<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function show($tournament)
    {
        $registrations = Registration::where('tournament', $tournament)->get();
        return response()->json($registrations);
    }

    public function create(Request $request)
    {

        $tournament = Tournament::findOrFail($request->input('tournament'));
        $registration = Registration::where('tournament', $tournament->id)->get();

        if($registration->count() >= $tournament->maxParticipants) {
            return response('Osiągnięto maksymalną liczbę uczestników', 400);
        }
        
        if(Registration::where('tournament', $tournament->id)
            ->where('user', Auth::user()->email)
            ->first() != null)
        {
            return response('Użytkownik już jest zarejestrowany', 400);
        }

        $this->validate($request, [
            'tournament' => 'required|exists:tournaments,id',
            'license' => [
                'required',
                Rule::unique('registrations')->where(function ($query) use($request) {
                    return $query
                        ->where('tournament', $request->input('tournament'))
                        ->where('license', $request->input('license'));
                })
            ],
            'rank' => [
                'required',
                Rule::unique('registrations')->where(function ($query) use($request) {
                    return $query
                        ->where('tournament', $request->input('tournament'))
                        ->where('rank', $request->input('rank'));
                })
            ]
        ]);

        $data = $request->all();
        $data['user'] = Auth::user()->email;

        $registration = Registration::create($data);
        return response()->json($registration, 201);
    }


    public function delete($id) {
        Registration::findOrFail($id)->delete();
        return response(null);
    }
}
