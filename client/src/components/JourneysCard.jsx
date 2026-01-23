import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiX
} from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const JourneyCard = ({ journey, onClick }) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    if (journey.status === 'completed' || journey.progress === 100) return 'var(--success)';
    if (journey.status === 'active') return 'var(--primary)';
    return 'var(--warning)'; // pending
  };

  const getStatusBadge = () => {
    // Use actual status from database
    if (journey.status === 'completed' || journey.progress === 100) {
      return { text: 'Completed', color: 'var(--success)' };
    }
    if (journey.status === 'active') {
      return { text: 'Active', color: 'var(--primary)' };
    }
    // Default to pending for 'pending' status or undefined
    return { text: 'Pending', color: 'var(--warning)' };
  };

  const status = getStatusBadge();

  // Calculate remaining days based on journey status
  const getRemainingDays = () => {
    if (journey.status === 'completed') {
      return 0;
    }
    if (journey.status === 'pending') {
      return journey.targetDays || 0;
    }
    // For active journeys, calculate remaining days
    const today = new Date();
    const startDate = new Date(journey.startDate);
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const remaining = (journey.targetDays || 0) - daysPassed;
    return Math.max(0, remaining); // Don't show negative days
  };

  // Format start date with time
  const formatStartDate = () => {
    if (!journey.startDate) return 'N/A';
    const date = new Date(journey.startDate);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${dateStr} `;
  };

  return (
    <motion.div
      className="group relative w-[380px] min-h-[280px] rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
      style={{ 
        backgroundColor: 'var(--card)',
        border: '2px solid',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ 
        y: -8,
        borderColor: getStatusColor(),
        scale: 1.02
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${getStatusColor()}15 0%, transparent 100%)`
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 
                className="text-xl font-bold line-clamp-1 flex-1"
                style={{ color: 'var(--text)' }}
              >
                {journey.name}
              </h3>
              <motion.span
                className="px-3 py-1  rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: theme === 'dark' ? `${status.color}` : `${status.color}`,
                  color: 'white'
                }}
                whileHover={{ scale: 1.1 }}
              >
                {status.text}
              </motion.span>
            </div>
          </div>

          <motion.div
            className="ml-2 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
            style={{ 
              backgroundColor: theme === 'dark' ? `${getStatusColor()}` : `${getStatusColor()}`,
              color: 'white'
            }}
            whileHover={{ scale: 1.15, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {journey.progress}%
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Current Streak */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.1)',
                color: 'var(--warning)'
              }}
            >
              <HiFire className="w-5 h-5" />
            </div>
            <div>
              <div 
                className="text-xs opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Current
              </div>
              <div 
                className="font-bold text-sm"
                style={{ color: 'var(--text)' }}
              >
                {journey.currentStreak}d
              </div>
            </div>
          </div>

          {/* Best Streak */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)'
              }}
            >
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div 
                className="text-xs opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Best
              </div>
              <div 
                className="font-bold text-sm"
                style={{ color: 'var(--text)' }}
              >
                {journey.bestStreak}d
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                color: 'var(--success)'
              }}
            >
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div 
                className="text-xs opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Tasks
              </div>
              <div 
                className="font-bold text-sm"
                style={{ color: 'var(--text)' }}
              >
                {journey.completedTopics}/{journey.totalTopics}
              </div>
            </div>
          </div>

          {/* Remaining Days */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)'
              }}
            >
              <FiTarget className="w-5 h-5" />
            </div>
            <div>
              <div 
                className="text-xs opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Remaining
              </div>
              <div 
                className="font-bold text-sm"
                style={{ color: 'var(--text)' }}
              >
                {getRemainingDays()}d
              </div>
            </div>
          </div>
        </div>


        {/* View Details Button */}
        <motion.div
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-sm opacity-60">
            <FiCalendar className="w-4 h-4" />
            <span style={{ color: 'var(--text)' }}>
              Started {formatStartDate()}
            </span>
          </div>

          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ 
              backgroundColor: getStatusColor(),
              color: '#FFFFFF'
            }}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
             Details
            <FiArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JourneyCard;