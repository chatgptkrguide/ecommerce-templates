# Vercel Deployment Setup Guide

## Current Status
✅ Build succeeded
❌ Runtime failing - Environment variables not configured

## Critical Issues to Fix

### 1. Database Connection Error
**Error**: `Environment variable not found: DATABASE_URL`

**Solution**: You need to set up a PostgreSQL database and configure the connection.

### 2. NextAuth Configuration Error
**Error**: `CLIENT_FETCH_ERROR - There is a problem with the server configuration`

**Solution**: NextAuth requires `NEXTAUTH_URL` and `NEXTAUTH_SECRET` environment variables.

## Step-by-Step Setup

### Option A: Quick Setup with Vercel Postgres (Recommended)

1. **Go to your Vercel project dashboard**
   - Navigate to your project: https://vercel.com/dashboard

2. **Add Vercel Postgres**
   - Go to **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose region (closest to your users)
   - Click **Create**
   - This automatically adds `DATABASE_URL` and related variables

3. **Configure required environment variables**
   - Go to **Settings** → **Environment Variables**
   - Add the following variables:

```bash
# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate-with-command-below>

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

4. **Generate NEXTAUTH_SECRET**
   Run this command in your terminal:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and use it as `NEXTAUTH_SECRET`

5. **Initialize the database**
   After deployment succeeds, you need to run migrations:

   **Option 1: Using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Pull environment variables
   vercel env pull

   # Run migrations
   npx prisma migrate deploy

   # (Optional) Seed sample data
   npm run db:seed
   ```

   **Option 2: Using Vercel Dashboard**
   - Go to your deployment
   - Open **Settings** → **Functions**
   - Create a serverless function to run migrations
   - Or use Vercel's Terminal feature if available

### Option B: Use External Database (Supabase, Railway, etc.)

1. **Create a PostgreSQL database** on your preferred platform:
   - [Supabase](https://supabase.com/) (Free tier available)
   - [Railway](https://railway.app/) (Free tier available)
   - [Neon](https://neon.tech/) (Free tier available)

2. **Get the connection string**
   - Format: `postgresql://user:password@host:5432/database`
   - Usually found in "Connection String" or "Database URL"

3. **Add to Vercel Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with your connection string

4. **Add other required variables** (same as Option A step 3)

## Required Environment Variables

### Production (REQUIRED for app to work)

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret-min-32-chars"

# App
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### Optional (For full features)

```bash
# Cloudinary (Image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (Payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email notifications (Resend)
RESEND_API_KEY="re_..."

# Search (Algolia)
ALGOLIA_APP_ID="your-app-id"
ALGOLIA_API_KEY="your-api-key"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Cache (Redis)
REDIS_URL="redis://..."
```

## Setting Environment Variables in Vercel

### Via Dashboard:
1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings**
3. Click **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Your actual value
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### Via Vercel CLI:
```bash
# Set a single variable
vercel env add DATABASE_URL production

# Pull variables to local
vercel env pull
```

## After Setting Environment Variables

1. **Trigger a new deployment**
   - Make a small change and push to GitHub, OR
   - Go to **Deployments** → click **⋯** on latest → **Redeploy**

2. **Run database migrations** (if using new database)
   ```bash
   # Pull env vars locally
   vercel env pull

   # Run migrations
   npx prisma migrate deploy

   # Seed sample data (optional)
   npm run db:seed
   ```

3. **Test your application**
   - Visit your app URL
   - Try to sign in/register
   - Check if pages load correctly

## Troubleshooting

### Still seeing 500 errors after setting variables?

1. **Check environment variable names**
   - Ensure they match exactly (case-sensitive)
   - No extra spaces or quotes

2. **Verify database connection**
   ```bash
   # Test locally
   vercel env pull
   npx prisma db push
   ```

3. **Check deployment logs**
   - Go to **Deployments** → Click on deployment → **Function Logs**
   - Look for specific error messages

4. **Ensure DATABASE_URL is accessible**
   - Some databases have IP whitelisting
   - Vercel uses dynamic IPs, so allow all IPs or use services that support it

### Database not initializing?

```bash
# Connect to your database and run:
npx prisma migrate deploy
npx prisma generate
npx prisma db seed  # Optional: adds sample data
```

## Production Checklist

Before going live:
- [ ] All required environment variables set
- [ ] Database migrations applied
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Custom domain configured (optional)
- [ ] Payment gateway configured (if using e-commerce features)
- [ ] Email service configured (for notifications)
- [ ] Error monitoring set up (Sentry recommended)
- [ ] Backup strategy in place for database

## Need Help?

- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [Prisma Documentation](https://www.prisma.io/docs)
- Open an issue on GitHub if problems persist

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` files to Git
- Use different secrets for development and production
- Rotate `NEXTAUTH_SECRET` periodically
- Keep API keys and secrets confidential
- Enable 2FA on all service accounts
