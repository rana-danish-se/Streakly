# Streakly Backend - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- MongoDB Atlas account with a cluster set up
- Cloudinary account for image uploads
- Google OAuth credentials
- VAPID keys for push notifications (can generate using web-push library)

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. For production deployment (Vercel), you'll need to add these as environment variables in your Vercel dashboard.

### Required Environment Variables:

1. **Server**
   - `PORT` - Server port (default: 5000)
   - `NODE_ENV` - Environment (production/development)

2. **Database**
   - `MONGODB_URI` - MongoDB connection string

3. **Authentication**
   - `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
   - `JWT_EXPIRE` - Token expiration time (e.g., 7d)

4. **CORS**
   - `CLIENT_URL` - Your frontend URL

5. **File Uploads**
   - `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary API secret

6. **Push Notifications**
   - `VAPID_PUBLIC_KEY` - VAPID public key
   - `VAPID_PRIVATE_KEY` - VAPID private key
   - `VAPID_SUBJECT` - Contact email (mailto:your-email@domain.com)

7. **Google OAuth**
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

8. **Email**
   - `SENDER_EMAIL` - Sender email address
   - `MAIL_USERNAME` - Email account username
   - `MAIL_PASSWORD` - Email account password (use app-specific password)

## Deploying to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Set Environment Variables
Go to your Vercel dashboard → Project Settings → Environment Variables and add all variables from `.env.example`.

### 5. Redeploy
After setting environment variables:
```bash
vercel --prod
```

## Cron Jobs

The application includes two cron jobs configured in `vercel.json`:
- **Daily Run** - Runs at 12:00 PM daily
- **Daily Task Reminder** - Runs every 30 minutes

These will automatically run on Vercel.

## Post-Deployment

1. **Update Frontend**: Make sure your frontend's API URL points to your deployed backend
2. **Test Endpoints**: Visit `https://your-backend.vercel.app/api/health` to verify deployment
3. **CORS**: Ensure your frontend URL is in the allowed origins list
4. **Database**: Verify MongoDB connection
5. **Cloudinary**: Test image upload functionality
6. **Push Notifications**: Test notification subscriptions

## Troubleshooting

- **CORS Errors**: Verify `CLIENT_URL` is set correctly and matches your frontend domain
- **Database Connection**: Check MongoDB URI and network access settings
- **500 Errors**: Check Vercel function logs for detailed error messages
- **Cron Jobs**: Verify they're running in Vercel dashboard → Deployments → Functions

## Security Checklist

- ✅ All environment variables are set in Vercel (not in code)
- ✅ `.env` file is in `.gitignore`
- ✅ JWT_SECRET is strong and random
- ✅ MongoDB has proper network access rules
- ✅ CORS is configured with specific origins (not *)
- ✅ Rate limiting is implemented (if needed)
- ✅ Input validation is in place

## Monitoring

- Monitor function logs in Vercel dashboard
- Set up error tracking (optional: Sentry, LogRocket)
- Monitor MongoDB Atlas performance
- Check Cloudinary usage

## Support

For issues, check:
1. Vercel function logs
2. MongoDB Atlas logs
3. Cloudinary dashboard
4. Browser console for CORS/network errors
