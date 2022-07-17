<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @see \Laravel\Fortify\Http\Responses\RegisterResponse
     */
    public function toResponse($request)
    {
        // `201`の他、Userを返却
        return $request->wantsJson()
            ? new JsonResponse(['user' => new UserResource(Auth::user())], 201)
            : redirect()->intended(config('fortify.home'));
    }
}
