# 🚀 Deployment Guide

Complete guide for pushing to GitHub and deploying your e-commerce admin dashboard.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Pushing to GitHub](#pushing-to-github)
3. [Deploying to Vercel](#deploying-to-vercel)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Post-Deployment Steps](#post-deployment-steps)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is tested and working locally
- [ ] `.env.local` is NOT committed (already in `.gitignore`)
- [ ] All sensitive data is removed from code
- [ ] README.md is updated
- [ ] Dependencies are installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)

---

## 📤 Pushing to GitHub

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Check current status
git status
```

### Step 2: Add All Files

```bash
# Add all files to staging
git add .

# Verify what will be committed
git status
```

### Step 3: Create Initial Commit

```bash
# Create first commit
git commit -m "Initial commit: E-commerce Admin Dashboard

- Complete CRUD operations for products
- Multi-step form with Zod validation
- Interactive data visualization
- Secure authentication with NextAuth.js
- Cloudinary image upload
- Modern UI with glassmorphism design
- Server-side rendering with Next.js 14"

# Or use a shorter message
git commit -m "Initial commit: E-commerce Admin Dashboard"
```

### Step 4: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository:**
   - Click the **"+"** icon → **"New repository"**
   - Repository name: `ecommerce-admin-dashboard` (or your preferred name)
   - Description: `Modern e-commerce product management dashboard built with Next.js, TypeScript, and MongoDB`
   - Visibility: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

3. **Copy Repository URL:**
   - Copy the repository URL (HTTPS or SSH)
   - Example: `https://github.com/yourusername/ecommerce-admin-dashboard.git`

### Step 5: Connect and Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/ecommerce-admin-dashboard.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you get authentication errors:**

**Option 1: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

**Option 2: Use GitHub CLI**
```bash
# Install GitHub CLI (if not installed)
# Then authenticate
gh auth login

# Push using CLI
git push -u origin main
```

---

## 🌐 Deploying to Vercel (Recommended)

Vercel is the best platform for Next.js applications. It offers:
- ✅ Automatic deployments
- ✅ Free tier with generous limits
- ✅ Built-in CI/CD
- ✅ Environment variable management
- ✅ Custom domains

### Step 1: Prepare for Deployment

1. **Build locally to test:**
   ```bash
   npm run build
   ```

2. **Verify build succeeds:**
   - Should see "Build completed successfully"
   - No errors in the output

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - Project name? `ecommerce-admin-dashboard`
   - Directory? `./` (current directory)
   - Override settings? **No**

5. **Production deployment:**
   ```bash
   vercel --prod
   ```

**Option B: Using Vercel Dashboard**

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project:**
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repository
   - Select the repository you just pushed

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Environment Variables:**
   - Add all environment variables (see next section)
   - Click **"Deploy"**

---

## 🔐 Environment Variables Setup

### Required Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | `your-secret-key` | Generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | `your-api-key` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | From Cloudinary dashboard |

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** Variable name (e.g., `MONGODB_URI`)
   - **Value:** Variable value
   - **Environment:** Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** the project for changes to take effect

### Generate NEXTAUTH_SECRET

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` to your Vercel URL:
- Example: `https://ecommerce-admin-dashboard.vercel.app`

---

## 🔄 Post-Deployment Steps

### 1. Verify Deployment

1. Visit your Vercel deployment URL
2. Test sign-in with default credentials
3. Verify all features work:
   - ✅ Dashboard loads
   - ✅ Products list displays
   - ✅ Create product works
   - ✅ Image upload works
   - ✅ Charts display correctly

### 2. Create First Admin

Since the database is fresh, create the first admin:

**Option 1: Using MongoDB Atlas**
- Connect to your MongoDB database
- Run the admin creation script or manually create a user

**Option 2: Using API (after first admin)**
- Use the onboarding page at `/admin/onboard`

### 3. Update Default Credentials

⚠️ **Important:** Change default admin credentials in production!

1. Sign in with default credentials
2. Create a new admin with secure password
3. Delete or update the default admin account

### 4. Set Up Custom Domain (Optional)

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to custom domain

---

## 🔧 Alternative Deployment Platforms

### Netlify

1. **Connect GitHub:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click **"New site from Git"**

2. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables

3. **Deploy**

### AWS Amplify

1. **Connect Repository:**
   - Go to AWS Amplify Console
   - Connect GitHub repository

2. **Configure:**
   - Build settings: Auto-detect Next.js
   - Add environment variables

3. **Deploy**

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
  // ... rest of config
}
```

---

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Error: TypeScript errors**
```bash
# Check tsconfig.json
# Ensure all types are properly defined
```

### Deployment Fails

**Error: Environment variables missing**
- Verify all required variables are set in Vercel
- Check variable names match exactly
- Redeploy after adding variables

**Error: MongoDB connection failed**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

**Error: NextAuth secret error**
- Generate new secret: `openssl rand -base64 32`
- Update `NEXTAUTH_SECRET` in Vercel
- Redeploy

### Runtime Errors

**Error: Images not loading**
- Verify Cloudinary credentials
- Check `next.config.js` image domains
- Ensure images are uploaded correctly

**Error: Authentication not working**
- Verify `NEXTAUTH_URL` matches deployment URL
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and retry

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable in Vercel Dashboard → Project → Analytics
2. View real-time metrics
3. Monitor performance

### Error Tracking

Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Built-in analytics

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change default admin credentials
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Review MongoDB access controls
- [ ] Set up rate limiting (if needed)
- [ ] Enable CORS restrictions
- [ ] Review API endpoints security
- [ ] Set up monitoring and alerts

---

## 📝 Quick Commands Reference

```bash
# Git commands
git init
git add .
git commit -m "Your message"
git remote add origin <repo-url>
git push -u origin main

# Build and test
npm run build
npm start

# Vercel deployment
vercel login
vercel
vercel --prod

# Environment
openssl rand -base64 32  # Generate secret
```

---

## 🎉 Success!

Once deployed, your dashboard will be available at:
- **Vercel URL:** `https://your-project.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)

**Next Steps:**
1. Test all features
2. Create production admin account
3. Share with your team
4. Monitor performance
5. Iterate and improve!

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Guides](https://guides.github.com/)

---

**Status:** ✅ Ready for Deployment!

