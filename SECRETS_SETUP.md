# 🔑 GitHub Repository Secrets Setup Guide

## Required Secrets for Your Repository

Go to: `https://github.com/trivickram/Xeno/settings/secrets/actions`

Click "New repository secret" for each of these:

---

## 🎯 **VERCEL SECRETS (Frontend)**

### 1. VERCEL_TOKEN
```
Name: VERCEL_TOKEN
Value: ETPzvQRlLlL8lg3o09LoWzhs
```

### 2. ORG_ID  
```
Name: ORG_ID
Value: trivickrams-projects
```

### 3. PROJECT_ID
```
Name: PROJECT_ID
Value: prj_csnfQEqpot3Io9AEr6EYlDHYf3Yl
```

### 4. NEXT_PUBLIC_API_URL
```
Name: NEXT_PUBLIC_API_URL
Value: https://your-railway-backend-url.railway.app
```
*Note: You'll get this URL after deploying to Railway*

---

## 🚂 **RAILWAY SECRETS (Backend)**

### 1. RAILWAY_TOKEN
```
Name: RAILWAY_TOKEN
Value: [Get this from Railway Dashboard]
```

**To get your Railway token:**
1. Go to: https://railway.app/account/tokens
2. Click "Create New Token"
3. Name it "GitHub Actions"
4. Copy the token value

---

## 🔗 **Service Connection Steps**

### **Connect Vercel (Frontend)**

Your project is already set up! Here's what's configured:
- **Project Name**: xeno-frontend
- **Project ID**: prj_csnfQEqpot3Io9AEr6EYlDHYf3Yl
- **Organization**: trivickrams-projects
- **Framework**: Next.js
- **Root Directory**: frontend

**Next steps:**
1. Add the secrets above to GitHub
2. Push your code to trigger automatic deployment
3. Your frontend will be available at: `https://xeno-frontend-trivickrams-projects.vercel.app`

### **Connect Railway (Backend)**

1. Go to: https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account if not already connected
4. Select repository: `trivickram/Xeno`
5. Choose "Deploy Now"
6. Set **Root Directory**: `backend`
7. Railway will auto-detect Node.js and deploy

**Environment Variables to set in Railway:**
```bash
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-here
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
FRONTEND_URL=https://xeno-frontend-trivickrams-projects.vercel.app
```

---

## ✅ **Verification Checklist**

- [ ] All 4 secrets added to GitHub repository
- [ ] Railway token obtained and added
- [ ] Backend deployed to Railway
- [ ] Railway URL added to NEXT_PUBLIC_API_URL secret
- [ ] Test deployment by pushing to main/master branch

---

## 🚀 **Test Your Setup**

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push origin master
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/trivickram/Xeno/actions
   - Watch the deployment workflows run

3. **Verify deployments:**
   - Frontend: Check Vercel dashboard
   - Backend: Check Railway dashboard

---

## 🔧 **Troubleshooting**

### Common Issues:
1. **"Invalid token"** → Double-check token values
2. **"Project not found"** → Verify PROJECT_ID is correct
3. **"Deploy failed"** → Check logs in respective dashboards

### Quick Fixes:
- Ensure all environment variables are set
- Check that repository secrets exactly match the names above
- Verify your GitHub repository is connected to both services

---

*Your deployment pipeline is now ready! 🎉*