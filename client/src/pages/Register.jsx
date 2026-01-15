import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiCheck, FiInstagram, FiAlertCircle } from 'react-icons/fi';
import { SiTiktok, SiGoogle, SiFacebook } from 'react-icons/si';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One number (0-9) or symbol', met: /[\d!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
    { text: 'Lowercase & uppercase (a-z, A-Z)', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    setIsLoading(false);

    if (result.success) {
      toast.success('Account created successfully! Please login to continue 🎉');
      // Redirect to login page (not auto-login)
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      const errorMessage = result.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/30 dark:from-blue-600/20 to-indigo-500/30 dark:to-indigo-600/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-400/20 dark:from-indigo-600/10 to-purple-400/20 dark:to-purple-600/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 relative z-10">
        {/* Left Side - Form */}
        <div className="bg-white dark:bg-gray-800 rounded-l-[3rem] lg:rounded-r-none rounded-r-[3rem] p-10 relative shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300">
                <FiArrowRight className="w-5 h-5 rotate-180 text-gray-900 dark:text-white" />
              </button>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Already member? <Link to="/login"><button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</button></Link>
            </div>
          </div>

          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Streakly Logo" className="h-12 w-auto" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sign Up</h1>
          </div>
          <div className="max-w-md">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Start tracking your learning journey today</p>

            <div className="space-y-3">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {formData.name && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {formData.email && formData.email.includes('@') && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                      )}
                      <span className={req.met ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-type password"
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>

              {/* Sign Up Button */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign Up
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <span className="text-gray-400 dark:text-gray-500 font-medium">Or</span>
                <button className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl flex items-center justify-center transition-colors">
                  <SiFacebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button className="w-12 h-12 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl flex items-center justify-center transition-colors">
                  <SiGoogle className="w-5 h-5 text-red-500 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 rounded-r-[3rem] p-12 relative overflow-hidden shadow-2xl">
          {/* Wavy decoration at top */}
          <div className="absolute top-0 left-0 w-full h-32">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <path d="M0,50 Q125,0 250,50 T500,50 L500,0 L0,0 Z" fill="rgba(255,255,255,0.1)" />
              <path d="M0,80 Q125,30 250,80 T500,80 L500,0 L0,0 Z" fill="rgba(99, 102, 241, 0.3)" />
            </svg>
          </div>

          {/* Floating cards */}
          <div className="relative z-10 h-full flex flex-col justify-center space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0s' }}>
              <div className="text-sm text-orange-500 dark:text-orange-400 font-semibold mb-2">Learning Streaks</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">176 days</div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <svg viewBox="0 0 100 40" className="w-full h-12">
                    <path d="M0,20 Q15,5 25,15 T45,20 Q55,25 65,15 T85,18 Q95,20 100,15" 
                          fill="none" 
                          stroke="#f97316" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                    />
                    <path d="M0,20 Q15,28 25,22 T45,25 Q55,18 65,25 T85,22 Q95,20 100,25" 
                          fill="none" 
                          stroke="#6366f1" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  45
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-end gap-4">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-float" style={{ animationDelay: '0.2s' }}>
                <FiInstagram className="w-7 h-7 text-pink-500" />
              </div>
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-float" style={{ animationDelay: '0.4s' }}>
                <SiTiktok className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
            </div>

            {/* Privacy Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="space-y-2 mb-4">
                    <div className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full w-20"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiLock className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your data, your rules</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your learning progress is private and secure</p>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default Register;