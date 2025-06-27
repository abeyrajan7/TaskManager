<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Task;

class TaskReorderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'tasks' => 'required|array',
            'tasks.*' => 'integer|exists:tasks,id',
        ];
    }
}
