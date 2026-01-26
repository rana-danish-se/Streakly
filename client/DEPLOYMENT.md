# Frontend Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Backend Deployed**: Ensure your backend is deployed and accessible
3. **Environment Variables**: Have the following ready:
   - Backend API URL
   - Google OAuth Client ID

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Set Environment Variables

In your Vercel project settings, add:

```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `client` folder as the root directory
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variables
8. Click **Deploy**

### 4. Deploy via CLI (Alternative)

```bash
cd client
vercel --prod
```

## Post-Deployment

### Update Backend CORS

Ensure your backend's `CLIENT_URL` environment variable includes your deployed frontend URL:

```
CLIENT_URL=https://your-frontend.vercel.app
```

### Test Checklist

- [ ] Application loads correctly
- [ ] All routes work (SPA routing)
- [ ] Login/Register works
- [ ] Google OAuth works
- [ ] Journeys load without 401 errors
- [ ] Quote of the Day displays
- [ ] Push notifications can be enabled
- [ ] Service worker registers successfully

## Troubleshooting

### 401 Errors
- Verify `VITE_API_URL` is set correctly
- Check backend CORS configuration
- Ensure backend is deployed and accessible

### Service Worker Issues
- Check browser console for errors
- Verify `vercel.json` is in the client folder
- Clear browser cache and re-register

### Environment Variables Not Loading
- Rebuild the application after adding variables
- Variables must start with `VITE_` prefix
- Check Vercel deployment logs
