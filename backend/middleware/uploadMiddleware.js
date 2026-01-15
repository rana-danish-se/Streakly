import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'streakly/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// Configure Cloudinary storage for documents (PDFs, DOCs)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'streakly/documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // For non-image files
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  // Allowed document types
  const documentTypes = /pdf|doc|docx/;
  
  const mimetype = file.mimetype.toLowerCase();
  const isImage = imageTypes.test(mimetype.split('/')[1]);
  const isDocument = documentTypes.test(mimetype.split('/')[1]) || mimetype.includes('pdf');
  
  if (isImage || isDocument) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX) are allowed.'), false);
  }
};

// Image upload middleware
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// Document upload middleware
export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// General upload middleware (supports both images and documents)
export const uploadFile = multer({
  storage: imageStorage, // Will be overridden based on file type
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
  },
});

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper function to delete raw files (PDFs, docs)
export const deleteRawFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
    return result;
  } catch (error) {
    console.error('Error deleting raw file from Cloudinary:', error);
    throw error;
  }
};
