import Topic from '../models/Topic.js';
import Task from '../models/Task.js';
import Journey from '../models/Journey.js';
import { updateJourneyStats } from '../utils/streakCalculator.js';

export const createTopic = async (req, res) => {
  try {
    const { title, description, parentId, journeyId } = req.body;
    
    const journey = await Journey.findById(journeyId);
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }
    
    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get max order to append to end
    const lastTopic = await Topic.findOne({ journey: journeyId, parent: parentId || null })
      .sort({ order: -1 });
    
    const newOrder = lastTopic ? lastTopic.order + 1 : 0;

    const topic = await Topic.create({
      title,
      description,
      journey: journeyId,
      parent: parentId || null,
      user: req.user._id,
      order: newOrder
    });

    // If added to a parent, ensure parent (and its ancestors) are marked incomplete
    // because a new item means the "set" is no longer fully complete.
    if (parentId) {
        const markAncestorsIncomplete = async (pId) => {
            const parent = await Topic.findById(pId);
            if (parent && parent.completed) {
                parent.completed = false;
                parent.completedAt = undefined;
                await parent.save();
                if (parent.parent) {
                    await markAncestorsIncomplete(parent.parent);
                }
            }
        };
        await markAncestorsIncomplete(parentId);
    }

    // Update Journey Stats after creation (although new topic is likely incomplete and wont change streak, it changes totalTopics)
    const allTasks = await Task.find({ journey: journeyId });
    const allTopics = await Topic.find({ journey: journeyId });
    const stats = updateJourneyStats(allTasks, allTopics);

    journey.currentStreak = stats.currentStreak;
    journey.longestStreak = stats.longestStreak;
    journey.totalDays = stats.totalDays;
    journey.progress = stats.progress;
    journey.completedTopics = stats.completedTopics;
    journey.totalTopics = stats.totalTopics;
    await journey.save();

    res.status(201).json({
      success: true,
      data: {
        topic,
        journeyStats: stats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getJourneyTopics = async (req, res) => {
  try {
    // Check journey access first (optional but good practice)
    const journey = await Journey.findById(req.params.journeyId);
    if (!journey || journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Fetch all topics for this journey
    // Sort by completed (false first) then by order to support "move to end" behavior
    const topics = await Topic.find({ journey: req.params.journeyId }).sort({ completed: 1, order: 1 });
    
    res.status(200).json({
      success: true,
      data: topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const { title, description, order, completed } = req.body;
    const topic = await Topic.findById(req.params.id);
    const updatedTopics = []; // Track all topics modified in this request
    const updatedTasks = []; // Track all tasks modified

    if (!topic || topic.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Topic not found or unauthorized' });
    }

    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (order !== undefined) topic.order = order;
    
    if (completed !== undefined) {
        if (completed === true) {
            // Verify all tasks in this topic are completed
            // Recursive check? The user said "all of its subtopics and tasks". 
            // Subtopic completion implies its tasks are complete (if we enforce integrity).
            
            // Check tasks of CURRENT topic
            const incompleteTasks = await Task.countDocuments({ topic: topic._id, completed: { $ne: true } });
            if (incompleteTasks > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Please complete all tasks in this topic first." 
                });
            }

            // Check IMMEDIATE subtopics (if they are incomplete, we block). 
            const incompleteSubtopics = await Topic.countDocuments({ parent: topic._id, completed: { $ne: true } });
            if (incompleteSubtopics > 0) {
                 return res.status(400).json({ 
                    success: false, 
                    message: "Please complete all subtopics first." 
                });
            }

            topic.completed = true;
            topic.completedAt = new Date();
            await topic.save(); // Save immediately so DB reflects completion for parent check

            // Auto-complete parent if all siblings are done
            if (topic.parent) {
                const checkAndCompleteParent = async (parentId) => {
                    const parent = await Topic.findById(parentId);
                    if (!parent || parent.completed) return;

                    const incompleteTasks = await Task.countDocuments({ topic: parentId, completed: { $ne: true } });
                    if (incompleteTasks > 0) return;

                    const incompleteSubtopics = await Topic.countDocuments({ parent: parentId, completed: { $ne: true } });
                    if (incompleteSubtopics > 0) return;

                    parent.completed = true;
                    parent.completedAt = new Date();
                    await parent.save();
                    
                    // Add to modified list
                    updatedTopics.push(parent);

                    if (parent.parent) {
                        await checkAndCompleteParent(parent.parent);
                    }
                };
                await checkAndCompleteParent(topic.parent);
            }
        } else {
            // Unmarking is allowed
            // Rule: "If user unmarks it then unmark of all of its subtopics and tasks recursivley."
            topic.completed = false;
            topic.completedAt = undefined;
            
            // Recursive unmark DOWN
            const unmarkDescendants = async (pId) => {
                const children = await Topic.find({ parent: pId });
                const tasks = await Task.find({ topic: pId });
                
                for (const t of tasks) {
                    if (t.completed) {
                        t.completed = false;
                        t.completedAt = undefined;
                        await t.save();
                        updatedTasks.push(t);
                    }
                }

                for (const child of children) {
                    if (child.completed) {
                        child.completed = false;
                        child.completedAt = undefined;
                        await child.save();
                        updatedTopics.push(child);
                    }
                    await unmarkDescendants(child._id);
                }
            };
            await unmarkDescendants(topic._id);
            
            // Recursive unmark UP (Ancestors)
            if (topic.parent) {
                 const markAncestorsIncomplete = async (pId) => {
                    const parent = await Topic.findById(pId);
                    if (parent && parent.completed) {
                        parent.completed = false;
                        parent.completedAt = undefined;
                        await parent.save();
                        updatedTopics.push(parent);
                        if (parent.parent) {
                            await markAncestorsIncomplete(parent.parent);
                        }
                    }
                };
                await markAncestorsIncomplete(topic.parent);
            }
    }

    }

    await topic.save();

    // Update Journey Stats
    const allTasks = await Task.find({ journey: topic.journey });
    const allTopics = await Topic.find({ journey: topic.journey });
    const stats = updateJourneyStats(allTasks, allTopics);

    const journey = await Journey.findById(topic.journey);
    if(journey){
        journey.currentStreak = stats.currentStreak;
        journey.longestStreak = stats.longestStreak;
        journey.totalDays = stats.totalDays;
        journey.progress = stats.progress;
        journey.completedTopics = stats.completedTopics;
        journey.totalTopics = stats.totalTopics;
        await journey.save();
    }

    res.status(200).json({
      success: true,
      data: {
        topic,
        updatedTopics, // Return all modified topics
        updatedTasks, // Return all modified tasks
        journeyStats: stats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic || topic.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Topic not found or unauthorized' });
    }

    // Recursive delete logic to handle any depth
    // Find all descendant topics
    const getAllDescendants = async (parentId) => {
        const children = await Topic.find({ parent: parentId });
        let descendants = [...children];
        for (const child of children) {
            const grandChildren = await getAllDescendants(child._id);
            descendants = [...descendants, ...grandChildren];
        }
        return descendants;
    };

    const descendants = await getAllDescendants(topic._id);
    const descendantIds = descendants.map(t => t._id);
    const allTopicIdsToDelete = [topic._id, ...descendantIds];
    
    // Delete tasks in all these topics
    const tasksToDelete = await Task.find({ topic: { $in: allTopicIdsToDelete } });
    const deletedTaskIds = tasksToDelete.map(t => t._id);
    await Task.deleteMany({ topic: { $in: allTopicIdsToDelete } });
    
    // Delete descendant topics
    await Topic.deleteMany({ _id: { $in: descendantIds } });
    
    // Delete topic itself
    await topic.deleteOne();

    // Update Journey Stats
    const journey = await Journey.findById(topic.journey);
    let stats = {};
    if (journey) {
        const allTasks = await Task.find({ journey: topic.journey });
        const allTopics = await Topic.find({ journey: topic.journey });
        stats = updateJourneyStats(allTasks, allTopics);

        journey.currentStreak = stats.currentStreak;
        journey.longestStreak = stats.longestStreak;
        journey.totalDays = stats.totalDays;
        journey.progress = stats.progress;
        journey.completedTopics = stats.completedTopics;
        journey.totalTopics = stats.totalTopics;
        await journey.save();
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Topic deleted',
        deletedTopicIds: allTopicIdsToDelete,
        deletedTaskIds,
        journeyStats: stats || {} 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
