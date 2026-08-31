<?php

namespace App\Http\Controllers;

use App\Models\Mesh;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Editor', [
            'meshes' => Mesh::all(),
        ]);
    }
}
