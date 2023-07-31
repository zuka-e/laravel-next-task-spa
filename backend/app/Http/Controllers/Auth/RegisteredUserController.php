<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Http\Controllers\RegisteredUserController as Controller;

/**
 * It extends `\Laravel\Fortify\Http\Controllers\RegisteredUserController`
 */
class RegisteredUserController extends Controller
{
    /**
     * Delete the authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        /** @var null|\App\Models\User Auth user if logged in */
        $user = $request->user();

        $user->delete();

        return response()->json([
            'severity' => 'warning',
            'message' => __('The :resource was deleted!', [
                'resource' => __('Account'),
            ]),
        ]);
    }
}
