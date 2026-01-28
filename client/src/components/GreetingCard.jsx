import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const GreetingCard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 
    
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getFirstName = () => {
    if (!user || !user.name) return 'User';
    return user.name.split(' ')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
        color: '#FFFFFF'
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <HiSparkles className="w-6 h-6" />
              <span className="text-sm font-semibold opacity-90">
                {getGreeting()}
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Welcome back, {getFirstName()}!
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Track your learning journey, build streaks, and achieve your goals. 
              Every topic you master brings you one step closer to excellence.
            </p>
          </div>
          <motion.div
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 min-w-[240px]"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FiCalendar className="w-5 h-5" />
              <span className="text-sm font-semibold">Today's Date</span>
            </div>
            <div className="text-2xl font-bold">
              {formatDate(currentTime)}
            </div>
            <div className="text-sm opacity-75 mt-1">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GreetingCard;
