@extends('layouts.app')

@section('title', 'Tasks')

@section('content')
    <h1>Tasks for Project: {{ $project->name }}</h1>

    @props(['task', 'readonly' => false])

    <li data-id="{{ $task->id }}" class="bg-white p-4 shadow rounded flex justify-between items-center">
        <div>
            <h4 class="font-semibold">{{ $task->title }}</h4>
            <p class="text-sm text-gray-500">Status: {{ ucfirst(str_replace('_', ' ', $task->status)) }}</p>
        </div>

        @unless($readonly)
            <div class="space-x-2">
                <button
                    class="text-blue-600 hover:underline"
                    x-on:click="$dispatch('open-modal', { taskId: {{ $task->id }}, taskTitle: '{{ $task->title }}', taskStatus: '{{ $task->status }}' })"
                >
                    Edit
                </button>
            </div>
        @endunless
    </li>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const list = document.getElementById('task-list');

            new Sortable(list, {
                animation: 150,
                onEnd: function () {
                    const orderedIds = Array.from(list.children).map(item => item.getAttribute('data-id'));

                    fetch('{{ route('tasks.reorder') }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({ ordered_ids: orderedIds })
                    })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));
                }
            });
        });
    </script>
@endsection
