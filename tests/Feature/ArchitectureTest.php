<?php

arch('app')
    ->expect('App')
    ->toBeCasedCorrectly();

arch('controllers')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('models')
    ->expect('App\Models')
    ->toBeClasses()
    ->toExtend('Illuminate\Database\Eloquent\Model');
