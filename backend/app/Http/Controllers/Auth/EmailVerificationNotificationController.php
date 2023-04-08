<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController as Controller;
use Laravel\Fortify\Fortify;

/**
 * It extends `\Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController`
 */
class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            $flash = [
                'severity' => 'info',
                'message' => __(
                    'Your email address has already been verified.',
                ),
            ];

            return $request->wantsJson()
                ? response()->json($flash)
                : redirect()
                    ->intended(Fortify::redirects('email-verification'))
                    ->with($flash);
        }

        $request->user()->sendEmailVerificationNotification();

        $flash = [
            'severity' => 'success',
            'message' => __('A new verification link has been sent.'),
        ];

        return $request->wantsJson()
            ? response()->json($flash, 202)
            : back()->with([
                ...$flash,
                'status' => Fortify::VERIFICATION_LINK_SENT,
            ]);
    }
}
