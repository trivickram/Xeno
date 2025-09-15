const { Op, Sequelize } = require('sequelize');
const { Order, Customer, Product, OrderItem, ShopifyStore } = require('../models');
const logger = require('../utils/logger');

class AnalyticsService {
  // Get dashboard overview metrics
  async getDashboardOverview(tenantId, period = '30d') {
    try {
      const dateRange = this.getDateRange(period);
      
      const [
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        orderGrowth
      ] = await Promise.all([
        this.getTotalRevenue(tenantId, dateRange),
        this.getTotalOrders(tenantId, dateRange),
        this.getTotalCustomers(tenantId),
        this.getTotalProducts(tenantId),
        this.getGrowthRate(tenantId, 'revenue', dateRange),
        this.getGrowthRate(tenantId, 'orders', dateRange)
      ]);

      return {
        metrics: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          revenueGrowth,
          orderGrowth
        },
        period,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      throw new Error('Failed to fetch dashboard overview');
    }
  }

  // Get revenue analytics with time series data
  async getRevenueAnalytics(tenantId, options = {}) {
    try {
      const { period = '30d', groupBy = 'day' } = options;
      const dateRange = this.getDateRange(period);
      
      const timeFormat = this.getTimeFormat(groupBy);
      
      const revenueData = await Order.findAll({
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('shopify_created_at'), timeFormat), 'date'],
          [Sequelize.fn('SUM', Sequelize.col('total_price')), 'revenue'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount']
        ],
        where: {
          tenantId,
          shopifyCreatedAt: {
            [Op.between]: [dateRange.start, dateRange.end]
          },
          test: false
        },
        group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('shopify_created_at'), timeFormat)],
        order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('shopify_created_at'), timeFormat), 'ASC']],
        raw: true
      });

      const topProducts = await this.getTopProductsByRevenue(tenantId, dateRange, 5);
      const revenueBySource = await this.getRevenueBySource(tenantId, dateRange);

      return {
        timeSeries: revenueData,
        topProducts,
        revenueBySource,
        period,
        groupBy
      };
    } catch (error) {
      logger.error('Error getting revenue analytics:', error);
      throw new Error('Failed to fetch revenue analytics');
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(tenantId, period = '30d') {
    try {
      const dateRange = this.getDateRange(period);
      
      const [
        newCustomers,
        returningCustomers,
        customerLifetimeValue,
        topCustomers,
        customerGrowth
      ] = await Promise.all([
        this.getNewCustomers(tenantId, dateRange),
        this.getReturningCustomers(tenantId, dateRange),
        this.getAverageCustomerLifetimeValue(tenantId),
        this.getTopCustomers(tenantId, dateRange, 10),
        this.getCustomerGrowthTrend(tenantId, dateRange)
      ]);

      return {
        newCustomers,
        returningCustomers,
        customerLifetimeValue,
        topCustomers,
        customerGrowth,
        period
      };
    } catch (error) {
      logger.error('Error getting customer analytics:', error);
      throw new Error('Failed to fetch customer analytics');
    }
  }

  // Get product analytics
  async getProductAnalytics(tenantId, options = {}) {
    try {
      const { period = '30d', limit = 10 } = options;
      const dateRange = this.getDateRange(period);
      
      const [
        topSellingProducts,
        lowStockProducts,
        productPerformance,
        categoryAnalytics
      ] = await Promise.all([
        this.getTopSellingProducts(tenantId, dateRange, limit),
        this.getLowStockProducts(tenantId, 10),
        this.getProductPerformance(tenantId, dateRange),
        this.getCategoryAnalytics(tenantId, dateRange)
      ]);

      return {
        topSellingProducts,
        lowStockProducts,
        productPerformance,
        categoryAnalytics,
        period
      };
    } catch (error) {
      logger.error('Error getting product analytics:', error);
      throw new Error('Failed to fetch product analytics');
    }
  }

  // Helper methods
  getDateRange(period) {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return { start, end };
  }

  getTimeFormat(groupBy) {
    switch (groupBy) {
      case 'hour':
        return '%Y-%m-%d %H:00:00';
      case 'day':
        return '%Y-%m-%d';
      case 'week':
        return '%Y-%u';
      case 'month':
        return '%Y-%m';
      default:
        return '%Y-%m-%d';
    }
  }

  async getTotalRevenue(tenantId, dateRange) {
    const result = await Order.sum('totalPrice', {
      where: {
        tenantId,
        shopifyCreatedAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        },
        test: false
      }
    });
    return result || 0;
  }

  async getTotalOrders(tenantId, dateRange) {
    return await Order.count({
      where: {
        tenantId,
        shopifyCreatedAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        },
        test: false
      }
    });
  }

  async getTotalCustomers(tenantId) {
    return await Customer.count({
      where: { tenantId }
    });
  }

  async getTotalProducts(tenantId) {
    return await Product.count({
      where: { 
        tenantId,
        status: 'active'
      }
    });
  }

  async getGrowthRate(tenantId, metric, dateRange) {
    const previousPeriod = {
      start: new Date(dateRange.start.getTime() - (dateRange.end.getTime() - dateRange.start.getTime())),
      end: dateRange.start
    };

    let currentValue, previousValue;

    if (metric === 'revenue') {
      currentValue = await this.getTotalRevenue(tenantId, dateRange);
      previousValue = await this.getTotalRevenue(tenantId, previousPeriod);
    } else if (metric === 'orders') {
      currentValue = await this.getTotalOrders(tenantId, dateRange);
      previousValue = await this.getTotalOrders(tenantId, previousPeriod);
    }

    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  async getTopProductsByRevenue(tenantId, dateRange, limit) {
    return await OrderItem.findAll({
      attributes: [
        'shopifyProductId',
        'title',
        [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'totalRevenue'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
      ],
      include: [{
        model: Order,
        where: {
          tenantId,
          shopifyCreatedAt: {
            [Op.between]: [dateRange.start, dateRange.end]
          },
          test: false
        },
        attributes: []
      }],
      group: ['shopifyProductId', 'title'],
      order: [[Sequelize.literal('totalRevenue'), 'DESC']],
      limit,
      raw: true
    });
  }

  async getTopSellingProducts(tenantId, dateRange, limit) {
    return await OrderItem.findAll({
      attributes: [
        'shopifyProductId',
        'title',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
        [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      include: [{
        model: Order,
        where: {
          tenantId,
          shopifyCreatedAt: {
            [Op.between]: [dateRange.start, dateRange.end]
          },
          test: false
        },
        attributes: []
      }],
      group: ['shopifyProductId', 'title'],
      order: [[Sequelize.literal('totalQuantity'), 'DESC']],
      limit,
      raw: true
    });
  }

  async getNewCustomers(tenantId, dateRange) {
    return await Customer.count({
      where: {
        tenantId,
        shopifyCreatedAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        }
      }
    });
  }

  async getReturningCustomers(tenantId, dateRange) {
    return await Customer.count({
      where: {
        tenantId,
        ordersCount: {
          [Op.gt]: 1
        }
      }
    });
  }

  async getTopCustomers(tenantId, dateRange, limit) {
    return await Customer.findAll({
      where: { tenantId },
      attributes: [
        'id', 'firstName', 'lastName', 'email', 
        'totalSpent', 'ordersCount'
      ],
      order: [['totalSpent', 'DESC']],
      limit
    });
  }

  async getLowStockProducts(tenantId, threshold) {
    return await Product.findAll({
      where: {
        tenantId,
        inventoryQuantity: {
          [Op.lte]: threshold
        },
        status: 'active'
      },
      attributes: [
        'id', 'title', 'inventoryQuantity', 
        'price', 'vendor'
      ],
      order: [['inventoryQuantity', 'ASC']],
      limit: 20
    });
  }

  async getAverageCustomerLifetimeValue(tenantId) {
    const result = await Customer.findOne({
      where: { tenantId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('total_spent')), 'avgLifetimeValue']
      ],
      raw: true
    });
    return result?.avgLifetimeValue || 0;
  }

  async getRevenueBySource(tenantId, dateRange) {
    return await Order.findAll({
      attributes: [
        'sourceName',
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount']
      ],
      where: {
        tenantId,
        shopifyCreatedAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        },
        test: false
      },
      group: ['sourceName'],
      order: [[Sequelize.literal('revenue'), 'DESC']],
      raw: true
    });
  }

  async getCustomerGrowthTrend(tenantId, dateRange) {
    return await Customer.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('shopify_created_at')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'newCustomers']
      ],
      where: {
        tenantId,
        shopifyCreatedAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('shopify_created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('shopify_created_at')), 'ASC']],
      raw: true
    });
  }

  async getProductPerformance(tenantId, dateRange) {
    return {
      totalProducts: await this.getTotalProducts(tenantId),
      averagePrice: await Product.findOne({
        where: { tenantId },
        attributes: [
          [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
        ],
        raw: true
      }),
      outOfStock: await Product.count({
        where: {
          tenantId,
          inventoryQuantity: 0,
          status: 'active'
        }
      })
    };
  }

  async getCategoryAnalytics(tenantId, dateRange) {
    return await OrderItem.findAll({
      attributes: [
        'productType',
        [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'revenue'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity']
      ],
      include: [{
        model: Order,
        where: {
          tenantId,
          shopifyCreatedAt: {
            [Op.between]: [dateRange.start, dateRange.end]
          },
          test: false
        },
        attributes: []
      }],
      where: {
        productType: {
          [Op.ne]: null
        }
      },
      group: ['productType'],
      order: [[Sequelize.literal('revenue'), 'DESC']],
      raw: true
    });
  }
}

module.exports = { AnalyticsService };