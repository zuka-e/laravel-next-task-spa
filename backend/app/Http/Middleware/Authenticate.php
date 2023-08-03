<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Arr;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     * @see \Illuminate\Auth\Middleware\Authenticate::redirectTo
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            $frontendUrl = config('fortify.home');
            $query = Arr::query(['redirect_uri' => $request->fullUrl()]);

            return "{$frontendUrl}/login?{$query}";
        }
    }
}
