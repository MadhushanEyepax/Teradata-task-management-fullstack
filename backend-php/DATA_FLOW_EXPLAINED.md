# 🔄 Complete Data Flow: `GET /api/users/1/tasks`

## 📍 Overview: The Journey of a Request

When you visit `http://localhost:8000/api/users/1/tasks`, here's the **complete journey** your request takes:

```
Browser → Web Server → Symfony Router → API Platform → State Provider → Repository → Database
   ↓                                                                                    ↓
   ←─────────────────────────────── Response (JSON) ←──────────────────────────────────┘
```

---

## 🎬 Step-by-Step Flow (Like a Movie Script)

### **SCENE 1: The Request Arrives** 🌐
**Location:** `public/index.php`
**What happens:** The entry point of your Symfony app

```
YOU type in browser: http://localhost:8000/api/users/1/tasks
                              ↓
                    HTTP GET Request sent
                              ↓
            Web Server (PHP Built-in / Apache / Nginx)
                              ↓
                 public/index.php (Entry point)
```

**File: `public/index.php`** (Symfony creates this automatically)
```php
// This file loads Symfony and starts the application
require_once dirname(__DIR__).'/vendor/autoload.php';
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);  // ← Magic happens here!
$response->send();
```

**What it does:**
- Creates a Symfony Kernel (the brain of your app)
- Converts the HTTP request into a Symfony Request object
- Passes it to the kernel to handle
- Returns the response to your browser

---

### **SCENE 2: Symfony Router Finds the Route** 🗺️
**Location:** `config/routes/api_platform.yaml`
**What happens:** Symfony figures out which code should handle this URL

```
Request: GET /api/users/1/tasks
              ↓
    Symfony Router checks all routes
              ↓
    Finds: api_platform.yaml has prefix /api
              ↓
    API Platform takes over
```

**File: `config/routes/api_platform.yaml`**
```yaml
api_platform:
    resource: .
    type: api_platform
    prefix: /api          # ← All API routes start with /api
```

**What it does:**
- Tells Symfony: "Any URL starting with `/api` belongs to API Platform"
- Hands control to API Platform

---

### **SCENE 3: API Platform Matches the Endpoint** 🎯
**Location:** `src/Entity/User.php` (lines 22-39)
**What happens:** API Platform reads your `#[ApiResource]` annotations

```
API Platform looks at all entities with #[ApiResource]
              ↓
    Finds User entity
              ↓
    Checks operations list
              ↓
    Finds matching operation:
    new Get(uriTemplate: '/users/{id}/tasks')
              ↓
    Extracts {id} = 1 from URL
```

**File: `src/Entity/User.php`** (The important part)
```php
#[ApiResource(
    operations: [
        // ... other operations ...
        new Get(
            uriTemplate: '/users/{id}/tasks',        // ← Matches our URL!
            normalizationContext: ['groups' => ['user:read', 'task:read']],
            provider: UserTasksProvider::class       // ← Tells which provider to use
        )
    ],
)]
class User
{
    // User properties...
}
```

**What it does:**
- API Platform scans all entities with `#[ApiResource]`
- Finds the operation that matches `/users/1/tasks`
- Sees it needs to use `UserTasksProvider::class`
- Extracts `id = 1` from the URL

---

### **SCENE 4: State Provider Fetches Data** 🔍
**Location:** `src/State/UserTasksProvider.php`
**What happens:** Custom code to fetch the user and their tasks

```
API Platform calls: UserTasksProvider->provide()
              ↓
    Receives: $uriVariables = ['id' => 1]
              ↓
    Calls EntityManager to find User with id=1
              ↓
    EntityManager uses UserRepository
```

**File: `src/State/UserTasksProvider.php`**
```php
class UserTasksProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager  // ← Database manager
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // STEP 1: Get the user ID from URL
        $userId = $uriVariables['id'] ?? null;  // $userId = 1

        if (!$userId) {
            return null;  // No ID? Return nothing
        }

        // STEP 2: Fetch user from database
        $user = $this->entityManager
            ->getRepository(User::class)      // ← Get UserRepository
            ->find($userId);                  // ← Find user with ID=1

        return $user;  // Return the User object (with tasks loaded)
    }
}
```

**What it does:**
1. Receives `['id' => 1]` from the URL
2. Asks EntityManager: "Give me the UserRepository"
3. Calls `find(1)` to get user with ID=1
4. Returns the User object

---

### **SCENE 5: Repository Queries the Database** 🗄️
**Location:** `src/Repository/UserRepository.php` (and Doctrine ORM)
**What happens:** Doctrine translates the request into SQL

```
UserRepository->find(1)
              ↓
    Doctrine ORM builds SQL query
              ↓
    SQL: SELECT * FROM users WHERE user_id = 1
              ↓
    Database executes query
              ↓
    Returns user data as array
```

**File: `src/Repository/UserRepository.php`**
```php
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // When you call find(1), Doctrine automatically:
    // 1. Builds SQL: SELECT * FROM users WHERE user_id = 1
    // 2. Executes query on database
    // 3. Converts result to User object
}
```

