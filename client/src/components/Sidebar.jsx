import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiBook,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSun,
  FiMoon,
  FiCamera
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getJourneys } from '../services/journeyService';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, uploadProfilePicture } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [journeyCount, setJourneyCount] = useState(0);

  useEffect(() => {
    const fetchJourneyCount = async () => {
      try {
        if (user) {
          const data = await getJourneys('active');
          if (data.success) {
            setJourneyCount(data.data.count || data.data.journeys?.length || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch journey count', error);
      }
    };

    fetchJourneyCount();
  }, [user]);

  // Default user if none provided
  const currentUser = user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: null
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <FiHome className="w-5 h-5" />,
      badge: null,
      path: '/dashboard'
    },
    { 
      id: 'journeys', 
      label: 'My Journeys', 
      icon: <FiBook className="w-5 h-5" />,
      badge: journeyCount > 0 ? journeyCount.toString() : null,
      path: '/dashboard/journeys'
    }
  ];

  const handleTabChange = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const result = await uploadProfilePicture(formData);
      if (result.success) {
        toast.success('Profile picture updated!');
      } else {
        toast.error(result.error || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation(); 
    fileInputRef.current?.click();
  };

  return (
    <>
      <motion.button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: 'var(--card)',
          color: 'var(--text)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <FiMenu className="w-6 h-6" />
      </motion.button>

      <motion.aside
        className="hidden lg:flex flex-col w-80 h-screen border-r z-50 fixed left-0 top-0"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
            <div className="flex flex-col z-50 h-full">
              <motion.div
                className="p-6 border-b flex items-center justify-between"
                style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="flex items-center gap-3 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.img
                    key={theme}
                    src={theme === 'dark' ? darkLogo : lightLogo}
                    alt="Logo"
                    className="h-10 w-auto"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </motion.div>

              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleTabChange(item.path)}
                        className="w-full p-3 rounded-xl flex items-center gap-3 transition-all relative overflow-hidden group"
                        style={{ 
                          backgroundColor: isActive 
                            ? 'var(--primary)' 
                            : 'transparent',
                          color: isActive ? '#FFFFFF' : 'var(--text)'
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ 
                          x: 5,
                          backgroundColor: isActive 
                            ? 'var(--primary)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                            style={{ backgroundColor: '#FFFFFF' }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        <div className={`${isActive ? 'text-white' : ''}`}>
                          {item.icon}
                        </div>

                        <span className="flex-1 text-left font-medium">
                          {item.label}
                        </span>

                        {item.badge && (
                          <motion.span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ 
                              backgroundColor: isActive ? '#FFFFFF' : 'var(--primary)',
                              color: isActive ? 'var(--primary)' : '#FFFFFF'
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            {item.badge}
                          </motion.span>
                        )}

                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}, transparent)`
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              <div 
                className="p-4 border-t space-y-3"
                style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              >
                <motion.button
                  onClick={toggleTheme}
                  className="w-full p-3 rounded-xl flex items-center gap-3 transition-all"
                  style={{ color: 'var(--text)' }}
                  whileHover={{ 
                    x: 5,
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {theme === 'dark' ? (
                      <FiMoon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <FiSun className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                    )}
                  </motion.div>
                  <span className="flex-1 text-left font-medium">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </motion.button>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors"
                    style={{ 
                      backgroundColor: isUserMenuOpen 
                        ? theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                        : 'transparent'
                    }}
                    whileHover={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 relative group overflow-hidden"
                      style={{ backgroundColor: 'var(--primary)' }}
                      onClick={handleAvatarClick}
                    >
                      {currentUser.profilePicture ? (
                        <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(currentUser.name)
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        {isUploading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                          />
                        ) : (
                          <FiCamera className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    <div className="flex-1 text-left overflow-hidden">
                      <div 
                        className="font-semibold truncate text-sm"
                        style={{ color: 'var(--text)' }}
                      >
                        {currentUser.name}
                      </div>
                      <div 
                        className="text-xs opacity-60 truncate"
                        style={{ color: 'var(--text)' }}
                      >
                        {currentUser.email}
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: 'var(--text)' }}
                    >
                      <FiChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden shadow-lg z-50"
                        style={{ 
                          backgroundColor: 'var(--card)',
                          border: '1px solid',
                          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                      >
                        <motion.button
                          onClick={handleLogout}
                          className="w-full p-3 flex items-center gap-3 transition-colors"
                          style={{ color: 'var(--danger)' }}
                          whileHover={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                          }}
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50 flex flex-col"
              style={{ backgroundColor: 'var(--card)' }}
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg z-[60]"
                style={{ color: 'var(--text)' }}
                whileHover={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  rotate: 90
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-6 h-6" />
              </motion.button>

              <div className="flex flex-col z-50 h-full">
                <motion.div
                  className="p-6 border-b"
                  style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    className="flex items-center gap-3 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.img
                      key={theme}
                      src={theme === 'dark' ? darkLogo : lightLogo}
                      alt="Logo"
                      className="h-10 w-auto"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </motion.div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                  <div className="space-y-1">
                    {menuItems.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleTabChange(item.path)}
                          className="w-full p-3 rounded-xl flex items-center gap-3 transition-all relative overflow-hidden group"
                          style={{ 
                            backgroundColor: isActive 
                              ? 'var(--primary)' 
                              : 'transparent',
                            color: isActive ? '#FFFFFF' : 'var(--text)'
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileHover={{ 
                            x: 5,
                            backgroundColor: isActive 
                              ? 'var(--primary)' 
                              : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTabMobile"
                              className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                              style={{ backgroundColor: '#FFFFFF' }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}

                          <div className={`${isActive ? 'text-white' : ''}`}>
                            {item.icon}
                          </div>

                          <span className="flex-1 text-left font-medium">
                            {item.label}
                          </span>

                          {item.badge && (
                            <motion.span
                              className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: isActive ? '#FFFFFF' : 'var(--primary)',
                                color: isActive ? 'var(--primary)' : '#FFFFFF'
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                            >
                              {item.badge}
                            </motion.span>
                          )}

                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}, transparent)`
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </nav>

                <div 
                  className="p-4 border-t space-y-3"
                  style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  <motion.button
                    onClick={toggleTheme}
                    className="w-full p-3 rounded-xl flex items-center gap-3 transition-all"
                    style={{ color: 'var(--text)' }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {theme === 'dark' ? (
                        <FiMoon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      ) : (
                        <FiSun className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                      )}
                    </motion.div>
                    <span className="flex-1 text-left font-medium">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </motion.button>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors"
                      style={{ 
                        backgroundColor: isUserMenuOpen 
                          ? theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                          : 'transparent'
                      }}
                      whileHover={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 relative group overflow-hidden"
                        style={{ backgroundColor: 'var(--primary)' }}
                        onClick={handleAvatarClick}
                      >
                        {currentUser.profilePicture ? (
                          <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(currentUser.name)
                        )}

                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          {isUploading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                            />
                          ) : (
                            <FiCamera className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 text-left overflow-hidden">
                        <div 
                          className="font-semibold truncate text-sm"
                          style={{ color: 'var(--text)' }}
                        >
                          {currentUser.name}
                        </div>
                        <div 
                          className="text-xs opacity-60 truncate"
                          style={{ color: 'var(--text)' }}
                        >
                          {currentUser.email}
                        </div>
                      </div>

                      {/* Dropdown Icon */}
                      <motion.div
                        animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: 'var(--text)' }}
                      >
                        <FiChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>

                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden shadow-lg z-50"
                          style={{ 
                            backgroundColor: 'var(--card)',
                            border: '1px solid',
                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                          }}
                        >
                          <motion.button
                            onClick={handleLogout}
                            className="w-full p-3 flex items-center gap-3 transition-colors"
                            style={{ color: 'var(--danger)' }}
                            whileHover={{ 
                              backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                            }}
                          >
                            <FiLogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;