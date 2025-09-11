# ✅ Pre-Setup Checklist - Shopify Insights Platform

## 📋 Prerequisites Checklist

Before running the project, make sure you have completed all items in this checklist:

### 🖥️ System Requirements
- [ ] **Node.js 16+** installed ([Download](https://nodejs.org/))
  ```bash
  # Check version
  node -v  # Should show v16.0.0 or higher
  npm -v   # Should show v8.0.0 or higher
  ```

- [ ] **PostgreSQL 12+** installed ([Download](https://www.postgresql.org/download/))
  ```bash
  # Check version
  psql --version  # Should show 12.0 or higher
  ```

- [ ] **Git** installed ([Download](https://git-scm.com/))
  ```bash
  # Check version
  git --version
  ```

### 🏪 Shopify Setup
- [ ] **Shopify Partner Account** created ([Sign up](https://partners.shopify.com))
- [ ] **Development Store** created with test data
  - [ ] Store has dummy products (at least 5-10)
  - [ ] Store has dummy customers (at least 5-10) 
  - [ ] Store has dummy orders (at least 10-20)
- [ ] **Private App** created in your development store
  - [ ] API permissions enabled for:
    - [ ] Customers (Read access)
    - [ ] Products (Read access)
    - [ ] Orders (Read access)
    - [ ] Inventory (Read access)
  - [ ] **Shop domain** noted (e.g., your-store.myshopify.com)
  - [ ] **Access token** (Password) noted securely

### 🗄️ Database Setup
- [ ] **PostgreSQL service** running
  ```bash
  # Windows: Check Services app for PostgreSQL
  # macOS: brew services list | grep postgres
  # Linux: systemctl status postgresql
  ```

- [ ] **Database created**
  ```sql
  -- Connect to PostgreSQL
  psql -U postgres
  
  -- Create database
  CREATE DATABASE shopify_insights_dev;
  
  -- Verify creation
  \l  -- Should show shopify_insights_dev in list
  ```

- [ ] **Database connection tested**
  ```bash
  # Test connection
  psql -U postgres -d shopify_insights_dev -c "SELECT 1;"
  # Should return: 1 (1 row)
  ```

### 🔐 Security Preparation
- [ ] **Strong JWT secret** generated (64+ characters)
  ```javascript
  // Generate a secure secret
  require('crypto').randomBytes(64).toString('hex')
  ```

- [ ] **Database password** set (if using authentication)
- [ ] **Shopify credentials** stored securely

## 🚀 Quick Start Commands

### Option 1: Automated Setup (Windows)
```batch
# Run the automated setup script
setup.bat
```

### Option 2: Automated Setup (macOS/Linux)
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies  
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your credentials
# (See configuration section below)

# 5. Start development server
npm run dev
```

## ⚙️ Environment Configuration

Edit `backend/.env` with these values:

```env
# ====================================
# REQUIRED CONFIGURATION
# ====================================

# Database (REQUIRED)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_insights_dev
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Security (REQUIRED - Generate a secure 64+ char string)
JWT_SECRET=your_64_character_secure_jwt_secret_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Shopify API (REQUIRED - From your Private App)
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_private_app_access_token
SHOPIFY_API_VERSION=2023-10

# ====================================
# OPTIONAL CONFIGURATION
# ====================================

# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Scheduling (Cron format - every 6 hours)
SYNC_CRON_SCHEDULE=0 */6 * * *

# Admin Operations (Generate secure keys)
ONBOARDING_SECRET_KEY=super_secure_onboarding_key_123
SYNC_SECRET_KEY=super_secure_sync_key_456

# Webhooks (For production)
WEBHOOK_SECRET=your_webhook_secret_for_production
```

## 🧪 Verification Steps

Run these commands to verify your setup:

### 1. Health Check
```bash
# Start server
cd backend && npm run dev

# In another terminal, test health endpoint
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2025-09-11T...",
#   "environment": "development", 
#   "version": "1.0.0"
# }
```

### 2. Database Connection
Check the server logs for:
```
✅ Database connection established successfully.
✅ Database models synchronized.
```

### 3. Create First Tenant
```bash
curl -X POST http://localhost:5000/api/tenant/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "secretKey": "super_secure_onboarding_key_123",
    "tenant": {
      "name": "My Test Company",
      "email": "admin@test.com"
    },
    "user": {
      "email": "admin@test.com", 
      "password": "TestPassword123!",
      "firstName": "John",
      "lastName": "Doe"
    },
    "shopify": {
      "shopDomain": "your-store.myshopify.com",
      "accessToken": "your_access_token"
    }
  }'
```

### 4. Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "TestPassword123!",
    "tenantSlug": "my-test-company"
  }'
```

## 🔧 Troubleshooting Common Issues

### Database Issues
```bash
# Issue: Connection refused
# Solution: Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
# Windows: Start PostgreSQL service in Services app

# Issue: Database doesn't exist
# Solution: Create it manually
psql -U postgres -c "CREATE DATABASE shopify_insights_dev;"

# Issue: Permission denied
# Solution: Create user and grant permissions
psql -U postgres -c "CREATE USER shopify_user WITH PASSWORD 'password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE shopify_insights_dev TO shopify_user;"
```

### Shopify API Issues
```bash
# Issue: 401 Unauthorized
# Check: Shop domain format (include .myshopify.com)
# Check: Access token is correct
# Check: Private app permissions are set

# Issue: 404 Not Found  
# Check: Shop domain spelling
# Check: Store is not password protected
```

### Server Issues
```bash
# Issue: Port 5000 in use
# Solution: Change port in .env or kill process
PORT=5001  # In .env file
# Or kill existing process:
lsof -ti:5000 | xargs kill -9
```

## 📚 Documentation References

- **Full Setup Guide**: `SETUP.md`
- **API Documentation**: `backend/README.md`
- **Project Overview**: `README.md`
- **Shopify API Docs**: [shopify.dev](https://shopify.dev/docs)
- **PostgreSQL Docs**: [postgresql.org](https://www.postgresql.org/docs/)

## 🎯 Success Criteria

Your setup is complete when:
- ✅ Server starts without errors
- ✅ Health endpoint returns 200 OK
- ✅ Database connection is established
- ✅ You can create a tenant successfully
- ✅ You can login and get a JWT token
- ✅ Shopify API connection works
- ✅ Data sync runs without errors

---

**🎉 Once all items are checked, you're ready to run the Shopify Insights Platform!**
