<?php

namespace App\Http\Resources;

use App\Models\TaskCard;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

/**
 * It's used to transform the model and define what data should be returned.
 *
 * @see https://laravel.com/docs/eloquent-resources
 */
class TaskCardResource extends JsonResource
{
    /**
     * `TaskCard` resource instance when loaded.
     *
     * @var \App\Models\TaskCard|\Illuminate\Http\Resources\MissingValue
     */
    public $resource; // Type declaration can't be used

    /**
     * Create a new resource instance.
     *
     * @param  \App\Models\TaskCard|\Illuminate\Http\Resources\MissingValue  $resource
     */
    public function __construct(TaskCard|MissingValue $resource)
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
        $taskCard = $this->resource;

        return [
            'id' => $taskCard->id,
            'userId' => $taskCard->user_id,
            'listId' => $taskCard->task_list_id,
            'title' => $taskCard->title,
            'content' => $taskCard->content,
            'deadline' => $taskCard->deadline,
            'done' => $taskCard->done,
            'createdAt' => $taskCard->created_at,
            'updatedAt' => $taskCard->updated_at,
        ];
    }
}
