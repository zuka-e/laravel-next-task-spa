<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Fortify;

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
        $flash = [
            'severity' => 'success',
            'message' => __('Logged out.'),
        ];

        return $request->wantsJson()
            ? response()->json($flash)
            : redirect(Fortify::redirects('logout'))->with($flash);
    }
}
