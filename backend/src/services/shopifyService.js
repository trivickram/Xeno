const axios = require('axios');
const crypto = require('crypto');
const { ShopifyStore, Customer, Product, Order, OrderItem } = require('../models');
const logger = require('../utils/logger');

class ShopifyService {
  constructor() {
    this.apiVersion = '2023-10';
    this.baseUrl = 'https://{shop}.myshopify.com/admin/api/{version}';
  }

  // Verify Shopify connection and get shop info
  async verifyConnection(shopDomain, accessToken) {
    try {
      const url = this.buildUrl(shopDomain, '/shop.json');
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return response.data.shop;
    } catch (error) {
      logger.error('Shopify connection verification failed:', error.message);
      throw new Error('Invalid shop domain or access token');
    }
  }

  // Test existing connection
  async testConnection(shopDomain, accessToken) {
    try {
      const shopInfo = await this.verifyConnection(shopDomain, accessToken);
      
      // Test additional endpoints
      const [ordersCount, productsCount, customersCount] = await Promise.all([
        this.getOrdersCount(shopDomain, accessToken),
        this.getProductsCount(shopDomain, accessToken),
        this.getCustomersCount(shopDomain, accessToken)
      ]);

      return {
        status: 'connected',
        shop: shopInfo,
        dataAvailable: {
          orders: ordersCount,
          products: productsCount,
          customers: customersCount
        },
        lastTested: new Date()
      };
    } catch (error) {
      logger.error('Shopify connection test failed:', error.message);
      return {
        status: 'failed',
        error: error.message,
        lastTested: new Date()
      };
    }
  }

  // Get webhooks
  async getWebhooks(shopDomain, accessToken) {
    try {
      const url = this.buildUrl(shopDomain, '/webhooks.json');
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.webhooks;
    } catch (error) {
      logger.error('Failed to get webhooks:', error.message);
      throw new Error('Failed to retrieve webhooks');
    }
  }

  // Setup webhooks
  async setupWebhooks(shopDomain, accessToken, storeId) {
    try {
      const webhookTopics = [
        'orders/create',
        'orders/updated',
        'orders/delete',
        'customers/create',
        'customers/update',
        'customers/delete',
        'products/create',
        'products/update',
        'products/delete'
      ];

      const webhookEndpoint = `${process.env.WEBHOOK_BASE_URL}/api/shopify/webhook/${storeId}`;
      const webhooks = [];

      for (const topic of webhookTopics) {
        try {
          const webhook = await this.createWebhook(shopDomain, accessToken, topic, webhookEndpoint);
          webhooks.push(webhook);
        } catch (error) {
          logger.error(`Failed to create webhook for ${topic}:`, error.message);
        }
      }

      return webhooks;
    } catch (error) {
      logger.error('Failed to setup webhooks:', error.message);
      throw new Error('Failed to setup webhooks');
    }
  }

