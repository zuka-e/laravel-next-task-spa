<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\PasswordUpdateResponse as PasswordUpdateResponseContract;

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordController::update
 * @see \Laravel\Fortify\Http\Responses\PasswordUpdateResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class PasswordUpdateResponse implements PasswordUpdateResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        return response()->json([
            'severity' => 'success',
            'message' => __('The :resource was updated!', [
                'resource' => __('Password'),
            ]),
        ]);
    }
}
