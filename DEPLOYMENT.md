# Deployment Guide - Vercel

This guide walks you through deploying the Smart Bookmark App to Vercel.

## Prerequisites

Before deploying, ensure you have:

- ✅ Completed Supabase setup
- ✅ Google OAuth configured
- ✅ Tested the app locally
- ✅ GitHub account
- ✅ Vercel account (free tier works)

## Step 1: Push to GitHub

### Initialize Git Repository

```bash
cd smart-bookmark-app
git init
```

### Create .gitignore (Already exists)

Verify `.gitignore` includes:

```
node_modules
.env
.env.local
.next
```

### Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name: `smart-bookmark-app`
4. Make it **Public** or **Private** (your choice)
5. **Don't** initialize with README (we already have one)
6. Click **Create Repository**

### Push Your Code

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Smart Bookmark App"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Import your `smart-bookmark-app` repository
5. Configure project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Click **Add** for each
5. Make sure they're available for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **...** on the latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache**
5. Click **Redeploy**

## Step 5: Update Google OAuth

Now that you have your production URL, update Google OAuth:

### Get Your Vercel URL

Your app is deployed at: `https://your-app-name.vercel.app`

### Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** → **Credentials**
3. Click on your OAuth client
4. Add to **Authorized JavaScript origins**:
   - `https://your-app-name.vercel.app`
5. Add to **Authorized redirect URIs**:
   - `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
6. Click **Save**

### Update Supabase

1. Go to your Supabase project
2. Go to **Authentication** → **URL Configuration**
3. Update **Site URL** to: `https://your-app-name.vercel.app`
4. Add to **Redirect URLs**:
   - `https://your-app-name.vercel.app/**`
5. Click **Save**

## Step 6: Test Production Deployment

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Click **Sign in with Google**
3. Authorize the app
4. You should be redirected to the dashboard
5. Add a bookmark
6. Open the app in a second tab
7. Verify real-time sync works
8. Test delete functionality
9. Test logout

## Step 7: Configure Custom Domain (Optional)

If you have a custom domain:

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain: `mybookmarks.com`
3. Follow DNS configuration instructions
4. Update Google OAuth with new domain
5. Update Supabase Auth settings with new domain

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys!
```

## Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solution**: 
- Check environment variables in Vercel
- Redeploy after adding them
- Make sure they start with `NEXT_PUBLIC_`

### Issue: Google OAuth fails in production

**Solution**:
- Verify redirect URI in Google Console matches exactly
- Check Site URL in Supabase matches your Vercel domain
- Clear browser cache and try again

### Issue: Real-time not working in production

**Solution**:
- Check browser console for WebSocket errors
- Verify Supabase Realtime is enabled
- Check RLS policies are correct

### Issue: Build fails

**Solution**:
- Check build logs in Vercel
- Verify all dependencies in package.json
- Run `npm run build` locally first

## Performance Optimization

### Enable Analytics

1. In Vercel, go to **Analytics**
2. Enable **Web Analytics**
3. Monitor performance metrics

### Check Lighthouse Score

1. Open your production site
2. Open Chrome DevTools
3. Go to **Lighthouse** tab
4. Run audit
5. Should score 90+ on Performance

## Monitoring

### Check Deployment Status

```bash
# Install Vercel CLI
npm i -g vercel

# Check status
vercel ls

# View logs
vercel logs
```

### Monitor Errors

1. In Vercel dashboard, go to your project
2. Click **Logs** to see runtime logs
3. Set up error notifications if needed

## Environment-Specific Configurations

### Preview Deployments

Every PR creates a preview deployment:
- URL: `https://your-app-git-branch.vercel.app`
- Uses the same environment variables
- Great for testing before merging

### Production vs Preview

You can set different env vars:
1. Go to **Settings** → **Environment Variables**
2. Select which environments for each variable
3. Use different Supabase projects for staging/production

## Rollback

If something goes wrong:

1. Go to **Deployments**
2. Find a working deployment
3. Click **...** → **Promote to Production**
4. Your app reverts immediately

## Cost

Free tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

The Smart Bookmark App stays well within free limits.

## Security Checklist

Before going live:

- ✅ Environment variables are set
- ✅ .env files not in git
- ✅ Google OAuth properly configured
- ✅ Supabase RLS enabled
- ✅ HTTPS enabled (automatic)
- ✅ No console errors in production

## Next Steps

After successful deployment:

1. Share your app URL
2. Monitor analytics
3. Set up custom domain (optional)
4. Enable Web Analytics in Vercel
5. Set up error tracking (optional)

Your app is now live! 🎉

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: Create issues in your repo

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Deploy to production
vercel --prod

# Remove deployment
vercel rm <deployment-url>
```

---

**Congratulations!** Your Smart Bookmark App is now deployed and accessible worldwide! 🚀