  // Create individual webhook
  async createWebhook(shopDomain, accessToken, topic, address) {
    try {
      const url = this.buildUrl(shopDomain, '/webhooks.json');
      
      const webhookData = {
        webhook: {
          topic,
          address: `${address}/${topic.replace('/', '-')}`,
          format: 'json'
        }
      };

      const response = await axios.post(url, webhookData, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.webhook;
    } catch (error) {
      logger.error(`Failed to create webhook for ${topic}:`, error.message);
      throw error;
    }
  }

  // Process webhook data
  async processWebhook(storeId, topic, data) {
    try {
      logger.info(`Processing webhook: ${topic} for store ${storeId}`);

      switch (topic) {
        case 'orders/create':
        case 'orders/updated':
          await this.processOrderWebhook(storeId, data, topic === 'orders/create');
          break;
        case 'orders/delete':
          await this.deleteOrder(storeId, data.id);
          break;
        case 'customers/create':
        case 'customers/update':
          await this.processCustomerWebhook(storeId, data, topic === 'customers/create');
          break;
        case 'customers/delete':
          await this.deleteCustomer(storeId, data.id);
          break;
        case 'products/create':
        case 'products/update':
          await this.processProductWebhook(storeId, data, topic === 'products/create');
          break;
        case 'products/delete':
          await this.deleteProduct(storeId, data.id);
          break;
        default:
          logger.warn(`Unhandled webhook topic: ${topic}`);
      }
    } catch (error) {
      logger.error('Webhook processing failed:', error);
      throw error;
    }
  }

  // Fetch orders from Shopify
  async fetchOrders(shopDomain, accessToken, options = {}) {
    try {
      const { limit = 250, sinceId, createdAtMin, status = 'any' } = options;
      
      let url = this.buildUrl(shopDomain, '/orders.json');
      const params = new URLSearchParams({
        limit: limit.toString(),
        status
      });

      if (sinceId) params.append('since_id', sinceId);
      if (createdAtMin) params.append('created_at_min', createdAtMin);

      url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.orders;
    } catch (error) {
      logger.error('Failed to fetch orders:', error.message);
      throw new Error('Failed to fetch orders from Shopify');
    }
  }

  // Fetch products from Shopify
  async fetchProducts(shopDomain, accessToken, options = {}) {
    try {
      const { limit = 250, sinceId, publishedStatus = 'published' } = options;
      
      let url = this.buildUrl(shopDomain, '/products.json');
      const params = new URLSearchParams({
        limit: limit.toString(),
        published_status: publishedStatus
      });

      if (sinceId) params.append('since_id', sinceId);

      url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.products;
    } catch (error) {
      logger.error('Failed to fetch products:', error.message);
      throw new Error('Failed to fetch products from Shopify');
    }
  }

  // Fetch customers from Shopify
  async fetchCustomers(shopDomain, accessToken, options = {}) {
    try {
      const { limit = 250, sinceId, createdAtMin } = options;
      
      let url = this.buildUrl(shopDomain, '/customers.json');
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      if (sinceId) params.append('since_id', sinceId);
      if (createdAtMin) params.append('created_at_min', createdAtMin);

      url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.customers;
    } catch (error) {
      logger.error('Failed to fetch customers:', error.message);
      throw new Error('Failed to fetch customers from Shopify');
    }
  }

  // Helper methods
  buildUrl(shopDomain, endpoint) {
    const cleanDomain = shopDomain.replace('.myshopify.com', '');
    return `https://${cleanDomain}.myshopify.com/admin/api/${this.apiVersion}${endpoint}`;
  }

  async getOrdersCount(shopDomain, accessToken) {
    try {
      const url = this.buildUrl(shopDomain, '/orders/count.json');
      const response = await axios.get(url, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      return response.data.count;
    } catch (error) {
      return 0;
    }
  }

  async getProductsCount(shopDomain, accessToken) {
    try {
      const url = this.buildUrl(shopDomain, '/products/count.json');
      const response = await axios.get(url, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      return response.data.count;
    } catch (error) {
      return 0;
    }
  }

  async getCustomersCount(shopDomain, accessToken) {
    try {
      const url = this.buildUrl(shopDomain, '/customers/count.json');
      const response = await axios.get(url, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      return response.data.count;
    } catch (error) {
      return 0;
    }
  }

  // Webhook processing methods
  async processOrderWebhook(storeId, orderData, isCreate) {
    try {
      const store = await ShopifyStore.findByPk(storeId);
      if (!store) return;

      const orderInfo = this.transformOrderData(orderData, store.tenantId, storeId);
      
      if (isCreate) {
        await Order.create(orderInfo);
      } else {
        await Order.upsert(orderInfo);
      }

      // Process order items
      if (orderData.line_items) {
        for (const lineItem of orderData.line_items) {
          const itemInfo = this.transformOrderItemData(lineItem, orderInfo.id);
          await OrderItem.upsert(itemInfo);
        }
      }
    } catch (error) {
      logger.error('Failed to process order webhook:', error);
    }
  }

  async processCustomerWebhook(storeId, customerData, isCreate) {
    try {
      const store = await ShopifyStore.findByPk(storeId);
      if (!store) return;

      const customerInfo = this.transformCustomerData(customerData, store.tenantId, storeId);
      
      if (isCreate) {
        await Customer.create(customerInfo);
      } else {
        await Customer.upsert(customerInfo);
      }
    } catch (error) {
      logger.error('Failed to process customer webhook:', error);
    }
  }

  async processProductWebhook(storeId, productData, isCreate) {
    try {
      const store = await ShopifyStore.findByPk(storeId);
      if (!store) return;

      const productInfo = this.transformProductData(productData, store.tenantId, storeId);
      
      if (isCreate) {
        await Product.create(productInfo);
      } else {
        await Product.upsert(productInfo);
      }
    } catch (error) {
      logger.error('Failed to process product webhook:', error);
    }
  }

  // Data transformation methods
  transformOrderData(orderData, tenantId, storeId) {
    return {
      id: require('uuid').v4(),
      tenantId,
      shopifyOrderId: orderData.id,
      shopifyStoreId: storeId,
      orderNumber: orderData.order_number,
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      financialStatus: orderData.financial_status,
      fulfillmentStatus: orderData.fulfillment_status,
      currency: orderData.currency,
      totalPrice: parseFloat(orderData.total_price || 0),
      subtotalPrice: parseFloat(orderData.subtotal_price || 0),
      totalWeight: orderData.total_weight,
      totalTax: parseFloat(orderData.total_tax || 0),
      taxesIncluded: orderData.taxes_included,
      totalDiscounts: parseFloat(orderData.total_discounts || 0),
      confirmed: orderData.confirmed,
      test: orderData.test,
      gateway: orderData.gateway,
      sourceName: orderData.source_name,
      landingSite: orderData.landing_site,
      referringSite: orderData.referring_site,
      note: orderData.note,
      tags: orderData.tags,
      processedAt: orderData.processed_at,
      shopifyCreatedAt: orderData.created_at,
      shopifyUpdatedAt: orderData.updated_at
    };
  }

  transformCustomerData(customerData, tenantId, storeId) {
    return {
      id: require('uuid').v4(),
      tenantId,
      shopifyCustomerId: customerData.id,
      shopifyStoreId: storeId,
      firstName: customerData.first_name,
      lastName: customerData.last_name,
      email: customerData.email,
      phone: customerData.phone,
      state: customerData.state,
      totalSpent: parseFloat(customerData.total_spent || 0),
      ordersCount: customerData.orders_count || 0,
      lastOrderId: customerData.last_order_id,
      lastOrderName: customerData.last_order_name,
      note: customerData.note,
      verifiedEmail: customerData.verified_email,
      taxExempt: customerData.tax_exempt,
      tags: customerData.tags,
      currency: customerData.currency,
      addresses: JSON.stringify(customerData.addresses || []),
      defaultAddress: JSON.stringify(customerData.default_address || {}),
      shopifyCreatedAt: customerData.created_at,
      shopifyUpdatedAt: customerData.updated_at
    };
  }

  transformProductData(productData, tenantId, storeId) {
    const mainVariant = productData.variants?.[0] || {};
    
    return {
      id: require('uuid').v4(),
      tenantId,
      shopifyProductId: productData.id,
      shopifyStoreId: storeId,
      title: productData.title,
      bodyHtml: productData.body_html,
      vendor: productData.vendor,
      productType: productData.product_type,
      handle: productData.handle,
      status: productData.status,
      publishedScope: productData.published_scope,
      tags: productData.tags,
      variants: JSON.stringify(productData.variants || []),
      options: JSON.stringify(productData.options || []),
      images: JSON.stringify(productData.images || []),
      image: JSON.stringify(productData.image || {}),
      price: parseFloat(mainVariant.price || 0),
      compareAtPrice: parseFloat(mainVariant.compare_at_price || 0),
      inventoryQuantity: mainVariant.inventory_quantity || 0,
      inventoryPolicy: mainVariant.inventory_policy,
      inventoryManagement: mainVariant.inventory_management,
      publishedAt: productData.published_at,
      shopifyCreatedAt: productData.created_at,
      shopifyUpdatedAt: productData.updated_at
    };
  }

  transformOrderItemData(lineItemData, orderId) {
    return {
      id: require('uuid').v4(),
      orderId,
      shopifyLineItemId: lineItemData.id,
      shopifyProductId: lineItemData.product_id,
      shopifyVariantId: lineItemData.variant_id,
      title: lineItemData.title,
      name: lineItemData.name,
      variantTitle: lineItemData.variant_title,
      vendor: lineItemData.vendor,
      productType: lineItemData.product_type,
      sku: lineItemData.sku,
      quantity: lineItemData.quantity,
      price: parseFloat(lineItemData.price || 0),
      totalDiscount: parseFloat(lineItemData.total_discount || 0),
      grams: lineItemData.grams,
      taxable: lineItemData.taxable,
      requiresShipping: lineItemData.requires_shipping,
      fulfillmentStatus: lineItemData.fulfillment_status,
      fulfillmentService: lineItemData.fulfillment_service,
      properties: JSON.stringify(lineItemData.properties || [])
    };
  }

  async deleteOrder(storeId, shopifyOrderId) {
    await Order.destroy({
      where: {
        shopifyOrderId,
        shopifyStoreId: storeId
      }
    });
  }

  async deleteCustomer(storeId, shopifyCustomerId) {
    await Customer.destroy({
      where: {
        shopifyCustomerId,
        shopifyStoreId: storeId
      }
    });
  }

  async deleteProduct(storeId, shopifyProductId) {
    await Product.destroy({
      where: {
        shopifyProductId,
        shopifyStoreId: storeId
      }
    });
  }
}

module.exports = { ShopifyService };