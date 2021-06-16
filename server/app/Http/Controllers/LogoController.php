<?php

namespace App\Http\Controllers;

use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    // public function show($tournament)
    // {
    //     $logos = Logo::where('tournament', $tournament)->get();

    //     return response($logos);
    // }

    public function create(Request $request)
    {

        $this->validate($request, [
            'tournament' => 'required|exists:tournaments,id',
            'logo' => 'required|image',
        ]);

        $file = $request->file('logo');

        $microtime = explode(" ", microtime());
        $microtime = $microtime[1]."_".str_replace(".", "_", $microtime[0]);

        $filename = $microtime . ".".$file->extension();

        $path = $file->move("logo", $filename);
        $url = url($path);

        $logo = Logo::create([
            'tournament' => $request->input('tournament'),
            'filename' => $filename
        ]);

        $logoJson = json_decode($logo->toJson());
        $logoJson->url = $url;
        
        return response()->json($logoJson, 201);
    }

    public function delete($id)
    {

        $logo = Logo::with('tournament')->findOrFail($id);
        $logo_arr = $logo->toArray();

        if($logo_arr['tournament']['organizer'] != Auth::user()->email) {
            return response('Użytkownik nie jest organizatorem tego turnieju', 401);
        }

        // Delete the file
        $path = base_path('public/logo/'.$logo->filename);
        unlink($path);

        $logo->delete();
        
        return response(null, 200);
    }

}
