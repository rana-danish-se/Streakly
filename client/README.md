# Streakly Frontend

React + Vite frontend application for Streakly learning progress tracker.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will run on [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```

## 📦 Dependencies

### Core
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **React DatePicker** - Date selection component

### Utilities
- **date-fns** - Date manipulation library

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts (auth, theme)
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json
```

## 🎨 Tailwind Configuration

- **Dark Mode**: Class-based (`class` strategy)
- **Custom Colors**: Primary, success, warning, danger
- **Custom Animations**: Fade in, slide up/down
- **Component Classes**: `.btn-primary`, `.input-field`, `.card`

## 🔧 Vite Configuration

- **Dev Server Port**: 5173
- **API Proxy**: `/api` → `http://localhost:5000`
- **HMR**: Enabled for fast refresh

## 🌐 API Integration

The app uses Axios with:
- Base URL: `/api` (proxied to backend)
- Credentials: Enabled (for JWT cookies)
- Auto 401 handling: Redirects to login

## 🎯 Next Steps

1. Create authentication context
2. Build login/register pages
3. Create dashboard layout
4. Implement journey management
5. Add topic tracking features
6. Build streak visualization

## 📝 Notes

- Backend must be running on port 5000
- JWT tokens are stored in httpOnly cookies
- Dark mode toggle coming soon
