<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use App\Models\Task;

class UserOwnershipService
{
    public function ownsProject(Project $project): bool
    {
        return $project->user_id === Auth::id();
    }

    public static function ownsTask(Task $task): bool
    {
        return $task->project && $task->project->user_id === Auth::id();
    }

    public function ownsAllTasksForProject(Project $project, array $taskIds): bool
    {
        $count = $project->tasks()->whereIn('id', $taskIds)->count();
        return $count === count($taskIds);
    }
}
