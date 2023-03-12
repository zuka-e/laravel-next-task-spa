<?php

namespace App\Http\Resources;

use App\Models\TaskList;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/eloquent-resources
 */
class TaskListResource extends JsonResource
{
    /**
     * `TaskList` resource instance when loaded.
     *
     * @var \App\Models\TaskList|\Illuminate\Http\Resources\MissingValue
     * @see \Illuminate\Http\Resources\ConditionallyLoadsAttributes ::removeMissingValues
     * @see https://laravel.com/docs/eloquent-resources#conditional-relationships
     */
    public $resource; // Type declaration can't be used

    /**
     * Create a new resource instance.
     *
     * @param  \App\Models\TaskList|\Illuminate\Http\Resources\MissingValue  $resource
     */
    public function __construct(TaskList|MissingValue $resource)
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
        $taskList = $this->resource;

        return [
            'id' => $taskList->id,
            'userId' => $taskList->user_id,
            'boardId' => $taskList->task_board_id,
            'cards' => TaskCardResource::collection(
                $this->whenLoaded('taskCards'),
            ),
            'title' => $taskList->title,
            'description' => $taskList->description,
            'createdAt' => $taskList->created_at,
            'updatedAt' => $taskList->updated_at,
        ];
    }
}
