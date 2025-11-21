# 🐳 Docker Setup Explained - For Beginners

## 🎯 What is Docker? (Simple Explanation)

Think of Docker like **shipping containers** for software:

- **Without Docker:** You install PHP, PostgreSQL, and all dependencies directly on your computer. Different computers = different setups = problems! 😩
- **With Docker:** Everything runs in isolated "containers" (like virtual computers). Same setup everywhere! 🎉

**Analogy:** Docker is like a lunchbox 🍱
- Your app = food inside
- Container = the lunchbox that keeps everything organized
- You can carry it anywhere and it works the same!

---

## 📦 Your Project's Docker Setup

Your project has **2 containers** (like 2 separate mini-computers):

1. **`php` container** - Runs your Symfony PHP application
2. **`database` container** - Runs PostgreSQL database

They talk to each other through a **Docker network** (like a private WiFi connection).

---

## 🗂️ Key Files Explained

### 1. **Dockerfile** (Recipe for PHP Container)

**Location:** `backend-php/Dockerfile`

**What it is:** Instructions to build the PHP container (like a recipe to bake a cake 🎂)

```dockerfile
FROM php:8.2-fpm                          # Start with PHP 8.2 base
                                          # (like starting with cake mix)

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \                                 # Version control
    curl \                                # Download tool
    libpq-dev \                           # PostgreSQL library (IMPORTANT!)
    zip \                                 # Compression
    unzip                                 # Unzip files

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql  # PostgreSQL drivers for PHP
                                          # (fixes "could not find driver" error!)

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
                                          # PHP package manager

# Set working directory
WORKDIR /var/www                          # Where your code lives in container

# Copy project files
COPY . .                                  # Copy everything from your computer
                                          # to the container

# Install Symfony dependencies
RUN composer install                      # Install all PHP packages

EXPOSE 8000                               # Open port 8000 for web traffic

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
                                          # Start PHP built-in web server
```

**In simple terms:**
1. Get a basic PHP 8.2 setup
2. Install tools needed for PostgreSQL
3. Install Composer (like npm for PHP)
4. Copy your code
5. Install dependencies
6. Start the web server on port 8000

---

### 2. **compose.yaml** (Orchestration File)

**Location:** `backend-php/compose.yaml`

**What it is:** Defines all your containers and how they connect (like a blueprint for a building 🏗️)

```yaml
services:                               # List of containers

  php:                                  # Container #1: PHP Application
    build:
      context: .                        # Build from current directory
      dockerfile: Dockerfile            # Use Dockerfile as recipe
    ports:
      - "8000:8000"                     # Map port 8000 (computer → container)
                                        # You access: localhost:8000
                                        # Container receives on: 8000
    volumes:
      - .:/var/www                      # Share your code with container
                                        # (like a shared folder)
                                        # Changes on computer = instant in container!
    depends_on:
      database:
        condition: service_healthy      # Wait for database to be ready
                                        # (don't start PHP until DB is up!)
    environment:
      DATABASE_URL: "postgresql://app:!ChangeMe!@database:5432/app?serverVersion=18"
                                        # How PHP connects to database
                                        # @database ← container name (not localhost!)

  database:                             # Container #2: PostgreSQL Database
    image: postgres:18-alpine           # Use official PostgreSQL 18 image
                                        # (alpine = smaller, faster version)
    environment:
      POSTGRES_DB: app                  # Database name
      POSTGRES_PASSWORD: !ChangeMe!     # Password
      POSTGRES_USER: app                # Username
    healthcheck:
      test: ["CMD", "pg_isready", "-d", "app", "-U", "app"]
                                        # Check if database is ready
      timeout: 5s
      retries: 5
      start_period: 60s
    volumes:
      - database_data:/var/lib/postgresql/data
                                        # Persist database data
                                        # (even when container stops, data stays!)

volumes:
  database_data:                        # Named volume for database storage
```

**Key Concepts:**

#### **Ports** (`8000:8000`)
```
Your Computer:8000  →  Container:8000
     (host)               (container)

You type: http://localhost:8000
Docker forwards to: Container port 8000
```

#### **Volumes** (`.:/var/www`)
```
Your Computer Folder   ↔   Container Folder
backend-php/           ↔   /var/www

Edit file on computer → Changes instantly in container!
(No need to rebuild!)
```

