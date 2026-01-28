import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiActivity, FiTrendingUp, FiCheckSquare, FiCalendar } from 'react-icons/fi';
import { HiFire, HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const JourneyDetailStats = ({ stats, tasks = [] }) => {
  const { theme } = useTheme();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = stats?.progress || 0;
  const totalDays = stats?.totalDays || 0;
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 scrollbar-hide sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      
      <motion.div
        variants={itemVariants}
        className="group relative rounded-2xl p-6 flex items-center gap-5"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: `0 12px 24px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)'}`,
          borderColor: 'var(--primary)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${theme === 'dark' ? 'rgba(129, 140, 248, 0.08)' : 'rgba(99, 102, 241, 0.04)'} 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10 w-20 h-20 flex-shrink-0">
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}
            styles={buildStyles({
              textSize: '22px',
              pathColor: theme === 'dark' ? '#818CF8' : '#6366F1',
              textColor: theme === 'dark' ? '#E5E7EB' : '#0F172A',
              trailColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              pathTransitionDuration: 0.8,
            })}
          />
        </div>

        <div className="relative z-10 flex-1 min-w-0">
          <h3 
            className="text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-60"
            style={{ color: 'var(--text)' }}
          >
            Progress
          </h3>
          <p 
            className="text-xl font-bold truncate"
            style={{ color: 'var(--text)' }}
          >
            {totalDays}{' '}
            <span className="text-sm font-normal opacity-50">
              days
            </span>
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group relative rounded-2xl p-6"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: `0 12px 24px ${theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.1)'}`,
          borderColor: 'var(--warning)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme === 'dark' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(245, 158, 11, 0.04)'} 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                color: 'var(--warning)'
              }}
            >
              <HiFire className="w-4 h-4" />
            </div>
            <span 
              className="text-xs font-semibold uppercase tracking-wider opacity-60"
              style={{ color: 'var(--text)' }}
            >
              Current Streak
            </span>
          </div>

          <div 
            className="text-3xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            {currentStreak}{' '}
            <span className="text-base font-normal opacity-50">days</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group relative rounded-2xl p-6"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: `0 12px 24px ${theme === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(147, 51, 234, 0.1)'}`,
          borderColor: '#A855F7'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme === 'dark' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(147, 51, 234, 0.04)'} 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(147, 51, 234, 0.1)',
                color: '#A855F7'
              }}
            >
              <FiTrendingUp className="w-4 h-4" />
            </div>
            <span 
              className="text-xs font-semibold uppercase tracking-wider opacity-60"
              style={{ color: 'var(--text)' }}
            >
              Best Streak
            </span>
          </div>

          <div 
            className="text-3xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            {longestStreak}{' '}
            <span className="text-base font-normal opacity-50">days</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group relative rounded-2xl p-6"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: `0 12px 24px ${theme === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(34, 197, 94, 0.1)'}`,
          borderColor: 'var(--success)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme === 'dark' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(34, 197, 94, 0.04)'} 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                color: 'var(--success)'
              }}
            >
              <FiCheckSquare className="w-4 h-4" />
            </div>
            <span 
              className="text-xs font-semibold uppercase tracking-wider opacity-60"
              style={{ color: 'var(--text)' }}
            >
              Tasks
            </span>
          </div>

          {/* Value */}
          <div className="mb-3">
            <div 
              className="text-3xl font-bold flex items-baseline gap-2"
              style={{ color: 'var(--text)' }}
            >
              {completedTasks}{' '}
              <span className="text-base font-medium opacity-50">
                / {totalTasks}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}
          >
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                backgroundColor: 'var(--success)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default JourneyDetailStats;