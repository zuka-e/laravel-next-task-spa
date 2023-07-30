<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\Verified;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Illuminate\Support\Facades\Auth;

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController
 */
class VerifyEmailController extends Controller
{
    /**
     * @param \App\Http\Resources\UserResource $userResource
     */
    public function __construct(protected UserResource $userResource)
    {
        //
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \App\Http\Requests\Auth\VerifyEmailRequest  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Routing\Exceptions\InvalidSignatureException
     */
    public function __invoke(VerifyEmailRequest $request)
    {
        $user = $request->resolvedUser();

        if ($user->hasVerifiedEmail()) {
            throw new InvalidSignatureException();
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        if (Auth::guest()) {
            Auth::login($user);
        }

        return response()->json([
            'severity' => 'success',
            'message' => __('Your email address was verified.'),
            'user' => $this->userResource->make($user),
        ]);
    }
}
