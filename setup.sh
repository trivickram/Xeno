#!/bin/bash

# Shopify Insights Platform - Quick Setup Script
# This script helps you set up the project quickly

echo "🚀 Shopify Insights Platform - Quick Setup"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not detected. Please make sure PostgreSQL is installed and accessible."
    echo "   Download from: https://www.postgresql.org/download/"
fi

# Navigate to backend directory
cd backend

echo ""
echo "📦 Installing backend dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual credentials before running the server!"
    echo "   Required: Database credentials, JWT secret, Shopify API credentials"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your credentials:"
echo "   - Database connection details"
echo "   - JWT secret (make it long and secure)"
echo "   - Shopify store domain and access token"
echo ""
echo "2. Make sure PostgreSQL is running"
echo ""
echo "3. Create database:"
echo "   psql -U postgres -c \"CREATE DATABASE shopify_insights_dev;\""
echo ""
echo "4. Start the development server:"
echo "   cd backend && npm run dev"
echo ""
echo "5. Test the health endpoint:"
echo "   curl http://localhost:5000/health"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"
