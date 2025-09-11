#!/bin/bash

# Shopify Insights Platform - Development Startup Script

echo "🚀 Starting Shopify Insights Platform..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️ PostgreSQL CLI not found. Make sure PostgreSQL is installed and running.${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL CLI detected${NC}"
fi

# Install root dependencies if not exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing root dependencies...${NC}"
    npm install
fi

# Install backend dependencies if not exists
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

# Install frontend dependencies if not exists
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

# Setup environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚙️ Creating backend .env file from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}📝 Please edit backend/.env with your database credentials${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚙️ Creating frontend .env.local file...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local
    echo "NEXT_PUBLIC_APP_NAME=Shopify Insights Platform" >> frontend/.env.local
fi

# Database setup check
echo -e "${BLUE}🗄️ Checking database connection...${NC}"
cd backend
if npm run db:check 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️ Database connection failed. Setting up database...${NC}"
    npm run db:setup || echo -e "${RED}❌ Database setup failed. Please check your PostgreSQL installation.${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}🎉 Setup complete! Starting services...${NC}"
echo ""
echo -e "${BLUE}📍 Frontend will be available at: http://localhost:3000${NC}"
echo -e "${BLUE}📍 Backend API will be available at: http://localhost:5000/api${NC}"
echo ""
echo -e "${YELLOW}🔑 Demo credentials:${NC}"
echo -e "${YELLOW}   Email: admin@example.com${NC}"
echo -e "${YELLOW}   Password: admin123${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop both services${NC}"
echo "=================================================="

# Start both services
npm run dev
