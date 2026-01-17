import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import QuoteOfTheDay from '../components/QuoteOfTheDay';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 p-4">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        <Sidebar />
        <main className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Quote Section */}
            <QuoteOfTheDay />

            {/* Action Section */}
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-3">
                Ready to make progress?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md">
                Check your active journeys, track your habits, and keep your streak alive!
              </p>
              <button
                onClick={() => navigate('/dashboard/journeys')}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Explore Journeys
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;