import React, { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { FiFolderMinus, FiFolderPlus, FiMoreHorizontal, FiCheckCircle } from 'react-icons/fi';
import TaskItem from './TaskItem';
import JourneyTaskInput from './JourneyTaskInput';
// import { useTheme } from '../contexts/ThemeContext';

const TopicItem = ({ 
  topic, 
  allTopics, 
  tasks, 
  journeyStatus, 
  startDate,
  onAddSubtopic,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTopic,
  onDeleteTopic 
}) => {
  // const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [showSubtopicInput, setShowSubtopicInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);

  // Filter direct children
  const subtopics = allTopics.filter(t => t.parent === topic._id).sort((a,b) => a.order - b.order);
  const topicTasks = tasks.filter(t => t.topic === topic._id).sort((a,b) => {
    if (a.completed === b.completed) return new Date(a.createdAt) - new Date(b.createdAt);
    return a.completed ? 1 : -1;
  });

  const completedCount = topicTasks.filter(t => t.completed).length;
  // Progress calculation could include subtopics recursively but simpler for now
  const progress = topicTasks.length > 0 ? (completedCount / topicTasks.length) * 100 : 0;
  
  // Visual completion: rely strictly on backend status which handles complex logic (tasks + subtopics)
  const isCompleted = topic.completed;

  const handleAddSubtopics = async (text) => {
      const titles = text.split('\n').map(t => t.trim()).filter(t => t);
      if (titles.length === 0) return;
      
      setIsAddingSubtopic(true);
      try {
          const success = await onAddSubtopic(topic._id, titles);
          if (success) {
              setShowSubtopicInput(false);
          }
      } finally {
          setIsAddingSubtopic(false);
      }
  };

  const handleToggleComplete = async (e) => {
      e.stopPropagation(); 
      setIsLoading(true);
      try {
        await onEditTopic({ ...topic, completed: !isCompleted });
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="mb-4">
      {/* Topic Header */}
      <div className="flex items-center group mb-2 p-2 -mx-2 rounded-xl transition-all duration-300 
                    hover:bg-slate-100/60 dark:hover:bg-slate-800/40 
                    hover:backdrop-blur-md hover:shadow-md 
                    border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isExpanded ? <FiFolderMinus className="w-5 h-5 text-slate-400" /> : <FiFolderPlus className="w-5 h-5 text-slate-400" />}
        </button>
        
        <div className="flex-1 flex items-center gap-3">
            <button 
                onClick={handleToggleComplete}
                disabled={isLoading}
                className={`p-1 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  isCompleted ? 'text-green-500' : 'text-slate-300 dark:text-slate-700'
                }`}
                title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
               {isLoading ? (
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${
                    isCompleted ? 'border-green-500/50 border-t-green-500' : 'border-slate-300 border-t-slate-600'
                  }`} />
               ) : (
                  <FiCheckCircle className="w-5 h-5" />
               )}
            </button>

          <div className="flex-1">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
              {topic.title}
              {topicTasks.length > 0 && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 no-underline">
                  {completedCount}/{topicTasks.length}
                </span>
              )}
            </h3>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 max-w-xs overflow-hidden">
                <div 
                className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
                style={{ width: `${isCompleted ? 100 : progress}%` }}
                />
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiMoreHorizontal />
          </button>
          
          {showMenu && (
             <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 shadow-xl rounded-xl z-20 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <button 
                  onClick={() => { setShowAddInput(true); setShowMenu(false); setIsExpanded(true); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                >
                  Add Task
                </button>
                <button 
                  onClick={() => { setShowSubtopicInput(true); setShowMenu(false); setIsExpanded(true); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                >
                  Add Subtopic
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button 
                  onClick={() => { onEditTopic(topic, true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-blue-500"
                >
                  Edit Topic
                </button>
                <button 
                  onClick={() => { onDeleteTopic(topic._id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-red-500"
                >
                  Delete
                </button>
             </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800"
          >
             {/* Add Subtopic Input */}
             {showSubtopicInput && (
              <div className="mb-4 bg-white dark:bg-slate-900 shadow-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-200">
                  <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add Subtopics</h4>
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] font-medium text-slate-500">
                           <span className="text-[10px]">Ctrl</span> + <span className="text-[10px]">↵</span>
                        </span>
                  </div>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm 
                             text-slate-900 dark:text-slate-100 placeholder:text-slate-400
                             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all resize-none
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    placeholder="Enter subtopic titles...&#10;One per line"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            if (e.target.value.trim() && !isAddingSubtopic){
                                handleAddSubtopics(e.target.value);
                            }
                        }
                    }}
                    autoFocus
                    disabled={isAddingSubtopic}
                    id={`subtopic-input-${topic._id}`}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                      <button 
                        onClick={() => setShowSubtopicInput(false)} 
                        disabled={isAddingSubtopic}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                            const input = document.getElementById(`subtopic-input-${topic._id}`);
                            if (input && input.value.trim()){
                                handleAddSubtopics(input.value);
                            }
                        }}
                        disabled={isAddingSubtopic}
                        className="px-4 py-1.5 text-xs font-medium bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 active:bg-slate-950 dark:active:bg-indigo-800 
                                 transition-all disabled:opacity-70 disabled:cursor-wait min-w-[60px] flex justify-center items-center shadow-sm hover:shadow"
                      >
                          {isAddingSubtopic ? (
                             <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Adding...</span>
                             </div>
                          ) : (
                             'Add'
                          )}
                      </button>
                  </div>
              </div>
            )}

            {/* Subtopics */}
            {subtopics.map(subtopic => (
              <TopicItem 
                key={subtopic._id} 
                topic={subtopic} 
                allTopics={allTopics}
                tasks={tasks}
                journeyStatus={journeyStatus}
                startDate={startDate}
                onAddSubtopic={onAddSubtopic}
                onAddTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onEditTopic={onEditTopic}
                onDeleteTopic={onDeleteTopic}
              />
            ))}

            {/* Add Task Input */}
             {showAddInput && (
              <div className="mb-4">
                 <JourneyTaskInput 
                   onAddTasks={(tasks) => { onAddTask(topic._id, tasks); setShowAddInput(false); }}
                   onCancel={() => setShowAddInput(false)}
                   placeholder={`Add tasks to ${topic.title}...`}
                 />
              </div>
            )}

            {/* Tasks */}
            {topicTasks.map(task => (
              <TaskItem 
                key={task._id} 
                task={task} 
                journeyStatus={journeyStatus}
                startDate={startDate}
                onUpdate={onUpdateTask} 
                onDelete={onDeleteTask}
              />
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicItem;
