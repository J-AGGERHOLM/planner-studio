<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SessionConstroller extends Controller
{
    //Get all session data
    public function index(Request $request) {
        return $request->session()->all();
    }

    //store session data
    public function store(Request $request)
{
    $request->session()->put(
        'modelSession',
        $request->input('modelSession', [])
    );

    return back();
}

 public function flush(Request $request)
    {
        $request->session()->forget('modelSession');

        return back();
    }



    }
