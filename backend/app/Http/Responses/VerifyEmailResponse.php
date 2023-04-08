<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Support\Arr;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;

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

        $flash = [
            'severity' => 'success',
            'message' => __('Your email address was verified.'),
        ];

        // When the link on email is clicked,...
        return $request->wantsJson()
            ? // with not logged in (and then logged in).
            response()->json([
                ...$flash,
                'user' => $this->userResource->make($user),
            ])
            : // with logged in.
            redirect(
                Fortify::redirects('email-verification') .
                    '?' .
                    Arr::query(['verified' => true]),
            )->with($flash);
    }
}
