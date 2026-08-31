<?php

use App\Http\Controllers\EditorController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EditorController::class, 'index'])->name('home');

Route::get('/sessions', [SessionController::class, 'index']);
Route::post('/sessions', [SessionController::class, 'store']);
Route::delete('/sessions', [SessionController::class, 'flush']);
