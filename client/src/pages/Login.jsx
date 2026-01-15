import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck, FiInstagram, FiTrendingUp, FiUsers, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { SiTiktok, SiGoogle, SiFacebook } from 'react-icons/si';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(formData);
    
    setIsLoading(false);

    if (result.success) {
      toast.success('Login successful! Welcome back 🎉');
      navigate('/dashboard');
    } else {
      const errorMessage = result.error || 'Login failed. Please try again.';
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
        <div className="bg-white dark:bg-gray-800 rounded-l-[3rem] lg:rounded-r-none rounded-r-[3rem] p-12 relative shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/">
              <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300">
                <FiArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              New here? <Link to="/register"><button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create account</button></Link>
            </div>
          </div>

          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Streakly Logo" className="h-12 w-auto" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          </div>
          <div className="max-w-md">
            <p className="text-gray-500 dark:text-gray-400 mb-10">Welcome back! Please enter your details</p>

            <div className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

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
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 ${
                    errors.email
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
                  } rounded-2xl focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                />
                {formData.email && formData.email.includes('@') && !errors.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                {errors.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 -mt-2">{errors.email}</p>
              )}

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
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900/50 border-2 ${
                    errors.password
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
                  } rounded-2xl focus:outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 -mt-2">{errors.password}</p>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                    Remember me
                  </span>
                </label>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
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
                      Sign In
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

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Additional Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 border-gray-200 dark:border-gray-600">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3C/svg%3E" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button className="py-3 px-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="text-sm font-semibold text-white">Apple</span>
              </button>
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
            {/* Active Users Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Active Learners</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">8,542</div>
                </div>
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <FiUsers className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-500 font-semibold flex items-center gap-1">
                  <FiTrendingUp className="w-4 h-4" />
                  +12.5%
                </span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
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

            {/* Activity Chart Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">Today's Activity</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">2.4k sessions</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <FiActivity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="h-20">
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,45 Q20,35 40,38 T80,42 Q100,30 120,25 T160,20 Q180,15 200,10" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0,45 Q20,35 40,38 T80,42 Q100,30 120,25 T160,20 Q180,15 200,10 L200,60 L0,60 Z" 
                    fill="url(#gradient)"
                  />
                  {[0, 40, 80, 120, 160, 200].map((x, i) => (
                    <circle 
                      key={i}
                      cx={x} 
                      cy={[45, 38, 42, 25, 20, 10][i]} 
                      r="3" 
                      fill="#8b5cf6"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </svg>
              </div>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Real-time user engagement metrics
              </div>
            </div>

            {/* Success Rate Badge */}
            <div className="flex justify-center">
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">98.5%</div>
                    <div className="text-white/80 text-xs">Success Rate</div>
                  </div>
                </div>
              </div>
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

export default Login;