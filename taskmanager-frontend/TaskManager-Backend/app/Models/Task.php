<?php

// app/Models/Task.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'title', 'details', 'due_date', 'priority', 'status'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
