import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiLogIn, FiUserPlus, FiLayout } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';

const HeroSection = ({ onLogin, onSignup, onDashboard }) => {
  const { theme, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--success)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <motion.img
            key={theme}
            src={theme === 'dark' ? darkLogo : lightLogo}
            alt="Logo"
            className="h-[58px] w-auto"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'var(--card)' }}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: theme === 'dark' ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <FiMoon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              ) : (
                <FiSun className="w-6 h-6" style={{ color: 'var(--warning)' }} />
              )}
            </motion.div>
            
            {/* Animated ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: 'var(--primary)' }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.button>

          {/* Login Button */}
          <motion.button
            onClick={onLogin}
            className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 border-2"
            style={{ 
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              backgroundColor: 'transparent'
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <FiLogIn className="w-5 h-5" />
            <span>Login</span>
          </motion.button>

          {/* Dashboard Button */}
          <motion.button
            onClick={onDashboard}
            className="px-6 py-3 rounded-xl font-medium flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
            }}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <FiLayout className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-5 pb-32 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
            border: '1px solid var(--primary)'
          }}
          whileHover={{ scale: 1.05 }}
        >
          <HiSparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Track Your Learning Journey
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--text)' }}
        >
          Master Your
          <br />
          <motion.span
            className="relative inline-block"
            style={{ color: 'var(--primary)' }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Learning Path
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl mb-6 max-w-3xl opacity-80"
          style={{ color: 'var(--text)' }}
        >
          Transform your learning experience with intelligent progress tracking, 
          streak management, and detailed analytics. Stay motivated and achieve your goals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {/* Get Started Button */}
          <motion.button
            onClick={onSignup}
            className="group relative px-6 py-4 rounded-xl font-bold text-lg flex items-center gap-3 overflow-hidden"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <FiUserPlus className="w-6 h-6" />
            <span>Get Started</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              →
            </motion.div>
          </motion.button>

        </motion.div>

        {/* Floating Elements */}
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-40 right-20 w-20 h-20 rounded-full opacity-30"
          style={{ backgroundColor: 'var(--success)' }}
        />
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-40 left-20 w-16 h-16 rounded-full opacity-30"
          style={{ backgroundColor: 'var(--warning)' }}
        />
      </motion.div>

    </div>
  );
};

export default HeroSection;