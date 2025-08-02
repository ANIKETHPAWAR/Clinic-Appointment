# 🚀 Vercel Deployment Guide for ClinicMS

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Cloud Database**: Set up PlanetScale or similar MySQL-compatible database
4. **Git Repository**: Push your code to GitHub/GitLab

## 🔧 Database Setup (PlanetScale)

### Step 1: Create PlanetScale Database

1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection details:
   - Host: `aws.connect.psdb.cloud`
   - Username: Your username
   - Password: Your password
   - Database: Your database name

### Step 2: Set Environment Variables

In Vercel dashboard, add these environment variables for backend:

```bash
NODE_ENV=production
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USERNAME=your_planetscale_username
DB_PASSWORD=your_planetscale_password
DB_DATABASE=your_database_name
JWT_SECRET=your_super_secure_jwt_secret_key_here
FRONTEND_URL=https://clinicms-frontend.vercel.app
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Login to Vercel (if not already logged in)
vercel login

# Deploy backend
vercel --prod

# Note the backend URL (e.g., https://clinicms-backend.vercel.app)
```

### Step 2: Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Set environment variable for API URL
export VITE_API_URL=https://your-backend-url.vercel.app/api

# Deploy frontend
vercel --prod
```

### Step 3: Update CORS (if needed)

If you get CORS errors, update the backend CORS configuration in `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    "http://localhost:5173",
    "https://clinicms-frontend.vercel.app",
    "https://clinicms-frontend-git-main.vercel.app",
    "https://clinicms-frontend-*.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

## 🔄 Automated Deployment

### Using the Deployment Script

```bash
# Make script executable
chmod +x deploy-vercel.sh

# Run deployment
./deploy-vercel.sh
```

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install -g vercel
      - run: |
          cd backend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install -g vercel
      - run: |
          cd frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VITE_API_URL: ${{ secrets.BACKEND_URL }}/api
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS configuration in backend
   - Verify frontend URL is in allowed origins

2. **Database Connection Issues**

   - Verify PlanetScale credentials
   - Check SSL configuration
   - Ensure database is accessible

3. **Build Errors**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check TypeScript compilation

4. **Environment Variables**
   - Ensure all required env vars are set in Vercel
   - Check variable names match code

### Debug Commands

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy with debug info
vercel --debug
```

## 📊 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user behavior

### Database Monitoring

- Use PlanetScale dashboard
- Monitor query performance
- Set up alerts for issues

## 🔒 Security

### Environment Variables

- Never commit secrets to Git
- Use Vercel's environment variable system
- Rotate JWT secrets regularly

### Database Security

- Use SSL connections
- Restrict database access
- Regular backups

## 🚀 Post-Deployment

### Testing Checklist

- [ ] Login functionality works
- [ ] All CRUD operations work
- [ ] File uploads work (if any)
- [ ] Email notifications work (if any)
- [ ] Mobile responsiveness
- [ ] Performance is acceptable

### Performance Optimization

- Enable Vercel Edge Functions
- Use CDN for static assets
- Optimize database queries
- Implement caching strategies

## 📞 Support

If you encounter issues:

1. Check Vercel documentation
2. Review deployment logs
3. Test locally first
4. Contact Vercel support if needed

---

**🎉 Your ClinicMS application is now deployed on Vercel!**
