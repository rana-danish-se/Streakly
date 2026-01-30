import React from 'react';
import TopicItem from './TopicItem';

const TopicList = ({
  topics,
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
  const [visibleActiveCount, setVisibleActiveCount] = React.useState(10);
  const [visibleCompletedCount, setVisibleCompletedCount] = React.useState(10);

  // Get root topics (those with no parent or parent is null)
  const rootTopics = topics.filter(t => !t.parent).sort((a,b) => a.order - b.order);
  
  const activeTopics = rootTopics.filter(t => !t.completed);
  const completedTopics = rootTopics.filter(t => t.completed);

  const renderTopic = (topic) => (
    <TopicItem
      key={topic._id}
      topic={topic}
      allTopics={topics}
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
  );

  if (rootTopics.length === 0) {
     return (
        <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <p>No topics created yet.</p>
          <p className="text-sm">Create your first topic to get started!</p>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      {/* Active Topics */}
      {activeTopics.length > 0 && (
          <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Active Topics ({activeTopics.length})
              </h3>
              {activeTopics.slice(0, visibleActiveCount).map(renderTopic)}
              
              {visibleActiveCount < activeTopics.length && (
                  <button 
                    onClick={() => setVisibleActiveCount(prev => prev + 10)}
                    className="w-full py-3 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-800 border-dashed"
                  >
                      Load More Active Topics (+{activeTopics.length - visibleActiveCount} remaining)
                  </button>
              )}
          </div>
      )}

      {/* Completed Topics */}
      {completedTopics.length > 0 && (
          <div className="space-y-4">
              <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Completed ({completedTopics.length})
                  </h3>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </div>
              
              {completedTopics.slice(0, visibleCompletedCount).map(renderTopic)}

              {visibleCompletedCount < completedTopics.length && (
                  <button 
                    onClick={() => setVisibleCompletedCount(prev => prev + 10)}
                    className="w-full py-3 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-800 border-dashed"
                  >
                      Load More Completed Topics (+{completedTopics.length - visibleCompletedCount} remaining)
                  </button>
              )}
          </div>
      )}
    </div>
  );
};

export default TopicList;
