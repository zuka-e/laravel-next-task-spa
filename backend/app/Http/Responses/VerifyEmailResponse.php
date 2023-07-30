<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::__invoke
 * @see \Laravel\Fortify\Http\Responses\VerifyEmailResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class VerifyEmailResponse implements VerifyEmailResponseContract
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        /** @var null|\App\Models\User Auth user if logged in */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return abort(403);
        }

        return response()->json([
            'severity' => 'success',
            'message' => __('Your email address was verified.'),
            'user' => $this->userResource->make($user),
        ]);
    }
}