**SQL Query Generated (behind the scenes):**
```sql
-- Find the user
SELECT u.user_id, u.username, u.email, u.created_at
FROM users u
WHERE u.user_id = 1;

-- Doctrine also loads related tasks (because of OneToMany relationship)
SELECT t.id, t.title, t.description, t.status, t.created_at, t.user_id
FROM tasks t
WHERE t.user_id = 1;
```

**What it does:**
1. Doctrine creates a SELECT query
2. Sends it to PostgreSQL database
3. Database returns rows of data
4. Doctrine converts rows into PHP objects (User and Task objects)

---

### **SCENE 6: Doctrine Hydrates Objects** 💧
**Location:** Doctrine ORM (automatic)
**What happens:** Database rows → PHP objects

```
Database returns:
  users table: [user_id=1, username="john", email="john@example.com", ...]
  tasks table: [
    {id=1, title="Buy milk", status="pending", user_id=1},
    {id=2, title="Study PHP", status="completed", user_id=1}
  ]
              ↓
    Doctrine "hydrates" (fills) objects:
              ↓
    User object {
      user_id: 1,
      username: "john",
      email: "john@example.com",
      tasks: Collection [
        Task {id: 1, title: "Buy milk", status: "pending"},
        Task {id: 2, title: "Study PHP", status: "completed"}
      ]
    }
```

**What it does:**
- Takes raw database data (arrays)
- Creates actual PHP objects
- Fills in all properties
- Loads related tasks into the `$tasks` Collection

---

### **SCENE 7: Serializer Converts to JSON** 📦
**Location:** Symfony Serializer (automatic)
**What happens:** PHP objects → JSON, using Groups

```
User object with tasks
              ↓
    Serializer checks normalizationContext
    ['groups' => ['user:read', 'task:read']]
              ↓
    Only includes properties with these groups:

    From User entity:
      ✅ #[Groups(['user:read'])] user_id
      ✅ #[Groups(['user:read'])] username
      ✅ #[Groups(['user:read'])] email
      ❌ #[Groups(['user:write'])] password  ← SKIPPED!
      ✅ #[Groups(['user:read'])] tasks

    From Task entity:
      ✅ #[Groups(['task:read'])] id
      ✅ #[Groups(['task:read'])] title
      ✅ #[Groups(['task:read'])] description
      ✅ #[Groups(['task:read'])] status
              ↓
    Converts to JSON
```

**File: `src/Entity/User.php`** (Serialization groups matter here)
```php
class User {
    #[Groups(['user:read'])]        // ✅ Include in response
    private ?int $user_id = null;

    #[Groups(['user:read'])]        // ✅ Include in response
    private ?string $username = null;

    #[Groups(['user:write'])]       // ❌ NOT in 'user:read', skip it!
    private ?string $password = null;

    #[Groups(['user:read'])]        // ✅ Include tasks
    private Collection $tasks;
}
```

**File: `src/Entity/Task.php`** (Tasks also have groups)
```php
class Task {
    #[Groups(['task:read'])]        // ✅ Include in response
    private ?int $id = null;

    #[Groups(['task:read'])]        // ✅ Include in response
    private ?string $title = null;

    #[Groups(['task:read'])]        // ✅ Include in response
    private string $status = 'pending';
}
```

**What it does:**
1. Looks at `normalizationContext: ['groups' => ['user:read', 'task:read']]`
2. Only includes properties tagged with those groups
3. Skips `password` (only has `user:write` group)
4. Converts everything to JSON format

---

### **SCENE 8: Final Response Sent** 📤
**Location:** Back to `public/index.php`
**What happens:** JSON sent back to browser

```
Serializer produces JSON:
{
  "user_id": 1,
  "username": "john",
  "email": "john@example.com",
  "created_at": "2025-11-20T10:00:00+00:00",
  "tasks": [
    {
      "id": 1,
      "title": "Buy milk",
      "description": null,
      "status": "pending",
      "createdAt": "2025-11-20T10:05:00+00:00"
    },
    {
      "id": 2,
      "title": "Study PHP",
      "description": "Complete tutorial",
      "status": "completed",
      "createdAt": "2025-11-20T11:00:00+00:00"
    }
  ]
}
              ↓
    Symfony creates HTTP Response
              ↓
    Sets headers: Content-Type: application/json
              ↓
    Sends to browser
              ↓
    YOU see the JSON!
```

**What it does:**
1. Wraps JSON in HTTP Response
2. Adds headers (Content-Type, etc.)
3. Sends to your browser

---

