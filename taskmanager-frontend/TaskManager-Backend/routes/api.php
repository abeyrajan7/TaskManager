<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

//public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::middleware(['auth:sanctum', 'return404'])->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json([
            'user' => $request->user()
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects', [ProjectController::class, 'index']);
    //get all active tasks
    Route::get('/projects/{project}', [ProjectController::class, 'showAllTasks']);
    //get all completed tasks
    Route::get('/projects/{project}/inactive', [ProjectController::class, 'showInactiveTasks']);
    Route::post('/projects/{project}/task', [ProjectController::class, 'addNewTask']);
    //reorder the tasks based on
    Route::put('/projects/{project}/reorder', [ProjectController::class, 'reorder']);
    //edit task
    Route::put('/tasks/{task}/edit',[ProjectController::class, 'editTask']);
    //delete Project
    Route::delete('/projects/{project}', [ProjectController::class, 'deleteProject']);
    //delete a task
    Route::delete('/projects/{project}/tasks/{task}', [ProjectController::class, 'deleteTask']);
    //change status of a task
    Route::put('/tasks/{task}/change-status', [ProjectController::class, 'updateTaskProgress']);
    //edit Project
    Route::put('/projects/{project}',[ProjectController::class, 'editProject']);

});




