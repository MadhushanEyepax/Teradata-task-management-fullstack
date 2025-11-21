# Symfony Backend API - Implementation Complete

## ✅ What We've Built

### Module 3 & 4: Symfony Backend + API Platform

**Task Entity Created** (`src/Entity/Task.php`)

- id: integer (primary key, auto-increment)
- title: string (255 chars, not null)
- description: text (nullable)
- status: string (pending, completed)
- created_at: datetime (auto)

**API Routes Available:**

- GET `/api/tasks` - Get all tasks (with pagination)
- GET `/api/tasks/{id}` - Get single task
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task

**Features Implemented:**
✅ REST API with API Platform
✅ Filtering by status: `/api/tasks?status=completed`
✅ Search by title: `/api/tasks?title=search`
✅ Pagination: `/api/tasks?page=1`
✅ Sorting: `/api/tasks?order[createdAt]=desc`
✅ Swagger Documentation: `/api/docs`
✅ Validation (title required, status must be pending/completed)

---

## 🚀 Next Steps

### 1. Set Up PostgreSQL Database

**Option A: Using Docker (Recommended)**

```powershell
docker run --name postgres-task-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=task_management -p 5432:5432 -d postgres:16
```

**Option B: Install PostgreSQL locally**

- Download from: https://www.postgresql.org/download/windows/
- Create database named: `task_management`

### 2. Run Database Migration

```powershell
cd C:\INTERN-teradata-learning-project\backend-php

# If using Docker for PostgreSQL, update .env with:
# DATABASE_URL="postgresql://postgres:password@host.docker.internal:5432/task_management?serverVersion=16&charset=utf8"

# For local PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@127.0.0.1:5432/task_management?serverVersion=16&charset=utf8"

# Run migration (you'll need PHP with PostgreSQL extension installed)
php bin/console doctrine:migrations:migrate --no-interaction
```

### 3. Start the Server

```powershell
cd C:\INTERN-teradata-learning-project\backend-php
docker run --rm -p 8000:8000 -v "${PWD}:/app" -w /app php:8.2-cli php -S 0.0.0.0:8000 -t public
```

**Access Points:**

- API Docs (Swagger): http://localhost:8000/api/docs
- API Endpoint: http://localhost:8000/api/tasks

---

## 📝 Testing the API

### 1. Create a Task (POST)

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "status": "pending"
  }'
```

### 2. Get All Tasks (GET)

```bash
curl http://localhost:8000/api/tasks
```

### 3. Filter by Status

```bash
curl http://localhost:8000/api/tasks?status=completed
```

### 4. Search by Title

```bash
curl "http://localhost:8000/api/tasks?title=First"
```

### 5. Pagination

```bash
curl http://localhost:8000/api/tasks?page=1
```

### 6. Update a Task (PUT)

```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "status": "completed"
  }'
```

### 7. Delete a Task (DELETE)

```bash
curl -X DELETE http://localhost:8000/api/tasks/1
```

---

## 🔍 API Documentation

Visit: **http://localhost:8000/api/docs**

This provides:

- Interactive Swagger UI
- All available endpoints
- Request/Response schemas
- Try it out functionality

---

## 📂 Files Created

1. `src/Entity/Task.php` - Task entity with validation
2. `src/Repository/TaskRepository.php` - Repository for custom queries
3. `migrations/Version20251120000001.php` - Database migration
4. `config/packages/api_platform.yaml` - API Platform configuration

---

## ✨ Features

### Validation

- Title is required (max 255 chars)
- Status must be "pending" or "completed"
- Created date auto-set

### Filters

- **Search**: `?status=completed`
- **Partial Search**: `?title=task`
- **Ordering**: `?order[createdAt]=desc`
- **Pagination**: `?page=2&itemsPerPage=20`

### Response Format

```json
{
  "id": 1,
  "title": "My Task",
  "description": "Task description",
  "status": "pending",
  "createdAt": "2025-11-20T09:00:00+00:00"
}
```

---

## 🎯 Module Completion Checklist

### Module 3: Symfony Backend ✅

- [x] Task Entity created
- [x] Repository pattern implemented
- [x] Validation rules added
- [x] Auto-generated created_at
- [x] All CRUD operations

### Module 4: API Platform ✅

- [x] API Platform installed
- [x] REST standards followed
- [x] Filtering implemented
- [x] Pagination configured
- [x] Swagger documentation available

### Module 5: PostgreSQL (Next)

- [ ] PostgreSQL database setup
- [ ] Run migrations
- [ ] Create users table
- [ ] Add foreign key relationship
- [ ] Test JOIN queries

---

## 💡 Tips

1. **View all routes:**

   ```powershell
   docker run --rm -v "${PWD}:/app" -w /app php:8.2-cli php bin/console debug:router
   ```

2. **Clear cache:**

   ```powershell
   docker run --rm -v "${PWD}:/app" -w /app php:8.2-cli php bin/console cache:clear
   ```

3. **View Entity mapping:**
   ```powershell
   docker run --rm -v "${PWD}:/app" -w /app php:8.2-cli php bin/console doctrine:mapping:info
   ```

---

## 🐛 Troubleshooting

**Issue**: Server returns 404

- **Fix**: Make sure you're accessing `/api/tasks` not just `/`

**Issue**: PostgreSQL connection error

- **Fix**: Verify PostgreSQL is running and DATABASE_URL in `.env` is correct

**Issue**: Validation errors

- **Fix**: Check required fields (title is mandatory)

---

## 📚 What You Learned

✅ Symfony Entity creation with Doctrine ORM
✅ API Platform for automatic REST API generation
✅ Validation with Symfony Validator
✅ Filtering and pagination
✅ Swagger/OpenAPI documentation
✅ Database migrations
✅ Repository pattern for database queries

**Your backend API is now ready for integration with the React frontend!**
