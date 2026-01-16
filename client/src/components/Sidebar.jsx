import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiBook, 
  FiPlus, 
  FiUser,
  FiChevronDown,
  FiTarget,
  FiStar,
  FiMenu,
  FiX,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from './ThemeToggle';
import JourneyModal from './JourneyModal';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  const recentJourneys = [
    { id: 1, name: 'JavaScript Mastery', progress: 75, color: 'from-teal-500 to-emerald-500', icon: '💻', streak: 12 },
    { id: 2, name: 'Daily Meditation', progress: 90, color: 'from-emerald-500 to-cyan-500', icon: '🧘', streak: 30 },
    { id: 3, name: 'French Learning', progress: 45, color: 'from-cyan-500 to-teal-500', icon: '🇫🇷', streak: 8 },
    { id: 4, name: 'Fitness Journey', progress: 60, color: 'from-teal-600 to-emerald-600', icon: '💪', streak: 15 },
  ];

  const menuItems = [
    { id: 'home', icon: FiHome, label: 'Dashboard', badge: null, path: '/dashboard' },
    { id: 'journeys', icon: FiBook, label: 'My Journeys', badge: '12', path: '/journeys' },
  ];

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.info('Logged out successfully. See you soon! 👋');
      navigate('/login');
    }
  };

  const handleJourneyCreated = (journeyData) => {
    // TODO: Refresh journeys list
    console.log('Journey created:', journeyData);
    // You can add logic here to refresh the journey list
  };

  const sidebarVariants = {
    expanded: { width: '320px' },
    collapsed: { width: '80px' }
  };

  return (
    <>
    <motion.div
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col relative overflow-hidden h-full"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-teal-500/10 dark:via-emerald-500/10 dark:to-cyan-500/10 opacity-50" />
      <motion.div 
        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-teal-500/20 dark:to-emerald-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-emerald-500/20 dark:to-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={() => {
              if (window.innerWidth < 1024) {
                navigate('/dashboard');
              } else {
                setIsExpanded(true);
              }
            }}
            className="flex items-center gap-3 min-w-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-teal-600 dark:via-emerald-600 dark:to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-teal-500/30 relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              {isExpanded ? (
                <img src={logo} alt="Streakly" className="w-8 h-8 relative z-10" />
              ) : (
                <span className="text-2xl font-bold text-white relative z-10">S</span>
              )}
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0"
                >
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent truncate">
                    Streakly
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">Build your habits</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <FiX className="w-5 h-5 text-gray-700 dark:text-slate-50" /> : <FiMenu className="w-5 h-5 text-gray-700 dark:text-slate-50" />}
          </motion.button>
        </div>

        {/* Create Journey Button */}
        <motion.button
          onClick={() => setShowJourneyModal(true)}
          className={`w-full mb-6 ${isExpanded ? 'py-4' : 'py-3'} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-teal-600 dark:via-emerald-600 dark:to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-teal-700 dark:hover:via-emerald-700 dark:hover:to-cyan-700 rounded-2xl text-white font-semibold shadow-lg shadow-blue-500/30 dark:shadow-teal-500/30 flex items-center justify-center gap-2 relative overflow-hidden group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <FiPlus className="w-5 h-5 relative z-10 flex-shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10"
              >
                New Journey
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Navigation Menu */}
        <nav className="mb-6 space-y-1">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                navigate(item.path);
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} px-4 py-3 rounded-xl transition-all duration-300 ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-teal-500/20 dark:to-emerald-500/20 text-blue-600 dark:text-teal-400 shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
              whileHover={{ x: isExpanded ? 5 : 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeMenu === item.id ? 'animate-pulse' : ''}`} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && isExpanded && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-blue-600 dark:bg-teal-500 text-white text-xs font-bold rounded-lg"
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Recent Journeys */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-slate-50 uppercase tracking-wider">
                  Recent Journeys
                </h3>
                <FiStar className="w-4 h-4 text-amber-500" />
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                {recentJourneys.map((journey, index) => (
                  <motion.div
                    key={journey.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 cursor-pointer group hover:shadow-md transition-all border border-gray-200/50 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${journey.color} rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                        {journey.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-slate-50 text-sm truncate">
                          {journey.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <FiTarget className="w-3 h-3 flex-shrink-0" />
                          <span>{journey.progress}% complete</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${journey.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${journey.color} rounded-full`}
                      />
                    </div>
                    
                    {/* Streak Badge */}
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-amber-500/20 rounded-lg">
                        <span className="text-xs">🔥</span>
                        <span className="text-xs font-bold text-orange-600 dark:text-amber-400">
                          {journey.streak} days
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
          {/* Theme Toggle */}
          <div className={`flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <ThemeToggle variant={isExpanded ? 'wide' : 'circle'} showLabel={isExpanded} />
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-teal-500/20 dark:to-emerald-500/20 hover:from-blue-500/20 hover:to-indigo-500/20 dark:hover:from-teal-500/30 dark:hover:to-emerald-500/30 transition-all`}
              whileHover={{ x: isExpanded ? 5 : 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-teal-500 dark:to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-gray-800 dark:text-slate-50 text-sm truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      Pro Member
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {isExpanded && (
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                </motion.div>
              )}
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 text-gray-700 dark:text-slate-50">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 text-gray-700 dark:text-slate-50">
                    <FiSettings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-slate-700" />
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </motion.div>
    
    {/* Journey Creation Modal */}
    <JourneyModal 
      isOpen={showJourneyModal}
      onClose={() => setShowJourneyModal(false)}
      onSuccess={handleJourneyCreated}
    />
  </>
  );
};

export default Sidebar;