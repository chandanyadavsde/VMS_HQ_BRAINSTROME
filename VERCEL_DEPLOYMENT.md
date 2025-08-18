# Vercel Deployment Guide

This branch (`prodv1`) is configured for deployment on Vercel.

## What's Different in This Branch

- **Vercel Configuration**: Added `vercel.json` for proper build and routing
- **Clean Scripts**: Removed EC2-specific deployment scripts
- **Vercel Ignore**: Added `.vercelignore` to exclude unnecessary files
- **Build Script**: Added `vercel-build` script for Vercel deployment

## Files Added/Modified

### New Files
- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from Vercel deployment
- `VERCEL_DEPLOYMENT.md` - This deployment guide

### Modified Files
- `package.json` - Cleaned up scripts, added vercel-build

## Deployment Steps

1. **Connect to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`

2. **Deploy**
   - Run: `vercel --prod`
   - Or use: `vercel` for preview deployment

3. **Automatic Deployments**
   - Connect your GitHub repo to Vercel
   - Push to this branch for automatic deployments

## Configuration Details

### Build Settings
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Routing
- All routes redirect to `index.html` for SPA routing
- Static assets are cached with long-term headers

### Environment Variables
- Configure any environment variables in Vercel dashboard
- No `.env` files needed in production

## Benefits of Vercel

- **Automatic HTTPS**: SSL certificates included
- **Global CDN**: Fast loading worldwide
- **Preview Deployments**: Automatic PR previews
- **Zero Configuration**: Works out of the box with Vite
- **Automatic Scaling**: Handles traffic spikes

## Rollback

If you need to rollback:
- Use Vercel dashboard to revert to previous deployment
- Or redeploy from a previous commit: `vercel --prod --force`

## Maintenance

- Keep this branch clean and focused on Vercel deployment
- Test builds locally: `npm run build`
- Monitor deployments in Vercel dashboard
