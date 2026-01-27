import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { getResourceType } from '../utils/fileType.js';

/**
 * Optimized Cloudinary Storage for Images and Documents (Raw)
 * Follows the core rule: PDFs and DOCs must be resource_type: "raw"
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resourceType = getResourceType(file.mimetype);
    
    // Clean filename: remove extension for public_id to avoid double extensions
    const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
    const cleanName = nameWithoutExt
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    return {
      folder: resourceType === "image" ? "streakly/images" : "streakly/documents",
      resource_type: resourceType,
      public_id: `${Date.now()}-${cleanName}`,
      // For raw resources, we don't specify allowed_formats here as Cloudinary handle them differently
      // But we can specify them for images
      ...(resourceType === "image" ? { allowed_formats: ['jpg', 'png', 'webp', 'gif', 'jpeg'] } : {})
    };
  },
});

// File filter function for security
const fileFilter = (req, file, cb) => {
  try {
    getResourceType(file.mimetype);
    cb(null, true);
  } catch (error) {
    cb(new Error(error.message), false);
  }
};

// General upload middleware
export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

/**
 * Helper function to delete file from Cloudinary correctly.
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  // If the publicId includes the folder, destroy handles it
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error(`Error deleting ${resourceType} from Cloudinary:`, error);
    throw error;
  }
};
