# Streakly Frontend - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- A deployed backend API (see backend DEPLOYMENT.md)
- Google OAuth credentials configured for your production domain
- Vercel account (or another hosting platform)

## Environment Variables

The frontend uses environment variables prefixed with `VITE_`. Copy `.env.example` to `.env` for local development.

### Required Environment Variables:

1. **VITE_API_URL**
   - **Local**: `http://localhost:5000/api`
   - **Production**: `https://your-backend-url.vercel.app/api`
   - This should point to your deployed backend API

2. **VITE_GOOGLE_CLIENT_ID**
   - Your Google OAuth 2.0 Client ID
   - Must be configured to allow your production domain in Google Cloud Console

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173`

## Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## Deploying to Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # For preview deployment
   vercel

   # For production deployment
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   - `VITE_API_URL` - Your deployed backend URL
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID

6. Click "Deploy"

## Post-Deployment Configuration

### 1. Update Google OAuth Settings

In [Google Cloud Console](https://console.cloud.google.com):
- Go to APIs & Services → Credentials
- Select your OAuth 2.0 Client ID
- Add your Vercel deployment URL to:
  - **Authorized JavaScript origins**: `https://your-app.vercel.app`
  - **Authorized redirect URIs**: `https://your-app.vercel.app`

### 2. Update Backend CORS

Ensure your backend's `CLIENT_URL` environment variable includes your frontend deployment URL.

### 3. Service Worker & PWA

The app includes a service worker for push notifications. After deployment:
- Service worker will be available at `/service-worker.js`
- PWA manifest is at `/manifest.json`
- Users can install the app on supported devices

## Environment-Specific Configuration

The app automatically detects the environment:
- **Development**: Uses local backend (`http://localhost:5000/api`)
- **Production**: Uses `VITE_API_URL` from environment variables

## Vercel Configuration

The `vercel.json` file includes:
- **Rewrites**: SPA routing support
- **Headers**: Security headers and service worker configuration
- **Caching**: Optimized for static assets

## Build Optimization

The Vite config includes:
- **Code splitting**: React and UI libraries are split into separate chunks
- **Tree shaking**: Unused code is removed
- **Minification**: Production builds are minified
- **Source maps**: Disabled in production for smaller bundle size

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
