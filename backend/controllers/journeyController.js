import Journey from '../models/Journey.js';
import Task from '../models/Task.js';
import pushService from '../services/pushNotificationService.js';

import { v2 as cloudinary } from 'cloudinary';

/**
 * @desc    Create new journey
 * @route   POST /api/journeys
 * @access  Private
 */
export const createJourney = async (req, res) => {
  try {
    const { title, description, targetDays, startDate } = req.body;
    
    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const now = new Date();
    
    // Determine initial status based on start date
    const status = parsedStartDate > now ? 'pending' : 'active';
    
    const journey = await Journey.create({
      user: req.user._id,
      title,
      description,
      targetDays: targetDays || 30,
      startDate: parsedStartDate,
      status
    });

    // Send appropriate notification based on status
    try {
      let payload;
      if (status === 'active') {
        // Journey starts immediately
        payload = pushService.createJourneyStartPayload(journey);
      } else {
        // Journey is scheduled for future
        payload = pushService.createJourneyScheduledPayload(journey, parsedStartDate);
      }
      
      await pushService.sendToUser(req.user._id, payload);
      
      if (status === 'active') {
        journey.notificationSent = true;
        await journey.save();
      }
    } catch (error) {
      console.error('Failed to send journey creation notification:', error);
      // Don't fail journey creation if notification fails
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
      message: error.message
    });
  }
};

/**
 * @desc    Get all journeys for user
 * @route   GET /api/journeys?status=active|completed|all
 * @access  Private
 */
export const getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user._id })
      .sort({ startDate: -1 });

    // Update status for any journeys that should have started
    const now = new Date();
    const updates = [];
    
    for (const journey of journeys) {
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
      message: error.message
    });
  }
};


/**
 * @desc    Get single journey with stats
 * @route   GET /api/journeys/:id
 * @access  Private
 */
export const getJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journey'
      });
    }

    // Get tasks for this journey to show in detail view
    const tasks = await Task.find({ journey: journey._id })
      .sort({ completed: 1, completedAt: -1, createdAt: -1 })
      .limit(50);

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
      message: error.message
    });
  }
};

/**
 * @desc    Update journey
 * @route   PUT /api/journeys/:id
 * @access  Private
 */
export const updateJourney = async (req, res) => {
  try {
    let journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
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
      message: error.message
    });
  }
};

/**
 * @desc    Delete journey (soft delete)
 * @route   DELETE /api/journeys/:id
 * @access  Private
 */
export const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this journey'
      });
    }

    // Hard delete journey and its tasks
    await Task.deleteMany({ journey: journey._id });
    await Journey.findByIdAndDelete(req.params.id);

    // Note: We should ideally also delete resources from Cloudinary here
    // but postponing that for optimization or background job

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

/**
 * @desc    Mark journey as completed
 * @route   POST /api/journeys/:id/complete
 * @access  Private
 */
export const completeJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
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

/**
 * @desc    Reactivate a completed journey
 * @route   POST /api/journeys/:id/reactivate
 * @access  Private
 */
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

    // Update status
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

/**
 * @desc    Add resource to journey (upload to Cloudinary)
 * @route   POST /api/journeys/:id/resources
 * @access  Private
 */
export const addResource = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this journey'
      });
    }

    const { type, url } = req.body;

    // If it's a link, just add it directly
    if (type === 'link') {
      await journey.addResource({
        type: 'link',
        url,
        filename: url
      });

      return res.status(200).json({
        success: true,
        message: 'Link added successfully',
        data: journey
      });
    }

    // For file uploads, expect file from Cloudinary middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file or provide a link'
      });
    }

    // File was uploaded to Cloudinary via middleware
    const resourceData = {
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'document',
      url: req.file.path, // Cloudinary URL
      filename: req.file.originalname,
      cloudinaryId: req.file.filename // For deletion
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

/**
 * @desc    Delete resource from journey
 * @route   DELETE /api/journeys/:id/resources/:resourceId
 * @access  Private
 */
export const deleteResource = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Check ownership
    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this journey'
      });
    }

    // Find the resource
    const resource = journey.resources.id(req.params.resourceId);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Delete from Cloudinary if it's a file
    if (resource.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(resource.cloudinaryId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue even if Cloudinary deletion fails
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

/**
 * @desc    Start a pending journey immediately
 * @route   POST /api/journeys/:id/start
 * @access  Private
 */
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

    // Update start date to now and status to active
    journey.startDate = new Date();
    journey.status = 'active';
    journey.isActive = true;
    
    await journey.save();

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

/**
 * @desc    Get journey statistics for user
 * @route   GET /api/journeys/stats
 * @access  Private
 */
export const getJourneyStats = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user._id });
    const tasks = await Task.find({ 
      journey: { $in: journeys.map(j => j._id) } 
    });

    // Calculate statistics
    const totalJourneys = journeys.length;
    const activeJourneys = journeys.filter(j => j.status === 'active' && j.progress < 100).length;
    const completedJourneys = journeys.filter(j => j.progress === 100 || j.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const longestStreak = Math.max(...journeys.map(j => j.bestStreak || 0), 0);
    const averageProgress = journeys.length > 0 
      ? journeys.reduce((sum, j) => sum + (j.progress || 0), 0) / journeys.length 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalJourneys,
        activeJourneys,
        completedJourneys,
        totalTasks,
        completedTasks,
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

