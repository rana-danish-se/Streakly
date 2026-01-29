import Journey from '../models/Journey.js';
import Task from '../models/Task.js';
import pushService from '../services/pushNotificationService.js';
import Topic from '../models/Topic.js';

import { v2 as cloudinary } from 'cloudinary';

export const createJourney = async (req, res) => {
  try {
    const { title, description, targetDays, startDate } = req.body;
    
    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const now = new Date();
    
    const status = parsedStartDate > now ? 'pending' : 'active';
    
    const journey = await Journey.create({
      user: req.user._id,
      title,
      description,
      targetDays: targetDays || 30,
      startDate: parsedStartDate,
      status
    });

    try {
      let payload;
      if (status === 'active') {
        payload = pushService.createJourneyStartPayload(journey);
      } else {
        payload = pushService.createJourneyScheduledPayload(journey, parsedStartDate);
      }
      
      await pushService.sendToUser(req.user._id, payload);
      
      if (status === 'active') {
        journey.notificationSent = true;
        await journey.save();
      }
    } catch (error) {
    }

    res.status(201).json({
      success: true,
      message: 'Journey created successfully',
      data: {
        journey,
        status: status === 'pending' 
          ? `Journey scheduled to start on ${parsedStartDate.toLocaleDateString()}. You'll receive reminders!`
          : 'Journey started - notification sent'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Invalid request data'
    });
  }
};



export const getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user._id })
      .sort({ startDate: -1 });

    const taskStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$journey",
          totalTopics: { $sum: 1 },
          completedTopics: {
            $sum: { $cond: ["$completed", 1, 0] }
          }
        }
      }
    ]);

    const statsMap = taskStats.reduce((acc, stat) => {
      acc[stat._id.toString()] = stat;
      return acc;
    }, {});

    const now = new Date();
    const updates = [];
    
    for (const journey of journeys) {
      const stats = statsMap[journey._id.toString()];
      if (stats) {
        journey.totalTopics = stats.totalTopics;
        journey.completedTopics = stats.completedTopics;
      }

      if (journey.status === 'pending' && journey.startDate <= now) {
        journey.status = 'active';
        updates.push(journey.save());
      }
    }
    
    if (updates.length > 0) {
      await Promise.all(updates);
    }

    res.json({
      success: true,
      data: { journeys }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error fetching journeys'
    });
  }
};


export const getJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journey'
      });
    }

    const tasks = await Task.find({ journey: journey._id })
      .sort({ completed: 1, completedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        journey,
        recentTasks: tasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

export const updateJourney = async (req, res) => {
  try {
    let journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this journey'
      });
    }

    const { title, description, targetDays, notes, isActive } = req.body;

    journey = await Journey.findByIdAndUpdate(
      req.params.id,
      { title, description, targetDays, notes, isActive },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Journey updated successfully',
      data: journey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error updating journey'
    });
  }
};

export const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this journey'
      });
    }

    if (journey.resources && journey.resources.length > 0) {
      
      const cloudinaryDeletions = journey.resources
        .filter(res => res.cloudinaryId)
        .map(res => 
          cloudinary.uploader.destroy(res.cloudinaryId, {
            resource_type: res.cloudinaryResourceType || 'image'
          }).catch(err => {
            return null;
          })
        );
        
      await Promise.all(cloudinaryDeletions);
    }

    await Task.deleteMany({ journey: journey._id });
    await Topic.deleteMany({ journey: journey._id });
    await Journey.findByIdAndDelete(req.params.id);


    res.status(200).json({
      success: true,
      message: 'Journey deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const completeJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this journey'
      });
    }

    const { notes } = req.body;
    await journey.markCompleted(notes);

    res.status(200).json({
      success: true,
      message: 'Journey marked as completed',
      data: journey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const reactivateJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this journey'
      });
    }

    journey.status = 'active';
    journey.isActive = true;
    journey.completedAt = undefined;
    
    await journey.save();

    res.status(200).json({
      success: true,
      message: 'Journey reactivated successfully',
      data: journey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const addResource = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this journey'
      });
    }

    const { type, url, filename } = req.body;

    if (type === 'link') {
      await journey.addResource({
        type: 'link',
        url,
        filename: filename || url
      });

      return res.status(200).json({
        success: true,
        message: 'Link added successfully',
        data: journey
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file or provide a link'
      });
    }

    const resourceData = {
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'document',
      url: req.file.path, 
      filename: req.file.originalname,
      cloudinaryId: req.file.filename,
      cloudinaryResourceType: req.file.resource_type, 
      size: req.file.size
    };

    await journey.addResource(resourceData);

    res.status(200).json({
      success: true,
      message: 'Resource added successfully',
      data: journey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this journey'
      });
    }

    const resource = journey.resources.id(req.params.resourceId);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.cloudinaryId) {
      try {
        const result = await cloudinary.uploader.destroy(resource.cloudinaryId, {
          resource_type: resource.cloudinaryResourceType || 'image'
        });
      } catch (cloudinaryError) {
      }
    }


    await journey.removeResource(req.params.resourceId);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
      data: journey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const startJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this journey'
      });
    }

    if (journey.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Journey is already ${journey.status}`
      });
    }

    journey.startDate = new Date();
    journey.status = 'active';
    journey.isActive = true;
    journey.notificationSent = true;
    
    await journey.save();

    try {
      const payload = pushService.createJourneyStartPayload(journey);
      await pushService.sendToUser(req.user._id, payload);
    } catch (error) {
    }

    res.status(200).json({
      success: true,
      message: 'Journey started successfully',
      data: journey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getJourneyStats = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user._id });
    const tasks = await Task.find({ 
      journey: { $in: journeys.map(j => j._id) } 
    });

    const totalJourneys = journeys.length;
    const activeJourneys = journeys.filter(j => j.status === 'active' && j.progress < 100).length;
    const completedJourneys = journeys.filter(j => j.progress === 100 || j.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const longestStreak = Math.max(...journeys.map(j => j.bestStreak || 0), 0);
    const averageProgress = journeys.length > 0 
      ? journeys.reduce((sum, j) => sum + (j.progress || 0), 0) / journeys.length 
      : 0;

    // Aggregate Topic Stats - correctly fetching from Topic collection
    const allTopics = await Topic.find({
        journey: { $in: journeys.map(j => j._id) }
    });
    const completedTopics = allTopics.filter(t => t.completed).length;

    res.status(200).json({
      success: true,
      data: {
        totalJourneys,
        activeJourneys,
        completedJourneys,
        totalTasks,
        completedTasks,
        completedTopics, // Added this field
        longestStreak,
        averageProgress: Math.round(averageProgress)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

