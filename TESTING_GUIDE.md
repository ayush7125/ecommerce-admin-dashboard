# Testing Guide - E-commerce Admin Dashboard

This guide will help you systematically test all features to ensure they work according to requirements.

## Prerequisites

1. ✅ Development server is running (`npm run dev`)
2. ✅ MongoDB is connected and working
3. ✅ Admin user is created (email: `admin@example.com`, password: `admin123`)
4. ✅ Environment variables are configured in `.env.local`

---

## Test 1: Authentication & Authorization ✅

### 1.1 Test Sign-In
**Steps:**
1. Open http://localhost:3000
2. You should be redirected to `/auth/signin`
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click "Sign in"

**Expected Result:**
- ✅ Redirected to `/admin/dashboard`
- ✅ Navigation bar shows "Admin User (admin)"
- ✅ Logout button is visible

### 1.2 Test Logout
**Steps:**
1. Click the "Logout" button in the navigation bar
2. Observe the redirect

**Expected Result:**
- ✅ Redirected to `/auth/signin`
- ✅ Session is cleared
- ✅ Cannot access admin pages without signing in again

### 1.3 Test Route Protection
**Steps:**
1. While logged out, try to access:
   - http://localhost:3000/admin/dashboard
   - http://localhost:3000/admin/products
   - http://localhost:3000/admin/onboard
2. Observe the behavior

**Expected Result:**
- ✅ All admin routes redirect to `/auth/signin`
- ✅ Cannot access protected pages without authentication

---

## Test 2: Server-Side Rendering (SSR) ✅

### 2.1 Test Dashboard SSR
**Steps:**
1. Sign in as admin
2. Navigate to Dashboard
3. Open browser DevTools (F12)
4. Go to Network tab
5. Refresh the page
6. Check the initial HTML response

**Expected Result:**
- ✅ Initial HTML contains data (not just loading states)
- ✅ Page loads quickly with data already rendered
- ✅ No blank screen before data loads

### 2.2 Test Products Page SSR
**Steps:**
1. Navigate to Products page
2. Check Network tab in DevTools
3. View page source (Ctrl+U)

**Expected Result:**
- ✅ Products data is fetched on server
- ✅ Page renders with data immediately
- ✅ Fast initial page load

---

## Test 3: Product Management (CRUD) ✅

### 3.1 CREATE - Add New Product
**Steps:**
1. Click "New Product" in navigation
2. **Step 1 - Basic Information:**
   - Enter Product Name: `Test Product`
   - Enter Description: `This is a test product description`
   - Enter Category: `Electronics`
   - Enter Brand: `TestBrand`
   - Enter SKU: `TEST-001`
   - Click "Next"
3. **Step 2 - Pricing & Inventory:**
   - Enter Price: `99.99`
   - Enter Stock: `50`
   - Click "Next"
4. **Step 3 - Images:**
   - Upload at least one image (if Cloudinary is configured)
   - Or skip if Cloudinary not set up
   - Click "Create Product"

**Expected Result:**
- ✅ Form validation works (try submitting empty fields)
- ✅ Multi-step navigation works (Previous/Next buttons)
- ✅ Product is created successfully
- ✅ Redirected to Products page
- ✅ New product appears in the list

### 3.2 READ - View Products
**Steps:**
1. Navigate to Products page
2. Observe the product list

**Expected Result:**
- ✅ Products are displayed in a list
- ✅ Product details are visible (name, price, stock, etc.)
- ✅ Images are displayed (if uploaded)
- ✅ Pagination works (if more than 10 products)

### 3.3 Search & Filter
**Steps:**
1. On Products page, use the search box
2. Enter a product name or SKU
3. Use category filter
4. Click "Search"

**Expected Result:**
- ✅ Search filters products correctly
- ✅ Category filter works
- ✅ Results update dynamically

### 3.4 UPDATE - Edit Product
**Steps:**
1. On Products page, click "Edit" on any product
2. Modify product details:
   - Change name
   - Update price
   - Change stock quantity
3. Navigate through steps
4. Click "Update Product"

**Expected Result:**
- ✅ Form is pre-filled with existing data
- ✅ Can navigate between steps
- ✅ Changes are saved
- ✅ Redirected to Products page
- ✅ Updated data is reflected

### 3.5 DELETE - Remove Product
**Steps:**
1. On Products page, click "Delete" on a product
2. Confirm deletion in the popup

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Product is deleted
- ✅ Product removed from list
- ✅ Images are deleted from Cloudinary (if configured)

---

## Test 4: Multi-Step Form Validation ✅

### 4.1 Test Form Validation
**Steps:**
1. Go to "New Product"
2. Try to submit with empty fields
3. Try invalid inputs:
   - SKU with lowercase letters (should be uppercase)
   - Negative price
   - Negative stock
   - Description less than 10 characters
   - No images in step 3

**Expected Result:**
- ✅ Validation errors appear for each field
- ✅ Cannot proceed to next step with invalid data
- ✅ Error messages are clear and helpful
- ✅ SKU is automatically converted to uppercase

### 4.2 Test Step Navigation
**Steps:**
1. Fill Step 1 correctly, click "Next"
2. Fill Step 2 correctly, click "Next"
3. Fill Step 3, click "Previous"
4. Go back and forth between steps

**Expected Result:**
- ✅ Can navigate forward and backward
- ✅ Data is preserved when navigating
- ✅ Step indicator shows current step
- ✅ Cannot skip steps

---

