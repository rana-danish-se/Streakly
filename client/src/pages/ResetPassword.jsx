import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One number or symbol', met: /[\d!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: 'Lowercase & uppercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(token, password);
    
    setIsLoading(false);

    if (result.success) {
      toast.success('Password reset successfully! Logging you in...');
      setTimeout(() => {
          navigate('/dashboard');
      }, 1500);
    } else {
      toast.error(result.error || 'Failed to reset password. Link may be expired.');
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
          {/* Header with Logo */}
          <div className="flex items-center justify-center mb-6">
            <img 
              src={theme === 'dark' ? darkLogo : lightLogo} 
              alt="Streakly Logo" 
              className="h-12 w-auto" 
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Reset Password
          </h1>
          
          <p className="mb-8 opacity-70" style={{ color: 'var(--text)' }}>
            Please enter your new password below.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <FiLock className="w-5 h-5" style={{ color: 'var(--text)' }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
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
            {password && (
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
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
                  Reset Password
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
          
           {/* Back to Login Link */}
          <div className="text-center mt-6">
             <Link to="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                Back to Login
             </Link>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
