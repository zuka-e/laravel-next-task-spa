<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
 * @see \Laravel\Fortify\Http\Responses\LoginResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class LoginResponse implements LoginResponseContract
{
    /**
     * @param \App\Http\Resources\UserResource $userResource
     */
    public function __construct(private UserResource $userResource)
    {
        //
    }

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
            'message' => __('Logged in.'),
        ];

        // Mainly for email verification.
        if (isSameOrigin(redirect()->getIntendedUrl() ?? '', $request->url())) {
            return redirect()
                ->intended()
                ->with($flash);
        }

        return $request->wantsJson()
            ? response()->json([
                ...$flash,
                'user' => $this->userResource->make($request->user()),
                'two_factor' => false,
            ])
            : redirect()
                ->intended(Fortify::redirects('login'))
                ->with($flash);
    }
}
