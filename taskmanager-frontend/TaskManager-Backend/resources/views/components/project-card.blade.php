@props(['project'])

<a href="{{ route('projects.tasks', $project->id) }}" class="block bg-white p-6 rounded-lg shadow hover:shadow-md transition">
    <h3 class="text-xl font-semibold mb-2">{{ $project->name }}</h3>
    <p class="text-sm text-gray-600">Deadline: {{ $project->deadline ? \Carbon\Carbon::parse($project->deadline)->toFormattedDateString() : 'N/A' }}</p>
    <p class="text-sm text-gray-500 mt-2">{{ $project->tasks->count() }} Task(s)</p>
</a>
