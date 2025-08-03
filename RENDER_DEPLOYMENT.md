# Render Deployment Guide

## Overview

This guide helps you deploy the ClinicMS backend to Render and troubleshoot common issues.

## Prerequisites

1. Render account
2. Railway MySQL database (or any external MySQL database)
3. Git repository with your code

## Quick Setup

### 1. Connect Your Repository

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Select the repository containing your ClinicMS code

### 2. Configure the Service

Use these settings:

**Basic Settings:**

- **Name:** `clinicms-backend`
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (deploy from root)

**Build & Deploy:**

- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm start`

### 3. Environment Variables

Add these environment variables in Render:

```env
NODE_ENV=production
PORT=3001
MYSQLHOST=your-mysql-host
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your-mysql-password
MYSQLDATABASE=railway
JWT_SECRET=msclinic
JWT_EXPIRES_IN=24h
```

### 4. Database Setup

You can use:

- **Railway MySQL** (recommended)
- **PlanetScale**
- **Any external MySQL database**

## Health Check Configuration

### Render Health Check Settings

- **Health Check Path:** `/api`
- **Health Check Timeout:** 120 seconds
- **Health Check Interval:** 30 seconds

## Troubleshooting

### Issue: Infinite npm install loop

**Solution:** Fixed in package.json - removed recursive install script

### Issue: Build fails

**Solution:**

1. Check that all dependencies are in backend/package.json
2. Verify TypeScript compilation
3. Ensure build script exists

### Issue: Database connection fails

**Solution:**

1. Verify MySQL environment variables are set correctly
2. Check that MySQL service is running
3. Ensure SSL is properly configured

### Issue: Health check timeout

**Solution:**

1. Check application logs for startup errors
2. Verify the `/api` endpoint is accessible
3. Ensure the application is listening on the correct port

## Environment Variables Reference

| Variable         | Description      | Required | Example                  |
| ---------------- | ---------------- | -------- | ------------------------ |
| `NODE_ENV`       | Environment      | Yes      | `production`             |
| `PORT`           | Application port | Yes      | `3001`                   |
| `MYSQLHOST`      | MySQL host       | Yes      | `ballast.proxy.rlwy.net` |
| `MYSQLPORT`      | MySQL port       | Yes      | `3306`                   |
| `MYSQLUSER`      | MySQL username   | Yes      | `root`                   |
| `MYSQLPASSWORD`  | MySQL password   | Yes      | `your-password`          |
| `MYSQLDATABASE`  | MySQL database   | Yes      | `railway`                |
| `JWT_SECRET`     | JWT secret key   | Yes      | `msclinic`               |
| `JWT_EXPIRES_IN` | JWT expiry       | No       | `24h`                    |

## Monitoring

### Health Check Endpoint

- URL: `https://your-app.onrender.com/api`
- Returns: JSON with status, timestamp, and environment info
- Expected: 200 OK response

### Application Logs

Monitor these log messages:

- `🚀 Front Desk System API is running on: http://localhost:3001`
- `✅ Database seeding completed successfully`
- `📚 API Documentation available at: http://localhost:3001/api`

## Deployment Steps

1. **Push your code to Git repository**
2. **Create new Web Service in Render**
3. **Configure build and start commands**
4. **Set environment variables**
5. **Deploy and monitor logs**

## Support

If you continue to experience issues:

1. Check Render status page
2. Review application logs in Render dashboard
3. Verify environment variables are set correctly
4. Test database connection manually
5. Check Render documentation for service-specific issues
