<?php

namespace App\Http\Controllers;

use App\Models\AMatch;
use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class MatchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'show',
        ]]);
    }

    public function show($tournament)
    {
        $tournament = Tournament::findOrFail($tournament);
        $registrations = Registration::where('tournament', $tournament->id)->get();
        $matches = AMatch::where('tournament', $tournament->id)->get();

        if(
            $registrations->count() > 0 &&
            strtotime($tournament->deadline) < time() &&
            $matches->count() == 0
            ) 
        {
            $this->createMatches($tournament);
        }
        $matches = AMatch::where('tournament', $tournament->id)
            ->with(['playerA', 'playerB'])
            ->get();

        return response()->json($matches);
    }

    public function setWinner(Request $request) {

        $user = Auth::user()->email;
        $winner = $request->input('winner');
        $match = AMatch::findOrFail($request->input('id'));

        if(empty($match->playerA) || empty($match->playerB) ||
            (isset($match->winnerA) && isset($match->winnerB))) {
            return response('Nie można ustawić zwycięzcy', 400);
        }

        $this->validate($request, [
            'id' => 'required|exists:matches,id',
            'winner' => 'required|in:A,B'
        ]);

        if($user == $match->playerA) {
            $match->winnerA = $winner;
        } else {
            $match->winnerB = $winner;
        }

        if(isset($match->winnerA) && isset($match->winnerB)) {
            if($match->winnerA == $match->winnerB) {
                // Copy winner to the next match
                $winnerEmail = $match->winnerA == 'A' ? $match->playerA : $match->playerB;
                if(isset($match->nextMatch)) {
                    $nextMatch = AMatch::findOrFail($match->nextMatch);
                    if($match->nextMatchFirst) {
                        $nextMatch->playerA = $winnerEmail;
                    } else {
                        $nextMatch->playerB = $winnerEmail;
                    }
                    $nextMatch->save();
                }
            } else {
                $match->winnerA = null;
                $match->winnerB = null;
            }
        }
        $match->save();
        return response($match);
    }

    private function createMatches($tournament) {
        $registrations = Registration::where('tournament', $tournament->id)->get()->all();
        shuffle($registrations);

        $levels = floor(log(count($registrations), 2));
        $extra = count($registrations) - (2 ** $levels);

        
        
        $previousMatches = [];
        $nextMatches = [];

        // On each level except the last one
        for($level = 1; $level < $levels; $level += 1) {

            // Number of matches on this level
            $matchCount = 2 ** ($level - 1);

            // Create the matches
            for($m = 0; $m < $matchCount; $m += 1) {
                if(!empty($previousMatches)) {
                    $nextMatch = $previousMatches[floor($m / 2)]->id;
                    $nextMatchFirst = ($m % 2) == 0;
                } else {
                    $nextMatch = null;
                    $nextMatchFirst = false;
                }
                
                $match = AMatch::create([
                    'tournament' => $tournament->id,
                    'level' => $level,
                    'nextMatch' => $nextMatch,
                    'nextMatchFirst' => $nextMatchFirst,
                ]);
                $nextMatches[] = $match;
            }

            $previousMatches = $nextMatches;
            $nextMatches = [];
        }

        // On last level
        $matchCount = 2 ** ($levels - 1);
        $r = - $extra;

        // Create the matches
        for($m = 0; $m < $matchCount; $m += 1) {
            if(!empty($previousMatches)) {
                $nextMatch = $previousMatches[floor($m / 2)]->id;
                $nextMatchFirst = ($m % 2) == 0;
            } else {
                $nextMatch = null;
                $nextMatchFirst = false;
            }
            $playerA = $r >= 0 ?  $registrations[$r]->user : null;
            $playerB = $r + 1 + 1 >= 0 ?  $registrations[$r + 1]->user : null;
            
            $match = AMatch::create([
                'tournament' => $tournament->id,
                'level' => $levels,
                'nextMatch' => $nextMatch,
                'nextMatchFirst' => $nextMatchFirst,
                'playerA' => $playerA,
                'playerB' => $playerB,
            ]);
            $nextMatches[] = $match;
            $r += 2;
        }

        $previousMatches = $nextMatches;
        $nextMatches = [];

        // On extra level
        if($extra > 0) {
            for($m = 0; $m < $extra; $m += 1) {
                if(!empty($previousMatches)) {
                    $nextMatch = $previousMatches[floor($m / 2)]->id;
                    $nextMatchFirst = ($m % 2) == 0;
                } else {
                    $nextMatch = null;
                    $nextMatchFirst = false;
                }
                
                $match = AMatch::create([
                    'tournament' => $tournament->id,
                    'level' => $levels + 1,
                    'nextMatch' => $nextMatch,
                    'nextMatchFirst' => $nextMatchFirst,
                    'playerA' => $registrations[$r]->user,
                    'playerB' => $registrations[$r+ 1]->user,
                ]);
                $nextMatches[] = $match;
                $r += 2;
            }
        }

        return response($registrations);
    }
}
