# Shopify Data Ingestion & Insights Service

## 📋 Overview

A comprehensive multi-tenant platform for Shopify data ingestion, analytics, and insights. Built for the **Xeno FDE Internship Assignment 2025**.

### 🎯 Project Goals
- **Multi-tenant Architecture**: Support multiple organizations with isolated data
- **Shopify Integration**: Real-time data sync with Shopify stores via API
- **Analytics Dashboard**: Rich visualizations and business insights
- **Scalable Backend**: Node.js/Express with PostgreSQL database
- **Modern Frontend**: Next.js with TypeScript and Tailwind CSS

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄───┤   (Node.js)     │◄───┤  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        ▼                        │
         │              ┌─────────────────┐                │
         └──────────────┤  Shopify API    │────────────────┘
                        │   (External)    │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation & Setup

1. **Clone and navigate:**
   ```bash
   cd "d:\Shopify\shopify-insights-platform"
   ```

2. **Run the automated setup:**
   ```bash
   setup.bat
   ```
   Or manually:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Database setup:**
   ```bash
   cd backend
   npm run db:setup
   ```

4. **Start both services:**
   ```bash
   # From root directory
   npm start
   ```

### Access Points
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api/docs

## 🔑 Demo Credentials
- **Email**: admin@example.com
- **Password**: admin123

## 📚 Documentation Structure

- [`/api/`](./api/) - API documentation and endpoints
- [`/architecture/`](./architecture/) - System architecture diagrams
- [`/deployment/`](./deployment/) - Deployment guides and configs
- [`/development/`](./development/) - Development setup and guidelines
- [`/features/`](./features/) - Feature specifications and user guides

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon
npm run test       # Run tests
npm run db:seed    # Seed sample data
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm run lint       # Run linting
```

## 🔧 Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/shopify_insights
JWT_SECRET=your-jwt-secret-key
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Shopify Insights Platform
```

## 📊 Features Implemented

### ✅ Authentication & Multi-tenancy
- User registration and login
- JWT-based authentication
- Tenant isolation and management
- Role-based access control

### ✅ Shopify Integration
- Store connection via API credentials
- Automated data synchronization
- Webhook handling for real-time updates
- Customer, product, and order ingestion

### ✅ Analytics Dashboard
- Revenue trends and growth metrics
- Customer acquisition and retention
- Product performance analytics
- Order volume and patterns

### ✅ Data Management
- Scheduled sync jobs
- Data validation and cleanup
- Export functionality
- Real-time updates

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

### Recommended Platforms
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify
- **Database**: Railway PostgreSQL, AWS RDS, DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For technical issues or questions:
- Check the [API Documentation](./api/)
- Review [Development Guide](./development/)
- Create an issue in the repository

---

**Built with ❤️ for Xeno FDE Internship Assignment 2025**
