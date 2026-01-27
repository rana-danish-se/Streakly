import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus,
  FiSearch,
  FiX,
  FiFilter,
  FiCheck
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import JourneyCard from '../components/JourneysCard';
import JourneyModal from '../components/JourneyModal';
import JourneyStats from '../components/JourneyStats';
import { getJourneys } from '../services/journeyService';

const JourneysContent = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

  // Fetch journeys on component mount
  useEffect(() => {
    const fetchJourneysData = async () => {
      try {
        setLoading(true);
        const response = await getJourneys('all');
        console.log('API Response:', response); // Debug log
        setJourneys(response.data?.journeys || []);
      } catch (error) {
        console.error('Error fetching journeys:', error);
        setJourneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneysData();
  }, []);

  // Refetch journeys after creating new one
  const handleJourneyCreated = () => {
    const fetchJourneysData = async () => {
      try {
        const response = await getJourneys('all');
        setJourneys(response.data?.journeys || []);
        // Trigger stats refresh
        setStatsRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error fetching journeys:', error);
      }
    };
    fetchJourneysData();
  };

  const filters = [
    { id: 'all', label: 'All Journeys', count: journeys.length },
    { id: 'active', label: 'Active', count: journeys.filter(j => j.status === 'active').length },
    { id: 'completed', label: 'Completed', count: journeys.filter(j => j.status === 'completed' || j.progress === 100).length },
    { id: 'pending', label: 'Pending', count: journeys.filter(j => j.status === 'pending').length }
  ];

  // Filter journeys
  const filteredJourneys = journeys.filter(journey => {
    // Search filter
    const matchesSearch = journey.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (journey.description && journey.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter - use actual status from database
    let matchesFilter = true;
    if (activeFilter === 'active') {
      matchesFilter = journey.status === 'active';
    } else if (activeFilter === 'completed') {
      matchesFilter = journey.status === 'completed' || journey.progress === 100;
    } else if (activeFilter === 'pending') {
      matchesFilter = journey.status === 'pending';
    }

    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Format journey data for JourneyCard component
  const formatJourneyForCard = (journey) => ({
    name: journey.title,
    description: journey.description,
    progress: Math.round(journey.progress || 0),
    status: journey.status, // Pass actual status from database
    currentStreak: journey.currentStreak || 0,
    bestStreak: journey.bestStreak || 0,
    targetDays: journey.targetDays || 0,
    totalTopics: journey.totalTopics || 0,
    completedTopics: journey.completedTopics || 0,
    startDate: journey.startDate || journey.createdAt // Use actual startDate for calculations
  });

  return (
    <div 
      className="min-h-screen  w-full p-6 lg:ml-80 relative overflow-x-hidden scrollbar-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Decorative Glows */}
      <div 
        className="absolute top-0 right-0  w-96 h-96 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, var(--success) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)'
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles style={{ color: 'var(--primary)' }} className="w-6 h-6" />
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--primary)' }}
            >
              My Learning Journeys
            </span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: 'var(--text)' }}
          >
            All Journeys
          </h1>
          <p 
            className="text-lg opacity-60"
            style={{ color: 'var(--text)' }}
          >
            Track and manage all your learning paths in one place
          </p>
        </motion.div>

        {/* Journey Statistics */}
        <JourneyStats refreshTrigger={statsRefreshTrigger} />

        {/* Search and Filter Bar */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FiSearch 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40"
              style={{ color: 'var(--text)' }}
            />
            <input
              type="text"
              placeholder="Search journeys by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: 'var(--card)',
                color: 'var(--text)',
                border: '2px solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Filter Button & Dropdown */}
          <div className="relative z-50">
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-4 rounded-xl font-bold flex items-center justify-center transition-all h-full"
              style={{ 
                backgroundColor: activeFilter !== 'all' ? 'var(--primary)' : 'var(--card)',
                color: activeFilter !== 'all' ? '#FFFFFF' : 'var(--text)',
                border: '2px solid',
                borderColor: activeFilter !== 'all' ? 'var(--primary)' : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFilter className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsFilterOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-50 backdrop-blur-xl"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="p-2 space-y-1">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setActiveFilter(filter.id);
                            setIsFilterOpen(false);
                          }}
                          className="w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          style={{
                             backgroundColor: activeFilter === filter.id ? 
                               (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 
                               'transparent',
                             color: 'var(--text)'
                          }}
                        >
                           <span className="flex items-center gap-2">
                             {activeFilter === filter.id ? (
                               <FiCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                             ) : (
                               <div className="w-4 h-4" />
                             )}
                             <span>{filter.label}</span>
                           </span>
                           <span 
                             className="text-xs px-2 py-0.5 rounded-full opacity-60"
                             style={{ 
                               backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
                             }}
                           >
                             {filter.count}
                           </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Create New Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 rounded-xl font-bold flex items-center gap-3 justify-center"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="w-5 h-5" />
            Create New Journey
          </motion.button>
        </motion.div>

        {/* Results Info */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-center justify-between"
        >
          <p 
            className="opacity-60"
            style={{ color: 'var(--text)' }}
          >
            Showing <span className="font-bold">{filteredJourneys.length}</span> {filteredJourneys.length === 1 ? 'journey' : 'journeys'}
          </p>
        </motion.div>

        {/* Journeys Grid */}
        <motion.div
          layout
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin"
                style={{ 
                  borderColor: 'var(--primary)',
                  borderTopColor: 'transparent'
                }}
              />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredJourneys.length > 0 ? (
                filteredJourneys.map((journey) => (
                  <JourneyCard
                    key={journey._id}
                    journey={formatJourneyForCard(journey)}
                    onClick={() => navigate(`/dashboard/journey/${journey._id}`)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="col-span-full flex flex-col items-center justify-center py-20"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: 'var(--text)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FiSearch className="w-12 h-12 opacity-30" />
                  </motion.div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    No journeys found
                  </h3>
                  <p 
                    className="opacity-60 mb-6"
                    style={{ color: 'var(--text)' }}
                  >
                    {searchQuery || activeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first journey to get started'}
                  </p>
                  <motion.button
                    onClick={() => {
                      if (searchQuery || activeFilter !== 'all') {
                        setSearchQuery('');
                        setActiveFilter('all');
                      } else {
                        navigate('/dashboard');
                      }
                    }}
                    className="px-6 py-3 rounded-xl font-semibold"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {searchQuery || activeFilter !== 'all' ? 'Clear Filters' : 'Create Journey'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>

      {/* Journey Creation Modal */}
      <JourneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJourneyCreated}
      />
    </div>
  );
};

export default JourneysContent;
