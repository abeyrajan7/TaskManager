# Task Manager App
# Coalition Task Manager

A full-stack Task Management application built with **Laravel (PHP)** for the backend and **Next.js (React)** for the frontend. This tool allows users to register, log in, manage projects, and organize tasks with priorities and statuses.

---

## Features

- User authentication with Laravel Sanctum
- Project and task management
- Task completion tracking
- Task reordering
- Clear API structure and error handling
- Protected routes (Frontend + Backend)

---

## Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React (Next.js), Axios      |
| Backend     | Laravel 11, PHP 8+, Sanctum |
| Database    | MySQL                       |
| Dev Tools   | Postman, VS Code, PHPStorm  |

---

## Getting Started

1. Clone the Repository
   bash
   Copy
   Edit
   git clone https://github.com/abeyrajan7/TaskManager.git
   cd CoalitionTaskManager
2. Set Up the Backend
    Run these comments in your IDE terminal
   - cd TaskManager-Backend
   - cp .env.example .env

   Update your .env file with your local database credentials:
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=coalition_task_manager
    DB_USERNAME=root
    DB_PASSWORD=
   Then run:
   - composer install 
   - php artisan key:generate
   - php artisan migrate
   - php artisan serve
   Make sure Apache and MySQL are running.

3. Set Up the Frontend
   In a new terminal:
   - cd taskmanager-frontend
   - npm install
   - npm run dev
4. Using the App
   Open the frontend URL (usually http://localhost:3000).

#### Register a new user on the Register page by clicking the register link below the login.
#### Once registered, Log in with your new credentials.
#### Create a project using the add button on right bottom.
#### Add tasks to your project using the add button on the right bottom.
#### Rearrange tasks by drag and drop the task cards and click "Save Order".
#### Log out when done.