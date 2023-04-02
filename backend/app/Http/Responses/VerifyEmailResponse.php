<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Support\Arr;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;

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
     * @see \Laravel\Fortify\Http\Responses\VerifyEmailResponse
     */
    public function toResponse($request)
    {
        // When the link on email is clicked,...
        return $request->wantsJson()
            ? // with not logged in (and then logged in).
            response()->json([
                'user' => $this->userResource->make($request->user()),
            ])
            : // with logged in.
            redirect(
                Fortify::redirects('email-verification') .
                    '?' .
                    Arr::query(['verified' => true]),
            );
    }
}
