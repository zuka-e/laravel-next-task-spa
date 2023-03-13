<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskListRequest;
use App\Http\Requests\UpdateTaskListRequest;
use App\Http\Resources\TaskListResource;
use App\Models\TaskBoard;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    /**
     * @param \App\Http\Resources\TaskListResource $taskListResource
     * @see https://laravel.com/docs/controllers#dependency-injection-and-controllers
     * @see https://laravel.com/docs/container
     */
    public function __construct(private TaskListResource $taskListResource)
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskListPolicy */
        $this->authorizeResource(TaskList::class);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskListRequest  $request
     * @param  \App\Models\TaskBoard  $taskBoard
     * @return \App\Http\Resources\TaskListResource
     */
    public function store(StoreTaskListRequest $request, TaskBoard $taskBoard)
    {
        /**
         * Only validated data
         *
         * @var array<string, mixed> $validated
         * @see https://laravel.com/docs/validation#working-with-validated-input
         */
        $validated = $request->validated();
        /**
         * Newly created `TaskList` of the `TaskBoard`
         *
         * @var \App\Models\TaskList $created
         * @see https://laravel.com/docs/eloquent-relationships#updating-belongs-to-relationships
         */
        $created = $taskBoard->taskLists()->make($validated);
        $created->user()->associate(Auth::id());
        $created->save();

        return $this->taskListResource->make($created);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskListRequest  $request  Validation
     * @param  \App\Models\TaskBoard  $taskBoard  For Scoping Resource Routes
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskListResource
     */
    public function update(
        UpdateTaskListRequest $request,
        TaskBoard $taskBoard,
        TaskList $taskList,
    ) {
        $taskList->update($request->validated());

        return $this->taskListResource->make($taskList);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskBoard  $taskBoard  For Scoping Resource Routes
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskListResource
     */
    public function destroy(TaskBoard $taskBoard, TaskList $taskList)
    {
        $taskList->delete();

        return $this->taskListResource->make($taskList);
    }
}
