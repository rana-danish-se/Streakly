import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-400">
            Ready to continue your learning journey?
          </p>
          {/* Main content will go here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;