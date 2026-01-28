# Database Configuration Guide

## Overview
This backend supports both local development and production (Railway) MySQL databases.

## Local Development Setup

The `.env` file is configured for local development:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Suman@9900
DB_NAME=testdb
```

**To run locally:**
1. Ensure MySQL is running on your local machine
2. Run: `node server.js`

## Production Deployment (Railway)

The `.env.production` file contains Railway MySQL credentials:

```env
DB_HOST=viaduct.proxy.rlwy.net
DB_PORT=43599
DB_USER=root
DB_PASSWORD=FGCFVtjzRNgoJfYdYpdiXUUHiEUQavul
DB_NAME=testdb
```

**To deploy to Railway:**

### Option 1: Using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

### Option 2: Using Railway Dashboard
1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically deploy
4. Add environment variables from `.env.production` in Railway dashboard

### Option 3: Manual Environment Variables
In Railway dashboard, add these environment variables:
- `DB_HOST=viaduct.proxy.rlwy.net`
- `DB_PORT=43599`
- `DB_USER=root`
- `DB_PASSWORD=FGCFVtjzRNgoJfYdYpdiXUUHiEUQavul`
- `DB_NAME=testdb`
- `ACCESS_TOKEN_SECRET=access-token-secret-key`
- `REFRESH_TOKEN_SECRET=refresh-token-secret-key`
- `ACCESS_TOKEN_EXPIRATION=9300`
- `REFRESH_TOKEN_EXPIRATION=10800`

## Why Local Connection Failed

The Railway MySQL database cannot be accessed from your local machine because:
1. Railway's TCP proxy may require the connection to originate from within Railway's network
2. Network/firewall restrictions may block external connections
3. The database might only accept connections from deployed Railway services

This is a common security practice for cloud databases.

## Testing Production Connection

Once deployed to Railway, the backend will automatically connect to the Railway MySQL database using the environment variables configured in the Railway dashboard.
