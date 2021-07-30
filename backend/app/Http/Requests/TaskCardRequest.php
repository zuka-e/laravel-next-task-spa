<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskCardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $maxTitle = floor(191 / 3);
        $maxContent = floor(65535 / 3);

        return [
            'title' => "required|string|max:${maxTitle}",
            'content' => "string|max:${maxContent}",
            'deadline' => 'date|after:now',
            'done' => 'boolean'
        ];
    }

    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;
}
