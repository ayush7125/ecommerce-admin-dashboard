# Quick Test Checklist

Follow this checklist to quickly verify all features are working.

## 🔐 Authentication Tests

### Test 1: Sign In
- [ ] Go to http://localhost:3000
- [ ] Redirected to sign-in page
- [ ] Enter: `admin@example.com` / `admin123`
- [ ] Successfully logged in
- [ ] Redirected to dashboard

### Test 2: Logout
- [ ] Click "Logout" button
- [ ] Redirected to sign-in page
- [ ] Cannot access admin pages

### Test 3: Route Protection
- [ ] While logged out, try: http://localhost:3000/admin/dashboard
- [ ] Automatically redirected to sign-in

---

## 📦 Product Management Tests

### Test 4: Create Product
- [ ] Click "New Product"
- [ ] **Step 1:** Fill Basic Information
  - [ ] Name: `Test Product`
  - [ ] Description: `Test description (min 10 chars)`
  - [ ] Category: `Electronics`
  - [ ] SKU: `TEST-001`
  - [ ] Click "Next"
- [ ] **Step 2:** Fill Pricing
  - [ ] Price: `99.99`
  - [ ] Stock: `50`
  - [ ] Click "Next"
- [ ] **Step 3:** Upload Image (optional)
  - [ ] Upload an image (if Cloudinary configured)
  - [ ] Or skip this step
- [ ] Click "Create Product"
- [ ] Product appears in Products list

### Test 5: View Products
- [ ] Go to "Products" page
- [ ] See list of products
- [ ] Product details visible (name, price, stock)

### Test 6: Search Products
- [ ] Enter search term in search box
- [ ] Click "Search"
- [ ] Results filtered correctly

### Test 7: Edit Product
- [ ] Click "Edit" on any product
- [ ] Form pre-filled with product data
- [ ] Change some values
- [ ] Click "Update Product"
- [ ] Changes saved

### Test 8: Delete Product
- [ ] Click "Delete" on a product
- [ ] Confirm deletion
- [ ] Product removed from list

---

## 📊 Dashboard & Charts Tests

### Test 9: Dashboard Statistics
- [ ] Go to Dashboard
- [ ] See 4 stat cards:
  - [ ] Total Products
  - [ ] Total Stock
  - [ ] Total Sales
  - [ ] Low Stock

### Test 10: Charts Display
- [ ] **Pie Chart:** "Products by Category" visible
- [ ] **Bar Chart:** "Top Selling Products" visible
- [ ] **Bar Chart:** "Sales by Category" visible
- [ ] Charts are interactive (hover shows data)

### Test 11: Create Test Data for Charts
Create products with:
- [ ] Different categories (Electronics, Clothing, Books)
- [ ] Different sales numbers (10, 50, 100)
- [ ] Refresh dashboard
- [ ] Charts update with new data

---

## 🖼️ Image Upload Tests (if Cloudinary configured)

### Test 12: Upload Image
- [ ] Go to "New Product" → Step 3
- [ ] Click "Choose File"
- [ ] Select an image (JPG/PNG)
- [ ] Image uploads successfully
- [ ] Preview appears
- [ ] Can remove image (X button)

### Test 13: Image Validation
- [ ] Try uploading non-image file → Error shown
- [ ] Try uploading >5MB file → Error shown

---

## 👥 Admin Onboarding Tests

### Test 14: Access Onboarding Page
- [ ] Click "Onboard Admin" in navigation
- [ ] Page accessible (admin-only)

### Test 15: Create New Admin
- [ ] Fill form:
  - [ ] Name: `New Admin`
  - [ ] Email: `newadmin@example.com`
  - [ ] Password: `admin456`
- [ ] Click "Create Admin Account"
- [ ] Success message appears
- [ ] Can sign in with new credentials

---

## ✅ Form Validation Tests

### Test 16: Validation Errors
- [ ] Try submitting empty form → Errors shown
- [ ] Try invalid SKU (lowercase) → Error shown
- [ ] Try negative price → Error shown
- [ ] Try description < 10 chars → Error shown

### Test 17: Step Navigation
- [ ] Fill Step 1, click "Next" → Works
- [ ] Click "Previous" → Returns to Step 1
- [ ] Data preserved when navigating

---

## 📱 Responsive Design Tests

### Test 18: Mobile View
- [ ] Resize browser to mobile size
- [ ] Navigation works
- [ ] Forms usable
- [ ] Charts responsive

---

## 🎯 Quick Verification (5 minutes)

**Minimum Test:**
1. ✅ Sign in works
2. ✅ Can create a product
3. ✅ Dashboard shows charts
4. ✅ Can edit/delete product
5. ✅ Logout works

If all 5 pass → **Site is working!** ✅

---

## 🐛 Troubleshooting

**If something doesn't work:**
1. Check browser console (F12) for errors
2. Check MongoDB connection
3. Check environment variables in `.env.local`
4. See detailed guide in `TESTING_GUIDE.md`

---

**Status:** ☐ All Tests Pass | ☐ Some Issues Found

