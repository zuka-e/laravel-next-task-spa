<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

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
     * Build the mail representation of the notification.
     *
     * @param  \Illuminate\Foundation\Auth\User  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return $this->buildMailMessage($this->verificationUrl($notifiable));
    }

    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
        return (new MailMessage())
            ->subject(__('Verify Your Email Address'))
            ->greeting(__('Thanks for registration'))
            ->line(
                __(
                    'Please click the button below to verify your email address.',
                ),
            )
            ->line(
                __('This password reset link will expire in :count minutes.', [
                    'count' => config('auth.verification.expire'),
                ]),
            )
            ->action(__('Verify Email Address'), $url)
            ->line(
                __(
                    'If you did not create an account, no further action is required.',
                ),
            )
            ->salutation(__('Regards.'));
    }

    /**
     * Get the relative verification URL with frontend domain for the given notifiable.
     * ※ In general, the verification link should point to the frontend.
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
    protected function verificationUrl($notifiable)
    {
        $credentials = [
            'id' => $notifiable->getKey(),
            'hash' => sha1($notifiable->getEmailForVerification()),
        ];

        $signedUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(config('auth.verification.expire')),
            $credentials,
            absolute: false,
        );

        $signedQuery = parse_url($signedUrl, PHP_URL_QUERY);
        $frontendUrl = config('fortify.home');

        return "{$frontendUrl}/email/verify/" .
            join('/', $credentials) .
            "?{$signedQuery}";
    }
}
