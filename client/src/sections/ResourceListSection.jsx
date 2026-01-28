import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiLightningBolt } from 'react-icons/hi';
import ResourceCard from '../components/ResourceCard';
import ResourceFilters from '../components/ResourceFilters';
import { motion } from 'framer-motion';

const ResourceListSection = ({ resources, onDelete, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
          style={{
            background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <ResourceFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={viewMode === 'grid' 
          ? "flex items-center flex-wrap justify-center  gap-6" 
          : "space-y-3"
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource) => (
            <ResourceCard 
              key={resource.id}
              resource={resource}
              viewMode={viewMode}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center"
        >
          <HiLightningBolt 
            className="w-16 h-16 mx-auto mb-4 opacity-20"
            style={{ color: 'var(--text)' }}
          />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            No resources found
          </h3>
          <p className="opacity-60" style={{ color: 'var(--text)' }}>
            {searchQuery ? 'Try a different search term' : 'Upload your first resource to get started'}
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-3"
        }>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`animate-pulse rounded-2xl ${viewMode === 'grid' ? 'h-64' : 'h-20'}`}
              style={{ backgroundColor: 'var(--card)', opacity: 0.5 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceListSection;
