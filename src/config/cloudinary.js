// Line 1: Import dotenv module to load environment variables
import dotenv from 'dotenv';

// Line 2: Execute dotenv configuration so process.env variables are populated immediately
dotenv.config();

// Line 3: Import Cloudinary version 2 SDK
import { v2 as cloudinary } from 'cloudinary';

// Line 4: Import Multer for handling multipart/form-data requests
import multer from 'multer';

// Line 5: Import Cloudinary storage engine adapter for Multer
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Line 6: Configure Cloudinary instance with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Line 7: Configure dynamic Cloudinary storage supporting both static images and video trailers
const storage = new CloudinaryStorage({
  // Line 8: Pass the authenticated Cloudinary instance
  cloudinary: cloudinary,
  // Line 9: Dynamic parameters callback to differentiate videos from images and sanitize filenames
  params: async (req, file) => {
    // Line 10: Check if the incoming file mimetype belongs to a video
    const isVideo = file.mimetype.startsWith('video');

    // Line 11: Remove special characters and spaces from the filename to prevent public_id errors
    const sanitizedName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '_');

    // Line 12: Return upload configuration object to Cloudinary
    return {
      // Line 13: Target folder inside Cloudinary media library
      folder: 'david-portfolio',
      // Line 14: Dynamically assign resource_type so Cloudinary handles videos correctly
      resource_type: isVideo ? 'video' : 'image',
      // Line 15: Whitelist permitted image and video extensions
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'mkv'],
      // Line 16: Supply a clean public_id with timestamp so Cloudinary never throws "Missing required parameter - public_id"
      public_id: `${Date.now()}_${sanitizedName}`,
    };
  },
});

// Line 17: Create and export Multer instance with an increased 200MB limit to handle high-definition trailers
export const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for video files
});