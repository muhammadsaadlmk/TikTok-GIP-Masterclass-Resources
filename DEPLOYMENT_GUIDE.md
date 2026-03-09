# Deployment Guide: GitHub & Render

## Quick Start Summary

This guide explains how to deploy your **Dev Tools Store** to GitHub and Render in minutes.

---

## Part 1: Push to GitHub

### Step 1: Prepare Your Repository

```bash
# Initialize if not already done
git init
git add .
git commit -m "Initial commit: Dev Tools Store"
```

### Step 2: Create Repository on GitHub

1. Visit https://github.com/new
2. Create new repository named `dev-tools-store`
3. **Do NOT** initialize with README (you already have one)
4. Copy the HTTPS URL

### Step 3: Push Code

```bash
git remote add origin https://github.com/YOUR-USERNAME/dev-tools-store.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Part 2: Deploy to Render

### Option A: Quick Deploy (Without Database)

**For testing only** - uses temporary in-memory storage:

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm start`
6. Add environment variable: `NODE_ENV=production`
7. Click **"Create Web Service"**

⚠️ **Note**: Data will be lost when the service restarts

### Option B: Recommended - Deploy with PostgreSQL

#### Step 1: Create PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name**: `dev-tools-store-db`
   - **Database**: `dev_tools_store`
   - Leave other settings as default
3. Click **"Create Database"**
4. Wait for creation (2-3 minutes)
5. **Copy the full connection string** (you'll need this)

#### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository `dev-tools-store`
3. Fill in deployment settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `dev-tools-store` |
   | **Environment** | Node |
   | **Region** | Pick closest to you |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

4. Click **"Create Web Service"** (don't add env vars yet)

#### Step 3: Add Environment Variables

Once the service is created:

1. Go to **"Environment"** tab
2. Add these variables:

   ```
   NODE_ENV = production
   DATABASE_URL = <paste the PostgreSQL connection string from step 1>
   SESSION_SECRET = <run: openssl rand -hex 32, paste the output>
   ```

3. Service automatically redeploys with new variables

#### Step 4: Wait for "Live" Status

You'll see "Your service is live!" when ready (2-5 minutes)

Your app is now at: `https://dev-tools-store.onrender.com` 🎉

---

## Testing Your Live App

1. **Visit your Render URL**
2. **Test homepage** - Should show app grid with 8 sample apps
3. **Test admin login**:
   - Click floating admin button (bottom right)
   - Username: `admin`
   - Password: `admin`
4. **Test app management**:
   - Add a new app
   - Edit the app name
   - Delete the app
5. **Test downloads** - Click DOWNLOAD button (should open Dropbox link in new tab)

---

## Continuous Deployment

Once deployed, every push to GitHub automatically redeploys:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render automatically deploys within 30 seconds!
```

Monitor deployments in Render Dashboard → "Deployments" tab

---

## Environment Variables Reference

| Variable | Required | Example/Notes |
|----------|----------|---------------|
| `NODE_ENV` | ✅ Yes | Always: `production` |
| `DATABASE_URL` | ✅ Yes | From Render PostgreSQL (starts with `postgresql://`) |
| `SESSION_SECRET` | ✅ Yes | Generate: `openssl rand -hex 32` |
| `PORT` | ❌ No | Render sets automatically |

---

## Troubleshooting

### "Build failed"
- Check Render logs (Deployments → Click failed deploy)
- Ensure `npm run build` works locally first: `npm install && npm run build`

### "Cannot connect to database"
- Verify DATABASE_URL is correct (copy-paste from Render PostgreSQL dashboard)
- Check PostgreSQL service is running in Render

### App loads but shows errors
- Check browser console (F12)
- Check Render logs for backend errors
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Admin login not working
- Default credentials: `admin` / `admin`
- If changed, check server/routes.ts login handler

### Changes aren't showing after push
- Render might still be building (check "Deployments" tab)
- Wait 30-60 seconds and refresh

---

## Local Testing Before Deploying

Always test the production build locally first:

```bash
npm install
npm run build
npm start
```

Visit `http://localhost:5000` and verify it works exactly like your live site.

---

## What's Included

✅ Full-stack Node.js + React application  
✅ PostgreSQL database with Drizzle ORM  
✅ Admin panel with authentication  
✅ App CRUD operations (Create, Read, Update, Delete)  
✅ Download counter tracking  
✅ Visitor counter  
✅ Responsive dark-theme UI  
✅ Dropbox integration  
✅ Production-ready build configuration  
✅ Automatic deployment on GitHub push  

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Render with PostgreSQL
3. ✅ Test the live application
4. ✅ Monitor in Render Dashboard
5. (Optional) Set up custom domain in Render

---

## Support

- **Render Docs**: https://render.com/docs
- **GitHub Docs**: https://docs.github.com
- **Project Docs**: See README.md
- **Issues**: Open an issue in your GitHub repository

---

**You're all set! 🚀 Your Dev Tools Store is ready to launch!**
