<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SessionConstroller extends Controller
{
    // Get all session data
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->session()->all());
    }

    // store session data
    public function store(Request $request): Response
    {
        $request->session()->put(
            'modelSession',
            $request->input('modelSession', [])
        );

        return response()->noContent();

    }

    public function flush(Request $request): Response
    {
        $request->session()->forget('modelSession');

        return response()->noContent();

    }
}
