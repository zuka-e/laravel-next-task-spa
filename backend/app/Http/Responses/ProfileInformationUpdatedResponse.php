<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse as ProfileInformationUpdatedResponseContract;
use Laravel\Fortify\Fortify;

/**
 * @see \App\Http\Controllers\Auth\ProfileInformationController::update
 * @see \Laravel\Fortify\Http\Responses\ProfileInformationUpdatedResponse
 * @see \App\Providers\FortifyServiceProvider
 */
class ProfileInformationUpdatedResponse implements
    ProfileInformationUpdatedResponseContract
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
            'message' => __('The :resource was updated!', [
                'resource' => __('Profile Information'),
            ]),
        ];

        return $request->wantsJson()
            ? response()->json([
                ...$flash,
                'user' => $this->userResource->make($request->user()),
            ])
            : back()->with([
                ...$flash,
                'status' => Fortify::PROFILE_INFORMATION_UPDATED,
            ]);
    }
}
