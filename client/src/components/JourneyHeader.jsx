import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiTarget, 
  FiClock, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiPlay,
  FiTrendingUp,
  FiAward,
  FiExternalLink
} from 'react-icons/fi';
import { HiFire, HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const JourneyHeader = ({ 
  journey, 
  onEdit, 
  onDelete, 
  onComplete, 
  onReactivate, 
  onStart, 
  stats 
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Calculate days
  const daysPassed = stats?.totalDays || 0;
  const targetDays = journey.targetDays || 30;
  const daysLeft = Math.max(0, targetDays - daysPassed);
  const progress = stats?.progress || 0;

  // Get status color and badge
  const getStatusConfig = () => {
    switch(journey.status) {
      case 'completed':
        return {
          color: 'var(--success)',
          bgColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(34, 197, 94, 0.1)',
          label: 'Completed',
          icon: <FiCheckCircle className="w-4 h-4" />
        };
      case 'active':
        return {
          color: 'var(--primary)',
          bgColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          label: 'Active',
          icon: <FiTrendingUp className="w-4 h-4" />
        };
      case 'pending':
        return {
          color: 'var(--warning)',
          bgColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.1)',
          label: 'Pending',
          icon: <FiClock className="w-4 h-4" />
        };
      default:
        return {
          color: 'var(--text)',
          bgColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          label: 'Unknown',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: theme === 'dark' ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}
    >
      {/* Top Right Glow Effect */}
      <motion.div
        className="absolute -top-64 -left-64 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 90%)' 
            : 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 90%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Top Row: Back & Status */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate('/dashboard/journeys')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
            style={{ 
              color: 'var(--text)',
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
            }}
            whileHover={{ 
              x: -5,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Journeys</span>
          </motion.button>

          {/* Status Badge - Moved here */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ 
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.color
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </motion.div>
        </div>

        {/* Main Header Content */}
        <div className="grid lg:grid-cols-[1fr,auto] gap-6 items-start">
          
          {/* Left Column: Title & Description */}
          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <h1 
                className="text-3xl lg:text-4xl font-bold mb-3"
                style={{ color: 'var(--text)' }}
              >
                {journey.title}
              </h1>

              {journey.description && (
                <p 
                  className="text-lg max-w-3xl opacity-70 leading-relaxed"
                  style={{ color: 'var(--text)' }}
                >
                  {journey.description}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              


              {/* Start Date */}
              <motion.div
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                      color: 'var(--success)'
                    }}
                  >
                    <FiCalendar className="w-4 h-4" />
                  </div>
                </div>
                <div 
                  className="text-sm font-bold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  {new Date(journey.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div 
                  className="text-xs opacity-60"
                  style={{ color: 'var(--text)' }}
                >
                  Started
                </div>
              </motion.div>

              {/* Target Days */}
              <motion.div
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.1)',
                      color: '#A855F7'
                    }}
                  >
                    <FiTarget className="w-4 h-4" />
                  </div>
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  {targetDays}
                </div>
                <div 
                  className="text-xs opacity-60"
                  style={{ color: 'var(--text)' }}
                >
                  Target Days
                </div>
              </motion.div>

              {/* Days Left */}
              <motion.div
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.1)',
                      color: 'var(--warning)'
                    }}
                  >
                    <FiClock className="w-4 h-4" />
                  </div>
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  {daysLeft}
                </div>
                <div 
                  className="text-xs opacity-60"
                  style={{ color: 'var(--text)' }}
                >
                  Days Left
                </div>
              </motion.div>

            </div>

          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col gap-3 lg:min-w-[280px]">
            
            {/* Primary Status Action */}
            {journey.status === 'active' && progress === 100 && (
              <motion.button 
                onClick={onComplete} 
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{ 
                  backgroundColor: 'var(--success)',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCheckCircle className="w-5 h-5" />
                Complete Journey
              </motion.button>
            )}

            {journey.status === 'pending' && (
              <motion.button 
                onClick={onStart} 
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{ 
                  backgroundColor: 'var(--success)',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlay className="w-5 h-5" />
                Start Journey
              </motion.button>
            )}

            {journey.status === 'completed' && (
              <motion.button 
                onClick={onReactivate} 
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <HiFire className="w-5 h-5" />
                Reactivate Journey
              </motion.button>
            )}

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button 
                onClick={onEdit}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                whileHover={{ 
                  y: -2,
                  borderColor: 'var(--primary)',
                  backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </motion.button>

              <motion.button 
                onClick={onDelete}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                whileHover={{ 
                  y: -2,
                  borderColor: 'var(--danger)',
                  backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                  color: 'var(--danger)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </div>

            {/* Achievements Button */}
            {stats?.achievementsCount > 0 && (
              <motion.button
                className="flex items-center justify-between px-4 py-3 rounded-xl font-medium"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--warning)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.2)'
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <FiAward className="w-5 h-5" />
                  <span>Achievements</span>
                </div>
                <span className="font-bold">{stats.achievementsCount}</span>
              </motion.button>
            )}

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            />

            {/* Resources Link */}
            <motion.button
              onClick={() => navigate(`/dashboard/journey/${journey._id}/resources`)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                color: 'var(--primary)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.2)'
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <HiSparkles className="w-5 h-5" />
              <span>Learning Resources</span>
              <FiExternalLink className="w-4 h-4" />
            </motion.button>

          </div>

        </div>


      </div>
    </div>
  );
};

export default JourneyHeader;