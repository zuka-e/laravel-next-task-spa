<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskCardRequest;
use App\Http\Requests\UpdateTaskCardRequest;
use App\Http\Resources\TaskCardResource;
use App\Models\TaskCard;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class TaskCardController extends Controller
{
    /**
     * @param \App\Http\Resources\TaskCardResource $taskCardResource
     * @see https://laravel.com/docs/controllers#dependency-injection-and-controllers
     * @see https://laravel.com/docs/container
     */
    public function __construct(private TaskCardResource $taskCardResource)
    {
        // > This method will attach the appropriate can middleware definitions
        // > to the resource controller's methods.
        // > https://laravel.com/docs/authorization#authorizing-resource-controllers
        /** @see \App\Policies\TaskCardPolicy */
        $this->authorizeResource(TaskCard::class);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskCardRequest  $request
     * @param  \App\Models\TaskList  $taskList
     * @return \App\Http\Resources\TaskCardResource
     * @see \Illuminate\Http\Resources\Json\JsonResource ::toResponse
     * @see \Illuminate\Http\Resources\Json\ResourceResponse ::toResponse
     * @see https://laravel.com/docs/eloquent-resources#resource-responses
     */
    public function store(StoreTaskCardRequest $request, TaskList $taskList)
    {
        /**
         * Only validated data
         *
         * @var array<string, mixed> $validated
         * @see https://laravel.com/docs/validation#working-with-validated-input
         */
        $validated = $request->validated();
        /**
         * Newly created `TaskCard` of the `TaskList`
         *
         * @var \App\Models\TaskCard $created
         * @see https://laravel.com/docs/eloquent-relationships#updating-belongs-to-relationships
         */
        $created = $taskList->taskCards()->make($validated);
        $created->user()->associate(Auth::id());
        $created->save();

        return $this->taskCardResource->make($created);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskCardRequest  $request  Validation
     * @param  \App\Models\TaskList  $taskList  For Scoping Resource Routes
     * @param  \App\Models\TaskCard  $taskCard
     * @return \App\Http\Resources\TaskCardResource
     */
    public function update(
        UpdateTaskCardRequest $request,
        TaskList $taskList,
        TaskCard $taskCard,
    ) {
        /** @var array<string, mixed> $validated Array of only validated data */
        $validated = $request->validated();

        isset($validated['list_id']) &&
            $taskCard->taskList()->associate($validated['list_id']);

        $taskCard->update($validated);

        return $this->taskCardResource->make($taskCard);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskList  $taskList  For Scoping Resource Routes
     * @param  \App\Models\TaskCard  $taskCard
     * @return \App\Http\Resources\TaskCardResource
     */
    public function destroy(TaskList $taskList, TaskCard $taskCard)
    {
        $taskCard->delete();

        return $this->taskCardResource->make($taskCard);
    }
}
