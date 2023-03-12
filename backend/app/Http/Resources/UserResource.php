<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/eloquent-resources
 */
class UserResource extends JsonResource
{
    /**
     * `User` resource instance when loaded.
     *
     * @var \App\Models\User|\Illuminate\Http\Resources\MissingValue
     * @see \Illuminate\Http\Resources\ConditionallyLoadsAttributes ::removeMissingValues
     * @see https://laravel.com/docs/eloquent-resources#conditional-relationships
     */
    public $resource;

    /**
     * The "data" wrapper that should be applied.
     *
     * @see https://laravel.com/docs/eloquent-resources#data-wrapping
     */
    public static $wrap = 'user';

    /**
     * Create a new resource instance.
     *
     * @param  \App\Models\User|\Illuminate\Http\Resources\MissingValue  $resource
     */
    public function __construct(User|MissingValue $resource)
    {
        $this->resource = $resource;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // Undefined properties can be accessed by `__get()`.
        // (Illuminate\Http\Resources\DelegatesToResource::__get)
        // But it's not type-safe. So access via a typed variable.
        // e.g. `$this->resource->id` instead of `this->id`
        $user = $this->resource;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'emailVerifiedAt' => $user->email_verified_at,
            'createdAt' => $user->created_at,
            'updatedAt' => $user->updated_at,
        ];
    }
}
