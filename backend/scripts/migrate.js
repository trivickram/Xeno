#!/usr/bin/env node

/**
 * Production Database Migration Script
 * Handles database initialization and schema migrations for production deployment
 */

require('dotenv').config();
const { sequelize } = require('../src/models');
const logger = require('../src/utils/logger');

// Import all models to ensure they're registered
require('../src/models/tenant');
require('../src/models/user');
require('../src/models/shopifyStore');
require('../src/models/product');
require('../src/models/customer');
require('../src/models/order');
require('../src/models/orderItem');

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync all models to database
    // In production, use { alter: true } for safer migrations
    // or implement proper migration files
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      logger.info('Running production database sync...');
      await sequelize.sync({ alter: true });
    } else {
      logger.info('Running development database sync...');
      await sequelize.sync({ force: false });
    }

    logger.info('Database migrations completed successfully.');

    // Create default tenant if none exists
    const Tenant = require('../src/models/tenant');
    const tenantCount = await Tenant.count();
    
    if (tenantCount === 0) {
      logger.info('Creating default tenant...');
      await Tenant.create({
        name: 'Default Tenant',
        domain: 'default',
        isActive: true,
        settings: {
          features: ['dashboard', 'analytics', 'sync'],
          limits: {
            stores: 5,
            users: 10
          }
        }
      });
      logger.info('Default tenant created successfully.');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Handle command line execution
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;