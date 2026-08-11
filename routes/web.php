<?php

use App\Http\Controllers\EditorController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::get('/editor', [EditorController::class, 'index']);

