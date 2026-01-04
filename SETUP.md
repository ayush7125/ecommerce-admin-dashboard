# Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for image storage

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce-db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Important:**
- Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
  ```bash
  openssl rand -base64 32
  ```
- Get your Cloudinary credentials from [Cloudinary Dashboard](https://cloudinary.com/console)

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ecommerce-db`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`

### 4. Create the First Admin User

Since the onboarding page requires admin authentication, create the first admin:

```bash
# Make sure MONGODB_URI is set in .env.local
npx ts-node scripts/create-admin.ts
```

Follow the prompts to enter admin details.

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Access the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the sign-in page
3. Sign in with the admin credentials you created
4. You'll be redirected to the dashboard

## Features Overview

### Dashboard (`/admin/dashboard`)
- Overview statistics (total products, stock, sales, low stock alerts)
- Interactive charts:
  - Products by category (pie chart)
  - Top selling products (bar chart)
  - Sales by category (bar chart)

### Products Management (`/admin/products`)
- View all products with pagination
- Search and filter products
- Edit and delete products
- Create new products

### Create Product (`/admin/products/new`)
- Multi-step form:
  1. Basic Information (name, description, category, brand, SKU)
  2. Pricing & Inventory (price, stock, sales)
  3. Images (upload multiple images via Cloudinary)

### Admin Onboarding (`/admin/onboard`)
- Create new admin accounts (admin-only access)
- Secure form with validation

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running (for local)
- Verify network access (for Atlas)

### Cloudinary Upload Issues
- Verify all Cloudinary credentials are correct
- Check image file size (max 5MB)
- Ensure image format is supported

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your application URL
- Clear browser cookies and try again

### Build Errors
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall dependencies
- Check Node.js version (requires 18+)

## Production Deployment

1. Set environment variables in your hosting platform
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for admin accounts
- Regularly rotate `NEXTAUTH_SECRET` in production
- Enable HTTPS in production
- Consider implementing rate limiting for API routes

