const { Op } = require('sequelize');
const { AnalyticsService } = require('../services/analyticsService');
const { SyncService } = require('../services/syncService');
const { Order, Customer, Product, ShopifyStore } = require('../models');
const logger = require('../utils/logger');

class DashboardController {
  constructor() {
    this.analyticsService = new AnalyticsService();
    this.syncService = new SyncService();
  }

  // Get dashboard overview data
  async getDashboardOverview(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { period = '30d' } = req.query;

      const overview = await this.analyticsService.getDashboardOverview(tenantId, period);
      
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      next(error);
    }
  }

  // Get dashboard metrics with sample data for testing
  async getDashboardMetrics(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { days = '30' } = req.query;

      // Generate sample metrics data for testing
      const metricsData = {
        totalRevenue: 15420.50,
        totalOrders: 87,
        totalCustomers: 234,
        averageOrderValue: 177.13,
        revenueGrowth: {
          value: 1250.30,
          percentage: 8.8,
          isPositive: true
        },
        ordersGrowth: {
          value: 12,
          percentage: 16.0,
          isPositive: true
        },
        customersGrowth: {
          value: 18,
          percentage: 8.3,
          isPositive: true
        },
        aovGrowth: {
          value: 15.20,
          percentage: 9.4,
          isPositive: true
        },
        revenueData: this.generateSampleRevenueData(parseInt(days)),
        customerData: this.generateSampleCustomerData(parseInt(days)),
        topProducts: [
          { name: 'Premium Widget', revenue: 3420.50, quantity: 24 },
          { name: 'Super Gadget', revenue: 2890.25, quantity: 18 },
          { name: 'Mega Tool', revenue: 2150.75, quantity: 15 },
          { name: 'Ultra Device', revenue: 1876.30, quantity: 12 },
          { name: 'Pro Accessory', revenue: 1245.80, quantity: 28 }
        ],
        recentOrders: [
          { 
            id: '1001', 
            customerName: 'John Smith', 
            total: 234.50, 
            status: 'completed', 
            date: new Date(Date.now() - 86400000).toISOString() 
          },
          { 
            id: '1002', 
            customerName: 'Sarah Johnson', 
            total: 156.75, 
            status: 'pending', 
            date: new Date(Date.now() - 172800000).toISOString() 
          },
          { 
            id: '1003', 
            customerName: 'Mike Davis', 
            total: 389.20, 
            status: 'completed', 
            date: new Date(Date.now() - 259200000).toISOString() 
          },
          { 
            id: '1004', 
            customerName: 'Emily Wilson', 
            total: 267.85, 
            status: 'completed', 
            date: new Date(Date.now() - 345600000).toISOString() 
          }
        ]
      };
      
      res.json({
        success: true,
        data: metricsData,
        message: `Dashboard metrics for last ${days} days`
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to generate sample revenue data
  generateSampleRevenueData(days) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseRevenue = Math.random() * 500 + 200;
      const baseOrders = Math.floor(Math.random() * 10) + 2;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue * 100) / 100,
        orders: baseOrders
      });
    }
    
    return data;
  }

  // Helper method to generate sample customer data
  generateSampleCustomerData(days) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const newCustomers = Math.floor(Math.random() * 8) + 1;
      const returningCustomers = Math.floor(Math.random() * 15) + 3;
      
      data.push({
        date: date.toISOString().split('T')[0],
        newCustomers,
        returningCustomers,
        totalCustomers: newCustomers + returningCustomers
      });
    }
    
    return data;
  }

  // Get revenue analytics
  async getRevenueAnalytics(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { period = '30d', groupBy = 'day' } = req.query;

      const revenueData = await this.analyticsService.getRevenueAnalytics(tenantId, {
        period,
        groupBy
      });
      
      res.json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { period = '30d' } = req.query;

      const customerData = await this.analyticsService.getCustomerAnalytics(tenantId, period);
      
      res.json({
        success: true,
        data: customerData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product analytics
  async getProductAnalytics(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { period = '30d', limit = 10 } = req.query;

      const productData = await this.analyticsService.getProductAnalytics(tenantId, {
        period,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: productData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get orders with pagination
  async getOrders(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { 
        page = 1, 
        limit = 20, 
        status, 
        search,
        sortBy = 'shopifyCreatedAt',
        sortOrder = 'desc'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = { tenantId };

      if (status) {
        whereClause.financialStatus = status;
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: orders } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Customer,
            attributes: ['firstName', 'lastName', 'email']
          }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customers with pagination
  async getCustomers(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { 
        page = 1, 
        limit = 20, 
        search,
        sortBy = 'shopifyCreatedAt',
        sortOrder = 'desc'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = { tenantId };

      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: customers } = await Customer.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['deletedAt'] },
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get products with pagination
  async getProducts(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { 
        page = 1, 
        limit = 20, 
        search,
        status = 'active',
        sortBy = 'shopifyCreatedAt',
        sortOrder = 'desc'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = { tenantId };

      if (status !== 'all') {
        whereClause.status = status;
      }

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { vendor: { [Op.like]: `%${search}%` } },
          { productType: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['deletedAt', 'bodyHtml'] },
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sync status
  async getSyncStatus(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      
      const stores = await ShopifyStore.findAll({
        where: { tenantId },
        attributes: ['id', 'storeName', 'shopDomain', 'isConnected', 'lastSync', 'status']
      });

      const syncStatus = await this.syncService.getSyncStatus(tenantId);
      
      res.json({
        success: true,
        data: {
          stores,
          syncStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Trigger manual sync
  async triggerSync(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const { storeId, syncType = 'full' } = req.body;

      if (!storeId) {
        return res.status(400).json({
          success: false,
          message: 'Store ID is required'
        });
      }

      const syncJob = await this.syncService.triggerManualSync(tenantId, storeId, syncType);
      
      logger.info(`Manual sync triggered by ${req.user.email} for store ${storeId}`);
      
      res.json({
        success: true,
        message: 'Sync triggered successfully',
        data: { syncJob }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();