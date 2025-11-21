# 🎓 Complete Beginner's Guide to PHP Symfony API Development

## 📚 Table of Contents
1. [Understanding the Basics](#understanding-the-basics)
2. [Data Flow Explanation](#data-flow-explanation)
3. [API Platform Features](#api-platform-features)
4. [Swagger Documentation](#swagger-documentation)
5. [Testing Your API](#testing-your-api)

---

## 🎯 Understanding the Basics

### What is an Entity? 📋

Think of an **Entity** like a **form template**:
- A User form has fields: username, email, password
- A Task form has fields: title, description, status

**Example from our code:**
```php
// This is in User.php
class User {
    private ?int $user_id = null;      // User's unique ID number
    private ?string $username = null;   // Username like "john_doe"
    private ?string $email = null;      // Email like "john@example.com"
    private ?string $password = null;   // Password (will be encrypted)
    private Collection $tasks;          // List of all tasks this user has
}
```

### What is #[ApiResource]? 🚪

This is like putting a **"PUBLIC ACCESS"** sign on your entity:

```php
#[ApiResource(
    operations: [
        new GetCollection(),  // GET /api/users - Get all users
        new Get(),           // GET /api/users/1 - Get one user
        new Post(),          // POST /api/users - Create a user
        new Put(),           // PUT /api/users/1 - Update a user
        new Delete()         // DELETE /api/users/1 - Delete a user
    ]
)]
```

**What this means:**
- `GetCollection()` = "Let people see the list of all users"
- `Get()` = "Let people see one specific user"
- `Post()` = "Let people create a new user"
- `Put()` = "Let people update a user"
- `Delete()` = "Let people delete a user"

---

## 🔄 Data Flow Explanation

### How `/api/users/1/tasks` Works (Step by Step)

Imagine ordering food at a restaurant:

```
1. YOU (Browser/Postman)
   ↓ "Can I get tasks for user 1?"
   ↓ HTTP GET /api/users/1/tasks

2. WAITER (Symfony Router)
   ↓ "Let me find who handles user tasks..."
   ↓ Checks routes and finds User entity

3. CHEF (API Platform)
   ↓ "I need to fetch user 1 from database"
   ↓ Calls UserRepository

4. STORAGE (Database)
   ↓ "Here's user 1 and all their tasks"
   ↓ Returns data

5. CHEF (API Platform)
   ↓ "Let me format this nicely"
   ↓ Uses Serialization Groups

6. WAITER (Symfony Router)
   ↓ "Here's your order!"
   ↓ Returns JSON response

7. YOU (Browser/Postman)
   ↓ Receives:
   {
     "user_id": 1,
     "username": "john_doe",
     "tasks": [
       {"id": 1, "title": "Buy milk", "status": "pending"},
       {"id": 2, "title": "Study PHP", "status": "completed"}
     ]
   }
```

### Code Behind the Scenes

**1. The Custom Endpoint (User.php:29-32)**
```php
new Get(
    uriTemplate: '/users/{id}/tasks',  // The URL pattern
    normalizationContext: ['groups' => ['user:read', 'task:read']]
)
```
- `{id}` = placeholder for user ID (e.g., 1, 2, 3)
- `normalizationContext` = What data to show in response

**2. Serialization Groups** (Like Privacy Settings)

Think of Groups as **privacy labels**:
- `#[Groups(['user:read'])]` = "Show this when reading user data"
- `#[Groups(['user:write'])]` = "Allow this when creating/updating user"
- `#[Groups(['task:read'])]` = "Show this when reading task data"

**Example:**
```php
#[Groups(['user:read'])]        // ✅ Shown in API response
private ?int $user_id = null;

#[Groups(['user:write'])]       // ❌ NOT shown, only used for creating
private ?string $password = null;
```

**Why?** We don't want passwords in API responses! 🔒

---

## 🎨 API Platform Features

### 1. Pagination 📄

**What it does:** Instead of returning 10,000 users at once, return 10 at a time.

```php
#[ApiResource(
    paginationEnabled: true,          // Turn on pagination
    paginationItemsPerPage: 10        // 10 items per page
)]
```

**How to use:**
- Page 1: `/api/users?page=1`
- Page 2: `/api/users?page=2`

### 2. Filtering 🔍

**What it does:** Search for specific data

```php
#[ApiFilter(SearchFilter::class, properties: [
    'status' => 'exact',      // Exact match: status=pending
    'title' => 'partial'      // Contains: title=milk
])]
```

**How to use:**
- Find pending tasks: `/api/tasks?status=pending`
- Search title: `/api/tasks?title=study`

### 3. Sorting (Ordering) ⬆️⬇️

```php
#[ApiFilter(OrderFilter::class, properties: ['createdAt', 'title'])]
```

**How to use:**
- Newest first: `/api/tasks?order[createdAt]=desc`
- Alphabetical: `/api/tasks?order[title]=asc`

### 4. Validation ✅

**What it does:** Makes sure data is correct before saving

```php
#[Assert\NotBlank(message: 'Title is required')]
#[Assert\Email(message: 'Invalid email')]
#[Assert\Choice(choices: ['pending', 'completed'])]
```

**Examples:**
- ✅ Valid: `{"email": "john@example.com"}`
- ❌ Invalid: `{"email": "not-an-email"}` → Error!

---

## 📖 Swagger Documentation

### What is Swagger? 📱

Swagger is like an **instruction manual** for your API that:
1. Shows all available endpoints
2. Let's you **test** the API in your browser
3. Shows example requests/responses

### How to Access Swagger:

Once your server is running, visit:
```
http://localhost:8000/api/docs
```

### What You'll See:

```
╔══════════════════════════════════════╗
║     API Documentation (Swagger)      ║
╠══════════════════════════════════════╣
║                                      ║
║  📂 User                             ║
║    GET    /api/users                 ║
║    POST   /api/users                 ║
║    GET    /api/users/{id}            ║
║    GET    /api/users/{id}/tasks   ← New!
║    PUT    /api/users/{id}            ║
║    DELETE /api/users/{id}            ║
║                                      ║
║  📂 Task                             ║
║    GET    /api/tasks                 ║
║    POST   /api/tasks                 ║
║    GET    /api/tasks/{id}            ║
║    PUT    /api/tasks/{id}            ║
║    DELETE /api/tasks/{id}            ║
║                                      ║
╚══════════════════════════════════════╝
```

### Interactive Testing in Swagger:

1. Click on an endpoint (e.g., `GET /api/users/1/tasks`)
2. Click "Try it out"
3. Enter `user_id: 1`
4. Click "Execute"
5. See the response! ✨

---

## 🧪 Testing Your API

### Using cURL (Command Line)

```bash
# Get all users
curl http://localhost:8000/api/users

# Get user 1 with their tasks
curl http://localhost:8000/api/users/1/tasks

# Create a new user
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"jane_doe","email":"jane@example.com","password":"secret123"}'

# Get all tasks for user 1
curl http://localhost:8000/api/users/1/tasks

# Filter tasks by status
curl http://localhost:8000/api/tasks?status=pending

# Sort tasks by date
curl "http://localhost:8000/api/tasks?order[createdAt]=desc"
```

### Using Postman or Browser

**GET Requests** (view data):
- Just paste URL in browser: `http://localhost:8000/api/users/1/tasks`

**POST Requests** (create data):
Use Postman:
1. Set method to POST
2. URL: `http://localhost:8000/api/users`
3. Body (JSON):
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

---

## 🎓 Key Concepts Summary

### 1. Entity = Blueprint
Defines what data looks like (User has username, email, etc.)

### 2. Repository = Database Helper
Fetches data from the database

### 3. API Resource = Public Door
Makes your entity accessible via HTTP

### 4. Serialization Groups = Privacy Settings
Controls what data is shown/hidden

### 5. Validation = Data Checker
Makes sure data is correct before saving

### 6. Operations = Actions You Can Do
- GET = Read data
- POST = Create new data
- PUT = Update existing data
- DELETE = Remove data

### 7. Filters = Search & Sort
Find specific data or order results

### 8. Pagination = Splitting Large Lists
Show 10 items per page instead of 10,000

---

## 🚀 Complete Example

### Create a User and Add Tasks

**Step 1: Create a user**
```bash
POST /api/users
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret123"
}

Response:
{
  "user_id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2025-11-20T10:00:00+00:00"
}
```

**Step 2: Create a task for this user**
```bash
POST /api/tasks
{
  "title": "Learn Symfony",
  "description": "Complete the tutorial",
  "status": "pending",
  "user": "/api/users/1"    ← Reference to user
}

Response:
{
  "id": 1,
  "title": "Learn Symfony",
  "description": "Complete the tutorial",
  "status": "pending",
  "createdAt": "2025-11-20T10:05:00+00:00",
  "user": {
    "username": "alice"
  }
}
```

**Step 3: Get all tasks for user 1**
```bash
GET /api/users/1/tasks

Response:
{
  "user_id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "tasks": [
    {
      "id": 1,
      "title": "Learn Symfony",
      "description": "Complete the tutorial",
      "status": "pending",
      "createdAt": "2025-11-20T10:05:00+00:00"
    }
  ]
}
```

---

## 🎉 You're Now Ready!

### Next Steps:
1. ✅ Run the migration to create tables
2. ✅ Start your server
3. ✅ Visit `http://localhost:8000/api/docs` (Swagger)
4. ✅ Test creating users and tasks
5. ✅ Try filtering and pagination

### Commands to Remember:
```bash
# Run migrations
docker-compose exec php php bin/console doctrine:migrations:migrate

# Clear cache
docker-compose exec php php bin/console cache:clear

# Check routes
docker-compose exec php php bin/console debug:router
```

---

**Happy Coding! 🚀**

*Remember: Every expert was once a beginner. Keep practicing!*
