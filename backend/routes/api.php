<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/home', fn () => Auth::user());

Route::group([
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1',
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/users/auth', fn () => new UserResource(Auth::user()));
    Route::delete('/users/auth', function (Request $request) {
        $request->user()->delete();
        return response()->json([], 204);
    });
    Route::middleware('verified')
        ->apiResource('users.task_cards', TaskCardController::class)
        ->only('index', 'show');
    Route::middleware('verified')
        ->apiResource('users.task_cards', TaskCardController::class)
        ->only('store');
});

Route::any('/{any?}', function ($any = null) {
    return response()->json([
        'error' => [
            'title' => '404 Not Found',
            'message' => 'The requested URL was not found'
        ]
    ], 404);
})->where('any', '.*');
