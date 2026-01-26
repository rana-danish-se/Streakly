import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiBook,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

const JourneyStats = ({ refreshTrigger }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalJourneys: 0,
    activeJourneys: 0,
    completedTasks: 0,
    longestStreak: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/journeys/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  const statsConfig = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Active Journeys',
      value: loading ? '...' : stats.activeJourneys,
      color: 'var(--primary)',
      rawColor: theme === 'dark' ? '#818CF8' : '#6366F1',
      bgColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
      glowColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.4)' : 'rgba(99, 102, 241, 0.3)'
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      label: 'Tasks Completed',
      value: loading ? '...' : stats.completedTasks,
      color: 'var(--success)',
      rawColor: theme === 'dark' ? '#4ADE80' : '#22C55E',
      bgColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
      glowColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(34, 197, 94, 0.3)'
    },
    {
      icon: <HiFire className="w-6 h-6" />,
      label: 'Longest Streak',
      value: loading ? '...' : `${stats.longestStreak} days`,
      color: 'var(--warning)',
      rawColor: theme === 'dark' ? '#FBBF24' : '#F59E0B',
      bgColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      glowColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(245, 158, 11, 0.3)'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      label: 'Avg Progress',
      value: loading ? '...' : `${stats.averageProgress}%`,
      color: 'var(--success)',
      rawColor: theme === 'dark' ? '#4ADE80' : '#22C55E',
      bgColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
      glowColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(34, 197, 94, 0.3)'
    }
  ];

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

  // Skeleton loader for each stat card
  const SkeletonCard = ({ stat }) => (
    <motion.div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}
    >
      {/* Animated skeleton shimmer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${stat.bgColor}, transparent)`
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl animate-pulse"
            style={{ backgroundColor: stat.bgColor }}
          />
        </div>
        <div 
          className="h-8 w-20 rounded mb-2 animate-pulse"
          style={{ backgroundColor: stat.bgColor }}
        />
        <div 
          className="h-4 w-32 rounded animate-pulse"
          style={{ backgroundColor: stat.bgColor }}
        />
      </div>
    </motion.div>
  );

  // Don't render if no stats available
  const hasStats = stats.totalJourneys > 0 || stats.activeJourneys > 0 || stats.completedTasks > 0 || stats.longestStreak > 0;
  
  if (!loading && !hasStats) {
    return null;
  }

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 mb-5 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statsConfig.map((stat, index) => (
        loading ? (
          <SkeletonCard key={index} stat={stat} />
        ) : (
          <motion.div
            key={index}
            className="group rounded-2xl p-6 relative overflow-hidden"
            style={{ 
              backgroundColor: 'var(--card)',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: `0 20px 40px ${stat.glowColor}, 0 0 60px ${stat.glowColor}`,
              borderColor: stat.rawColor
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Animated background gradient on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${stat.glowColor} 0%, transparent 70%)`
              }}
            />

            {/* Animated glow pulse */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${stat.glowColor} 0%, transparent 70%)`
              }}
            />

            {/* Orbiting particles effect */}
            <motion.div
              className="absolute top-0 left-0 w-2 h-2 rounded-full opacity-0 group-hover:opacity-60"
              style={{ backgroundColor: stat.rawColor }}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-40"
              style={{ backgroundColor: stat.rawColor }}
              animate={{
                x: [0, -80, 0],
                y: [0, -60, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                  style={{ 
                    backgroundColor: stat.bgColor,
                    color: stat.color
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Icon glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    style={{
                      boxShadow: `0 0 20px ${stat.glowColor}, inset 0 0 20px ${stat.glowColor}`
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {stat.icon}
                </motion.div>
              </div>

              {/* Value with glow */}
              <motion.div 
                className="text-3xl font-bold mb-1 relative"
                style={{ color: 'var(--text)' }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Text glow on hover */}
                <motion.span
                  className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-70"
                  style={{ color: stat.rawColor }}
                >
                  {stat.value}
                </motion.span>
                <span className="relative z-10">{stat.value}</span>
              </motion.div>

              <div 
                className="text-sm opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text)' }}
              >
                {stat.label}
              </div>
            </div>

            {/* Corner accent */}
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 100% 0%, ${stat.rawColor} 0%, transparent 70%)`,
                borderRadius: '0 1rem 0 0'
              }}
            />

            {/* Bottom border glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, transparent, ${stat.rawColor}, transparent)`,
                boxShadow: `0 0 10px ${stat.glowColor}`
              }}
            />
          </motion.div>
        )
      ))}
    </motion.div>
  );
};

export default JourneyStats;