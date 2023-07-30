<?php

namespace App\Services;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

/**
 * Resolve email verification logic
 */
class VerifyEmailService
{
    /**
     * @param  \Illuminate\Foundation\Auth\User  $user
     * @return array<string, string>
     */
    public function getCredentials(User $user): array
    {
        $id = $user->getKey();
        $encryptedId = Crypt::encryptString($id);
        $email = $user->getEmailForVerification();
        $hashedEmail = hash_hmac('sha256', $email, config('app.key'));

        return ['id' => $encryptedId, 'hash' => $hashedEmail];
    }

    /**
     * @param  string  $payload
     * @return string|false
     * @see https://laravel.com/docs/10.x/encryption
     */
    public function decrypt(string $payload): string|false
    {
        try {
            return Crypt::decryptString($payload);
        } catch (DecryptException $e) {
            Log::warning($e);
            return false;
        }
    }
}
