# 🔄 Local PostgreSQL vs Docker: How They Communicate

## 🎯 Your Current Situation

You have **TWO possible setups**. Let me explain both:

---

## 📍 Setup 1: Running EVERYTHING Locally (No Docker)

### **Architecture:**
```
┌─────────────────────────────────────────────────┐
│  YOUR COMPUTER (Windows)                        │
│                                                  │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  PHP Process     │───→│  PostgreSQL      │  │
│  │  (Symfony)       │    │  (Local Install) │  │
│  │  Port: 8000      │    │  Port: 5432      │  │
│  └──────────────────┘    └──────────────────┘  │
│         ↑                         ↑             │
│         │                         │             │
│    localhost:8000           localhost:5432      │
└─────────┼─────────────────────────┼─────────────┘
          │                         │
     Browser Access           Direct DB Access
```

### **How They Communicate:**

1. **PostgreSQL** runs as a Windows service on `localhost:5432`
2. **PHP** runs via `php -S localhost:8000 -t public`
3. **Symfony** connects using `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:simplePass123@127.0.0.1:5432/task_management"
   ```

### **Connection Flow:**
```
Browser
   ↓
http://localhost:8000 (PHP built-in server)
   ↓
Symfony Application
   ↓
Doctrine ORM
   ↓
127.0.0.1:5432 (Local PostgreSQL)
   ↓
Database: task_management
```

### **Commands:**
```bash
# Start PostgreSQL (Windows Service - already running)
# Check: Services → PostgreSQL

# Start PHP server
cd backend-php
php -S localhost:8000 -t public

# Run migrations
php bin/console doctrine:migrations:migrate

# Access API
http://localhost:8000/api/tasks
```

### **Pros:**
✅ Simple, direct connection
✅ No Docker overhead
✅ Easy to debug

### **Cons:**
❌ PostgreSQL must be installed on Windows
❌ Different setup on different computers
❌ Port conflicts possible

---

## 📍 Setup 2: Docker PHP + Local PostgreSQL (Hybrid)

### **Architecture:**
```
┌───────────────────────────────────────────────────────────┐
│  YOUR COMPUTER (Windows)                                  │
│                                                            │
│  ┌──────────────────────────────────┐  ┌──────────────┐  │
│  │  Docker Desktop                  │  │ PostgreSQL   │  │
│  │                                  │  │ (Local)      │  │
│  │  ┌────────────────────────────┐  │  │              │  │
│  │  │  php container             │  │  │ Port: 5432  │  │
│  │  │  - Symfony                 │──┼──→              │  │
│  │  │  - Port 8000               │  │  │              │  │
│  │  │  - /var/www → your code    │  │  │              │  │
│  │  └────────────────────────────┘  │  │              │  │
│  │                                  │  │              │  │
│  └──────────────────────────────────┘  └──────────────┘  │
│                ↑                              ↑           │
│                │                              │           │
│         localhost:8000                 localhost:5432     │
└────────────────┼──────────────────────────────┼───────────┘
                 │                              │
            Browser Access              DB Access from
                                        container
```

### **The Problem:**
When PHP runs **inside Docker**, it can't use `127.0.0.1` or `localhost` to connect to PostgreSQL on your computer!

**Why?**
- `127.0.0.1` inside container = container itself, not your computer
- Container has its own network namespace

### **The Solution:**
Use `host.docker.internal` - a special hostname that Docker provides to access your computer from inside a container.

### **How They Communicate:**

#### **Step 1: Update compose.yaml**
```yaml
services:
  php:
    environment:
      # ❌ WRONG - Container can't reach localhost
      # DATABASE_URL: "postgresql://postgres:simplePass123@localhost:5432/task_management"

      # ✅ CORRECT - Use host.docker.internal
      DATABASE_URL: "postgresql://postgres:simplePass123@host.docker.internal:5432/task_management?serverVersion=18"
```

#### **Step 2: PostgreSQL Must Allow External Connections**

**File: `C:\Program Files\PostgreSQL\18\data\postgresql.conf`**
```ini
# Change this line:
listen_addresses = 'localhost'    # ❌ Only local

# To this:
listen_addresses = '*'            # ✅ All addresses
```

