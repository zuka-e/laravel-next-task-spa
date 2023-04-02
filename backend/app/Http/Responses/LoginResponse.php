<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

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
     * @see \Laravel\Fortify\Http\Responses\LoginResponse
     */
    public function toResponse($request)
    {
        // Mainly for email verification.
        if (isSameOrigin(redirect()->getIntendedUrl() ?? '', $request->url())) {
            return redirect()->intended(Fortify::redirects('login'));
        }

        return $request->wantsJson()
            ? response()->json([
                'user' => $this->userResource->make($request->user()),
                'two_factor' => false,
            ])
            : redirect()->intended(config('fortify.home'));
    }
}
