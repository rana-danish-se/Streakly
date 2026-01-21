import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiMoreVertical, FiCalendar, FiTarget, FiActivity, FiTrendingUp, FiEdit2, FiTrash2, FiPause, FiPlay, FiArrowRight } from 'react-icons/fi';
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
      setJourneys(data.data.journeys || []);
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
      } catch {
        toast.error('Failed to delete journey');
      }
      setActiveMenuId(null);
    }
  };

  const filteredJourneys = journeys?.length > 0 ? journeys
    .filter(journey => {
      const matchesSearch = journey.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : journey.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

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
        className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
      >
        {/* Gradient Header Bar */}
        <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
        
        <div className="p-6 pb-4 flex-1">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                  journey.isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-600'
                }`}>
                  {journey.isActive ? 'Active' : 'Inactive'}
                </span>
                {journey.status === 'pending' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                    Pending
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-1 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {journey.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-10">
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
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-400 dark:text-slate-500"
              >
                <FiMoreVertical />
              </motion.button>
              
              <AnimatePresence>
                {activeMenuId === journey._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-20 overflow-hidden"
                  >
                    <button
                      onClick={(e) => handleRename(e, journey)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 className="w-3.5 h-3.5 text-teal-500" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => handleToggleStatus(e, journey)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border-t border-gray-100 dark:border-slate-700"
                    >
                      {journey.isActive ? (
                        <>
                          <FiPause className="w-3.5 h-3.5 text-amber-500" />
                          Pause
                        </>
                      ) : (
                        <>
                          <FiPlay className="w-3.5 h-3.5 text-emerald-500" />
                          Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, journey)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-gray-100 dark:border-slate-700"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-lg">
                🔥
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-slate-50 leading-none">{journey.currentStreak}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 mt-1">Streak</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <FiTarget />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-slate-50 leading-none">{journey.targetDays}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 mt-1">Goal</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Progress</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 pt-0 mt-auto">
          <button
            onClick={() => navigate(`/dashboard/journeys/${journey._id}`)}
            className="w-full py-3 px-4 bg-gray-50 hover:bg-teal-50 dark:bg-slate-700/50 dark:hover:bg-teal-900/20 text-gray-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-all duration-300 flex items-center justify-between group/btn border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
          >
            <span className="text-sm font-semibold">View Details</span>
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center group-hover/btn:bg-teal-600 dark:group-hover/btn:bg-teal-500 group-hover/btn:text-white transition-all">
              <FiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
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
              {['active', 'pending', 'completed', 'all'].map((status) => (
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