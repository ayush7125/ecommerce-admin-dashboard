# ⚡ Quick Deploy Guide

Fastest way to deploy your e-commerce admin dashboard.

## 🚀 Deploy to Vercel (5 Minutes)

### Prerequisites
- ✅ Code pushed to GitHub
- ✅ Vercel account (free)

### Steps

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click **"Add New"** → **"Project"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project**
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Click **"Deploy"** (skip environment variables for now)

4. **Add Environment Variables**
   - After first deployment, go to **Settings** → **Environment Variables**
   - Add these variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**

6. **Done!**
   - Your app is live at: `https://your-app.vercel.app`

## 🔐 Generate NEXTAUTH_SECRET

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📝 Important Notes

1. **Update NEXTAUTH_URL** after deployment with your actual Vercel URL
2. **MongoDB Atlas:** Whitelist Vercel IPs (0.0.0.0/0 for all)
3. **First Admin:** Create using MongoDB or API after deployment
4. **Default Credentials:** Change in production!

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] App accessible
- [ ] First admin created
- [ ] Default credentials changed

## 🆘 Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