**File: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`**
```
# Add this line (allow Docker network):
host    all    all    172.16.0.0/12    md5
```

**Restart PostgreSQL service:**
```powershell
# Open PowerShell as Administrator
Restart-Service postgresql-x64-18
```

### **Connection Flow:**
```
Browser
   ↓
http://localhost:8000
   ↓
Docker forwards to php container
   ↓
Symfony Application (inside container)
   ↓
Doctrine connects to host.docker.internal:5432
   ↓
Docker translates to your computer's IP
   ↓
Local PostgreSQL on Windows
   ↓
Database: task_management
```

### **Commands:**
```bash
# Start Docker containers
docker-compose up -d

# Check if PHP can reach PostgreSQL
docker-compose exec php php bin/console dbal:run-sql "SELECT 1"

# Run migrations
docker-compose exec php php bin/console doctrine:migrations:migrate

# Access API
http://localhost:8000/api/tasks
```

### **Pros:**
✅ Consistent PHP environment
✅ Easy to share setup
✅ Isolated dependencies

### **Cons:**
❌ More complex networking
❌ Requires PostgreSQL config changes
❌ Docker overhead

---

## 📍 Setup 3: Full Docker (Recommended)

### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│  YOUR COMPUTER (Windows)                                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Docker Desktop                                     │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────┐      │ │
│  │  │  Docker Network (bridge)                 │      │ │
│  │  │                                          │      │ │
│  │  │  ┌────────────────┐  ┌────────────────┐ │      │ │
│  │  │  │  php container │  │ database       │ │      │ │
│  │  │  │                │  │ container      │ │      │ │
│  │  │  │  - Symfony     │←→│ - PostgreSQL   │ │      │ │
│  │  │  │  - Port 8000   │  │ - Port 5432    │ │      │ │
│  │  │  └────────────────┘  └────────────────┘ │      │ │
│  │  │                                          │      │ │
│  │  └──────────────────────────────────────────┘      │ │
│  └────────────────────────────────────────────────────┘ │
│                       ↑                                  │
│                localhost:8000                            │
└───────────────────────┼──────────────────────────────────┘
                        │
                   Browser Access
```

### **How They Communicate:**

**Both containers in same Docker network!**

1. **Docker creates a bridge network** automatically
2. **Containers can talk using service names** (not IPs)
3. **PHP connects to `database:5432`** (hostname = service name)

### **Connection Flow:**
```
Browser
   ↓
http://localhost:8000
   ↓
Docker maps to php container port 8000
   ↓
Symfony Application
   ↓
Doctrine connects to "database:5432"
   ↓
Docker network routes to database container
   ↓
PostgreSQL in database container
   ↓
Database: app
```

### **compose.yaml Configuration:**
```yaml
services:
  php:
    environment:
      # ✅ Use service name "database"
      DATABASE_URL: "postgresql://app:!ChangeMe!@database:5432/app?serverVersion=18"
    depends_on:
      database:
        condition: service_healthy

  database:
    image: postgres:18-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: !ChangeMe!
```

### **Commands:**
```bash
# Start everything
docker-compose up -d

# Run migrations
docker-compose exec php php bin/console doctrine:migrations:migrate

# Access database
docker-compose exec database psql -U app -d app

# Access API
http://localhost:8000/api/tasks
```

### **Pros:**
✅ Complete isolation
✅ No PostgreSQL installation needed
✅ Same setup everywhere
✅ Easy container-to-container networking
✅ Production-ready

### **Cons:**
❌ More disk space
❌ Learning curve

---

## 🔍 Deep Dive: How Docker Networking Works

### **Docker Network Types:**

#### **1. Bridge Network (Default)**
```
Docker creates a virtual network (like a private WiFi)

Network: 172.17.0.0/16

php container:      172.17.0.2
database container: 172.17.0.3

They can talk to each other using:
- IP addresses (172.17.0.3)
- Service names (database) ← Preferred!
```

#### **2. Host Network**
```
Container uses host's network directly

Container's localhost = Host's localhost

❌ Not recommended for most cases
```

#### **3. None Network**
```
No network access

Container is completely isolated

❌ Rarely used
```

