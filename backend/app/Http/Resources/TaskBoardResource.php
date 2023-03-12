<?php

namespace App\Http\Resources;

use App\Models\TaskBoard;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/eloquent-resources
 */
class TaskBoardResource extends JsonResource
{
    /**
     * `TaskBoard` resource instance when loaded.
     *
     * @var \App\Models\TaskBoard|\Illuminate\Http\Resources\MissingValue
     */
    public $resource; // Type declaration can't be used

    /**
     * Create a new resource instance.
     *
     * @param  \App\Models\TaskBoard|\Illuminate\Http\Resources\MissingValue  $resource
     */
    public function __construct(TaskBoard|MissingValue $resource)
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
        $taskBoard = $this->resource;

        return [
            'id' => $taskBoard->id,
            'userId' => $taskBoard->user_id,
            'title' => $taskBoard->title,
            'description' => $taskBoard->description,
            'lists' => TaskListResource::collection(
                $this->whenLoaded('taskLists'),
            ),
            'createdAt' => $taskBoard->created_at,
            'updatedAt' => $taskBoard->updated_at,
            'listIndexMap' => $taskBoard->list_index_map,
            'cardIndexMap' => $taskBoard->card_index_map,
        ];
    }
}