#### **Networks** (automatic)
Docker creates a private network where containers can talk:
```
php container
    ↓ (talks to)
database container (hostname: "database")
```

That's why DATABASE_URL uses `@database` not `@localhost`!

---

### 3. **.env** (Environment Variables)

**Location:** `backend-php/.env`

**What it is:** Configuration settings (like a settings file 🎛️)

```ini
APP_ENV=dev                             # Development mode
APP_SECRET=35d58694442d01fabbea295023437852  # Security key

# Database connection (when NOT using Docker)
DATABASE_URL="postgresql://postgres:simplePass123@127.0.0.1:5432/task_management?serverVersion=18"
                            ↑
                      This is for LOCAL PostgreSQL (outside Docker)
```

**Important:** When running in Docker, `compose.yaml` **overrides** this with:
```yaml
DATABASE_URL: "postgresql://app:!ChangeMe!@database:5432/app?serverVersion=18"
                                          ↑
                                    Container name (not 127.0.0.1)
```

---

## 🔄 How Everything Connects

### **The Complete Picture:**

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR COMPUTER (Windows)                                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Docker Desktop                                     │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────┐      │    │
│  │  │  Docker Network (bridge)                 │      │    │
│  │  │                                          │      │    │
│  │  │  ┌────────────────┐  ┌────────────────┐ │      │    │
│  │  │  │  php container │  │ database       │ │      │    │
│  │  │  │                │  │ container      │ │      │    │
│  │  │  │  - PHP 8.2     │  │                │ │      │    │
│  │  │  │  - Symfony     │←→│ - PostgreSQL 18│ │      │    │
│  │  │  │  - Port 8000   │  │ - Port 5432    │ │      │    │
│  │  │  │                │  │                │ │      │    │
│  │  │  └────────────────┘  └────────────────┘ │      │    │
│  │  │         ↑                    ↑          │      │    │
│  │  └─────────┼────────────────────┼──────────┘      │    │
│  │            │                    │                  │    │
│  └────────────┼────────────────────┼──────────────────┘    │
│               │                    │                        │
│          Port 8000            Volume (data)                 │
│               │                    │                        │
└───────────────┼────────────────────┼────────────────────────┘
                ↓                    ↓
         Browser Access       backend-php folder
    http://localhost:8000     (your code)
```

### **Step-by-Step Connection Flow:**

1. **You start Docker:**
   ```bash
   docker-compose up
   ```

2. **Docker builds `php` container:**
   - Reads `Dockerfile`
   - Installs PHP, PostgreSQL drivers, Composer
   - Copies your code to `/var/www`
   - Runs `composer install`

3. **Docker starts `database` container:**
   - Downloads PostgreSQL 18 Alpine image
   - Creates database named "app"
   - Sets up user "app" with password "!ChangeMe!"
   - Runs healthcheck to verify it's ready

4. **Docker creates network:**
   - Both containers can talk to each other
   - PHP can reach database at hostname `database`

5. **PHP starts web server:**
   - Runs on port 8000 inside container
   - Docker maps it to port 8000 on your computer
   - You can access: `http://localhost:8000`

6. **Symfony connects to database:**
   - Uses `DATABASE_URL` from `compose.yaml`
   - Connects to `database:5432` (container network)
   - PostgreSQL accepts connection

---

## 🎮 Common Docker Commands

### **Start Everything:**
```bash
cd backend-php
docker-compose up
```
- Builds containers (if needed)
- Starts both `php` and `database`
- Shows logs in terminal

### **Start in Background (Detached):**
```bash
docker-compose up -d
```
- Same as above, but runs in background
- Terminal is free for other commands

### **Stop Everything:**
```bash
docker-compose down
```
- Stops and removes containers
- **Data persists** in volumes!

### **Rebuild Containers (after changing Dockerfile):**
```bash
docker-compose up --build
```
- Forces rebuild of containers
- Use when you modify `Dockerfile`

### **See Running Containers:**
```bash
docker-compose ps
```
Output:
```
NAME                  SERVICE    STATUS
backend-php-php-1     php        Up
backend-php-database-1 database  Up (healthy)
```

### **View Logs:**
```bash
docker-compose logs php        # PHP logs
docker-compose logs database   # Database logs
docker-compose logs -f         # Follow all logs (live)
```

