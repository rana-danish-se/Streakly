import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { SiGoogle } from 'react-icons/si';
import { GoogleLogin } from '@react-oauth/google';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { register: registerUser, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One number or symbol', met: /[\d!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
    { text: 'Lowercase & uppercase', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Valid email is required');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    setIsLoading(false);

    if (result.success) {
      toast.success('Please verify your account');
      navigate(`/otp-verification?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const result = await googleLogin(credentialResponse.credential, 'signup');
      setIsLoading(false);

      if (result.success) {
        toast.success('Account created successfully! Welcome to Streakly 🎉');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Google sign up failed. Please try again.');
      }
    } catch {
      setIsLoading(false);
      toast.error('Google sign up failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign up failed. Please try again.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--success)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md relative z-10"
      >
        <div 
          className="rounded-3xl p-8 shadow-2xl"
          style={{ 
            backgroundColor: 'var(--card)',
            border: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
        >
          {/* Header with Back Button and Logo */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <motion.button 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowRight className="w-5 h-5 rotate-180" />
              </motion.button>
            </Link>
            
            <img 
              src={theme === 'dark' ? darkLogo : lightLogo} 
              alt="Streakly Logo" 
              className="h-12 w-auto" 
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Sign Up
          </h1>
          
          <p className="mb-8 opacity-70" style={{ color: 'var(--text)' }}>
            Start tracking your learning journey today
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <FiUser className="w-5 h-5" style={{ color: 'var(--text)' }} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: 'var(--text)'
                }}
              />
              {formData.name && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success)' }}>
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <FiMail className="w-5 h-5" style={{ color: 'var(--text)' }} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: 'var(--text)'
                }}
              />
              {formData.email && formData.email.includes('@') && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success)' }}>
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <FiLock className="w-5 h-5" style={{ color: 'var(--text)' }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: 'var(--text)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                style={{ color: 'var(--text)' }}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2 pl-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <FiCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
                    ) : (
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0" 
                        style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                      />
                    )}
                    <span 
                      className="opacity-70"
                      style={{ color: req.met ? 'var(--success)' : 'var(--text)' }}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <FiLock className="w-5 h-5" style={{ color: 'var(--text)' }} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: 'var(--text)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                style={{ color: 'var(--text)' }}
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign Up
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <span className="text-sm opacity-50" style={{ color: 'var(--text)' }}>Or continue with</span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          </div>

          {/* Google Sign In */}
          <div className="w-full" style={{ 
            filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
            />
          </div>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-sm opacity-70" style={{ color: 'var(--text)' }}>
            Already have an account?{' '}
            <Link to="/login">
              <span className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
