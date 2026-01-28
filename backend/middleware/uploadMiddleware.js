import path from 'path';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { getResourceType } from '../utils/fileType.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resourceType = getResourceType(file.mimetype);
    
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const cleanName = nameWithoutExt
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    const publicId = `${Date.now()}-${cleanName}`;

    return {
      folder: (resourceType === "image" && file.mimetype !== "application/pdf") 
        ? "streakly/images" 
        : "streakly/documents",
      resource_type: resourceType,
      public_id: publicId,
      format: ext.replace('.', ''), // Explicitly set format to keep extension
      ...(resourceType === "image" && file.mimetype !== "application/pdf" 
        ? { allowed_formats: ['jpg', 'png', 'webp', 'gif', 'jpeg'] } 
        : {})
    };
  },
});

const fileFilter = (req, file, cb) => {
  try {
    getResourceType(file.mimetype);
    cb(null, true);
  } catch (error) {
    cb(new Error(error.message), false);
  }
};

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
  },
});

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
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
