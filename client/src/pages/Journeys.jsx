import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiMoreVertical, FiCalendar, FiTarget, FiActivity, FiTrendingUp, FiEdit2, FiTrash2, FiPause, FiPlay } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import JourneyModal from '../components/JourneyModal';
import RenameJourneyModal from '../components/RenameJourneyModal';
import { getJourneys, updateJourney, deleteJourney } from '../services/journeyService';
import { toast } from 'react-toastify';

const Journeys = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [journeyToRename, setJourneyToRename] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const data = await getJourneys('all');
      setJourneys(data.data || []);
    } catch (error) {
      console.error('Error fetching journeys:', error);
      toast.error('Failed to load journeys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggleStatus = async (e, journey) => {
    e.stopPropagation();
    try {
      await updateJourney(journey._id, { isActive: !journey.isActive });
      toast.success(`Journey marked as ${!journey.isActive ? 'active' : 'inactive'}`);
      fetchJourneys();
    } catch (error) {
      toast.error('Failed to update status');
    }
    setActiveMenuId(null);
  };

  const handleRename = (e, journey) => {
    e.stopPropagation();
    setJourneyToRename(journey);
    setIsRenameModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = async (e, journey) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) {
      try {
        await deleteJourney(journey._id);
        toast.success('Journey deleted successfully');
        fetchJourneys();
      } catch (error) {
        toast.error('Failed to delete journey');
      }
      setActiveMenuId(null);
    }
  };

  const filteredJourneys = journeys
    .filter(journey => {
      const matchesSearch = journey.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : filterStatus === 'active' ? journey.isActive 
        : !journey.isActive;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const JourneyCard = ({ journey }) => {
    const progress = journey.progressPercentage || 0;
    const daysElapsed = journey.totalDays || 0;
    const daysRemaining = Math.max(0, journey.targetDays - daysElapsed);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
        onClick={() => navigate(`/dashboard/journeys/${journey._id}`)}
      >
        {/* Gradient Header Bar */}
        <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
        
        <div className="p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-2 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {journey.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {journey.description || 'No description provided'}
              </p>
            </div>
            
            {/* Menu Button */}
            <div className="relative flex-shrink-0">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === journey._id ? null : journey._id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <FiMoreVertical className="text-gray-500 dark:text-slate-400" />
              </motion.button>
              
              <AnimatePresence>
                {activeMenuId === journey._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-20 overflow-hidden"
                  >
                    <button
                      onClick={(e) => handleRename(e, journey)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                    >
                      <FiEdit2 className="w-4 h-4 text-teal-500" />
                      Rename Journey
                    </button>
                    <button
                      onClick={(e) => handleToggleStatus(e, journey)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-t border-gray-100 dark:border-slate-700"
                    >
                      {journey.isActive ? (
                        <>
                          <FiPause className="w-4 h-4 text-amber-500" />
                          Mark as Inactive
                        </>
                      ) : (
                        <>
                          <FiPlay className="w-4 h-4 text-emerald-500" />
                          Mark as Active
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, journey)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 border-t border-gray-100 dark:border-slate-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete Journey
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">Progress</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{progress}%</span>
            </div>
            <div className="relative h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Current Streak */}
            <div className="relative p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl border border-orange-200/50 dark:border-orange-800/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-400/10 dark:bg-orange-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500/20 dark:bg-orange-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-base">🔥</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-0.5">{journey.currentStreak}</p>
                <p className="text-[10px] font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Current Streak</p>
              </div>
            </div>

            {/* Longest Streak */}
            <div className="relative p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-0.5">{journey.longestStreak}</p>
                <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Best Streak</p>
              </div>
            </div>

            {/* Target Days */}
            <div className="relative p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10 rounded-2xl border border-teal-200/50 dark:border-teal-800/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-teal-500/20 dark:bg-teal-500/30 rounded-lg flex items-center justify-center">
                    <FiTarget className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-0.5">{journey.targetDays}</p>
                <p className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">Target Days</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
              <FiCalendar className="w-3.5 h-3.5" />
              <span className="font-medium">
                Started {new Date(journey.startDate || journey.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {daysRemaining > 0 && (
                <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                  {daysRemaining} days left
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                journey.isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
              }`}>
                {journey.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-teal-500/20 transition-colors pointer-events-none" />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 p-4">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        <Sidebar />
        <main className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-1">My Journeys</h1>
              <p className="text-gray-500 dark:text-slate-400">Track and manage your learning goals</p>
            </div>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 font-semibold"
            >
              <FiPlus className="w-5 h-5" />
              New Journey
            </motion.button>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-8 shrink-0">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search journeys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-500 rounded-xl focus:outline-none transition-all text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl gap-1">
              {['active', 'completed', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    filterStatus === status
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
              </div>
            ) : filteredJourneys.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6 pb-6">
                {filteredJourneys.map(journey => (
                  <JourneyCard key={journey._id} journey={journey} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mb-6">
                  <FiTarget className="w-12 h-12 text-teal-500 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-2">No journeys found</h3>
                <p className="text-gray-500 dark:text-slate-400 mb-6">Create your first journey to start tracking your progress</p>
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/30"
                >
                  Create Journey
                </motion.button>
              </div>
            )}
          </div>
        </main>
      </div>

      <JourneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchJourneys();
          setIsModalOpen(false);
        }}
      />
      
      <RenameJourneyModal
        isOpen={isRenameModalOpen}
        onClose={() => {
          setIsRenameModalOpen(false);
          setJourneyToRename(null);
        }}
        onSuccess={() => {
          fetchJourneys();
          setIsRenameModalOpen(false);
        }}
        journey={journeyToRename}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Journeys;