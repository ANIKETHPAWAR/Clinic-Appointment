# 🚀 PlanetScale Database Setup Guide

## Step 1: Create PlanetScale Account

1. Go to [planetscale.com](https://planetscale.com)
2. Click "Get Started"
3. Sign up with GitHub
4. Verify your email

## Step 2: Create Database

1. Click "New Database"
2. Choose "Create new database"
3. Enter database name: `clinicms`
4. Select region (closest to you)
5. Click "Create database"

## Step 3: Get Connection Details

1. Go to your database dashboard
2. Click "Connect"
3. Select "Connect with MySQL"
4. Copy the connection details:

```
Host: aws.connect.psdb.cloud
Username: your_username
Password: your_password
Database: clinicms
Port: 3306
```

## Step 4: Set Up Schema

1. Go to "Console" tab
2. Copy and paste the contents of `database-schema.sql`
3. Click "Run" to execute the schema

## Step 5: Test Connection

You can test the connection using MySQL Workbench or any MySQL client:

```bash
mysql -h aws.connect.psdb.cloud -u your_username -p clinicms
```

## Step 6: Environment Variables

Add these to your Vercel backend environment variables:

```
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=clinicms
```

## Step 7: Update Backend Configuration

Your backend is already configured to work with PlanetScale. The database config will automatically use SSL when connecting to PlanetScale.

## Troubleshooting

### Connection Issues

- Verify credentials are correct
- Check if database is in the correct region
- Ensure SSL is enabled

### Schema Issues

- Run schema commands one by one
- Check for syntax errors
- Verify table creation

### Performance

- PlanetScale automatically scales
- Monitor usage in dashboard
- Upgrade plan if needed
