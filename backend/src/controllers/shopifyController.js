const { ShopifyService } = require('../services/shopifyService');
const { SyncService } = require('../services/syncService');
const { ShopifyStore } = require('../models');
const logger = require('../utils/logger');

class ShopifyController {
  constructor() {
    this.shopifyService = new ShopifyService();
    this.syncService = new SyncService();
  }

  // Connect new Shopify store
  async connectStore(req, res, next) {
    try {
      const { shopDomain, accessToken } = req.body;
      const tenantId = req.user.tenantId;

      if (!shopDomain || !accessToken) {
        return res.status(400).json({
          success: false,
          message: 'Shop domain and access token are required'
        });
      }

      // Validate shop domain format
      const validDomain = shopDomain.includes('.myshopify.com') ? 
        shopDomain : `${shopDomain}.myshopify.com`;

      // Verify token and get shop info
      const shopInfo = await this.shopifyService.verifyConnection(validDomain, accessToken);
      
      // Check if store already exists
      const existingStore = await ShopifyStore.findOne({
        where: { shopDomain: validDomain }
      });

      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: 'Store is already connected'
        });
      }

      // Create store record
      const store = await ShopifyStore.create({
        tenantId,
        shopDomain: validDomain,
        shopifyStoreId: shopInfo.id,
        storeName: shopInfo.name,
        accessToken,
        currency: shopInfo.currency,
        timezone: shopInfo.timezone,
        status: 'active',
        isConnected: true
      });

      logger.info(`Shopify store connected: ${validDomain} for tenant ${tenantId}`);
      
      res.status(201).json({
        success: true,
        message: 'Store connected successfully',
        data: { store: { ...store.toJSON(), accessToken: undefined } }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get connected stores
  async getStores(req, res, next) {
    try {
      const tenantId = req.user.tenantId;

      const stores = await ShopifyStore.findAll({
        where: { tenantId },
        attributes: { exclude: ['accessToken', 'deletedAt'] },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: { stores }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single store details
  async getStore(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        },
        attributes: { exclude: ['accessToken', 'deletedAt'] }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      res.json({
        success: true,
        data: { store }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update store settings
  async updateStore(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;
      
      const allowedFields = ['syncFrequency', 'storeSettings', 'webhookEndpoints'];
      const updateData = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      await store.update(updateData);
      
      logger.info(`Store settings updated: ${store.shopDomain}`);
      
      res.json({
        success: true,
        message: 'Store updated successfully',
        data: { store: { ...store.toJSON(), accessToken: undefined } }
      });
    } catch (error) {
      next(error);
    }
  }

  // Disconnect store
  async disconnectStore(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      await store.update({
        isConnected: false,
        status: 'disconnected',
        accessToken: null
      });
      
      logger.info(`Store disconnected: ${store.shopDomain}`);
      
      res.json({
        success: true,
        message: 'Store disconnected successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Test store connection
  async testConnection(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      const connectionTest = await this.shopifyService.testConnection(
        store.shopDomain, 
        store.accessToken
      );
      
      res.json({
        success: true,
        data: { connectionTest }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get store webhook status
  async getWebhookStatus(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      const webhooks = await this.shopifyService.getWebhooks(
        store.shopDomain, 
        store.accessToken
      );
      
      res.json({
        success: true,
        data: { webhooks }
      });
    } catch (error) {
      next(error);
    }
  }

  // Setup webhooks
  async setupWebhooks(req, res, next) {
    try {
      const { storeId } = req.params;
      const tenantId = req.user.tenantId;

      const store = await ShopifyStore.findOne({
        where: { 
          id: storeId,
          tenantId 
        }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      const webhooks = await this.shopifyService.setupWebhooks(
        store.shopDomain, 
        store.accessToken,
        storeId
      );

      await store.update({
        webhookEndpoints: webhooks
      });
      
      logger.info(`Webhooks setup for store: ${store.shopDomain}`);
      
      res.json({
        success: true,
        message: 'Webhooks setup successfully',
        data: { webhooks }
      });
    } catch (error) {
      next(error);
    }
  }

  // Handle webhook
  async handleWebhook(req, res, next) {
    try {
      const { storeId } = req.params;
      const webhookTopic = req.get('X-Shopify-Topic');
      const webhookData = req.body;

      await this.shopifyService.processWebhook(storeId, webhookTopic, webhookData);
      
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Webhook processing failed:', error);
      res.status(200).json({ success: false }); // Always return 200 to Shopify
    }
  }
}

module.exports = new ShopifyController();