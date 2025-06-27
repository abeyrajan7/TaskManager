@extends('layouts.app')

@section('title', 'Projects')

@section('content')
    <h1>Your Projects</h1>

    <div class="row">
        @foreach ($projects as $project)
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{{ $project->name }}</h5>
                        <p class="card-text">
                            Deadline:
                            {{ $project->deadline ? \Carbon\Carbon::parse($project->deadline)->format('Y-m-d') : 'No deadline' }}
                        </p>
                        <a href="{{ route('projects.tasks', $project->id) }}" class="btn btn-primary">View Tasks</a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endsection
