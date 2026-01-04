# 📤 GitHub Push Instructions

Quick guide to push your code to GitHub.

## Step-by-Step Instructions

### 1. Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name:** `ecommerce-admin-dashboard` (or your preferred name)
   - **Description:** `Modern e-commerce product management dashboard built with Next.js, TypeScript, and MongoDB`
   - **Visibility:** Choose **Public** or **Private**
   - **DO NOT** check "Initialize with README" (we already have one)
   - **DO NOT** add .gitignore or license (we already have them)
4. Click **"Create repository"**

### 2. Copy Repository URL

After creating the repository, GitHub will show you the repository URL. Copy it:
- **HTTPS:** `https://github.com/yourusername/ecommerce-admin-dashboard.git`
- **SSH:** `git@github.com:yourusername/ecommerce-admin-dashboard.git`

### 3. Connect and Push

Open your terminal in the project directory and run:

```bash
# Add remote repository (replace with your URL)
git remote add origin https://github.com/yourusername/ecommerce-admin-dashboard.git

# Verify remote was added
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Authentication

If prompted for credentials:

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "E-commerce Dashboard"
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use:
   - Username: Your GitHub username
   - Password: The token you just copied

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI first, then:
gh auth login
git push -u origin main
```

### 5. Verify Push

1. Go to your GitHub repository page
2. You should see all your files
3. Check that `.env.local` is NOT visible (it's in .gitignore)

## ✅ Success!

Your code is now on GitHub! You can:
- View it at: `https://github.com/yourusername/ecommerce-admin-dashboard`
- Share it with others
- Deploy it to Vercel or other platforms

## Next Steps

See `DEPLOYMENT_GUIDE.md` for deployment instructions.

