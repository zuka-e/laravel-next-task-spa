<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see \App\Providers\ApiResourceServiceProvider
 * @see https://laravel.com/docs/eloquent-resources
 */
abstract class ApiResource extends JsonResource
{
    /**
     * The resource instance when loaded.
     *
     * @var \Illuminate\Http\Resources\MissingValue
     * @see \Illuminate\Http\Resources\ConditionallyLoadsAttributes ::removeMissingValues
     * @see https://laravel.com/docs/eloquent-resources#conditional-relationships
     */
    public $resource;

    /**
     * Create a new resource instance.
     *
     * @param  \Illuminate\Http\Resources\MissingValue  $resource
     * @return void
     */
    public function __construct(MissingValue $resource)
    {
        $this->resource = $resource;
    }
}
