<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Return404IfUnauthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Not Found.'], 404);
        }

        return $next($request);
    }
}
