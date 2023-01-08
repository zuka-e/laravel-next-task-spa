<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskBoardRequest;
use App\Http\Requests\UpdateTaskBoardRequest;
use App\Http\Resources\TaskBoardResource;
use App\Models\TaskBoard;
use App\Models\User;

class TaskBoardController extends Controller
{
    /**
     * @see https://laravel.com/docs/9.x/controllers#dependency-injection-and-controllers
     * @see https://laravel.com/docs/9.x/container
     */
    public function __construct()
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/9.x/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskBoardPolicy */
        $this->authorizeResource(TaskBoard::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * @see \Illuminate\Http\Resources\Json\ResourceCollection ::toResponse
     * @see \Illuminate\Http\Resources\Json\PaginatedResourceResponse
     * @see https://laravel.com/docs/9.x/eloquent-resources#resource-collections
     * @see https://laravel.com/docs/9.x/eloquent-resources#pagination
     * @see https://laravel.com/docs/9.x/pagination
     */
    public function index(User $user)
    {
        return TaskBoardResource::collection(
            $user
                ->taskBoards()
                ->getQuery()
                ->orderBy('updated_at', 'desc')
                ->paginate(20)
                ->withQueryString(),
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskBoardRequest  $request
     * @param  \App\Models\User  $user
     * @return \App\Http\Resources\TaskBoardResource
     * @see \Illuminate\Http\Resources\Json\JsonResource ::toResponse
     * @see \Illuminate\Http\Resources\Json\ResourceResponse ::toResponse
     * @see https://laravel.com/docs/9.x/eloquent-resources#resource-responses
     */
    public function store(StoreTaskBoardRequest $request, User $user)
    {
        /**
         * Only validated data
         *
         * @var array<string, mixed> $validated
         * @see https://laravel.com/docs/9.x/validation#working-with-validated-input
         */
        $validated = $request->validated();
        /**
         * Newly created `TaskBoard` of the user
         *
         * ※`create()` fill the model with fillable attributes and save it.
         *
         * @var \App\Models\TaskBoard $created
         * @see https://laravel.com/docs/9.x/eloquent-relationships#the-create-method
         */
        $created = $user->taskBoards()->create($validated);

        return TaskBoardResource::make($created);
    }

    /**
     * Display the specified resource.
     *
     * Be sure to specify the parameter `$user` with `\App\Models\User`,
     * and only the user's `TaskBoard` will be queried.
     * it's not used here, but is required for `scoped()` in the routing.
     *
     * @param  \App\Models\User  $user  For Scoping Resource Routes
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskBoardResource
     */
    public function show(User $user, TaskBoard $taskBoard)
    {
        return TaskBoardResource::make(
            $taskBoard->load([
                // > When using this feature, you should always include
                // > the id column and any relevant foreign key columns
                // see: https://laravel.com/docs/9.x/eloquent-relationships#eager-loading-specific-columns
                'taskLists:id,user_id,task_board_id,title,description,created_at,updated_at',
                // Nested eager loading with specific columns can be used like this.
                // see: https://laravel.com/docs/9.x/eloquent-relationships#nested-eager-loading
                'taskLists.taskCards:*',
            ]),
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskBoardRequest  $request  Validation
     * @param  \App\Models\User  $user  For Scoping Resource Routes
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskBoardResource
     */
    public function update(
        UpdateTaskBoardRequest $request,
        User $user,
        TaskBoard $taskBoard,
    ) {
        $taskBoard->update($request->validated());

        return TaskBoardResource::make($taskBoard);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user  For Scoping Resource Routes
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskBoardResource
     */
    public function destroy(User $user, TaskBoard $taskBoard)
    {
        $taskBoard->delete();

        return TaskBoardResource::make($taskBoard);
    }
}
