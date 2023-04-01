<?php

namespace App\Providers;

use App\Http\Resources\ApiResource;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\ServiceProvider;

/**
 * @see https://laravel.com/docs/container#binding
 */
class ApiResourceServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Resolve even extended classes
        $this->app->beforeResolving(ApiResource::class, function (
            string $class,
            array $parameters,
        ): void {
            // For `singleton` instead of `singletonIf`,
            // resolving multiple times at the same place can lead to infinite loops.
            $this->app->singletonIf(
                $class,
                fn(Application $app): ApiResource => new $class(
                    // Accept param. e.g. app(UserResource::class, ['resource' => $user]);
                    $parameters['resource'] ?? $app->make(MissingValue::class),
                ),
            );
        });
    }
}
