<?php

use App\Http\Controllers\EditorController;
use App\Http\Controllers\SessionConstroller;
use Illuminate\Support\Facades\Route;

Route::get('/', [EditorController::class, 'index'])->name('home');

Route::get('/sessions', [SessionConstroller::class, 'index']);
Route::post('/sessions', [SessionConstroller::class, 'store']);
Route::delete('/sessions', [SessionConstroller::class, 'flush']);
