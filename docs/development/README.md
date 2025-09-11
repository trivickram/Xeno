# Development Setup Guide

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Optional Tools
- **pgAdmin** - PostgreSQL GUI management tool
- **Postman** - API testing tool
- **VSCode** - Recommended code editor

## 🗄️ Database Setup

### 1. Install PostgreSQL

#### Windows
1. Download PostgreSQL installer from official website
2. Run installer and follow setup wizard
3. Remember the password for `postgres` user
4. Ensure PostgreSQL service is running

#### macOS (with Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Development Database

Connect to PostgreSQL as superuser:
```bash
# Windows/Linux
psql -U postgres

# macOS
psql postgres
```

Create database and user:
```sql
-- Create database
CREATE DATABASE shopify_insights_dev;

-- Create user (optional - can use postgres user for development)
CREATE USER shopify_dev WITH PASSWORD 'shopify123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shopify_insights_dev TO shopify_dev;

-- Exit psql
\q
```

### 3. Test Database Connection

```bash
# Test with created user
psql -h localhost -U shopify_dev -d shopify_insights_dev

# Or with postgres user
psql -h localhost -U postgres -d shopify_insights_dev
```

## 🚀 Project Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd shopify-insights-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies (includes concurrently)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies  
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create `backend/.env` file:
```env
# Environment
NODE_ENV=development
PORT=5000

# Database - Update with your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_insights_dev
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret - Use a secure random string in production
JWT_SECRET=super_secret_jwt_key_for_development_only

# Shopify API (optional for initial setup)
SHOPIFY_SHOP_DOMAIN=demo-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=demo_token
```

#### Frontend Environment (.env.local)
Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Shopify Insights Platform
```

### 4. Database Migration
```bash
cd backend
npm run db:setup
```

This will:
- Create all database tables
- Run initial migrations
- Seed sample data (optional)

## 🏃‍♂️ Running the Application

### Development Mode (Both Services)
```bash
# From root directory
npm run dev
```

This starts:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Individual Services
```bash
# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend
```

### Production Mode
```bash
# Build both applications
npm run build

# Start production servers
npm start
```

## 🔧 Development Workflow

### 1. Making Backend Changes
- Files are in `backend/src/`
- Server restarts automatically with nodemon
- Check logs in console or `backend/logs/`

### 2. Making Frontend Changes  
- Files are in `frontend/src/`
- Next.js hot reload is enabled
- Check browser console for errors

### 3. Database Changes
- Create new migration: `cd backend && npm run db:migration:create <name>`
- Run migrations: `npm run db:migrate`
- Rollback if needed: `npm run db:rollback`

### 4. API Testing
Use the demo credentials:
- **Email**: admin@example.com
- **Password**: admin123

Or create new account via `/register` endpoint.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test                # Run tests
npm run test:watch      # Watch mode
```

### API Testing
- Use Postman collection (if available)
- Test endpoints with curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 🐛 Common Issues

### Database Connection Issues

**Error**: `SequelizeConnectionRefusedError`
**Solution**: 
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists
4. Test connection with `psql`

**Error**: `Database does not exist`
**Solution**:
```bash
createdb -U postgres shopify_insights_dev
```

### Node.js Version Issues

**Error**: `Unsupported Node.js version`
**Solution**: Use Node.js 18 or higher
```bash
# Check version
node -v

# Update using nvm (recommended)
nvm install 18
nvm use 18
```

### Port Already in Use

**Error**: `Port 5000 is already in use`
**Solution**:
1. Kill process using port: `npx kill-port 5000`
2. Or change port in `backend/.env`

**Error**: `Port 3000 is already in use`  
**Solution**:
1. Kill process: `npx kill-port 3000`
2. Next.js will automatically suggest port 3001

### Module Not Found Errors

**Error**: `Cannot find module`
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For specific service
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

## 📝 Code Style & Guidelines

### Backend Code Style
- Use ES6+ features
- Follow MVC pattern
- Use async/await for promises
- Add JSDoc comments for functions
- Handle errors properly with try/catch

### Frontend Code Style
- Use TypeScript
- Follow React functional components
- Use custom hooks for logic
- Implement proper error boundaries
- Use Tailwind CSS for styling

### Database Guidelines
- Use descriptive table/column names
- Add proper indexes for foreign keys
- Use migrations for schema changes
- Add validation constraints
- Document relationships

## 🔍 Debugging

### Backend Debugging
1. **Console Logs**: Check terminal output
2. **Log Files**: Check `backend/logs/app.log`
3. **Database Logs**: Enable query logging in Sequelize
4. **API Testing**: Use Postman or curl

### Frontend Debugging  
1. **Browser Console**: Check for JavaScript errors
2. **React DevTools**: Install browser extension
3. **Network Tab**: Check API calls
4. **Next.js Debug**: Use `DEBUG=* npm run dev`

### Database Debugging
```bash
# Connect to database
psql -h localhost -U postgres -d shopify_insights_dev

# List tables
\dt

# Describe table structure
\d table_name

# Check recent queries (if logging enabled)
\x
SELECT query FROM pg_stat_activity;
```

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Getting Help

1. **Check the logs** for error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

## 🔄 Development Commands Reference

```bash
# Root level commands
npm run dev              # Start both services
npm run build           # Build both applications
npm run test            # Run all tests
npm run lint            # Lint all code

# Backend specific
cd backend
npm run dev             # Start backend with nodemon
npm run start           # Start production backend
npm run test            # Run backend tests
npm run db:setup        # Setup database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed sample data

# Frontend specific  
cd frontend
npm run dev             # Start Next.js development
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types
```
