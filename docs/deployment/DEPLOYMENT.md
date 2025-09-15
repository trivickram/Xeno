# Deployment Guide

## Overview

This guide covers deploying the Shopify Insights Platform to production environments using modern hosting platforms.

## Architecture

- **Frontend**: Next.js application deployed to Vercel
- **Backend**: Express.js API deployed to Railway
- **Database**: PostgreSQL (production) / SQLite (development)
- **CI/CD**: GitHub Actions for automated deployment

## Prerequisites

### Required Accounts
- [GitHub](https://github.com) account for code hosting and CI/CD
- [Vercel](https://vercel.com) account for frontend hosting
- [Railway](https://railway.app) account for backend hosting
- [Shopify Partners](https://partners.shopify.com) account for app development

### Local Development Setup
- Node.js 18+ installed
- Git configured
- Docker Desktop (optional, for local container testing)

## Frontend Deployment (Vercel)

### 1. Connect Repository
1. Login to Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory

### 2. Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```bash
# Required for production
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_NAME=Shopify Insights Platform
NEXT_PUBLIC_APP_ENV=production

# Optional analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 3. Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Backend Deployment (Railway)

### 1. Connect Repository
1. Login to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `backend` folder as the root directory

### 2. Configure Environment Variables
In Railway dashboard → Variables tab:

```bash
# Database (Railway provides PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Shopify API (from Shopify Partners)
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_SCOPES=read_products,read_orders,read_customers

# CORS Configuration
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
```

### 3. Database Setup
1. In Railway dashboard → Add service → PostgreSQL
2. Connect the database to your backend service
3. Database URL will be automatically provided

### 4. Deploy Configuration
Railway will automatically:
- Detect Node.js and install dependencies
- Run build command
- Execute migration scripts via `postinstall`
- Start the server

## CI/CD Pipeline (GitHub Actions)

### 1. Repository Secrets
In GitHub repository → Settings → Secrets and variables → Actions:

```bash
# Vercel deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Railway deployment
RAILWAY_TOKEN=your-railway-token
```

### 2. Workflow Files
The repository includes pre-configured workflows:
- `.github/workflows/deploy-frontend.yml`
- `.github/workflows/deploy-backend.yml`

### 3. Automatic Deployment
Deployments trigger on:
- Push to `main` branch
- Pull request merge
- Manual workflow dispatch

## Database Management

### Production Database
- **Provider**: Railway PostgreSQL
- **Automatic backups**: Enabled
- **Connection pooling**: Configured
- **SSL**: Required

### Migrations
```bash
# Run migrations (automatic on deploy)
npm run db:migrate

# Seed development data (development only)
npm run db:seed
```

### Monitoring
- **Health checks**: `/health` endpoint
- **Logs**: Available in Railway dashboard
- **Error tracking**: Built-in error handling

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
DATABASE_URL=sqlite:database.sqlite
FRONTEND_URL=http://localhost:3000
```

### Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-app.vercel.app
```

## Security Considerations

### Frontend Security
- Content Security Policy headers
- XSS protection
- CORS configuration
- Environment variable validation

### Backend Security
- Helmet.js security headers
- Rate limiting
- JWT token validation
- Database query sanitization
- Error message sanitization

### Infrastructure Security
- HTTPS enforced
- Environment variable encryption
- Access logging
- Regular dependency updates

## Monitoring and Maintenance

### Health Checks
- Frontend: Built-in Next.js health monitoring
- Backend: `/health` endpoint with status reporting
- Database: Connection monitoring

### Logging
- **Production logs**: Railway dashboard
- **Error tracking**: Built-in error handlers
- **Access logs**: Morgan middleware

### Performance Monitoring
- **Frontend**: Vercel Analytics
- **Backend**: Custom metrics via logger
- **Database**: Railway monitoring

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables
   - Review build logs

2. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is running

3. **CORS Errors**
   - Verify FRONTEND_URL and ALLOWED_ORIGINS
   - Check domain configuration
   - Review browser console for specifics

### Debugging Commands
```bash
# Check application health
curl https://your-backend.railway.app/health

# View recent logs
railway logs --tail

# Test database connection
railway run npm run db:migrate
```

## Scaling Considerations

### Horizontal Scaling
- Railway: Auto-scaling based on traffic
- Vercel: Edge network distribution
- Database: Connection pooling

### Performance Optimization
- Frontend: Static generation and ISR
- Backend: Response caching
- Database: Query optimization

## Backup and Recovery

### Database Backups
- **Automatic**: Daily backups via Railway
- **Manual**: Export via Railway CLI
- **Recovery**: Point-in-time restore available

### Code Backups
- **Primary**: GitHub repository
- **Deployments**: Vercel deployment history
- **Docker images**: Railway container registry

## Cost Optimization

### Vercel
- **Free tier**: Personal projects
- **Pro tier**: Commercial applications
- **Enterprise**: Large-scale deployments

### Railway
- **Usage-based**: Pay for resources consumed
- **Sleep mode**: Automatic for low traffic
- **Resource limits**: Configurable

## Security Checklist

- [ ] Environment variables properly configured
- [ ] Database credentials secure
- [ ] HTTPS enforced on all endpoints
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Dependencies regularly updated
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Authentication flows secure

## Support and Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)

### Community Support
- GitHub Issues for bug reports
- Discord communities for real-time help
- Stack Overflow for technical questions

---

This deployment guide ensures a robust, scalable, and secure production environment for the Shopify Insights Platform.