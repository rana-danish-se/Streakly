import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {FiAward, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import TaskItem from './TaskItem';

const JourneyTaskList = ({ tasks = [], journeyStatus, startDate, onUpdate, onDelete }) => {
  const { theme } = useTheme();
  const [visibleActive, setVisibleActive] = React.useState(10);
  const [visibleCompleted, setVisibleCompleted] = React.useState(10);
  
  // Sorting:
  // Active: ascending order (oldest added first)
  const activeTasks = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Completed: ascending order (completed first should be at top)
  const completedTasks = [...tasks]
    .filter(t => t.completed)
    .sort((a, b) => new Date(a.completedAt || 0) - new Date(b.completedAt || 0));

  const displayedActive = activeTasks.slice(0, visibleActive);
  const displayedCompleted = completedTasks.slice(0, visibleCompleted);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="space-y-6 relative">
       
       {/* Background Glow - Green */ }
       <motion.div
         className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-50"
         style={{
           background: theme === 'dark' 
             ? 'radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, rgba(34, 197, 94, 0.15) 50%, transparent 70%)' 
             : 'radial-gradient(circle, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 70%)'
         }}
         animate={{
           scale: [1, 1.1, 1],
           opacity: [0.6, 0.8, 0.6]
         }}
         transition={{
           duration: 12,
           repeat: Infinity,
           ease: "easeInOut"
         }}
       />

       {/* Active Tasks Section */}
       <div>
         {/* Section Header */}
         {activeTasks.length > 0 && (
           <motion.div 
             className="flex items-center gap-3 mb-4"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
             <div 
               className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                 color: 'var(--primary)'
               }}
             >
               <FiCircle className="w-4 h-4" />
             </div>
             <h3 
               className="text-sm font-bold uppercase tracking-wider"
               style={{ color: 'var(--text)' }}
             >
               Active Tasks
             </h3>
             <div 
               className="px-2.5 py-0.5 rounded-full text-xs font-bold"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                 color: 'var(--primary)'
               }}
             >
               {activeTasks.length}
             </div>
             <div 
               className="flex-1 h-px"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
               }}
             />
           </motion.div>
         )}

         {/* Active Tasks List */}
         <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="space-y-3"
         >
           <AnimatePresence mode="popLayout" initial={false}>
             {displayedActive.map(task => (
               <motion.div
                 key={task._id}
                 variants={itemVariants}
                 initial="hidden"
                 animate="visible"
                 exit="exit"
                 layout
                 className="relative z-0" 
               >
                 <TaskItem 
                   task={task} 
                   journeyStatus={journeyStatus}
                   startDate={startDate}
                   onUpdate={onUpdate} 
                   onDelete={onDelete}
                 />
               </motion.div>
             ))}
           </AnimatePresence>
         </motion.div>

          {/* Load More Active */}
          {activeTasks.length > visibleActive && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVisibleActive(prev => prev + 10)}
              className="w-full mt-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                border: '1px dashed',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: 'var(--text)',
                opacity: 0.8
              }}
            >
              Load More Active Tasks ({activeTasks.length - visibleActive} remaining)
            </motion.button>
          )}

         {/* Empty State for Active Tasks */}
         {activeTasks.length === 0 && (
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative py-12 text-center rounded-2xl overflow-hidden"
             style={{ 
               backgroundColor: 'var(--card)',
               border: '2px dashed',
               borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
             }}
           >
             {/* Background decoration */}
             <div className="absolute inset-0 opacity-20">
               <motion.div
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
                 style={{ 
                   background: completedTasks.length > 0 
                     ? `radial-gradient(circle, var(--success) 0%, transparent 70%)`
                     : `radial-gradient(circle, var(--primary) 0%, transparent 70%)`
                 }}
                 animate={{
                   scale: [1, 1.2, 1],
                 }}
                 transition={{
                   duration: 4,
                   repeat: Infinity,
                   ease: "easeInOut"
                 }}
               />
             </div>

             <div className="relative z-10">
               {completedTasks.length > 0 ? (
                 <>
                   <motion.div
                     animate={{
                       rotate: [0, 10, -10, 0],
                       scale: [1, 1.1, 1]
                     }}
                     transition={{
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   >
                     <FiAward 
                       className="w-16 h-16 mx-auto mb-4"
                       style={{ color: 'var(--success)' }}
                     />
                   </motion.div>
                   <h4 
                     className="text-xl font-bold mb-2"
                     style={{ color: 'var(--text)' }}
                   >
                     All Tasks Completed! 🎉
                   </h4>
                   <p 
                     className="text-sm opacity-60"
                     style={{ color: 'var(--text)' }}
                   >
                     Amazing work! You've finished everything on your list.
                   </p>
                 </>
               ) : (
                 <>
                   <motion.div
                     animate={{
                       y: [0, -10, 0],
                     }}
                     transition={{
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   >
                     <FiCircle 
                       className="w-16 h-16 mx-auto mb-4"
                       style={{ color: 'var(--primary)' }}
                     />
                   </motion.div>
                   <h4 
                     className="text-xl font-bold mb-2"
                     style={{ color: 'var(--text)' }}
                   >
                     No Active Tasks Yet
                   </h4>
                   <p 
                     className="text-sm opacity-60"
                     style={{ color: 'var(--text)' }}
                   >
                     Add your first task above to start your journey!
                   </p>
                 </>
               )}
             </div>
           </motion.div>
         )}
       </div>

       {/* Completed Tasks Section */}
       {completedTasks.length > 0 && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="pt-2"
         >
           {/* Section Header */}
           <motion.div 
             className="flex items-center gap-3 mb-4"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
             <div 
               className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                 color: 'var(--success)'
               }}
             >
               <FiCheckCircle className="w-4 h-4" />
             </div>
             <h3 
               className="text-sm font-bold uppercase tracking-wider"
               style={{ color: 'var(--text)' }}
             >
               Completed
             </h3>
             <div 
               className="px-2.5 py-0.5 rounded-full text-xs font-bold"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                 color: 'var(--success)'
               }}
             >
               {completedTasks.length}
             </div>
             <div 
               className="flex-1 h-px"
               style={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
               }}
             />
           </motion.div>

           {/* Completed Tasks List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
              style={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {displayedCompleted.map(task => (
                  <motion.div
                    key={task._id}
                    variants={itemVariants}
                    layout
                    className="relative z-0"
                  >
                    <TaskItem 
                      task={task} 
                      journeyStatus={journeyStatus}
                      startDate={startDate}
                      onUpdate={onUpdate} 
                      onDelete={onDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Completed */}
            {completedTasks.length > visibleCompleted && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisibleCompleted(prev => prev + 10)}
                className="w-full mt-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: '1px dashed',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: 'var(--text)',
                  opacity: 0.8
                }}
              >
                Load More Completed Tasks ({completedTasks.length - visibleCompleted} remaining)
              </motion.button>
            )}
         </motion.div>
       )}

    </div>
  );
};

export default JourneyTaskList;