#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates database with sample data for development and testing
 */

require('dotenv').config();
const { sequelize } = require('../src/models');
const logger = require('../src/utils/logger');

// Import models
const Tenant = require('../src/models/tenant');
const User = require('../src/models/user');
const ShopifyStore = require('../src/models/shopifyStore');
const Product = require('../src/models/product');
const Customer = require('../src/models/customer');
const Order = require('../src/models/order');

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Only seed in development environment
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Skipping seeding in production environment');
      return;
    }

    // Create sample tenant
    const [tenant] = await Tenant.findOrCreate({
      where: { domain: 'demo' },
      defaults: {
        name: 'Demo Tenant',
        domain: 'demo',
        isActive: true,
        settings: {
          features: ['dashboard', 'analytics', 'sync'],
          limits: {
            stores: 5,
            users: 10
          }
        }
      }
    });

    // Create sample user
    const [user] = await User.findOrCreate({
      where: { email: 'demo@example.com' },
      defaults: {
        email: 'demo@example.com',
        password: 'password123', // Will be hashed by the model
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        tenantId: tenant.id
      }
    });

    // Create sample Shopify store
    const [store] = await ShopifyStore.findOrCreate({
      where: { shopDomain: 'demo-store.myshopify.com' },
      defaults: {
        shopDomain: 'demo-store.myshopify.com',
        accessToken: 'demo_token',
        isActive: true,
        tenantId: tenant.id,
        settings: {
          syncEnabled: true,
          webhooksEnabled: true
        }
      }
    });

    // Create sample products
    const sampleProducts = [
      {
        shopifyId: '1001',
        title: 'Premium Wireless Headphones',
        handle: 'premium-wireless-headphones',
        status: 'active',
        price: 199.99,
        inventoryQuantity: 50,
        shopifyStoreId: store.id,
        tenantId: tenant.id
      },
      {
        shopifyId: '1002',
        title: 'Smart Fitness Tracker',
        handle: 'smart-fitness-tracker',
        status: 'active',
        price: 129.99,
        inventoryQuantity: 75,
        shopifyStoreId: store.id,
        tenantId: tenant.id
      },
      {
        shopifyId: '1003',
        title: 'Eco-Friendly Water Bottle',
        handle: 'eco-friendly-water-bottle',
        status: 'active',
        price: 24.99,
        inventoryQuantity: 200,
        shopifyStoreId: store.id,
        tenantId: tenant.id
      }
    ];

    for (const productData of sampleProducts) {
      await Product.findOrCreate({
        where: { shopifyId: productData.shopifyId, shopifyStoreId: store.id },
        defaults: productData
      });
    }

    // Create sample customers
    const sampleCustomers = [
      {
        shopifyId: '2001',
        email: 'customer1@example.com',
        firstName: 'John',
        lastName: 'Smith',
        totalSpent: 299.98,
        shopifyStoreId: store.id,
        tenantId: tenant.id
      },
      {
        shopifyId: '2002',
        email: 'customer2@example.com',
        firstName: 'Jane',
        lastName: 'Johnson',
        totalSpent: 154.99,
        shopifyStoreId: store.id,
        tenantId: tenant.id
      }
    ];

    for (const customerData of sampleCustomers) {
      await Customer.findOrCreate({
        where: { shopifyId: customerData.shopifyId, shopifyStoreId: store.id },
        defaults: customerData
      });
    }

    logger.info('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Handle command line execution
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;