<?php

namespace App\Http\Resources;

use App\Models\TaskBoard;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Facades\App;

class TaskBoardResource extends ApiResource
{
    /**
     * `TaskBoard` resource instance when loaded.
     *
     * @var \App\Models\TaskBoard|\Illuminate\Http\Resources\MissingValue
     */
    public $resource;

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
        /** @var \App\Http\Resources\TaskListResource $taskListResource */
        $taskListResource = App::make(TaskListResource::class);

        return [
            'id' => $taskBoard->id,
            'userId' => $taskBoard->user_id,
            'title' => $taskBoard->title,
            'description' => $taskBoard->description,
            'lists' => $taskListResource->collection(
                $this->whenLoaded('taskLists'),
            ),
            'createdAt' => $taskBoard->created_at,
            'updatedAt' => $taskBoard->updated_at,
            'listIndexMap' => $taskBoard->list_index_map,
            'cardIndexMap' => $taskBoard->card_index_map,
        ];
    }
}
