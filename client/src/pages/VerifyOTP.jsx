import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiMail, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { verifyEmail, resendOTP } = useAuth();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    console.log('VerifyOTP emailParam:', emailParam);
    if (emailParam) {
      setEmail(emailParam);
    } else {
      toast.error('No email found for verification. Please sign up again.');
      navigate('/register');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Filter to last character if multiple chars pasted
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    setIsLoading(true);
    const result = await verifyEmail(email, otpValue);
    setIsLoading(false);

    if (result.success) {
      toast.success('Email verified successfully! Welcome to Streakly 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    const result = await resendOTP(email);
    setResendLoading(false);

    if (result.success) {
      toast.success('New code sent to your email!');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } else {
      toast.error(result.error || 'Failed to resend code');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-3xl shadow-teal-500"
          style={{ backgroundColor: 'var(--primary)' }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 blur-3xl shadow-success-500"
          style={{ backgroundColor: 'var(--success)' }}
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
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
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img 
                src={theme === 'dark' ? darkLogo : lightLogo} 
                alt="Streakly" 
                className="h-12 w-auto mb-6" 
              />
            </Link>
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(0, 128, 128, 0.1)' }}
            >
              <FiMail className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              Verify Your Email
            </h1>
            <p className="text-center opacity-70 px-4" style={{ color: 'var(--text)' }}>
              We've sent a 6-digit verification code to <br />
              <span className="font-semibold text-primary">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 px-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderColor: digit 
                      ? 'var(--primary)' 
                      : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                    color: 'var(--text)'
                  }}
                />
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-teal-500/20"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Verify Account
                  <FiCheckCircle className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              className="flex items-center gap-2 mx-auto font-semibold transition-all disabled:opacity-40"
              style={{ color: 'var(--primary)' }}
            >
              {resendLoading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiRefreshCw className={`w-4 h-4 ${!canResend ? '' : 'animate-pulse'}`} />
              )}
              {canResend ? 'Resend New Code' : `Resend in ${timer}s`}
            </button>
            
            <div className="pt-4 border-t border-dashed" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <Link 
                to="/register" 
                className="text-sm hover:underline opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Use a different email address
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyOTP;