## Test 5: Data Visualization (Charts) ✅

### 5.1 Test Dashboard Charts
**Steps:**
1. Create at least 3-5 products with different categories
2. Set different sales numbers for products
3. Navigate to Dashboard
4. Observe the charts

**Expected Result:**
- ✅ **Stats Cards:** Show correct totals (Products, Stock, Sales, Low Stock)
- ✅ **Pie Chart:** "Products by Category" displays categories
- ✅ **Bar Chart:** "Top Selling Products" shows top 5 products
- ✅ **Bar Chart:** "Sales by Category" shows sales per category
- ✅ Charts are interactive (hover shows tooltips)
- ✅ Charts are responsive (resize browser window)

### 5.2 Test Real-Time Updates
**Steps:**
1. Open Dashboard
2. In another tab, create/edit a product
3. Wait 30 seconds or refresh Dashboard

**Expected Result:**
- ✅ Stats update automatically (React Query refetch)
- ✅ Charts reflect new data

---

## Test 6: Image Upload (Cloudinary) ✅

### 6.1 Test Image Upload
**Prerequisites:** Cloudinary credentials must be in `.env.local`

**Steps:**
1. Go to "New Product" or "Edit Product"
2. In Step 3, click "Choose File"
3. Select an image file (JPG, PNG, etc.)
4. Wait for upload
5. Observe the preview

**Expected Result:**
- ✅ Image uploads successfully
- ✅ Image preview appears
- ✅ Can upload multiple images
- ✅ Can remove images (X button)
- ✅ File size validation (max 5MB)
- ✅ File type validation (images only)

### 6.2 Test Image Display
**Steps:**
1. View Products page
2. Check if product images are displayed

**Expected Result:**
- ✅ Images load correctly
- ✅ Images are optimized (Next.js Image component)
- ✅ Images are responsive

---

## Test 7: Admin Onboarding ✅

### 7.1 Test Admin Onboarding Access
**Steps:**
1. While logged in as admin, navigate to "Onboard Admin"
2. Observe the page

**Expected Result:**
- ✅ Page is accessible
- ✅ Form is displayed
- ✅ Can see "Onboard Admin" in navigation

### 7.2 Test Create New Admin
**Steps:**
1. On Onboard Admin page, fill the form:
   - Name: `New Admin`
   - Email: `newadmin@example.com`
   - Password: `admin456`
2. Click "Create Admin Account"

**Expected Result:**
- ✅ Form validation works
- ✅ Admin account is created
- ✅ Success message appears
- ✅ Can sign in with new admin credentials

### 7.3 Test Admin-Only Access
**Steps:**
1. Try to access `/admin/onboard` while logged out
2. Try to access via direct URL

**Expected Result:**
- ✅ Redirected to sign-in page
- ✅ Cannot access without admin role

---

## Test 8: Additional Features ✅

### 8.1 Test Responsive Design
**Steps:**
1. Open Dashboard in browser
2. Resize browser window (mobile, tablet, desktop sizes)
3. Test on different screen sizes

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ Navigation works on mobile
- ✅ Charts are responsive
- ✅ Forms are usable on all devices

### 8.2 Test Error Handling
**Steps:**
1. Disconnect MongoDB temporarily
2. Try to access Dashboard
3. Try to create a product

**Expected Result:**
- ✅ Error messages are displayed
- ✅ Application doesn't crash
- ✅ User-friendly error handling

### 8.3 Test Performance
**Steps:**
1. Open browser DevTools
2. Go to Performance tab
3. Record page load
4. Check load times

**Expected Result:**
- ✅ Fast initial page load (SSR benefit)
- ✅ Smooth interactions
- ✅ No lag when navigating

---

## Quick Test Checklist

Use this checklist for a quick verification:

- [ ] Can sign in with admin credentials
- [ ] Can sign out successfully
- [ ] Dashboard loads with data (SSR)
- [ ] Can create a new product (multi-step form)
- [ ] Form validation works correctly
- [ ] Can view products list
- [ ] Can search and filter products
- [ ] Can edit a product
- [ ] Can delete a product
- [ ] Charts display on dashboard
- [ ] Can upload images (if Cloudinary configured)
- [ ] Can onboard new admin
- [ ] Protected routes work correctly
- [ ] Responsive design works

---

## Common Issues & Solutions

### Issue: Cannot sign in
**Solution:** 
- Check MongoDB connection
- Verify admin user exists: `node scripts/create-default-admin.js`

### Issue: Images not uploading
**Solution:**
- Check Cloudinary credentials in `.env.local`
- Verify file size is under 5MB
- Check file type is an image

### Issue: Charts not showing
**Solution:**
- Create some products first
- Set sales numbers for products
- Check browser console for errors

### Issue: Form validation not working
**Solution:**
- Check browser console for errors
- Verify all required fields are filled
- Check Zod schema in `lib/validations.ts`

---

## Test Data Suggestions

To thoroughly test, create test data:

1. **Products with different categories:**
   - Electronics (3 products)
   - Clothing (2 products)
   - Books (2 products)

2. **Products with different stock levels:**
   - High stock (100+)
   - Low stock (< 10)
   - Out of stock (0)

3. **Products with different sales:**
   - High sellers (100+ sales)
   - Medium sellers (50 sales)
   - Low sellers (10 sales)

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ All features work as expected
✅ UI is responsive and user-friendly
✅ Performance is acceptable
✅ Security is maintained (protected routes)

---

**Happy Testing! 🚀**

