# Pre-Deployment Checklist

Use this checklist before deploying to Vercel.

## ✅ Code Preparation

- [ ] All code committed to GitHub
- [ ] No sensitive data in code (use environment variables)
- [ ] `.env` file is in `.gitignore`
- [ ] `package.json` has all dependencies
- [ ] Build works locally: `npm run build`
- [ ] No TypeScript errors: `npm run lint`

## ✅ Database Setup

- [ ] Cloud MySQL database created
- [ ] Database accessible from internet
- [ ] Schema executed: `lib/schema.sql`
- [ ] Migration run (if needed): `npm run migrate-slug`
- [ ] Test connection works
- [ ] Database credentials saved securely

## ✅ Environment Variables

- [ ] `DB_HOST` - Database host address
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name
- [ ] `NEXT_PUBLIC_APP_URL` - Will be set to Vercel URL
- [ ] `NEXT_PUBLIC_SITE_URL` - Will be set to Vercel URL

## ✅ Vercel Setup

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported to Vercel
- [ ] All environment variables added
- [ ] Build settings configured
- [ ] Domain configured (if custom)

## ✅ Testing

- [ ] Homepage loads
- [ ] Products display
- [ ] Product detail pages work
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin panel accessible
- [ ] API routes work
- [ ] Database queries work
- [ ] Images load correctly
- [ ] SEO metadata works (sitemap, robots.txt)

## ✅ Security

- [ ] No API keys in code
- [ ] Database password is strong
- [ ] Admin routes protected (if needed)
- [ ] Environment variables secured

## ✅ Performance

- [ ] Images optimized
- [ ] Build size reasonable
- [ ] No console errors
- [ ] Fast page loads

## ✅ Documentation

- [ ] README updated
- [ ] Deployment guide created
- [ ] Environment variables documented

---

**Ready to Deploy?** Follow `VERCEL_DEPLOYMENT_GUIDE.md`