## 🎯 Complete Flow Summary (With Files)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Browser: GET /api/users/1/tasks                             │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. public/index.php                                             │
│    - Creates Symfony Kernel                                     │
│    - Converts HTTP to Request object                            │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. config/routes/api_platform.yaml                              │
│    - Matches /api prefix                                        │
│    - Hands off to API Platform                                  │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. src/Entity/User.php                                          │
│    - API Platform finds #[ApiResource]                          │
│    - Matches operation: '/users/{id}/tasks'                     │
│    - Sees provider: UserTasksProvider::class                    │
│    - Extracts id=1 from URL                                     │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. src/State/UserTasksProvider.php                              │
│    - provide() method called                                    │
│    - Receives $uriVariables = ['id' => 1]                       │
│    - Calls EntityManager                                        │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. src/Repository/UserRepository.php                            │
│    - find(1) called                                             │
│    - Doctrine builds SQL query                                  │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. PostgreSQL Database                                          │
│    - Executes: SELECT * FROM users WHERE user_id = 1            │
│    - Executes: SELECT * FROM tasks WHERE user_id = 1            │
│    - Returns data rows                                          │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Doctrine ORM (automatic)                                     │
│    - Converts database rows to PHP objects                      │
│    - Creates User object                                        │
│    - Creates Task objects                                       │
│    - Fills User->tasks Collection                               │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. Symfony Serializer (automatic)                               │
│    - Checks Groups: ['user:read', 'task:read']                  │
│    - Includes only properties with these groups                 │
│    - Skips password (has 'user:write' group)                    │
│    - Converts objects to JSON                                   │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. public/index.php                                            │
│     - Wraps JSON in HTTP Response                               │
│     - Adds headers                                              │
│     - Sends to browser                                          │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. Browser displays JSON                                       │
│     {                                                            │
│       "user_id": 1,                                             │
│       "username": "john",                                       │
│       "tasks": [...]                                            │
│     }                                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Key Components Explained

### 1. **Entry Point** (`public/index.php`)
- **Role:** Gateway to your app
- **Think of it as:** The front door of a building

### 2. **Router** (`config/routes/api_platform.yaml`)
- **Role:** Matches URLs to handlers
- **Think of it as:** A receptionist who directs you to the right office

### 3. **Entity** (`src/Entity/User.php`)
- **Role:** Defines data structure and API operations
- **Think of it as:** Blueprint + Instructions manual

### 4. **State Provider** (`src/State/UserTasksProvider.php`)
- **Role:** Custom logic to fetch data
- **Think of it as:** A specialized employee who knows how to get specific data

### 5. **Repository** (`src/Repository/UserRepository.php`)
- **Role:** Database query builder
- **Think of it as:** A librarian who fetches books (data) for you

### 6. **Doctrine ORM** (automatic, vendor code)
- **Role:** Converts database rows ↔ PHP objects
- **Think of it as:** A translator between database language and PHP language

### 7. **Serializer** (automatic, Symfony component)
- **Role:** Converts PHP objects → JSON
- **Think of it as:** A packaging department that wraps data for shipping

---

## 🎓 Important Concepts

### **Normalization Context** (Lines in User.php:31)
```php
normalizationContext: ['groups' => ['user:read', 'task:read']]
```
- **What it means:** "When converting to JSON, only include properties tagged with `user:read` or `task:read`"
- **Why it matters:** Security! We don't want to expose passwords in API responses

### **URI Variables** (In UserTasksProvider.php)
```php
$userId = $uriVariables['id'] ?? null;  // id = 1
```
- **What it means:** Extracts `{id}` from URL `/users/{id}/tasks`
- **Example:** `/users/1/tasks` → `$uriVariables = ['id' => 1]`

### **Doctrine Hydration** (automatic)
- **What it means:** Filling PHP objects with database data
- **Example:**
  ```
  Database row: ['user_id' => 1, 'username' => 'john']
                      ↓
  PHP object: User { user_id: 1, username: 'john' }
  ```

---

## 🚀 Try It Yourself!

### Add Debug Logging

**In `src/State/UserTasksProvider.php`**, add logging:
```php
public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
{
    $userId = $uriVariables['id'] ?? null;

    // ✨ DEBUG: Log what we received
    error_log("🔍 UserTasksProvider called with userId: " . $userId);

    if (!$userId) {
        error_log("❌ No userId provided!");
        return null;
    }

    $user = $this->entityManager
        ->getRepository(User::class)
        ->find($userId);

    // ✨ DEBUG: Log what we found
    error_log("✅ Found user: " . ($user ? $user->getUsername() : 'null'));

    return $user;
}
```

Now check your logs when you call the API! 📝

---

## 📚 Summary

**Question:** "How does `/api/users/1/tasks` work?"

**Answer:**
1. **Router** finds the URL matches `/users/{id}/tasks`
2. **API Platform** reads `User.php` and sees it needs `UserTasksProvider`
3. **UserTasksProvider** asks the database for user with id=1
4. **Doctrine** runs SQL queries and creates User object with Task objects
5. **Serializer** converts objects to JSON (respecting Groups)
6. **Browser** receives JSON response

**Key files touched:**
- `config/routes/api_platform.yaml` - Routing
- `src/Entity/User.php` - API definition
- `src/State/UserTasksProvider.php` - Custom data fetching
- `src/Repository/UserRepository.php` - Database queries
- Database - Actual data storage

---

**You now understand the complete flow! 🎉**
