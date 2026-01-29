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
  // Get root topics (those with no parent or parent is null)
  const rootTopics = topics.filter(t => !t.parent).sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {rootTopics.length === 0 ? (
         <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p>No topics created yet.</p>
            <p className="text-sm">Create your first topic to get started!</p>
         </div>
      ) : (
        rootTopics.map(topic => (
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
        ))
      )}
    </div>
  );
};

export default TopicList;
