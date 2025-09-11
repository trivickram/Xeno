# Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Railway (Recommended)
Railway provides easy deployment for both backend and database.

#### Backend Deployment
1. **Connect repository to Railway**
2. **Set environment variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-production-jwt-secret
   SHOPIFY_API_KEY=your-shopify-api-key
   SHOPIFY_API_SECRET=your-shopify-api-secret
   ```
3. **Deploy command:** `npm start`
4. **Health check:** `/api/health`

#### Database Setup
- Use Railway PostgreSQL add-on
- Run migrations: `npm run db:migrate`
- Seed data: `npm run db:seed`

### Option 2: Render
Similar to Railway with built-in PostgreSQL support.

#### Backend Service
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js 18+

### Option 3: Heroku
Traditional PaaS with PostgreSQL add-on.

```bash
# Install Heroku CLI
heroku create shopify-insights-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)
Perfect for Next.js applications.

1. **Connect GitHub repository**
2. **Set environment variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NEXT_PUBLIC_APP_NAME=Shopify Insights Platform
   ```
3. **Auto-deploy on push to main**

### Option 2: Netlify
1. **Build command:** `npm run build`
2. **Publish directory:** `.next`
3. **Environment variables:** Same as Vercel

## 🗄️ Database Migration

### Production Database Setup
```sql
-- Create database
CREATE DATABASE shopify_insights_prod;

-- Create user
CREATE USER shopify_user WITH ENCRYPTED PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE shopify_insights_prod TO shopify_user;
```

### Migration Commands
```bash
# Run migrations
npm run db:migrate

# Rollback if needed
npm run db:rollback

# Check migration status
npm run db:status
```

## 🔒 Security Checklist

### Environment Variables
- [ ] Strong JWT secret (32+ characters)
- [ ] Secure database passwords
- [ ] API keys properly protected
- [ ] No sensitive data in code

### HTTPS & SSL
- [ ] SSL certificates installed
- [ ] Force HTTPS redirects
- [ ] Secure cookie settings
- [ ] CORS properly configured

### Database Security
- [ ] Connection pooling configured
- [ ] Backup strategy implemented
- [ ] Read replicas for scaling
- [ ] Monitoring and alerting

## 📊 Monitoring & Logging

### Application Monitoring
- **Winston** for backend logging
- **Sentry** for error tracking
- **New Relic** or **DataDog** for APM

### Database Monitoring
- Connection pool metrics
- Query performance
- Slow query logging
- Database size monitoring

### Infrastructure Monitoring
- **Uptime Robot** for availability
- **CloudWatch** for AWS
- **Railway Analytics** for Railway

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: railway deploy

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: vercel --prod
```

## 🏗️ Infrastructure as Code

### Docker Setup
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/shopify_insights
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=shopify_insights
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🔧 Performance Optimization

### Backend Optimization
- Connection pooling (10-20 connections)
- Redis caching for analytics
- Gzip compression
- Rate limiting
- Query optimization

### Frontend Optimization
- Next.js Image optimization
- Code splitting and lazy loading
- CDN for static assets
- Service worker for caching

### Database Optimization
- Proper indexing on foreign keys
- Query optimization
- Connection pooling
- Read replicas for analytics

## 📈 Scaling Strategy

### Horizontal Scaling
- Load balancer (NGINX/HAProxy)
- Multiple backend instances
- Database read replicas
- CDN for frontend assets

### Vertical Scaling
- Increase server resources
- Database performance tuning
- Memory optimization
- CPU optimization

## 🚨 Disaster Recovery

### Backup Strategy
- **Database backups**: Daily automated backups
- **Code backups**: Git repositories
- **Environment configs**: Secure storage
- **SSL certificates**: Backup and rotation

### Recovery Plan
1. **RTO (Recovery Time Objective)**: 1 hour
2. **RPO (Recovery Point Objective)**: 24 hours
3. **Backup restoration procedures**
4. **Communication plan**

## 🔍 Health Checks

### Backend Health Check
```javascript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2025-09-11T10:00:00.000Z",
  "uptime": 86400,
  "database": "connected",
  "shopify_api": "accessible"
}
```

### Frontend Health Check
- Build process completion
- Static asset loading
- API connectivity test

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Database migrations ready
- [ ] Environment variables set
- [ ] SSL certificates valid

### During deployment
- [ ] Graceful shutdown of old instances
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] DNS updated (if needed)
- [ ] CDN cache cleared

### Post-deployment
- [ ] Application functionality verified
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] Monitoring alerts active
- [ ] Team notified of deployment

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check connection
psql $DATABASE_URL

# Test from application
npm run db:test-connection
```

#### API Connectivity Issues
```bash
# Test API endpoint
curl https://your-api-domain.com/api/health

# Check logs
heroku logs --tail  # For Heroku
railway logs         # For Railway
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Monitoring Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all
```
