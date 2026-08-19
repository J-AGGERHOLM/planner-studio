<?php

use App\Http\Controllers\EditorController;
use App\Http\Controllers\ThreeDModelController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EditorController::class, 'index'])->name('home');