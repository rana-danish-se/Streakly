import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journeys from './pages/Journeys';
import JourneyDetails from './pages/JourneyDetails';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/journeys" element={<Journeys />} />
        <Route path="/dashboard/journeys/:id" element={<JourneyDetails />} />
      </Routes>
    </AnimatePresence>
  );
}

import NotificationPermission from './components/NotificationPermission';

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AnimatedRoutes />
            <NotificationPermission />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </NotificationProvider>
      </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
