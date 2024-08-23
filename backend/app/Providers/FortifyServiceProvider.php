<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Responses\RegisterResponse;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\LogoutResponse;
use App\Http\Responses\PasswordUpdateResponse;
use App\Http\Responses\ProfileInformationUpdatedResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse as ProfileInformationUpdatedResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\PasswordUpdateResponse as PasswordUpdateResponseContract;

/**
 * @see \Laravel\Fortify\FortifyServiceProvider
 */
class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @see https://laravel.com/docs/container#binding-a-singleton
     */
    public function boot()
    {
        Fortify::ignoreRoutes();

        $this->configureRoutes();

        $this->registerActions();

        $this->registerResponseBindings();

        $this->registerRateLimiters();
    }

    /**
     * Configure the routes offered by the application.
     *
     * @return void
     * @see \Laravel\Fortify\FortifyServiceProvider configureRoutes
     * @see \App\Providers\RouteServiceProvider
     */
    protected function configureRoutes()
    {
        Route::namespace('Laravel\Fortify\Http\Controllers')
            ->domain(config('fortify.domain', null))
            ->prefix(config('fortify.prefix'))
            ->group(base_path('routes/auth.php'));
    }

    /**
     * Register named rate limiters.
     *
     * @see https://laravel.com/docs/routing#attaching-rate-limiters-to-routes
     */
    protected function registerRateLimiters(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->email . $request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by(
                $request->session()->get('login.id'),
            );
        });
    }

    /**
     * Register the actions.
     */
    protected function registerActions(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(
            UpdateUserProfileInformation::class,
        );
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
    }

    /**
     * Register the response bindings.
     */
    protected function registerResponseBindings(): void
    {
        $this->app->singleton(
            RegisterResponseContract::class,
            RegisterResponse::class,
        );
        $this->app->singleton(
            ProfileInformationUpdatedResponseContract::class,
            ProfileInformationUpdatedResponse::class,
        );
        $this->app->singleton(
            PasswordUpdateResponseContract::class,
            PasswordUpdateResponse::class,
        );
        $this->app->singleton(
            LoginResponseContract::class,
            LoginResponse::class,
        );
        $this->app->singleton(
            LogoutResponseContract::class,
            LogoutResponse::class,
        );
    }
}
