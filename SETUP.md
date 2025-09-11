# 🚀 Setup Guide - Shopify Insights Platform

## 📋 Prerequisites

Before running this project, you need to have the following installed and configured:

### 1. **System Requirements**
- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **PostgreSQL** (v12.0 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### 2. **Shopify Development Store**
You need a Shopify development store with dummy data:

1. **Create a Shopify Partner Account** (if you don't have one):
   - Go to [partners.shopify.com](https://partners.shopify.com)
   - Sign up for free

2. **Create a Development Store**:
   - In your Partner Dashboard, click "Stores"
   - Click "Add store" → "Development store"
   - Fill in store details
   - Choose "Start with test data" for dummy products/customers/orders

3. **Create a Private App** (for API access):
   - In your development store admin, go to "Apps"
   - Click "Manage private apps" at the bottom
   - Click "Create private app"
   - Fill in app details
   - In "Admin API permissions", enable:
     - **Customers**: Read access
     - **Orders**: Read access  
     - **Products**: Read access
     - **Inventory**: Read access
   - Save and note down:
     - **API key**
     - **Password** (this is your access token)
     - **Shop domain** (e.g., your-store.myshopify.com)

### 3. **Database Setup**

#### Option A: Local PostgreSQL
1. **Install PostgreSQL** on your system
2. **Create a database**:
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE shopify_insights_dev;

-- Create user (optional)
CREATE USER shopify_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shopify_insights_dev TO shopify_user;
```

#### Option B: Cloud Database (Recommended for production)
- **Heroku Postgres**: Free tier available
- **Railway PostgreSQL**: Easy setup
- **Supabase**: Free tier with good performance
- **AWS RDS**: Production-grade

## 🛠️ Project Setup Steps

### Step 1: Clone and Navigate
```bash
# Clone the repository (when available)
git clone <your-repo-url>
cd shopify-insights-platform

# Or create the project structure manually
mkdir shopify-insights-platform
cd shopify-insights-platform
```

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Step 3: Configure Environment Variables
Edit the `.env` file with your actual credentials:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_insights_dev
DB_USER=postgres  # or your database user
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_secure_64_characters
JWT_EXPIRES_IN=7d

# Shopify API Configuration
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_private_app_password_from_shopify
SHOPIFY_API_VERSION=2023-10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Cron Job Configuration
SYNC_CRON_SCHEDULE=0 */6 * * *

# Optional: Webhook Secret (for production)
WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Admin Keys
ONBOARDING_SECRET_KEY=super_secret_onboarding_key
SYNC_SECRET_KEY=super_secret_sync_key
```

### Step 4: Database Migration Setup
First, we need to set up Sequelize CLI for migrations:

```bash
# Install Sequelize CLI globally (if not installed)
npm install -g sequelize-cli

# Initialize Sequelize (this will be done automatically when you run the app)
# The models will create tables automatically in development mode
```

## ▶️ How to Run the Project

### Option 1: Development Mode (Recommended for testing)

```bash
# 1. Start PostgreSQL service
# On Windows: Start PostgreSQL service from Services
# On macOS: brew services start postgresql
# On Linux: sudo systemctl start postgresql

# 2. Navigate to backend directory
cd backend

# 3. Install dependencies (if not done already)
npm install

# 4. Start development server with auto-reload
npm run dev

# You should see output like:
# 🚀 Server running on port 5000 in development mode
# 📊 Health check available at http://localhost:5000/health
# Database connection established successfully.
# Database models synchronized.
```

### Option 2: Production Mode

```bash
# 1. Navigate to backend directory
cd backend

# 2. Set NODE_ENV to production in .env
NODE_ENV=production

# 3. Start production server
npm start
```

## 🧪 Testing the Setup

### 1. **Health Check**
```bash
# Test if server is running
curl http://localhost:5000/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2025-09-11T...",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. **Create a Tenant** (First-time setup)
```bash
# Create your first tenant with admin user
curl -X POST http://localhost:5000/api/tenant/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "secretKey": "super_secret_onboarding_key",
    "tenant": {
      "name": "My Company",
      "email": "admin@mycompany.com"
    },
    "user": {
      "email": "admin@mycompany.com",
      "password": "SecurePassword123!",
      "firstName": "John",
      "lastName": "Doe"
    },
    "shopify": {
      "shopDomain": "your-store.myshopify.com",
      "accessToken": "your_shopify_access_token",
      "shopName": "My Store"
    }
  }'
```

### 3. **Login Test**
```bash
# Login with your admin user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mycompany.com",
    "password": "SecurePassword123!",
    "tenantSlug": "my-company"
  }'

# Save the returned JWT token for authenticated requests
```

### 4. **Sync Data from Shopify**
```bash
# Sync all data (use JWT token from login)
curl -X POST http://localhost:5000/api/sync/all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: YOUR_TENANT_ID"
```

### 5. **Get Dashboard Data**
```bash
# Get overview stats
curl -X GET http://localhost:5000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: YOUR_TENANT_ID"
```

## 📁 Project Structure After Setup

```
shopify-insights-platform/
├── backend/
│   ├── src/                    # Source code
│   ├── logs/                   # Application logs (created automatically)
│   ├── node_modules/           # Dependencies
│   ├── .env                    # Your environment config
│   ├── package.json            # Dependencies and scripts
│   └── README.md               # Backend documentation
├── frontend/                   # (To be created next)
├── docs/                       # Documentation
└── README.md                   # Main project documentation
```

## 🚨 Common Issues & Troubleshooting

### Database Connection Issues
```bash
# Error: Connection refused
# Solution: Make sure PostgreSQL is running
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Error: Database doesn't exist
# Solution: Create the database manually
psql -U postgres -c "CREATE DATABASE shopify_insights_dev;"
```

### Shopify API Issues
```bash
# Error: 401 Unauthorized
# Solution: Check your access token and shop domain in .env

# Error: 429 Rate Limited  
# Solution: The app handles this automatically with delays
```

### Port Already in Use
```bash
# Error: Port 5000 already in use
# Solution: Change PORT in .env or kill the process
lsof -ti:5000 | xargs kill -9  # Kill process on port 5000
```

### JWT Secret Issues
```bash
# Error: JWT secret not provided
# Solution: Make sure JWT_SECRET in .env is at least 32 characters long
```

## 📚 Available NPM Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server

# Database
npm run migrate     # Run database migrations
npm run migrate:undo # Undo last migration
npm run seed       # Run database seeders

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm test          # Run tests (when implemented)
```

## 🔐 Security Notes

1. **Change default secrets** in `.env` before production
2. **Use strong passwords** for database and JWT
3. **Keep your Shopify credentials secure**
4. **Don't commit `.env` file** to version control
5. **Use HTTPS** in production
6. **Set up proper firewall rules**

## 🎯 Next Steps

After the backend is running successfully:

1. **Create the Next.js frontend** for the dashboard
2. **Set up proper database migrations** for production
3. **Configure deployment** to Railway/Render
4. **Add comprehensive testing**
5. **Set up CI/CD pipeline**

---

**🎉 You're now ready to run the Shopify Insights Platform backend!**

The server will be available at `http://localhost:5000` with full API documentation and multi-tenant Shopify data synchronization capabilities.
