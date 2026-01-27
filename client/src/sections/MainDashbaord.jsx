import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp,
  FiAward,
  FiBook,
  FiZap,
  FiTarget,
  FiCheckCircle,
  FiActivity,
  FiArrowRight
} from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import GreetingCard from '../components/GreetingCard';
import QuoteOfTheDay from '../components/QuoteOfTheDay';
import { getJourneys } from '../services/journeyService';

const MainDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch journeys on component mount
  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        const response = await getJourneys('active');
        console.log('Dashboard API Response:', response); // Debug log
        // Get the most recent 4 journeys
        const recentJourneys = response.data?.journeys?.slice(0, 4) || [];
        setJourneys(recentJourneys);
      } catch (error) {
        console.error('Error fetching journeys:', error);
        setJourneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <main 
      className="min-h-screen p-6 lg:ml-80"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Welcome Section */}
        <GreetingCard />
        {/* Motivational Quote */}
        <QuoteOfTheDay />

        {/* Recent Journeys */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="text-3xl font-bold mb-1"
                style={{ color: 'var(--text)' }}
              >
                Recent Journeys
              </h2>
              <p 
                className="opacity-60"
                style={{ color: 'var(--text)' }}
              >
                Continue where you left off
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/dashboard/journeys')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF'
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div 
                  className="w-8 h-8 border-2 rounded-full animate-spin"
                  style={{ 
                    borderColor: 'var(--primary)',
                    borderTopColor: 'transparent'
                  }}
                />
              </div>
            ) : journeys.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg opacity-60" style={{ color: 'var(--text)' }}>
                  No active journeys yet. Start your first journey!
                </p>
              </div>
            ) : (
              journeys.map((journey, index) => (
              <motion.div
                key={journey._id}
                className="group relative rounded-2xl p-6 cursor-pointer overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(`/dashboard/journey/${journey._id}`)}
              >
                {/* Progress glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)'} 0%, transparent 100%)`
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--text)' }}
                      >
                        {journey.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span 
                          className="flex items-center gap-1 opacity-70"
                          style={{ color: 'var(--text)' }}
                        >
                          <FiTarget className="w-4 h-4" />
                          {journey.completedTopics || 0}/{journey.totalTopics || 0} tasks
                        </span>
                        <span 
                          className="flex items-center gap-1"
                          style={{ color: 'var(--warning)' }}
                        >
                          <HiFire className="w-4 h-4" />
                          {journey.bestStreak || 0} day streak
                        </span>
                      </div>
                    </div>
                    
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)'
                      }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {Math.round(journey.progress || 0)}%
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <div 
                    className="h-3 rounded-full overflow-hidden"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{ 
                        background: `linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(journey.progress || 0)}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white opacity-20"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Continue button */}
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    Continue Learning
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FiArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default MainDashboard;