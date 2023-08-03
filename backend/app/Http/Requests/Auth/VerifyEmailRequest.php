<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Services\VerifyEmailService;
use Laravel\Fortify\Http\Requests\VerifyEmailRequest as OriginalVerifyEmailRequest;

/**
 * @see \Laravel\Fortify\Http\Requests\VerifyEmailRequest
 */
class VerifyEmailRequest extends OriginalVerifyEmailRequest
{
    /**
     * @var null|\App\Models\User
     */
    protected ?User $user = null;

    /**
     * @param  \App\Services\VerifyEmailService  $verifyEmailService
     */
    public function __construct(
        protected VerifyEmailService $verifyEmailService,
    ) {
        parent::__construct();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->user = $this->resolveUser();
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (!$this->user) {
            return false;
        }

        $credentials = $this->verifyEmailService->getCredentials($this->user);

        if (!hash_equals($credentials['hash'], (string) $this->route('hash'))) {
            return false;
        }

        return true;
    }

    /**
     * Resolve the user from the path parameter 'id'
     *
     * @return null|\App\Models\User
     */
    protected function resolveUser(): ?User
    {
        $encryptedId = $this->route('id');

        if (!is_string($encryptedId)) {
            return null;
        }

        $id = $this->verifyEmailService->decrypt($encryptedId);

        if (!$id) {
            return false;
        }

        $user = User::query()->find($id);

        if (!($user instanceof User)) {
            return null;
        }

        return $user;
    }

    /**
     * Return the resolved user from the path parameter 'id'
     *
     * @return \App\Models\User
     * @throws \BadMethodCallException
     */
    public function resolvedUser(): User
    {
        if (!$this->user) {
            throw new \BadMethodCallException(
                'This method cannot be used for an invalid request.',
            );
        }

        return $this->user;
    }
}
