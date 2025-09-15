/**
 * Shopify Insights Platform - Backend Server
 * Multi-tenant Shopify Data Ingestion & Insights Service
 * Xeno FDE Internship 2025
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import utilities and middleware
const logger = require('./utils/logger');
const { testConnection, syncDatabase } = require('./models');
const { 
  validationError, 
  databaseError, 
  jwtError, 
  notFound, 
  globalErrorHandler 
} = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const shopifyRoutes = require('./routes/shopify');
const syncRoutes = require('./routes/sync');
const tenantRoutes = require('./routes/tenant');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('combined', { 
  stream: { 
    write: (message) => logger.info(message.trim()) 
  } 
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Shopify Insights Platform API',
    data: {
      name: 'Shopify Insights Platform',
      version: '1.0.0',
      description: 'Multi-tenant Shopify Data Ingestion & Insights Service',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        dashboard: '/api/dashboard',
        shopify: '/api/shopify',
        sync: '/api/sync',
        tenant: '/api/tenant'
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Shopify Insights Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/tenant', tenantRoutes);

// Error handling middleware (order matters!)
app.use(validationError);
app.use(databaseError);
app.use(jwtError);
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database');
      process.exit(1);
    }

    // Sync database models
    const dbSynced = await syncDatabase();
    if (!dbSynced) {
      logger.error('Failed to sync database models');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Shopify Insights Platform API ready`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📁 Database: SQLite`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();