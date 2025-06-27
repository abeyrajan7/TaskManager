@extends('layouts.app')

@section('title', 'Tasks')

@section('content')
    <h1>Tasks for Project: {{ $project->name }}</h1>

    <ul class="list-group mb-3" id="task-list">
        @foreach ($tasks as $task)
            <li class="list-group-item d-flex justify-content-between align-items-center">
                {{ $task->title }}
                <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editTaskModal" data-task-id="{{ $task->id }}" data-task-title="{{ $task->title }}">
                    Edit
                </button>
            </li>
        @endforeach
    </ul>

    <!-- Edit Task Modal -->
    <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form id="editTaskForm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="taskId" name="task_id" />
                        <div class="mb-3">
                            <label for="taskTitle" class="form-label">Title</label>
                            <input type="text" class="form-control" id="taskTitle" name="title" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save changes</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script>
        var editTaskModal = document.getElementById('editTaskModal')
        editTaskModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget
            var taskId = button.getAttribute('data-task-id')
            var taskTitle = button.getAttribute('data-task-title')

            var modalTaskId = editTaskModal.querySelector('#taskId')
            var modalTaskTitle = editTaskModal.querySelector('#taskTitle')

            modalTaskId.value = taskId
            modalTaskTitle.value = taskTitle
        })

        // TODO: Add AJAX form submission for task edit here
    </script>
@endsection
