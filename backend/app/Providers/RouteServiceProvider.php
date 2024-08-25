<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     * But it isn't used if the request is an XHR request.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->configureApiRoutes();

        $this->routes(function () {
            Route::middleware(['api', 'throttle:api'])
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        // Usage: `Route::middleware(['throttle:api'])...`
        // https://laravel.com/docs/routing#attaching-rate-limiters-to-routes
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(
                optional($request->user())->id ?: $request->ip(),
            );
        });
    }

    /**
     * Configure the routes offered by the application.
     *
     * @see \Laravel\Fortify\FortifyServiceProvider configureRoutes
     * @see \App\Providers\RouteServiceProvider
     */
    protected function configureApiRoutes(): void
    {
        $versionDirs = File::directories(base_path('routes/api'));

        foreach ($versionDirs as $versionDir) {
            foreach (File::files($versionDir) as $routePath) {
                if (File::name($routePath) === 'auth.php') {
                    continue;
                }

                $version = File::name($versionDir);

                Route::middleware(['api', 'throttle:api'])
                    ->namespace($this->namespace)
                    ->prefix($version)
                    ->name("{$version}.")
                    ->group($routePath);
            }
        }
    }
}
