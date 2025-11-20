# Vercel Deployment Guide for ENEXT

Complete guide to deploy your ENEXT e-commerce platform on Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Cloud Database** - MySQL database (see options below)

## 🗄️ Database Setup Options

Since Vercel doesn't provide MySQL hosting, you need a cloud database:

### Option 1: PlanetScale (Recommended - Free Tier)
- Sign up at [planetscale.com](https://planetscale.com)
- Create a new database
- Get connection string
- **Free tier**: 1 database, 1GB storage

### Option 2: Railway
- Sign up at [railway.app](https://railway.app)
- Create MySQL service
- Get connection details
- **Free tier**: $5 credit/month

### Option 3: AWS RDS / DigitalOcean / Other
- Any MySQL hosting service works
- Get connection details

## 🚀 Deployment Steps

### Step 1: Prepare Your Database

1. **Create your cloud MySQL database**
2. **Run the schema**:
   ```sql
   -- Copy and run lib/schema.sql in your database
   ```
3. **Run migration** (if needed):
   ```bash
   # Update connection in .env, then:
   npm run migrate-slug
   ```

### Step 2: Deploy to Vercel

#### Method A: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your GitHub repository**:
   - Select `coding-with-maaz/ENEXT`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

   **Important**: 
   - Add these for **Production**, **Preview**, and **Development**
   - Replace `your-project.vercel.app` with your actual Vercel domain

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

#### Method B: Via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add DB_HOST
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXT_PUBLIC_SITE_URL
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `aws-0-us-east-1.pooler.supabase.com` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `your-secure-password` |
| `DB_NAME` | Database name | `enext_db` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL | `https://enext.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL | `https://enext.vercel.app` |

### Setting in Vercel Dashboard

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name
   - **Value**: Variable value
   - **Environment**: Select (Production, Preview, Development)
4. Click **Save**

## 📝 Post-Deployment Checklist

- [ ] Database connection working
- [ ] Environment variables set correctly
- [ ] Site loads without errors
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin panel accessible
- [ ] Sitemap accessible: `https://your-site.vercel.app/sitemap.xml`
- [ ] Robots.txt accessible: `https://your-site.vercel.app/robots.txt`

## 🔍 Troubleshooting

### Database Connection Issues

**Error**: "ECONNREFUSED" or "Connection timeout"

**Solutions**:
1. Check database host allows external connections
2. Verify firewall rules allow Vercel IPs
3. Check database credentials are correct
4. Ensure database is running

### Build Errors

**Error**: "Module not found"

**Solution**:
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: "Environment variable not found"

**Solution**:
- Verify all environment variables are set in Vercel
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Runtime Errors

**Error**: "Cannot connect to database"

**Solution**:
- Verify database is accessible from internet
- Check connection string format
- Test connection with a simple script

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## 📊 Monitoring

- **Vercel Dashboard**: View deployments, logs, analytics
- **Function Logs**: Check API route logs
- **Analytics**: Enable Vercel Analytics for insights

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:
- **Production**: `master` or `main` branch
- **Preview**: Other branches (creates preview URLs)

## 🎯 Next Steps

1. **Set up database** (PlanetScale, Railway, etc.)
2. **Deploy to Vercel** (follow steps above)
3. **Test all features** (products, cart, checkout)
4. **Configure custom domain** (optional)
5. **Set up monitoring** (Vercel Analytics)

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PlanetScale Docs](https://planetscale.com/docs)
- [Railway Docs](https://docs.railway.app)

---

**Need Help?** Check Vercel's [support](https://vercel.com/support) or your deployment logs.

