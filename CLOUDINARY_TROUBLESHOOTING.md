# 🔧 Cloudinary Upload Error Troubleshooting

## Current Error

```
Cloudinary upload stream error: {
  message: `Server return invalid JSON response. Status Code 500. 
  SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`,
  http_code: 500
}
```

## What This Means

Cloudinary is returning an **HTML error page** (500) instead of JSON. This typically indicates:

1. **Invalid Cloudinary Credentials** - API key/secret are wrong
2. **Cloudinary Account Issues** - Account suspended, billing issues, or limits exceeded
3. **Network/Firewall Issues** - Vercel can't reach Cloudinary
4. **Cloudinary Service Outage** - Temporary Cloudinary API issues

## Solutions

### 1. Verify Cloudinary Credentials in Vercel

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these variables are set correctly:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

**How to Get Correct Values:**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in to your account
3. Go to **Settings** (gear icon)
4. Copy:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET` (click "Reveal")

### 2. Check Cloudinary Account Status

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Check for any warnings or account issues
3. Verify your account is active (not suspended)
4. Check billing status if on paid plan
5. Verify you haven't exceeded usage limits

### 3. Test Cloudinary Credentials

You can test if your credentials work by running this in Node.js:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', 
  { folder: 'test' },
  (error, result) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', result.secure_url);
    }
  }
);
```

### 4. Common Issues & Fixes

#### Issue: Credentials Changed
**Fix:** Update environment variables in Vercel and redeploy

#### Issue: Account Suspended
**Fix:** Contact Cloudinary support or check billing

#### Issue: Wrong Cloud Name
**Fix:** Ensure cloud name matches exactly (case-sensitive)

#### Issue: API Secret Regenerated
**Fix:** If you regenerated the API secret, update it in Vercel

### 5. Update Environment Variables in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. For each Cloudinary variable:
   - Click the variable
   - Update the value
   - Save
3. **Redeploy** the project (or wait for automatic redeploy)

### 6. Verify After Update

1. Wait for Vercel to redeploy
2. Try uploading an image again
3. Check Vercel function logs for any new errors

## Error Codes Reference

- **401** - Authentication failed (wrong API key/secret)
- **400** - Bad request (invalid parameters)
- **500** - Server error (account issues, service problems)
- **403** - Forbidden (account suspended, billing issues)

## Prevention

1. **Never commit** `.env.local` to Git (already in `.gitignore`)
2. **Always verify** credentials in Vercel after changes
3. **Monitor** Cloudinary dashboard for account status
4. **Test** credentials locally before deploying

## Status

✅ **Error handling improved** - Better error messages will help identify the issue
✅ **Validation added** - Credentials are now validated before use
✅ **Timeout added** - 60 second timeout to prevent hanging

---

**Next Steps:**
1. Verify Cloudinary credentials in Vercel
2. Check Cloudinary account status
3. Update credentials if needed
4. Redeploy and test

