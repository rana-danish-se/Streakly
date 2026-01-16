import Journey from '../models/Journey.js';
import Task from '../models/Task.js';
import { updateJourneyStats } from '../utils/streakCalculator.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * @desc    Create new journey
 * @route   POST /api/journeys
 * @access  Private
 */
export const createJourney = async (req, res) => {
  try {
    const { title, description, targetDays, tasks, startDate } = req.body;

    // Create the journey
    const journey = await Journey.create({
      user: req.user._id,
      title,
      description,
      targetDays: targetDays || 30,
      startDate: startDate || Date.now()
    });

    // If tasks array is provided, create initial tasks
    let createdTasks = [];
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      // Create all tasks
      const taskPromises = tasks.map(taskData => 
        Task.create({
          journey: journey._id,
          user: req.user._id,
          name: taskData.name || taskData, // Support both { name: 'task' } and 'task' formats
          completed: true
        })
      );
      
      createdTasks = await Promise.all(taskPromises);

      // Update journey stats based on created tasks
      const stats = updateJourneyStats(createdTasks);
      journey.currentStreak = stats.currentStreak;
      journey.longestStreak = stats.longestStreak;
      journey.totalDays = stats.totalDays;
      await journey.save();
    }

    res.status(201).json({
      success: true,
      message: 'Journey created successfully',
      data: {
        journey,
        tasks: createdTasks
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
    const { status = 'active' } = req.query;
    
    let filter = { user: req.user._id };
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'completed') {
      filter.isActive = false;
    }
    // 'all' - no additional filter

    const journeys = await Journey.find(filter)
      .sort({ createdAt: -1 })
      .select('-resources'); // Exclude resources for list view

    res.status(200).json({
      success: true,
      count: journeys.length,
      data: journeys
    });
  } catch (error) {
    res.status(500).json({
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
      .sort({ createdAt: -1 })
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

    const { title, description, targetDays, notes } = req.body;

    journey = await Journey.findByIdAndUpdate(
      req.params.id,
      { title, description, targetDays, notes },
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

    // Soft delete - mark as inactive
    journey.isActive = false;
    await journey.save();

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
