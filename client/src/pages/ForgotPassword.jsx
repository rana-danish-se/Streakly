import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    const result = await forgotPassword(email);
    
    setIsLoading(false);

    if (result.success) {
      setIsSent(true);
      toast.success('Password reset link sent to your email');
    } else {
      toast.error(result.error || 'Failed to send reset link. Please try again.');
    }
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
            <Link to="/login">
              <motion.button 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <img 
              src={theme === 'dark' ? darkLogo : lightLogo} 
              alt="Streakly Logo" 
              className="h-12 w-auto" 
            />
          </div>

          {!isSent ? (
            <>
              {/* Title */}
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                Forgot Password?
              </h1>
              
              <p className="mb-8 opacity-70" style={{ color: 'var(--text)' }}>
                Don't worry! It happens. Please enter the email associated with your account.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                    <FiMail className="w-5 h-5" style={{ color: 'var(--text)' }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      color: 'var(--text)'
                    }}
                  />
                </div>

                {/* Submit Button */}
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
                      Send Code
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
              >
                <FiMail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Check your email</h2>
              <p className="opacity-70 mb-8" style={{ color: 'var(--text)' }}>
                We sent a password reset link to <br/>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{email}</span>
              </p>
              
              <Link to="/login">
                <motion.button
                  className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: 'var(--text)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back to Login
                </motion.button>
              </Link>
              
              <div className="mt-6">
                 <p className="text-sm opacity-60 mb-2" style={{ color: 'var(--text)' }}>
                  Didn't receive the email? 
                </p>
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="text-sm font-semibold hover:underline disabled:opacity-50"
                  style={{ color: 'var(--primary)' }}
                >
                  Click to resend
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
