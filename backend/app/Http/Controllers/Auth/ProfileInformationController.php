<?php

namespace App\Http\Controllers\Auth;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Laravel\Fortify\Http\Controllers\ProfileInformationController as Controller;

/**
 * It extends `\Laravel\Fortify\Http\Controllers\ProfileInformationController`
 */
class ProfileInformationController extends Controller
{
    /**
     * @param \App\Http\Resources\UserResource $userResource
     */
    public function __construct(private UserResource $userResource)
    {
        //
    }

    /**
     * Display the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        /** @var ?\App\Models\User The authenticated user if logged in */
        $user = $request->user();

        return $this->userResource->make($user);
    }
}
