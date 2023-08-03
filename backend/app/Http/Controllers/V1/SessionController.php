<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * @param \App\Http\Resources\UserResource $userResource
     */
    public function __construct(protected UserResource $userResource)
    {
        //
    }

    /**
     * Return the user information
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        /** @var null|\App\Models\User Auth user if logged in */
        $user = $request->user();

        return $user
            ? $this->userResource->make($user)->additional([])
            : ['user' => null];
    }
}
