import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ variant = 'circle', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  const isCircle = variant === 'circle';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative ${
        isCircle 
          ? 'w-14 h-14 rounded-full' 
          : 'w-full px-4 py-3 rounded-xl'
      } bg-gray-200 dark:bg-gray-800 flex items-center ${
        isCircle ? 'justify-center' : 'gap-3'
      } hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
      whileHover={{ scale: isCircle ? 1.05 : 1.02, x: !isCircle ? 5 : 0 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0"
      >
        {theme === 'dark' ? (
          <FiMoon className="w-5 h-5 text-[var(--primary)]" />
        ) : (
          <FiSun className="w-5 h-5 text-[var(--warning)]" />
        )}
      </motion.div>
      <AnimatePresence>
        {showLabel && !isCircle && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-medium flex-1 text-left text-[var(--text)]"
          >
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
