import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiGrid,
  FiList,
  FiSearch,
  FiFile, 
  FiImage, 
  FiFileText, 
  FiLink
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ResourceFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  viewMode, 
  setViewMode 
}) => {
  const { theme } = useTheme();

  const typeFilters = [
    { id: 'all', label: 'All Resources', icon: <FiGrid /> },
    { id: 'pdf', label: 'PDFs', icon: <FiFileText /> },
    { id: 'image', label: 'Images', icon: <FiImage /> },
    { id: 'doc', label: 'Documents', icon: <FiFile /> },
    { id: 'link', label: 'Links', icon: <FiLink /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
    >
      <div className="relative flex-1 max-w-md w-full">
        <FiSearch 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40"
          style={{ color: 'var(--text)' }}
        />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--card)',
            color: 'var(--text)',
            border: '2px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {typeFilters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
            style={{ 
              backgroundColor: filterType === filter.id ? 'var(--primary)' : 'var(--card)',
              color: filterType === filter.id ? '#FFFFFF' : 'var(--text)',
              border: '1px solid',
              borderColor: filterType === filter.id ? 'var(--primary)' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.icon}
            <span className="hidden sm:inline">{filter.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => setViewMode('grid')}
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'var(--card)',
            color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiGrid className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={() => setViewMode('list')}
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'var(--card)',
            color: viewMode === 'list' ? '#FFFFFF' : 'var(--text)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiList className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResourceFilters;
