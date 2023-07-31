<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController as Controller;

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
            return response()->json([
                'severity' => 'info',
                'message' => __(
                    'Your email address has already been verified.',
                ),
            ]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(
            [
                'severity' => 'success',
                'message' => __('A new verification link has been sent.'),
            ],
            202,
        );
    }
}