### **Run Commands Inside Containers:**
```bash
# Enter PHP container shell
docker-compose exec php bash

# Run Symfony commands
docker-compose exec php php bin/console cache:clear
docker-compose exec php php bin/console doctrine:migrations:migrate

# Enter PostgreSQL database
docker-compose exec database psql -U app -d app
```

### **Stop and Remove Everything (including volumes):**
```bash
docker-compose down -v
```
⚠️ **WARNING:** This deletes ALL database data!

---

## 🔍 Troubleshooting

### **Problem 1: Port 8000 already in use**
**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**
```bash
# Stop whatever is using port 8000
netstat -ano | findstr :8000    # Find process
taskkill /PID <PID> /F          # Kill it

# Or change port in compose.yaml:
ports:
  - "8001:8000"   # Use port 8001 instead
```

### **Problem 2: Database connection failed**
**Error:** `could not find driver`

**Solution:**
```bash
# Rebuild PHP container with PostgreSQL drivers
docker-compose down
docker-compose up --build
```

### **Problem 3: Changes not reflecting**
**Solution:**
```bash
# Clear cache
docker-compose exec php php bin/console cache:clear

# Restart containers
docker-compose restart
```

### **Problem 4: Database data lost**
**Cause:** You ran `docker-compose down -v`

**Solution:**
- Don't use `-v` flag unless you want to delete data
- Use `docker-compose down` to keep data

---

## 🎓 Key Concepts Summary

### **Container vs Image**
- **Image** = Recipe (instructions, read-only)
- **Container** = Actual running instance (like baked cake)

Example:
```
Dockerfile → Image (php:8.2-symfony) → Container (backend-php-php-1)
```

### **Volumes**
- Persist data between container restarts
- Two types:
  1. **Bind mount:** `.:/var/www` (share folder with host)
  2. **Named volume:** `database_data` (Docker-managed storage)

### **Networks**
- Containers in same `compose.yaml` can talk using service names
- `php` container can reach `database` container at hostname `database`

### **Environment Variables**
Priority (highest to lowest):
1. Shell environment
2. `compose.yaml` environment section
3. `.env` file

---

## 🚀 Your Current Setup

### **With Docker (Recommended):**
```bash
# Start
cd backend-php
docker-compose up -d

# Access
http://localhost:8000/api/tasks

# Run migrations
docker-compose exec php php bin/console doctrine:migrations:migrate

# Stop
docker-compose down
```

**DATABASE_URL:** `postgresql://app:!ChangeMe!@database:5432/app`

### **Without Docker (Local PostgreSQL):**
```bash
# Start
cd backend-php
php -S localhost:8000 -t public

# Access
http://localhost:8000/api/tasks
```

**DATABASE_URL:** `postgresql://postgres:simplePass123@127.0.0.1:5432/task_management`

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐         ┌──────────────────────┐   │
│  │   php Service       │         │  database Service    │   │
│  ├─────────────────────┤         ├──────────────────────┤   │
│  │ Built from:         │         │ Image:               │   │
│  │ - Dockerfile        │         │ - postgres:18-alpine │   │
│  │                     │         │                      │   │
│  │ Ports:              │         │ Ports:               │   │
│  │ - 8000:8000         │         │ - 5432 (internal)    │   │
│  │                     │         │                      │   │
│  │ Volumes:            │         │ Volumes:             │   │
│  │ - .:/var/www        │         │ - database_data      │   │
│  │                     │         │                      │   │
│  │ Environment:        │         │ Environment:         │   │
│  │ - DATABASE_URL      │────────>│ - POSTGRES_DB        │   │
│  │                     │connects │ - POSTGRES_USER      │   │
│  │                     │    to   │ - POSTGRES_PASSWORD  │   │
│  └─────────────────────┘         └──────────────────────┘   │
│           ↑                                                  │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            │ Port mapping
            ↓
    http://localhost:8000
     (Your browser)
```

---

## 🎉 Summary

**Q: How does your project connect to Docker?**

**A:**
1. **`Dockerfile`** defines how to build the PHP container (with PostgreSQL drivers)
2. **`compose.yaml`** orchestrates 2 containers: `php` and `database`
3. **Docker network** allows containers to communicate (`php` → `database`)
4. **Volumes** persist database data and share your code
5. **Port mapping** (`8000:8000`) makes your app accessible at `localhost:8000`

**Flow:**
```
You → localhost:8000 → Docker → php container → database container → PostgreSQL
```

Now you understand Docker! 🎓🐳