### **DNS Resolution in Docker:**

When you use `database:5432`, Docker's internal DNS resolves it:

```
1. Symfony tries to connect to "database:5432"
2. Docker DNS checks network for service named "database"
3. Finds database container at 172.17.0.3
4. Returns IP to Symfony
5. Connection established!
```

---

## 🎯 Your Current Setup (Based on .env)

Looking at your `.env` file:
```ini
DATABASE_URL="postgresql://postgres:simplePass123@127.0.0.1:5432/task_management"
```

**You're using Setup 1: Everything Local**

### **Current Communication:**
```
PHP (local process) → 127.0.0.1:5432 → PostgreSQL (Windows service)
```

### **To Switch to Full Docker:**

**Step 1: Update .env (or remove this line, compose.yaml will override)**
```ini
# Not needed when using Docker Compose
# DATABASE_URL will come from compose.yaml
```

**Step 2: Ensure compose.yaml has:**
```yaml
services:
  php:
    environment:
      DATABASE_URL: "postgresql://app:!ChangeMe!@database:5432/app?serverVersion=18"
```

**Step 3: Start Docker:**
```bash
docker-compose up -d
```

**Step 4: Run migrations:**
```bash
docker-compose exec php php bin/console doctrine:migrations:migrate
```

---

## 🔧 Troubleshooting

### **Problem: Can't connect from Docker to local PostgreSQL**

**Error:** `Connection refused`

**Solution:**
```bash
# 1. Use host.docker.internal instead of localhost
DATABASE_URL="postgresql://postgres:simplePass123@host.docker.internal:5432/task_management"

# 2. Check PostgreSQL is listening on all addresses
# File: postgresql.conf
listen_addresses = '*'

# 3. Allow Docker network in pg_hba.conf
host all all 172.16.0.0/12 md5

# 4. Restart PostgreSQL
Restart-Service postgresql-x64-18
```

### **Problem: Docker containers can't talk to each other**

**Error:** `could not translate host name "database" to address`

**Solution:**
```bash
# Ensure containers are in same network
docker-compose ps  # Both should be listed

# Check network
docker network ls
docker network inspect backend-php_default
```

### **Problem: Port 5432 already in use**

**Error:** `port is already allocated`

**Cause:** Local PostgreSQL is using port 5432

**Solution:**
```yaml
# In compose.yaml, use different port for database container
services:
  database:
    ports:
      - "5433:5432"  # External:Internal

# Then update DATABASE_URL
DATABASE_URL="postgresql://app:!ChangeMe!@database:5432/app"
# (still use 5432 inside Docker network!)
```

---

## 📊 Comparison Table

| Feature | Local | Docker + Local DB | Full Docker |
|---------|-------|-------------------|-------------|
| **Setup Complexity** | Easy | Medium | Medium |
| **PostgreSQL Install** | Required | Required | Not needed |
| **Networking** | Simple | Complex | Simple |
| **Portability** | Low | Medium | High |
| **Consistency** | Low | Medium | High |
| **Performance** | Fast | Medium | Fast |
| **Recommended For** | Quick tests | Transition | Production-like |

---

## 🎓 Summary

### **Your Current Setup (Local):**
```
PHP Process → 127.0.0.1:5432 → Local PostgreSQL
   ↑
   └─ Direct network call (same machine)
```

### **Docker + Local PostgreSQL:**
```
PHP Container → host.docker.internal:5432 → Your Computer → Local PostgreSQL
   ↑                        ↑
   └─ Docker network       Docker magic hostname
```

### **Full Docker (Recommended):**
```
PHP Container → database:5432 → Database Container
   ↑                  ↑
   └─ Docker network  Service name (DNS resolved by Docker)
```

---

## ✅ Recommendation

**For Learning:** Use **Full Docker** (Setup 3)
- Easiest networking (service names!)
- No PostgreSQL installation
- Same as production environments
- Your compose.yaml is already configured for this!

**To Use Full Docker:**
1. Make sure Docker Desktop is running
2. Run: `docker-compose up -d`
3. Access: `http://localhost:8000/api/tasks`

That's it! 🎉
