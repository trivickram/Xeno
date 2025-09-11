@echo off
REM Shopify Insights Platform - Quick Setup Script for Windows
REM This script helps you set up the project quickly

echo 🚀 Shopify Insights Platform - Quick Setup
echo ===========================================

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node -v

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL is not detected. Please make sure PostgreSQL is installed and accessible.
    echo    Download from: https://www.postgresql.org/download/
)

REM Navigate to backend directory
cd backend

echo.
echo 📦 Installing backend dependencies...
npm install

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual credentials before running the server!
    echo    Required: Database credentials, JWT secret, Shopify API credentials
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your credentials:
echo    - Database connection details
echo    - JWT secret (make it long and secure)
echo    - Shopify store domain and access token
echo.
echo 2. Make sure PostgreSQL is running
echo.
echo 3. Create database using pgAdmin or command line:
echo    psql -U postgres -c "CREATE DATABASE shopify_insights_dev;"
echo.
echo 4. Start the development server:
echo    cd backend ^&^& npm run dev
echo.
echo 5. Test the health endpoint:
echo    Open http://localhost:5000/health in your browser
echo.
echo 📖 For detailed setup instructions, see SETUP.md
echo.
pause
