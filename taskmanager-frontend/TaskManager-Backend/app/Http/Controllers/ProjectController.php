<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskReorderRequest;
use App\Models\Project;
use App\Models\Task;
use App\Services\UserOwnershipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'tasks' => 'nullable|array',
            'tasks.*.title' => 'string|max:255',
        ]);

        $project = Project::create([
            'name' => $request->name,
            'deadline' => $request->deadline,
            'user_id' => Auth::id(),
        ]);
        foreach ($request->tasks as $index => $task) {
            $project->tasks()->create([
                'title' => $task['title'],
                'priority' => $index + 1,
                'details' => array_key_exists('details', $task) ? $task['details'] : null ,
                'due_date' => array_key_exists('due_date', $task) ? $task['due_date'] : null,
            ]);
        }

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project->load('tasks'),
        ], 201);
    }

    public function editProject(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);

        $project->name = $request->name;
        $project->description = $request->description;
        $project->save();

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->load('tasks'),
        ]);
    }
    public function addNewTask(Project $project, Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'nullable|string',
            'due_date' => 'nullable|string',
        ]);

        $nextPriority = $project->tasks()->count() + 1;

        $task = $project->tasks()->create([
            'title' => $request->input('title'),
            'details' => $request->input('details'),
            'due_date' => $request->input('due_date'),
            'priority' => $nextPriority,
        ]);

        return response()->json([
            'message' => 'Task added successfully',
            'task' => $task,
        ], 201);
    }

    public function index(Request $request)
    {
        $projects = Project::with('tasks')->where('user_id', Auth::id())->get();
        return response()->json([
            'projects' => $projects->values(), // make sure it's re-indexed
        ], 200);
    }

    //updateTask
    public function editTask(Task $task, Request $request){
        $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'nullable|string|max:255',
            'status' => 'required|string|in:pending,in_progress,completed',
            'due_date' => 'required|string|max:255',
        ]);

        $task->update([
            'title' => $request->title,
            'details' => $request->details,
            'status' => $request->status,
            'due_date' => $request->due_date
        ]);

        return response()->json([
            'message' => 'Task updated successfully',
        ], 200);
    }


    public function showTasks(Project $project)
    {
        $tasks = $project->tasks()->orderBy('priority')->get();
        return response()->json([
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }
    //get all active tasks
    public function showAllTasks(Project $project)
    {
        $activeTasks = $project->tasks()->get();

        return response()->json([
            'name' => $project->name,
            'description' => $project->description,
            'tasks' => $activeTasks
        ], 200);
    }

    public function showInactiveTasks(Project $project)
    {
        $activeTasks = $project->tasks()->where('status', 'completed')->get();

        return response()->json([
            'tasks' => $activeTasks
        ], 200);
    }

    public function reorder(TaskReorderRequest $request)
    {
        $tasks = $request->get('tasks');

        foreach ($tasks as $index => $taskId) {
            Task::where('id', $taskId)->update(['priority' => $index + 1]);
        }

        return response()->json(['message' => 'Tasks reordered successfully']);
    }

    public function reorderTasks(Request $request)
    {
        $orderedIds = $request->input('ordered_ids');

        foreach ($orderedIds as $index => $taskId) {
            DB::table('tasks')->where('id', $taskId)->update(['priority' => $index]);
        }

        return response()->json(['message' => 'Task order updated successfully']);
    }

    //delete project
    public function deleteProject(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }

    //delete Task
    public function deleteTask(Project $project, Task $task)
    {
        if ($task->project_id !== $project->id) {
            return response()->json(['error' => 'Task does not belong to the given project.'], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task added successfully',
            'task' => $task, // add this
        ], 201);
    }

    //update task status
    public function updateTaskProgress(Request $request, Task $task){
        UserOwnershipService::ownsTask($task);
        $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);
        $status = $request->get('status');
        $task->update([
            'status' => $status,
        ]);

        return response()->json(['message' => 'Task updated successfully']);
    }

}
