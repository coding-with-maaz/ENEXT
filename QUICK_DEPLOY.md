# Quick Deploy to Vercel

## 🚀 Fastest Way to Deploy

### 1. Set Up Cloud Database (5 minutes)

**Option A: PlanetScale (Easiest)**
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up (free)
3. Create database → Get connection string
4. Run schema: Copy `lib/schema.sql` and execute in PlanetScale SQL editor

**Option B: Railway**
1. Go to [railway.app](https://railway.app)
2. New Project → Add MySQL
3. Get connection details
4. Run schema in MySQL

### 2. Deploy to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub)
3. **Click "Add New Project"**
4. **Import Repository**: `coding-with-maaz/ENEXT`
5. **Add Environment Variables**:

   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

6. **Click "Deploy"**
7. **Wait 2-3 minutes** → Done! 🎉

### 3. Update Site URL (After First Deploy)

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
3. **Redeploy** (or it will auto-deploy)

## ✅ That's It!

Your site is now live at: `https://your-project.vercel.app`

## 🔧 Need Help?

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

