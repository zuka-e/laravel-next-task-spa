<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeController extends Controller
{
    /**
     * @param \App\Http\Resources\UserResource $userResource
     * @see https://laravel.com/docs/controllers#dependency-injection-and-controllers
     * @see https://laravel.com/docs/container
     */
    public function __construct(private UserResource $userResource)
    {
        //
    }

    /**
     * Return the authenticated user or a welcome message
     *
     * @return \Illuminate\Http\Resources\Json\JsonResource|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResource|JsonResponse
    {
        /** @var ?\App\Models\User The authenticated user if logged in */
        $user = $request->user();

        return $user
            ? $this->userResource->make($user)
            : response()->json([
                'message' => 'Welcome to ' . config('app.name'),
            ]);
    }
}
