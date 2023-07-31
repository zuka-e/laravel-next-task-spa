<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

/**
 * @see \App\Http\Controllers\Auth\RegisteredUserController::store
 * @see \Laravel\Fortify\Http\Responses\RegisterResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class RegisterResponse implements RegisterResponseContract
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
        return response()->json(
            [
                'severity' => 'success',
                'message' => __('Registration has been completed.'),
                'user' => $this->userResource->make($request->user()),
            ],
            201,
        );
    }
}
