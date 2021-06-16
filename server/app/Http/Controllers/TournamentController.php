<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TournamentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'showAll',
            'showOne',
        ]]);
    }

    public function showAll(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $name = $request->query('name');

        $tournaments = Tournament::where('name', 'LIKE', '%'.$name.'%')
            ->paginate($limit);

        return response()->json($tournaments);
    }

    public function showOne($id)
    {
        $tournament = Tournament::with(['organizer', 'registrations.user', 'logos'])
            ->findOrFail($id)
            ->toArray();
        //$registrations = Registration::where('tournament', $id)->get()->toArray();
        //$tournament['registrations'] = Registration::where('tournament', $id)->get()->toArray();

        return response()->json($tournament);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'discipline' => 'required',
            'maxParticipants' => 'required|min:1|max:255',
            'date' => 'required|date|after_or_equal:now',
            'deadline' => 'required|date|after_or_equal:now'
        ]);

        $data = $request->all();
        $data['organizer'] = Auth::user()->email;

        $tournament = Tournament::create($data);
        return response()->json($tournament, 201);
    }

    public function update(Request $request, $id) {
        
        $this->validate($request, [
            'name' => 'required',
            'discipline' => 'required',
            'maxParticipants' => 'required|min:1|max:255',
            'date' => 'required|date|after_or_equal:now',
            'deadline' => 'required|date|after_or_equal:now'
        ]);

        $data = $request->all();
        
        $tournament = Tournament::findOrFail($id);

        if($tournament->registrations()->count() > $request->input('maxParticipants')) {
            return response('Limit zgłoszeń nie może być mniejszy niż aktualnia liczba zgłoszeń', 400);
        }

        $tournament->update($data);
        return response()->json($tournament, 200);
    }


    public function delete($id) {

        $tournament = Tournament::with([
            'matches',
            'registrations',
            'logos'
            ])->findOrFail($id);

        if(Auth::user()->email != $tournament->organizer) {
            return response('Brak uprawnień', 401);
        }
        
        $tournament->matches()->delete();
        $tournament->registrations()->delete();
        $tournament->logos()->delete();
        $tournament->delete();

        return response(null);
    }

    // public function register(Request $request) {

    //     $this->validate($request, [
    //         'id' => 'required|exists:tournaments,id',
    //         'license' => 'required|string|unique:registrations,license',
    //         'rank' => 'required|string|unique:registrations,license',
    //     ]);

    //     $tournament = Tournament::findOrFail($request->input('id'));
    //     $user = Auth::user();

    //     if(Registration::where('tournament', $request->input('id'))
    //         ->where('user', $user->email)
    //         ->first() !== null)
    //     {
    //         return response('Użytkownik już zarejestrowany na ten turniej', 400);
    //     }
        
    // }
}
