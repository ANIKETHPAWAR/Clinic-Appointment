# Railway Deployment Guide

## Overview

This guide helps you deploy the ClinicMS backend to Railway and troubleshoot common issues.

## Prerequisites

1. Railway account
2. Railway CLI installed
3. MySQL database service on Railway

## Quick Setup

### 1. Create Railway Project

```bash
railway login
railway init
```

### 2. Add MySQL Database

1. Go to your Railway project dashboard
2. Click "New Service" → "Database" → "MySQL"
3. Note down the connection details

### 3. Set Environment Variables

In your Railway project settings, add these environment variables:

```env
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
PORT=3001
MYSQLHOST=your-mysql-host
MYSQLPORT=your-mysql-port
MYSQLUSER=your-mysql-user
MYSQLPASSWORD=your-mysql-password
MYSQLDATABASE=your-mysql-database
```

### 4. Deploy

```bash
railway up
```

## Health Check Issues

### Problem: Health check fails with "service unavailable"

**Solution:**

1. The application now includes a health check endpoint at `/api`
2. The health check will return a 200 status with application info
3. Database seeding is now non-blocking - the app will start even if seeding fails

### Problem: Database connection issues

**Solution:**

1. Verify all MySQL environment variables are set correctly
2. Check that the MySQL service is running in Railway
3. The application will retry database connections automatically
4. Database tables will be created automatically via TypeORM synchronize

### Problem: Application fails to start

**Solution:**

1. Check Railway logs: `railway logs`
2. Verify the Dockerfile is building correctly
3. Ensure all dependencies are installed
4. Check that the port is correctly exposed (3001)

## Troubleshooting Commands

### Check Railway Connection

```bash
cd backend
npm run railway:check
```

### View Logs

```bash
railway logs
```

### Check Service Status

```bash
railway status
```

### Restart Service

```bash
railway service restart
```

## Database Schema

The application uses TypeORM entities that automatically create the database schema. The main tables are:

- `users` - User accounts and authentication
- `doctors` - Doctor information and specializations
- `patients` - Patient records
- `appointments` - Appointment scheduling
- `queue` - Patient queue management

## Environment Variables Reference

| Variable              | Description                          | Required |
| --------------------- | ------------------------------------ | -------- |
| `NODE_ENV`            | Environment (production/development) | Yes      |
| `RAILWAY_ENVIRONMENT` | Railway environment identifier       | Yes      |
| `PORT`                | Application port                     | Yes      |
| `MYSQLHOST`           | MySQL host address                   | Yes      |
| `MYSQLPORT`           | MySQL port                           | Yes      |
| `MYSQLUSER`           | MySQL username                       | Yes      |
| `MYSQLPASSWORD`       | MySQL password                       | Yes      |
| `MYSQLDATABASE`       | MySQL database name                  | Yes      |

## Common Issues and Solutions

### Issue: "Cannot connect to database"

- Check MySQL service is running in Railway
- Verify environment variables are correct
- Ensure SSL is properly configured

### Issue: "Tables don't exist"

- The application will create tables automatically
- Check that `synchronize: true` is set in database config
- Verify database permissions

### Issue: "Health check timeout"

- Check application logs for startup errors
- Verify the `/api` endpoint is accessible
- Ensure the application is listening on the correct port

### Issue: "Build fails"

- Check that all dependencies are in package.json
- Verify TypeScript compilation
- Check Dockerfile syntax

## Monitoring

### Health Check Endpoint

- URL: `https://your-app.railway.app/api`
- Returns: JSON with status, timestamp, and environment info
- Expected: 200 OK response

### Application Logs

Monitor these log messages:

- `🚀 Front Desk System API is running on: http://localhost:3001`
- `✅ Database seeding completed successfully`
- `📚 API Documentation available at: http://localhost:3001/api`

## Support

If you continue to experience issues:

1. Check Railway status page
2. Review application logs
3. Verify environment variables
4. Test database connection manually
5. Check Railway documentation for service-specific issues
