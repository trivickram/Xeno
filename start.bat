@echo off
setlocal enabledelayedexpansion

REM Shopify Insights Platform - Development Startup Script for Windows

echo.
echo 🚀 Starting Shopify Insights Platform...
echo ==================================================

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node -v

REM Install root dependencies if not exists
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

REM Install backend dependencies if not exists
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Install frontend dependencies if not exists  
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

REM Setup environment files if they don't exist
if not exist "backend\.env" (
    echo ⚙️ Creating backend .env file from template...
    copy "backend\.env.example" "backend\.env" >nul
    echo 📝 Please edit backend\.env with your database credentials
)

if not exist "frontend\.env.local" (
    echo ⚙️ Creating frontend .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > "frontend\.env.local"
    echo NEXT_PUBLIC_APP_NAME=Shopify Insights Platform >> "frontend\.env.local"
)

REM Database setup
echo 🗄️ Setting up database...
cd backend
call npm run db:setup
cd ..

echo.
echo 🎉 Setup complete! Starting services...
echo.
echo 📍 Frontend will be available at: http://localhost:3000
echo 📍 Backend API will be available at: http://localhost:5000/api
echo.
echo 🔑 Demo credentials:
echo    Email: admin@example.com  
echo    Password: admin123
echo.
echo Press Ctrl+C to stop both services
echo ==================================================

REM Start both services
npm run dev

pause
