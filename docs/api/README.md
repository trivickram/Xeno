# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 🔐 Authentication

#### POST /auth/register
Register a new user and tenant.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "tenantName": "My Company",
  "tenantDomain": "mycompany"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    },
    "tenant": {
      "id": "uuid",
      "name": "My Company",
      "domain": "mycompany"
    },
    "token": "jwt-token",
    "expiresAt": "2025-09-12T10:00:00.000Z"
  }
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "..." },
    "tenant": { "..." },
    "token": "jwt-token",
    "expiresAt": "2025-09-12T10:00:00.000Z"
  }
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "..." },
    "tenant": { "..." }
  }
}
```

### 🏪 Shopify Integration

#### GET /shopify/stores
List all connected Shopify stores for current tenant.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shopDomain": "mystore.myshopify.com",
      "isActive": true,
      "lastSyncAt": "2025-09-11T10:00:00.000Z"
    }
  ]
}
```

#### POST /shopify/connect
Connect a new Shopify store.

**Request:**
```json
{
  "shopDomain": "mystore.myshopify.com",
  "accessToken": "shopify-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "uuid",
      "shopDomain": "mystore.myshopify.com",
      "isActive": true
    }
  }
}
```

#### POST /shopify/sync/:storeId
Trigger manual data synchronization.

**Response:**
```json
{
  "success": true,
  "data": {
    "syncId": "uuid",
    "status": "started",
    "message": "Synchronization started successfully"
  }
}
```

### 📊 Analytics

#### GET /analytics/dashboard
Get dashboard metrics and KPIs.

**Query Parameters:**
- `dateRange` - 7d, 30d, 90d, 1y (default: 30d)
- `storeId` - Filter by specific store (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000.50,
    "totalOrders": 1250,
    "totalCustomers": 890,
    "averageOrderValue": 100.00,
    "revenueGrowth": 15.5,
    "ordersGrowth": 12.3,
    "customersGrowth": 8.7,
    "aovGrowth": 2.8
  }
}
```

#### GET /analytics/revenue
Get revenue trend data.

**Query Parameters:**
- `dateRange` - Time period (default: 30d)
- `granularity` - day, week, month (default: day)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-09-01",
      "revenue": 5200.00,
      "orders": 52
    },
    {
      "date": "2025-09-02",
      "revenue": 4800.00,
      "orders": 48
    }
  ]
}
```

#### GET /analytics/customers
Get customer analytics data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-09-01",
      "newCustomers": 15,
      "returningCustomers": 37
    }
  ]
}
```

### 👥 Customers

#### GET /customers
List customers with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `segment` - Customer segment filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "customer@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "totalSpent": 1250.00,
      "ordersCount": 8,
      "createdAt": "2025-08-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 890,
    "totalPages": 45
  }
}
```

#### GET /customers/:id
Get detailed customer information.

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": { "..." },
    "recentOrders": [ "..." ],
    "analytics": {
      "lifetimeValue": 1250.00,
      "averageOrderValue": 156.25,
      "daysSinceLastOrder": 5
    }
  }
}
```

### 📦 Products

#### GET /products
List products with performance data.

**Query Parameters:**
- `page`, `limit` - Pagination
- `sortBy` - revenue, units, title
- `order` - asc, desc

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Premium T-Shirt",
      "vendor": "Brand Name",
      "revenue": 5200.00,
      "unitsSold": 52,
      "inventoryLevel": 145
    }
  ]
}
```

### 🛒 Orders

#### GET /orders
List orders with filtering.

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` - Filter by fulfillment status
- `dateFrom`, `dateTo` - Date range filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "#1001",
      "customerEmail": "customer@example.com",
      "totalPrice": 156.25,
      "financialStatus": "paid",
      "fulfillmentStatus": "fulfilled",
      "createdAt": "2025-09-11T08:30:00.000Z"
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited:
- **Authentication**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Data sync**: 1 request per minute

## Webhooks

The platform supports Shopify webhooks for real-time updates:

### Supported Events
- `orders/create` - New order created
- `orders/updated` - Order updated
- `customers/create` - New customer
- `products/create` - New product
- `products/update` - Product updated

### Webhook URL
```
POST /api/webhooks/shopify
```

## SDKs and Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:5000/api';

// Login
const response = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.token;

// Get dashboard data
const dashboardResponse = await fetch(`${API_BASE}/analytics/dashboard`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get dashboard (with token)
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints. A Postman collection is available in the repository.
