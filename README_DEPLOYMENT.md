# 🚀 Deploy ENEXT to Vercel

## Quick Steps

### 1. Database Setup (Choose One)

**PlanetScale (Free & Easy)**
```
1. Visit: https://planetscale.com
2. Sign up → Create database
3. Copy lib/schema.sql → Run in SQL editor
4. Get connection string
```

**Railway**
```
1. Visit: https://railway.app
2. New Project → Add MySQL
3. Run schema.sql
4. Get connection details
```

### 2. Deploy to Vercel

1. **Visit**: https://vercel.com
2. **Sign in** with GitHub
3. **Add New Project** → Import `coding-with-maaz/ENEXT`
4. **Add Environment Variables**:

```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

5. **Deploy** → Wait 2-3 minutes
6. **Update URLs** with your actual Vercel domain
7. **Redeploy**

## ✅ Done!

Your site: `https://your-project.vercel.app`

## 📚 Full Guides

- Quick: `QUICK_DEPLOY.md`
- Detailed: `VERCEL_DEPLOYMENT_GUIDE.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`

