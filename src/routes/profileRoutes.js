// Line 1: Import Express Router
import express from 'express';

// Line 2: Import Profile Mongoose model
import Profile from '../models/Profile.js';

// Line 3: Import Cloudinary upload middleware
import { upload } from '../config/cloudinary.js';

// Line 4: Initialize Express router instance
const router = express.Router();

// Line 5: GET /api/profile - Fetch current profile record
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ name: 'David', avatarUrl: '' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
});

// Line 6: POST /api/profile/avatar - Safe wrapper to prevent HTML error output on upload failure
router.post('/avatar', (req, res) => {
  // Line 7: Manually invoke multer middleware to intercept any upload errors
  upload.single('avatarImage')(req, res, async (err) => {
    // Line 8: If Multer or Cloudinary fails, respond with JSON (never HTML)
    if (err) {
      console.error('Cloudinary/Multer Upload Error:', err);
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }

    // Line 9: Verify that a file was sent
    if (!req.file) {
      return res.status(400).json({ message: 'No image file was attached in the request' });
    }

    try {
      // Line 10: Find existing profile or instantiate a new one
      let profile = await Profile.findOne();
      if (!profile) {
        profile = new Profile({ name: 'David' });
      }

      // Line 11: Store the secure Cloudinary URL
      profile.avatarUrl = req.file.path;
      await profile.save();

      // Line 12: Return success JSON
      return res.status(200).json({
        message: 'Avatar updated successfully',
        avatarUrl: profile.avatarUrl,
      });
    } catch (dbErr) {
      console.error('MongoDB Save Error:', dbErr);
      return res.status(500).json({ message: 'Database save failed', error: dbErr.message });
    }
  });
});

// Line 13: Export router as default
export default router;