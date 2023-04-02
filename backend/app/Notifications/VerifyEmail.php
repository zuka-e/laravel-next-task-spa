<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

/**
 * This extends `\Illuminate\Auth\Notifications\VerifyEmail`.
 * According to the document, use `\App\Providers\AuthServiceProvider::boot()`
 * to customize the email verification.
 * But it looks a bit complicated at first. That is why this class is used.
 *
 * @see https://laravel.com/docs/verification#verification-email-customization
 * @see https://laravel.com/docs/10.x/verification#verification-email-customization
 * @see \Illuminate\Auth\Notifications\VerifyEmail ::toMailUsing
 */
class VerifyEmail extends VerifyEmailNotification
{
    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
        return (new MailMessage())
            ->subject(Lang::get('Verify Your Email Address'))
            ->greeting(Lang::get('Thanks for registration'))
            ->line(
                Lang::get(
                    'Please click the button below to verify your email address.',
                ),
            )
            ->action(Lang::get('Verify Email Address'), $url)
            ->line(
                Lang::get(
                    'If you did not create an account, no further action is required.',
                ),
            )
            ->salutation(Lang::get('Regards.'));
    }

    /**
     * Get the relative verification URL for the given notifiable.
     *
     * To validate, use relative `ValidateSignature` middleware (`signed:relative`).
     *
     * @param  \Illuminate\Foundation\Auth\User  $notifiable
     * @return string
     * @see \App\Http\Kernel $routeMiddleware['signed'] ↓
     * @see \Illuminate\Routing\Middleware\ValidateSignature ↓
     * @see \Illuminate\Routing\UrlGenerator hasValidRelativeSignature
     * @see \Illuminate\Routing\UrlGenerator temporarySignedRoute
     */
    // protected function relativeVerificationUrl(User $notifiable)
    // {
    //     return URL::temporarySignedRoute(
    //         'verification.verify',
    //         Carbon::now()->addMinutes(
    //             Config::get('auth.verification.expire', 60),
    //         ),
    //         [
    //             'id' => $notifiable->getKey(),
    //             'hash' => sha1($notifiable->getEmailForVerification()),
    //         ],
    //         absolute: false,
    //     );
    // }
}
