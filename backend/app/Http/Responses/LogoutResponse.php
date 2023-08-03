<?php

namespace App\Http\Responses;

use App\Enums\Severity;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::destroy
 * @see \Laravel\Fortify\Http\Responses\LogoutResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class LogoutResponse implements LogoutResponseContract
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
            'severity' => Severity::Success,
            'message' => __('Logged out.'),
        ]);
    }
}
