# 🏪 Shopify Insights Platform - Multi-tenant Data Analytics

> **Xeno FDE Internship Assignment – 2025**

A comprehensive multi-tenant Shopify data ingestion and insights service built with modern web technologies. This platform enables businesses to connect their Shopify stores, automatically sync data, and gain valuable insights through interactive dashboards.

## 📋 Project Overview

This project implements a full-stack solution for Shopify data analytics with the following key components:

- **🔧 Backend Service**: Node.js/Express API with multi-tenant architecture
- **🎨 Frontend Dashboard**: Next.js React application with interactive charts
- **📊 Analytics Engine**: Real-time metrics and insights generation  
- **🔄 Data Sync**: Automated Shopify API integration with scheduling
- **🗄️ Database**: PostgreSQL with Sequelize ORM for robust data management
- **🚀 Cloud Deployment**: Production-ready deployment configuration

## ✨ Features

### Core Features
- ✅ **Multi-tenant Architecture** - Complete data isolation per tenant
- ✅ **Shopify Integration** - REST/GraphQL API connectivity 
- ✅ **Real-time Analytics** - Live dashboard with key metrics
- ✅ **Automated Sync** - Scheduled data ingestion (every 6 hours)
- ✅ **User Authentication** - JWT-based secure access
- ✅ **Role-based Access** - Admin, User, and Viewer roles
- ✅ **Responsive Design** - Mobile-friendly dashboard interface

### Dashboard Insights
- 📈 **Overview Statistics** - Total customers, orders, revenue, products
- 📊 **Orders by Date** - Time-series analysis with date range filtering
- 👥 **Top Customers** - Highest spending customer analytics
- 🛍️ **Top Products** - Best-selling products by quantity/revenue
- 📋 **Sales by Category** - Product type performance analysis
- 🚚 **Fulfillment Stats** - Order processing and delivery metrics

### Technical Features  
- 🔐 **Secure API** - Rate limiting, CORS, input validation
- 📝 **Comprehensive Logging** - Winston-based error tracking
- ⚡ **Performance Optimized** - Database indexing and query optimization
- 🔄 **Webhook Support** - Real-time Shopify event handling
- 📱 **RESTful API** - Clean, documented endpoints
- 🛡️ **Data Protection** - Encrypted passwords, secure tokens

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Shopify API   │
│   (Next.js)     │◄──►│  (Express.js)   │◄──►│                 │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Multi-tenant  │    │ • Customers     │
│ • Charts        │    │ • Authentication│    │ • Products      │
│ • User Auth     │    │ • Data Sync     │    │ • Orders        │
│ • Responsive    │    │ • Analytics     │    │ • Webhooks      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │                 │
                    │ • Tenants       │
                    │ • Users         │
                    │ • Customers     │
                    │ • Products      │
                    │ • Orders        │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- Shopify Development Store
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd shopify-insights-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database and Shopify credentials
npm run migrate
npm run dev
```

### 3. Frontend Setup  
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Configure your frontend environment variables
npm run dev
```

### 4. Access Application
- **Backend API**: http://localhost:5000
- **Frontend Dashboard**: http://localhost:3000
- **Health Check**: http://localhost:5000/health

## 🗂️ Project Structure

```
shopify-insights-platform/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Helper functions
│   ├── logs/              # Application logs
│   └── package.json
├── frontend/              # Next.js React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Next.js pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Frontend utilities
│   │   └── styles/        # CSS/styling files
│   └── package.json
├── docs/                  # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   └── deployment.md
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_insights_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Shopify
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
SHOPIFY_API_VERSION=2023-10

# App
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Shopify Insights
```

## 📊 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### Dashboard Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/overview` | Overview statistics |
| GET | `/api/dashboard/orders-by-date` | Orders by date |
| GET | `/api/dashboard/top-customers` | Top customers |
| GET | `/api/dashboard/top-products` | Top products |

### Data Synchronization
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/all` | Sync all data |
| POST | `/api/sync/customers` | Sync customers |
| POST | `/api/sync/products` | Sync products |
| POST | `/api/sync/orders` | Sync orders |

## 🗄️ Database Schema

### Core Tables
- **tenants** - Multi-tenant isolation
- **users** - User authentication & roles  
- **shopify_stores** - Shopify connection details
- **customers** - Shopify customer data
- **products** - Product catalog with variants
- **orders** - Order transactions
- **order_items** - Order line items

### Key Relationships
- Each tenant has one Shopify store
- Users belong to tenants with roles
- Customers, products, orders are tenant-scoped
- Orders contain multiple order items

## 🚀 Deployment

### Backend Deployment (Railway/Render)
```bash
# Build and deploy backend
cd backend
npm run build
# Deploy to Railway/Render with environment variables
```

### Frontend Deployment (Vercel)
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod
```

### Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE shopify_insights_prod;
-- Run migrations in production
npm run migrate
```

## 📈 Performance & Monitoring

- **Database Indexing**: Optimized queries for analytics
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Caching**: In-memory caching for frequently accessed data
- **Logging**: Structured JSON logs with Winston
- **Health Checks**: `/health` endpoint for monitoring

## 🔒 Security Features

- JWT token authentication
- bcrypt password hashing (12 rounds)
- SQL injection prevention via Sequelize
- Input validation with express-validator  
- CORS configuration
- Helmet security headers
- Rate limiting middleware

## 📝 Development Notes

### Key Design Decisions
1. **Multi-tenancy**: Tenant isolation at database level for security
2. **Shopify Integration**: Used shopify-api-node for reliable API access  
3. **Authentication**: JWT tokens for stateless authentication
4. **Database**: PostgreSQL for ACID compliance and JSON support
5. **Scheduling**: node-cron for automated data synchronization

### Assumptions Made
- Each tenant has one Shopify store
- Sync happens every 6 hours (configurable)
- Users register within existing tenants
- Admin users can manage tenant settings
- Data retention is indefinite (can be configured)

### Next Steps for Production
- [ ] Add Redis for session management
- [ ] Implement database connection pooling
- [ ] Add comprehensive test suite
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Implement data backup strategy
- [ ] Add email notifications
- [ ] Set up monitoring dashboards

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Xeno FDE Intern Candidate**  
*Built for Xeno FDE Internship Assignment – 2025*

---

*This project demonstrates full-stack development skills, API integration, database design, and modern web technologies suitable for enterprise-level applications.*
