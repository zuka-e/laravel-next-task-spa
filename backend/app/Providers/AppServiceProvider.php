<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // cf. https://laravel.com/docs/10.x/telescope#local-only-installation
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Horizon\HorizonServiceProvider::class);
            $this->app->register(HorizonServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
