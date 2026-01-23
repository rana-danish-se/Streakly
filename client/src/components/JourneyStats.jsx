import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiBook,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  const statsConfig = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Active Journeys',
      value: loading ? '...' : stats.activeJourneys,
      color: 'var(--primary)',
      bgColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)'
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      label: 'Tasks Completed',
      value: loading ? '...' : stats.completedTasks,
      color: 'var(--success)',
      bgColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)'
    },
    {
      icon: <HiFire className="w-6 h-6" />,
      label: 'Longest Streak',
      value: loading ? '...' : `${stats.longestStreak} days`,
      color: 'var(--warning)',
      bgColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      label: 'Avg Progress',
      value: loading ? '...' : `${stats.averageProgress}%`,
      color: 'var(--success)',
      bgColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)'
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
        <motion.div
          key={index}
          className="rounded-2xl p-6"
          style={{ 
            backgroundColor: 'var(--card)',
            border: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: stat.bgColor,
                color: stat.color
              }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {stat.icon}
            </motion.div>
          </div>
          <div 
            className="text-3xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            {stat.value}
          </div>
          <div 
            className="text-sm opacity-60"
            style={{ color: 'var(--text)' }}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JourneyStats;
